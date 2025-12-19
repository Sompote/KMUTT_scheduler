# 🔐 Login Page Feature

## Overview

A complete authentication system has been added to the frontend application with login page, protected routes, and user session management.

## Features Implemented

### ✅ Login Page (`/login`)
- Beautiful gradient design with KMUTT branding
- Username and password fields with icons
- "Remember me" checkbox
- "Forgot password" link placeholder
- Demo credentials display
- Loading state during authentication
- Error message display
- Fully responsive design

### ✅ Authentication System

**Components Created:**
1. **`Login.tsx`** - Main login page component
2. **`AuthContext.tsx`** - Authentication state management with Context API
3. **`ProtectedRoute.tsx`** - Route wrapper requiring authentication
4. **`MainApp.tsx`** - Main application (moved from App.tsx)
5. **`useAuth.ts`** - Custom hook for authentication

**Backend API:**
- **`/api/auth/login`** - POST endpoint for user login
- **`/api/auth/verify`** - GET endpoint for token verification
- **`/api/auth/logout`** - POST endpoint for logout

## Demo Credentials

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator (ผู้ดูแลระบบ)

### Teacher User
- **Username**: `teacher`
- **Password**: `teacher123`
- **Role**: Teacher (อาจารย์)

## How It Works

### 1. Initial Load
- Application checks for existing user session in `localStorage`
- If found, user is automatically logged in
- If not found, redirects to `/login`

### 2. Login Process
```
User enters credentials → AuthContext.login() → Store user in localStorage → Redirect to /
```

### 3. Protected Routes
```
Access protected route → Check authentication → Redirect if not authenticated
```

### 4. Logout
```
User clicks logout → Clear localStorage → Redirect to /login
```

## File Structure

```
frontend/src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx              # Login page
│   │   └── ProtectedRoute.tsx     # Protected route wrapper
│   └── layout/
│       └── MainApp.tsx            # Main app (previously in App.tsx)
├── contexts/
│   └── AuthContext.tsx            # Auth state management
├── hooks/
│   └── useAuth.ts                 # Auth hook
└── App.tsx                        # Router setup

backend/src/routes/
└── auth.ts                        # Auth API endpoints
```

## Navigation Flow

```
┌─────────────────┐
│   User visits   │
│   application   │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Logged   │
    │   in?    │
    └──┬───┬───┘
       │   │
    No │   │ Yes
       │   │
       ▼   ▼
  ┌────────┐  ┌──────────┐
  │ /login │  │ Main App │
  └────┬───┘  └──────┬───┘
       │             │
       │ Login       │ Logout
       │             │
       └──────┬──────┘
              │
         ┌────▼─────┐
         │ Update   │
         │ Session  │
         └──────────┘
```

## UI Features

### Login Page
- **Header**: KMUTT logo with department name (Thai & English)
- **Card**: White card with shadow on orange gradient background
- **Form Fields**:
  - Username with user icon
  - Password with lock icon
  - Remember me checkbox
  - Forgot password link
- **Submit Button**: Orange KMUTT theme with loading spinner
- **Demo Credentials**: Shown in a highlighted box
- **Footer**: Copyright and tech stack information

### Main App (After Login)
- **User Menu**: Shows user name and role in navbar
- **Logout Button**: Red logout button in top-right corner
- **Protected Content**: All tabs require authentication

## Security Notes

### Current Implementation (Demo)
⚠️ **For demonstration purposes only**
- Passwords stored in plain text
- No actual JWT token generation
- Client-side authentication only
- Mock token system

### Production Requirements
For production deployment, implement:
1. **Password Hashing**: Use bcrypt to hash passwords
2. **JWT Tokens**: Generate and verify real JWT tokens
3. **Database**: Store users in database
4. **HTTPS**: Use SSL/TLS for secure transmission
5. **CSRF Protection**: Add CSRF tokens
6. **Rate Limiting**: Prevent brute force attacks
7. **Session Timeout**: Implement auto-logout
8. **Two-Factor Auth**: Add 2FA for enhanced security

## Future Enhancements

- [ ] Real JWT token-based authentication
- [ ] Password reset functionality
- [ ] User registration
- [ ] Role-based access control (RBAC)
- [ ] Activity logging
- [ ] Session timeout with auto-logout
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, Microsoft)

## Testing

### Test Login
1. Navigate to `http://localhost:5175`
2. You should see the login page
3. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
4. Click "เข้าสู่ระบบ" button
5. You should be redirected to the main application
6. Your name and logout button should appear in the navbar

### Test Protected Routes
1. While logged out, try to access `http://localhost:5175/`
2. You should be redirected to `/login`
3. After logging in, you can access all pages
4. Click the logout button to return to login page

### Test Session Persistence
1. Log in successfully
2. Refresh the page
3. You should remain logged in (session persists in localStorage)

## API Endpoints

### POST /api/auth/login
**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "name": "ผู้ดูแลระบบ",
      "role": "admin"
    },
    "token": "mock-jwt-token-1"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
}
```

### GET /api/auth/verify
**Headers:**
```
Authorization: Bearer mock-jwt-token-1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "name": "ผู้ดูแลระบบ",
      "role": "admin"
    }
  }
}
```

### POST /api/auth/logout
**Response:**
```json
{
  "success": true,
  "message": "ออกจากระบบสำเร็จ"
}
```

## Screenshot

The login page features:
- 🎨 KMUTT orange gradient background
- 🔵 White card with logo
- 📝 Clean form fields with icons
- 🔐 Demo credentials display
- 📱 Fully responsive design

## Development Notes

- Authentication state is managed globally via React Context
- Session persists across page refreshes using localStorage
- Protected routes automatically redirect to login
- Logout clears session and redirects to login
- User information displayed in navbar after login

---

**Status**: ✅ Complete and tested
**Version**: 1.0.0
**Date**: December 19, 2025
