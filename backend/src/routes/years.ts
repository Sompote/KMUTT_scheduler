import { Router, Request, Response } from 'express';
import db from '../database/connection';
import { Year, CreateYearRequest, UpdateYearRequest, ApiResponse } from '../types';

const router = Router();

// GET all years
router.get('/', (req: Request, res: Response<ApiResponse<Year[]>>) => {
  try {
    const years = db.prepare('SELECT * FROM years ORDER BY id').all() as Year[];
    res.json({ success: true, data: years });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET year by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Year>>) => {
  try {
    const year = db.prepare('SELECT * FROM years WHERE id = ?').get(req.params.id) as Year | undefined;
    if (!year) {
      return res.status(404).json({ success: false, error: 'Year not found' });
    }
    res.json({ success: true, data: year });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create year
router.post('/', (req: Request<{}, {}, CreateYearRequest>, res: Response<ApiResponse<Year>>) => {
  try {
    const { id, name, count } = req.body;

    if (!id || !name || count === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const stmt = db.prepare('INSERT INTO years (id, name, count) VALUES (?, ?, ?)');
    stmt.run(id, name, count);

    const year = db.prepare('SELECT * FROM years WHERE id = ?').get(id) as Year;
    res.status(201).json({ success: true, data: year, message: 'Year created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update year
router.put('/:id', (req: Request<{ id: string }, {}, UpdateYearRequest>, res: Response<ApiResponse<Year>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if year exists
    const existing = db.prepare('SELECT * FROM years WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Year not found' });
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.count !== undefined) { fields.push('count = ?'); values.push(updates.count); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    if (fields.length > 1) { // More than just updated_at
      const stmt = db.prepare(`UPDATE years SET ${fields.join(', ')} WHERE id = ?`);
      stmt.run(...values);
    }

    const year = db.prepare('SELECT * FROM years WHERE id = ?').get(id) as Year;
    res.json({ success: true, data: year, message: 'Year updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE year
router.delete('/:id', (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM years WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Year not found' });
    }

    res.json({ success: true, message: 'Year deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
