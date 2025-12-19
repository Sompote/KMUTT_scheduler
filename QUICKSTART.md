# Quick Start Guide - CE KMUTT Scheduler

## 🚀 Running the Application

### Step 1: Start the Backend

Open Terminal 1:
```bash
cd /Users/sompoteyouwai/env1/time_shcedule/backend
npm run dev
```

You should see:
```
✅ Database connected: ./data/scheduler.db
🚀 Server running on http://localhost:3000
```

### Step 2: Start the Frontend

Open Terminal 2:
```bash
cd /Users/sompoteyouwai/env1/time_shcedule/frontend

# First time only - install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open the Application

Open your browser and navigate to: **http://localhost:5173**

## ✅ What's Working Now

### Data Management Tab (ข้อมูลพื้นฐาน)

#### 1. **Years (ชั้นปี)** - Fully Functional ✅
- Click "+ เพิ่ม" to add a new year
- Click on any year to edit
- Fill in: ID, Name, Student Count
- Click "บันทึก" to save
- Click "ลบชั้นปี" to delete

**Try adding:**
```
ID: TH-B1A
Name: ป.ตรี (ปกติ) ปี 1 (A)
Count: 45
```

#### 2. **Rooms (ห้องเรียน)** - Fully Functional ✅
- Click "+ เพิ่ม" to add a new room
- Click on any room to edit
- Fill in: ID, Name, Capacity
- Click "บันทึก" to save
- Click "ลบห้อง" to delete

**Try adding:**
```
ID: CB1103
Name: CB1103
Capacity: 150
```

#### 3. **Instructors (ผู้สอน)** - Fully Functional ✅
- Click "+ เพิ่ม" to add a new instructor
- Fill in personal information
- **Click on the availability grid** to mark busy times (red = busy)
- Click "บันทึก" to save
- Click "ลบผู้สอน" to delete

**Try adding:**
```
Prefix: ผู้ช่วยศาสตราจารย์ ดร.
Field: วิศวกรรมโครงสร้าง
First Name: สมชาย
Last Name: ทดสอบ
Tel: 02 470 9999
Email: somchai@kmutt.ac.th
```

Then click on some time slots to mark them as busy!

#### 4. **Subjects (รายวิชา)** - Display Only 🔨
- Table shows all subjects from database
- Click "+ เพิ่มรายวิชา" button (not yet implemented)
- Edit/Delete functionality coming next

### What's NOT Working Yet ⏳

- Subject creation/editing (complex form - next phase)
- Scheduler calendar (drag & drop)
- Auto-assign algorithm
- Reports

## 🧪 Testing the CRUD Operations

### Test Years CRUD:

1. **Create**: Click "+ เพิ่ม" → Fill form → Click "บันทึก"
2. **Read**: See the list update automatically
3. **Update**: Click on an item → Edit → Click "บันทึก"
4. **Delete**: Click on an item → Click "ลบชั้นปี" → Confirm

### Test Rooms CRUD:

Same steps as Years

### Test Instructors CRUD:

1. **Create**: Click "+ เพิ่ม" → Fill form → Click availability grid → "บันทึก"
2. **Read**: See instructor in list
3. **Update**: Click instructor → Modify → Change availability → "บันทึก"
4. **Delete**: Click instructor → "ลบผู้สอน" → Confirm

## 🔍 Checking the Database

You can verify data was saved by checking the backend API:

```bash
# Get all years
curl http://localhost:3000/api/years

# Get all rooms
curl http://localhost:3000/api/rooms

# Get all instructors
curl http://localhost:3000/api/instructors
```

Or check the SQLite database directly:
```bash
cd /Users/sompoteyouwai/env1/time_shcedule/backend
sqlite3 data/scheduler.db

# Inside sqlite3:
SELECT * FROM years;
SELECT * FROM rooms;
SELECT * FROM instructors;
.quit
```

## 📋 Next Steps

### Phase 2: Subject Management (In Progress)
The Subject form is complex because it needs:
- Multiple year checkboxes
- Multiple instructors with ratio (must sum to 100%)
- Split pattern (e.g., "3,1" for 3hr + 1hr classes)
- Fixed schedule option

### Phase 3: Scheduler (Coming Next)
- Drag & drop calendar
- Room selection on drop
- Conflict detection
- Visual feedback

### Phase 4: Auto-Assign & Reports
- Intelligent scheduling algorithm
- Workload reports
- Room utilization reports

## 🐛 Troubleshooting

### Backend not connecting?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Restart backend
cd backend && npm run dev
```

### Frontend not loading?
```bash
# Check if port 5173 is in use
lsof -i :5173

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### Database issues?
```bash
# Reinitialize database (creates empty tables)
cd backend
npm run db:init

# Populate with sample data from original Scheduler.html
npm run db:seed
```

**What's the difference?**
- `npm run db:init` - Creates empty database tables (schema only)
- `npm run db:seed` - Populates database with sample data (26 years, 51 rooms, 34 instructors, 69 subjects)

**Sample data includes:**
- Years: TH-B1A through TH-B5B+ (Regular), IT-B1A through IT-B5B+ (International), Graduate programs
- Rooms: CB building rooms, drawing rooms, SC rooms, GYM
- Instructors: P1-P34 with full details (names, emails, fields)
- Subjects: CVE courses for Year 1-4 (both TH and IT programs) with instructors and ratios

**Try this to get started quickly:**
```bash
cd backend
npm run db:init    # Create tables
npm run db:seed    # Add sample data
npm run dev        # Start backend
```

Then open http://localhost:5173 and you'll see all the sample data ready to use!

## 🎯 Current Status Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Backend API | ✅ Complete | All endpoints working |
| Database | ✅ Complete | SQLite with 12 tables |
| Years CRUD | ✅ Complete | Fully functional |
| Rooms CRUD | ✅ Complete | Fully functional |
| Instructors CRUD | ✅ Complete | With availability grid |
| Subjects Table | 🔨 In Progress | Display only |
| Subject Form | ⏳ Pending | Complex modal needed |
| Scheduler | ⏳ Pending | Drag & drop calendar |
| Auto-Assign | ⏳ Pending | Algorithm port |
| Reports | ⏳ Pending | Workload & rooms |

## 💡 Tips

1. **Try adding data in this order**: Years → Rooms → Instructors
2. **The availability grid** is clickable - red = busy, white = available
3. **Data persists** in SQLite - it won't disappear on refresh!
4. **Open browser DevTools** (F12) to see API calls and errors
5. **Check both terminals** for backend and frontend logs

---

**You now have a working data management system!** 🎉

The infrastructure is solid, and adding the remaining features (Subject form, Scheduler, Reports) will follow the same patterns you see in Years, Rooms, and Instructors components.
