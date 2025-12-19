import { Router, Request, Response } from 'express';
import db from '../database/connection';
import { Room, CreateRoomRequest, UpdateRoomRequest, ApiResponse } from '../types';

const router = Router();

// GET all rooms
router.get('/', (req: Request, res: Response<ApiResponse<Room[]>>) => {
  try {
    const rooms = db.prepare('SELECT * FROM rooms ORDER BY id').all() as Room[];
    res.json({ success: true, data: rooms });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET room by ID
router.get('/:id', (req: Request, res: Response<ApiResponse<Room>>) => {
  try {
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id) as Room | undefined;
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create room
router.post('/', (req: Request<{}, {}, CreateRoomRequest>, res: Response<ApiResponse<Room>>) => {
  try {
    const { id, name, capacity } = req.body;

    if (!id || !name || capacity === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const stmt = db.prepare('INSERT INTO rooms (id, name, capacity) VALUES (?, ?, ?)');
    stmt.run(id, name, capacity);

    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id) as Room;
    res.status(201).json({ success: true, data: room, message: 'Room created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update room
router.put('/:id', (req: Request<{ id: string }, {}, UpdateRoomRequest>, res: Response<ApiResponse<Room>>) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.capacity !== undefined) { fields.push('capacity = ?'); values.push(updates.capacity); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    if (fields.length > 1) {
      const stmt = db.prepare(`UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`);
      stmt.run(...values);
    }

    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id) as Room;
    res.json({ success: true, data: room, message: 'Room updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE room
router.delete('/:id', (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM rooms WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
