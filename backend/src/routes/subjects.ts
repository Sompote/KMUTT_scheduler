import { Router, Request, Response } from 'express';
import db from '../database/connection';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest, ApiResponse } from '../types';

const router = Router();

// GET all subjects
router.get('/', (req: Request, res: Response<ApiResponse<Subject[]>>) => {
  try {
    const subjects = db.prepare('SELECT * FROM subjects ORDER BY code, section').all() as Subject[];

    // Get years and instructors for each subject
    for (const subject of subjects) {
      // Parse split_pattern
      subject.splitPattern = JSON.parse(subject.split_pattern);

      // Get years
      const years = db.prepare(
        'SELECT year_id FROM subject_years WHERE subject_id = ?'
      ).all(subject.id).map((row: any) => row.year_id);
      subject.year = years;

      // Get instructors
      const instructors = db.prepare(
        'SELECT instructor_id as id, ratio FROM subject_instructors WHERE subject_id = ?'
      ).all(subject.id) as Array<{ id: string; ratio: number }>;
      subject.instructors = instructors;
    }

    res.json({ success: true, data: subjects });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET subject by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Subject>>) => {
  try {
    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id) as Subject | undefined;
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    // Parse split_pattern
    subject.splitPattern = JSON.parse(subject.split_pattern);

    // Get years
    const years = db.prepare(
      'SELECT year_id FROM subject_years WHERE subject_id = ?'
    ).all(subject.id).map((row: any) => row.year_id);
    subject.year = years;

    // Get instructors
    const instructors = db.prepare(
      'SELECT instructor_id as id, ratio FROM subject_instructors WHERE subject_id = ?'
    ).all(subject.id) as Array<{ id: string; ratio: number }>;
    subject.instructors = instructors;

    res.json({ success: true, data: subject });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create subject
router.post('/', (req: Request<{}, {}, CreateSubjectRequest>, res: Response<ApiResponse<Subject>>) => {
  try {
    const {
      id, code, section, name, credit, workload, splitPattern,
      is_fixed, fixed_day, fixed_start, fixed_room, year, instructors
    } = req.body;

    if (!id || !code || !section || !name || !splitPattern || !year || !instructors) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const transaction = db.transaction(() => {
      // Insert subject
      const stmt = db.prepare(`
        INSERT INTO subjects (id, code, section, name, credit, workload, split_pattern, is_fixed, fixed_day, fixed_start, fixed_room)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, code, section, name, credit, workload,
        JSON.stringify(splitPattern),
        is_fixed, fixed_day || null, fixed_start ?? null, fixed_room || null
      );

      // Insert years
      const yearStmt = db.prepare('INSERT INTO subject_years (subject_id, year_id) VALUES (?, ?)');
      for (const yearId of year) {
        yearStmt.run(id, yearId);
      }

      // Insert instructors
      const instStmt = db.prepare('INSERT INTO subject_instructors (subject_id, instructor_id, ratio) VALUES (?, ?, ?)');
      for (const inst of instructors) {
        instStmt.run(id, inst.id, inst.ratio);
      }
    });

    transaction();

    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id) as Subject;
    subject.splitPattern = splitPattern;
    subject.year = year;
    subject.instructors = instructors;

    res.status(201).json({ success: true, data: subject, message: 'Subject created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update subject
router.put('/:id', (req: Request<{ id: string }, {}, UpdateSubjectRequest>, res: Response<ApiResponse<Subject>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    const transaction = db.transaction(() => {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.code !== undefined) { fields.push('code = ?'); values.push(updates.code); }
      if (updates.section !== undefined) { fields.push('section = ?'); values.push(updates.section); }
      if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
      if (updates.credit !== undefined) { fields.push('credit = ?'); values.push(updates.credit); }
      if (updates.workload !== undefined) { fields.push('workload = ?'); values.push(updates.workload); }
      if (updates.splitPattern !== undefined) { fields.push('split_pattern = ?'); values.push(JSON.stringify(updates.splitPattern)); }
      if (updates.is_fixed !== undefined) { fields.push('is_fixed = ?'); values.push(updates.is_fixed); }
      if (updates.fixed_day !== undefined) { fields.push('fixed_day = ?'); values.push(updates.fixed_day); }
      if (updates.fixed_start !== undefined) { fields.push('fixed_start = ?'); values.push(updates.fixed_start); }
      if (updates.fixed_room !== undefined) { fields.push('fixed_room = ?'); values.push(updates.fixed_room); }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (fields.length > 1) {
        const stmt = db.prepare(`UPDATE subjects SET ${fields.join(', ')} WHERE id = ?`);
        stmt.run(...values);
      }

      // Update years if provided
      if (updates.year !== undefined) {
        db.prepare('DELETE FROM subject_years WHERE subject_id = ?').run(id);
        if (updates.year.length > 0) {
          const yearStmt = db.prepare('INSERT INTO subject_years (subject_id, year_id) VALUES (?, ?)');
          for (const yearId of updates.year) {
            yearStmt.run(id, yearId);
          }
        }
      }

      // Update instructors if provided
      if (updates.instructors !== undefined) {
        db.prepare('DELETE FROM subject_instructors WHERE subject_id = ?').run(id);
        if (updates.instructors.length > 0) {
          const instStmt = db.prepare('INSERT INTO subject_instructors (subject_id, instructor_id, ratio) VALUES (?, ?, ?)');
          for (const inst of updates.instructors) {
            instStmt.run(id, inst.id, inst.ratio);
          }
        }
      }
    });

    transaction();

    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id) as Subject;
    subject.splitPattern = JSON.parse(subject.split_pattern);

    const years = db.prepare(
      'SELECT year_id FROM subject_years WHERE subject_id = ?'
    ).all(id).map((row: any) => row.year_id);
    subject.year = years;

    const instructors = db.prepare(
      'SELECT instructor_id as id, ratio FROM subject_instructors WHERE subject_id = ?'
    ).all(id) as Array<{ id: string; ratio: number }>;
    subject.instructors = instructors;

    res.json({ success: true, data: subject, message: 'Subject updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE subject
router.delete('/:id', (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM subjects WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
