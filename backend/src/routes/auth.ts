import { Router, Request, Response } from 'express';

const router = Router();

// Mock users database (in production, this should be in a real database with hashed passwords)
const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, this should be hashed with bcrypt
    name: 'ผู้ดูแลระบบ',
    role: 'admin'
  },
  {
    id: '2',
    username: 'teacher',
    password: 'teacher123',
    name: 'อาจารย์ทดสอบ',
    role: 'teacher'
  }
];

// Login endpoint
router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
      });
    }

    // Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        // In production, generate a JWT token here
        token: `mock-jwt-token-${user.id}`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    });
  }
});

// Verify token endpoint (for session validation)
router.get('/verify', (req: Request, res: Response) => {
  try {
    // In production, verify JWT token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'ไม่พบ token'
      });
    }

    // Mock verification - extract user ID from token
    const userId = token.replace('mock-jwt-token-', '');
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token ไม่ถูกต้อง'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการตรวจสอบ token'
    });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  // In production with JWT, you might want to blacklist the token
  res.json({
    success: true,
    message: 'ออกจากระบบสำเร็จ'
  });
});

export default router;
