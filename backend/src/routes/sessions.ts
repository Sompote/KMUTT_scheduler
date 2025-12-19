import { Router, Request, Response } from 'express';
import db from '../database/connection';
import { Session, CreateSessionRequest, UpdateSessionRequest, ApiResponse } from '../types';

const router = Router();

// GET all sessions
router.get('/', (req: Request, res: Response<ApiResponse<Session[]>>) => {
  try {
    const sessions = db.prepare('SELECT * FROM sessions ORDER BY day, start_slot').all() as Session[];
    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET session by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Session>>) => {
  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id) as Session | undefined;
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create session
router.post('/', (req: Request<{}, {}, CreateSessionRequest>, res: Response<ApiResponse<Session>>) => {
  try {
    const { id, subject_id, day, start_slot, duration, room_id } = req.body;

    if (!id || !subject_id || !day || start_slot === undefined || !duration) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO sessions (id, subject_id, day, start_slot, duration, room_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, subject_id, day, start_slot, duration, room_id || null);

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as Session;
    res.status(201).json({ success: true, data: session, message: 'Session created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update session
router.put('/:id', (req: Request<{ id: string }, {}, UpdateSessionRequest>, res: Response<ApiResponse<Session>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.subject_id !== undefined) { fields.push('subject_id = ?'); values.push(updates.subject_id); }
    if (updates.day !== undefined) { fields.push('day = ?'); values.push(updates.day); }
    if (updates.start_slot !== undefined) { fields.push('start_slot = ?'); values.push(updates.start_slot); }
    if (updates.duration !== undefined) { fields.push('duration = ?'); values.push(updates.duration); }
    if (updates.room_id !== undefined) { fields.push('room_id = ?'); values.push(updates.room_id); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    if (fields.length > 1) {
      const stmt = db.prepare(`UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`);
      stmt.run(...values);
    }

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as Session;
    res.json({ success: true, data: session, message: 'Session updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE session
router.delete('/:id', (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE all sessions (reset schedule)
router.delete('/', (req: Request, res: Response<ApiResponse>) => {
  try {
    const stmt = db.prepare('DELETE FROM sessions');
    const result = stmt.run();

    res.json({
      success: true,
      message: `All sessions deleted successfully (${result.changes} sessions removed)`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST auto-assign sessions to calendar
// Clone of the original autoAssign algorithm from Scheduler.html
router.post('/auto-assign', (req: Request, res: Response<ApiResponse>) => {
  try {
    const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    // Get settings
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get() as any;
    const startIdx = settings?.work_start || 0;
    const endIdx = settings?.work_end || 13;
    const checkRoom = settings?.check_room_constraints || 1;

    // Get department constraints
    const deptConstraints: Record<string, number> = {};
    const constraints = db.prepare('SELECT * FROM department_constraints').all() as any[];
    constraints.forEach(c => {
      deptConstraints[`${c.day}_${c.slot}`] = c.constraint_type === 'hard' ? 2 : 1;
    });

    // 1. Get unassigned sessions only
    const allSessions = db.prepare('SELECT * FROM sessions WHERE day IS NULL').all() as any[];

    // Get all data needed for sorting and checking
    const subjects = db.prepare('SELECT * FROM subjects').all() as any[];
    const years = db.prepare('SELECT * FROM years').all() as any[];
    const instructors = db.prepare('SELECT * FROM instructors').all() as any[];
    const rooms = db.prepare('SELECT * FROM rooms').all() as any[];
    const instructorAvailability = db.prepare('SELECT * FROM instructor_availability WHERE is_busy = 1').all() as any[];

    // Build instructor busy map
    const instructorBusyMap: Record<string, string[]> = {};
    instructorAvailability.forEach((av: any) => {
      if (!instructorBusyMap[av.instructor_id]) instructorBusyMap[av.instructor_id] = [];
      instructorBusyMap[av.instructor_id].push(`${av.day}_${av.slot}`);
    });

    // Get subject years and instructors
    const subjectYears = db.prepare('SELECT * FROM subject_years').all() as any[];
    const subjectInstructors = db.prepare('SELECT * FROM subject_instructors').all() as any[];

    // Build maps
    const subjectYearsMap: Record<string, string[]> = {};
    subjectYears.forEach(sy => {
      if (!subjectYearsMap[sy.subject_id]) subjectYearsMap[sy.subject_id] = [];
      subjectYearsMap[sy.subject_id].push(sy.year_id);
    });

    const subjectInstructorsMap: Record<string, string[]> = {};
    subjectInstructors.forEach(si => {
      if (!subjectInstructorsMap[si.subject_id]) subjectInstructorsMap[si.subject_id] = [];
      subjectInstructorsMap[si.subject_id].push(si.instructor_id);
    });

    // 2. Sort by priority (hours DESC, student count DESC, instructor busy count DESC)
    allSessions.sort((a, b) => {
      if (b.duration !== a.duration) return b.duration - a.duration;

      const subA = subjects.find(s => s.id === a.subject_id);
      const subB = subjects.find(s => s.id === b.subject_id);

      // Calculate student count
      const getCount = (subId: string) => {
        const subYears = subjectYearsMap[subId] || [];
        return subYears.reduce((sum, yId) => {
          const year = years.find(y => y.id === yId);
          return sum + (year?.count || 0);
        }, 0);
      };

      const countA = getCount(a.subject_id);
      const countB = getCount(b.subject_id);
      if (countB !== countA) return countB - countA;

      // Instructor busy count
      const busyA = (subjectInstructorsMap[a.subject_id] || []).reduce((acc, iId) =>
        acc + (instructorBusyMap[iId]?.length || 0), 0);
      const busyB = (subjectInstructorsMap[b.subject_id] || []).reduce((acc, iId) =>
        acc + (instructorBusyMap[iId]?.length || 0), 0);
      return busyB - busyA;
    });

    let placedCount = 0;

    // 3. Try to assign each session
    for (const sess of allSessions) {
      const sub = subjects.find(s => s.id === sess.subject_id);
      if (!sub) continue;

      const subYears = subjectYearsMap[sess.subject_id] || [];
      const subInstructors = subjectInstructorsMap[sess.subject_id] || [];

      // Calculate required capacity
      const needed = subYears.reduce((sum, yId) => {
        const year = years.find(y => y.id === yId);
        return sum + (year?.count || 0);
      }, 0);

      // Filter valid rooms (sorted by capacity)
      const validRooms = rooms
        .filter(r => !checkRoom || r.capacity >= needed)
        .sort((a, b) => a.capacity - b.capacity);

      let placed = false;

      // Try each day
      for (const day of DAYS) {
        if (placed) break;

        // Try each time slot
        for (let i = startIdx; i <= endIdx - sess.duration; i++) {
          if (placed) break;

          // 3.1 Check department hard constraints
          let deptHard = false;
          for (let k = 0; k < sess.duration; k++) {
            if (deptConstraints[`${day}_${i + k}`] === 2) {
              deptHard = true;
              break;
            }
          }
          if (deptHard) continue;

          // 3.2 Check instructor availability
          const busyProf = subInstructors.some(instId => {
            const busy = instructorBusyMap[instId] || [];
            for (let k = 0; k < sess.duration; k++) {
              if (busy.includes(`${day}_${i + k}`)) return true;
            }
            return false;
          });
          if (busyProf) continue;

          // 3.3 Check for conflicts with already assigned sessions
          let conflict = false;
          const assignedSessions = db.prepare('SELECT * FROM sessions WHERE day = ?').all(day) as any[];

          for (let k = 0; k < sess.duration; k++) {
            const overlapSessions = assignedSessions.filter(o => {
              const oStart = o.start_slot;
              const oEnd = oStart + o.duration;
              return (i + k) >= oStart && (i + k) < oEnd;
            });

            for (const o of overlapSessions) {
              const oSub = subjects.find(s => s.id === o.subject_id);
              if (!oSub) continue;

              const oYears = subjectYearsMap[o.subject_id] || [];
              const oInstructors = subjectInstructorsMap[o.subject_id] || [];

              // Check year overlap
              const hasCommonYear = subYears.some(y => oYears.includes(y));
              if (hasCommonYear) {
                conflict = true;
                break;
              }

              // Check instructor overlap
              const hasCommonInstructor = subInstructors.some(iId => oInstructors.includes(iId));
              if (hasCommonInstructor) {
                conflict = true;
                break;
              }
            }
            if (conflict) break;
          }
          if (conflict) continue;

          // 3.4 Find available room
          for (const room of validRooms) {
            let roomFree = true;

            if (checkRoom) {
              for (let k = 0; k < sess.duration; k++) {
                const roomBusy = assignedSessions.some(o => {
                  if (o.room_id !== room.id) return false;
                  const oStart = o.start_slot;
                  const oEnd = oStart + o.duration;
                  return (i + k) >= oStart && (i + k) < oEnd;
                });
                if (roomBusy) {
                  roomFree = false;
                  break;
                }
              }
            }

            if (roomFree) {
              // Assign the session!
              db.prepare(`
                UPDATE sessions
                SET day = ?, start_slot = ?, room_id = ?, updated_at = datetime('now')
                WHERE id = ?
              `).run(day, i, room.id, sess.id);

              placed = true;
              placedCount++;
              break;
            }
          }
        }
      }
    }

    res.json({
      success: true,
      message: `จัดตารางเพิ่มสำเร็จ ${placedCount} รายการ`,
      data: { placedCount }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST sync sessions from subjects
// This generates session records from subjects based on their splitPattern
router.post('/sync', (req: Request, res: Response<ApiResponse>) => {
  try {
    // Get all subjects
    const subjects = db.prepare('SELECT * FROM subjects').all() as any[];

    // Get existing sessions to preserve assignments
    const existingSessions = db.prepare('SELECT * FROM sessions').all() as any[];
    const existingMap = new Map(existingSessions.map(s => [s.id, s]));

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // For each subject, generate sessions based on splitPattern
    for (const subject of subjects) {
      let splitPattern: number[] = [];
      try {
        splitPattern = JSON.parse(subject.split_pattern);
      } catch {
        console.warn(`Invalid splitPattern for subject ${subject.id}: ${subject.split_pattern}`);
        continue;
      }

      // Generate sessions for each part in the split pattern
      splitPattern.forEach((duration, index) => {
        const sessionId = `${subject.id}_${index}`;
        const existing = existingMap.get(sessionId);

        if (existing) {
          // Session exists - only update if subject is fixed and assignment changed
          if (subject.is_fixed === 1) {
            const needsUpdate =
              existing.day !== subject.fixed_day ||
              existing.start_slot !== subject.fixed_start ||
              existing.room_id !== subject.fixed_room ||
              existing.duration !== duration;

            if (needsUpdate) {
              db.prepare(`
                UPDATE sessions
                SET day = ?, start_slot = ?, duration = ?, room_id = ?, updated_at = datetime('now')
                WHERE id = ?
              `).run(
                subject.fixed_day,
                subject.fixed_start,
                duration,
                subject.fixed_room,
                sessionId
              );
              updated++;
            } else {
              skipped++;
            }
          } else {
            // Non-fixed subject - only update duration if changed
            if (existing.duration !== duration) {
              db.prepare(`
                UPDATE sessions SET duration = ?, updated_at = datetime('now') WHERE id = ?
              `).run(duration, sessionId);
              updated++;
            } else {
              skipped++;
            }
          }
        } else {
          // Create new session
          if (subject.is_fixed === 1) {
            // Fixed subject - assign to fixed day/time/room
            db.prepare(`
              INSERT INTO sessions (id, subject_id, day, start_slot, duration, room_id, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `).run(
              sessionId,
              subject.id,
              subject.fixed_day,
              subject.fixed_start,
              duration,
              subject.fixed_room
            );
          } else {
            // Non-fixed subject - create unassigned session (no day/slot/room)
            db.prepare(`
              INSERT INTO sessions (id, subject_id, day, start_slot, duration, room_id, created_at, updated_at)
              VALUES (?, ?, NULL, NULL, ?, NULL, datetime('now'), datetime('now'))
            `).run(
              sessionId,
              subject.id,
              duration
            );
          }
          created++;
        }
      });
    }

    // Delete orphaned sessions (sessions for subjects that no longer exist)
    const subjectIds = subjects.map(s => s.id);
    const orphaned = db.prepare(`
      DELETE FROM sessions WHERE subject_id NOT IN (${subjectIds.map(() => '?').join(',')})
    `).run(...subjectIds);

    res.json({
      success: true,
      message: `Sessions synced: ${created} created, ${updated} updated, ${skipped} skipped, ${orphaned.changes} deleted`,
      data: {
        created,
        updated,
        skipped,
        deleted: orphaned.changes
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
