import { Router, Request, Response } from 'express';
import db from '../database/connection';
import { Instructor, CreateInstructorRequest, UpdateInstructorRequest, ApiResponse, BusySlot } from '../types';

const router = Router();

// GET all instructors
router.get('/', (req: Request, res: Response<ApiResponse<Instructor[]>>) => {
  try {
    const instructors = db.prepare('SELECT * FROM instructors ORDER BY id').all() as Instructor[];

    // Get busy slots for each instructor
    for (const instructor of instructors) {
      const busySlots = db.prepare(
        'SELECT day, slot FROM instructor_availability WHERE instructor_id = ? AND is_busy = 1'
      ).all(instructor.id) as BusySlot[];
      instructor.busy = busySlots;
    }

    res.json({ success: true, data: instructors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET instructor by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Instructor>>) => {
  try {
    const instructor = db.prepare('SELECT * FROM instructors WHERE id = ?').get(req.params.id) as Instructor | undefined;
    if (!instructor) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }

    // Get busy slots
    const busySlots = db.prepare(
      'SELECT day, slot FROM instructor_availability WHERE instructor_id = ? AND is_busy = 1'
    ).all(instructor.id) as BusySlot[];
    instructor.busy = busySlots;

    res.json({ success: true, data: instructor });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create instructor
router.post('/', (req: Request<{}, {}, CreateInstructorRequest>, res: Response<ApiResponse<Instructor>>) => {
  try {
    const { id, prefix, first_name, last_name, telephone, email, field, busy } = req.body;

    if (!id || !first_name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const transaction = db.transaction(() => {
      // Insert instructor
      const stmt = db.prepare(
        'INSERT INTO instructors (id, prefix, first_name, last_name, telephone, email, field) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      stmt.run(id, prefix || null, first_name, last_name || null, telephone || null, email || null, field || null);

      // Insert busy slots
      if (busy && busy.length > 0) {
        const busyStmt = db.prepare(
          'INSERT OR REPLACE INTO instructor_availability (instructor_id, day, slot, is_busy) VALUES (?, ?, ?, 1)'
        );
        for (const slot of busy) {
          busyStmt.run(id, slot.day, slot.slot);
        }
      }
    });

    transaction();

    const instructor = db.prepare('SELECT * FROM instructors WHERE id = ?').get(id) as Instructor;
    instructor.busy = busy || [];

    res.status(201).json({ success: true, data: instructor, message: 'Instructor created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update instructor
router.put('/:id', (req: Request<{ id: string }, {}, UpdateInstructorRequest>, res: Response<ApiResponse<Instructor>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = db.prepare('SELECT * FROM instructors WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }

    const transaction = db.transaction(() => {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.prefix !== undefined) { fields.push('prefix = ?'); values.push(updates.prefix); }
      if (updates.first_name !== undefined) { fields.push('first_name = ?'); values.push(updates.first_name); }
      if (updates.last_name !== undefined) { fields.push('last_name = ?'); values.push(updates.last_name); }
      if (updates.telephone !== undefined) { fields.push('telephone = ?'); values.push(updates.telephone); }
      if (updates.email !== undefined) { fields.push('email = ?'); values.push(updates.email); }
      if (updates.field !== undefined) { fields.push('field = ?'); values.push(updates.field); }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (fields.length > 1) {
        const stmt = db.prepare(`UPDATE instructors SET ${fields.join(', ')} WHERE id = ?`);
        stmt.run(...values);
      }

      // Update busy slots if provided
      if (updates.busy !== undefined) {
        // Clear existing busy slots
        db.prepare('DELETE FROM instructor_availability WHERE instructor_id = ?').run(id);

        // Insert new busy slots
        if (updates.busy.length > 0) {
          const busyStmt = db.prepare(
            'INSERT INTO instructor_availability (instructor_id, day, slot, is_busy) VALUES (?, ?, ?, 1)'
          );
          for (const slot of updates.busy) {
            busyStmt.run(id, slot.day, slot.slot);
          }
        }
      }
    });

    transaction();

    const instructor = db.prepare('SELECT * FROM instructors WHERE id = ?').get(id) as Instructor;
    const busySlots = db.prepare(
      'SELECT day, slot FROM instructor_availability WHERE instructor_id = ? AND is_busy = 1'
    ).all(id) as BusySlot[];
    instructor.busy = busySlots;

    res.json({ success: true, data: instructor, message: 'Instructor updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE instructor
router.delete('/:id', (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM instructors WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }

    res.json({ success: true, message: 'Instructor deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
