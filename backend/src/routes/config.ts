import { Router, Request, Response } from 'express';
import db from '../database/connection';
import { Settings, UpdateSettingsRequest, DepartmentConstraint, ApiResponse } from '../types';

const router = Router();

// GET academic year
router.get('/acad-year', (req: Request, res: Response<ApiResponse<string>>) => {
  try {
    const result = db.prepare("SELECT value FROM config WHERE key = 'acadYear'").get() as { value: string } | undefined;
    res.json({ success: true, data: result?.value || '2/2568' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update academic year
router.put('/acad-year', (req: Request<{}, {}, { value: string }>, res: Response<ApiResponse<string>>) => {
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ success: false, error: 'Value is required' });
    }

    db.prepare("INSERT OR REPLACE INTO config (key, value, updated_at) VALUES ('acadYear', ?, CURRENT_TIMESTAMP)")
      .run(value);

    res.json({ success: true, data: value, message: 'Academic year updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET settings
router.get('/settings', (req: Request, res: Response<ApiResponse<Settings>>) => {
  try {
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get() as Settings;
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update settings
router.put('/settings', (req: Request<{}, {}, UpdateSettingsRequest>, res: Response<ApiResponse<Settings>>) => {
  try {
    const updates = req.body;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.work_start !== undefined) { fields.push('work_start = ?'); values.push(updates.work_start); }
    if (updates.work_end !== undefined) { fields.push('work_end = ?'); values.push(updates.work_end); }
    if (updates.max_continuous_hours !== undefined) { fields.push('max_continuous_hours = ?'); values.push(updates.max_continuous_hours); }
    if (updates.check_room_constraints !== undefined) { fields.push('check_room_constraints = ?'); values.push(updates.check_room_constraints); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(1);

    if (fields.length > 1) {
      const stmt = db.prepare(`UPDATE settings SET ${fields.join(', ')} WHERE id = ?`);
      stmt.run(...values);
    }

    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get() as Settings;
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET department constraints
router.get('/dept-constraints', (req: Request, res: Response<ApiResponse<DepartmentConstraint[]>>) => {
  try {
    const constraints = db.prepare('SELECT * FROM department_constraints ORDER BY day, slot').all() as DepartmentConstraint[];
    res.json({ success: true, data: constraints });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update department constraints (replaces all)
router.put('/dept-constraints', (req: Request<{}, {}, DepartmentConstraint[]>, res: Response<ApiResponse<DepartmentConstraint[]>>) => {
  try {
    const constraints = req.body;

    const transaction = db.transaction(() => {
      // Clear existing constraints
      db.prepare('DELETE FROM department_constraints').run();

      // Insert new constraints
      if (constraints && constraints.length > 0) {
        const stmt = db.prepare('INSERT INTO department_constraints (day, slot, constraint_type) VALUES (?, ?, ?)');
        for (const c of constraints) {
          stmt.run(c.day, c.slot, c.constraint_type);
        }
      }
    });

    transaction();

    const updated = db.prepare('SELECT * FROM department_constraints ORDER BY day, slot').all() as DepartmentConstraint[];
    res.json({ success: true, data: updated, message: 'Department constraints updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
