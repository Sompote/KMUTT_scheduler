# Database Seeding Guide

## 📝 Overview

The database seeding script (`backend/src/database/seed.ts`) populates your SQLite database with the exact same sample data from the original `Scheduler.html` file. This allows you to immediately test the application with realistic data without manually entering everything.

## 🚀 Quick Start

### Initialize and Seed Database

```bash
cd backend

# Step 1: Create empty tables
npm run db:init

# Step 2: Populate with sample data
npm run db:seed
```

### Expected Output

```
✅ Database connected: ./data/scheduler.db
🌱 Starting database seeding...
  🧹 Clearing existing data...
  📅 Inserting years...
    ✅ Inserted 26 years
  🏢 Inserting rooms...
    ✅ Inserted 51 rooms
  👨‍🏫 Inserting instructors...
    ✅ Inserted 34 instructors
  📚 Inserting subjects...
    ✅ Inserted 69 subjects with relationships
  ⚙️  Setting academic year...
    ✅ Set academic year to 2567
✅ Database seeding completed successfully!

📊 Summary:
   - Years: 26
   - Rooms: 51
   - Instructors: 34
   - Subjects: 69
```

## 📊 Seeded Data Summary

### Years (26 total)

#### Regular Program (TH)
- **Year 1**: TH-B1A, TH-B1B (45 students each)
- **Year 2**: TH-B2A, TH-B2B (45 students each)
- **Year 3**: TH-B3A, TH-B3B (45 students each)
- **Year 4**: TH-B4A, TH-B4B (45 students each)
- **Year 5+**: TH-B5A+, TH-B5B+ (45 students each)

#### International Program (IT)
- **Year 1**: IT-B1A, IT-B1B (45 students each)
- **Year 2**: IT-B2A, IT-B2B (45 students each)
- **Year 3**: IT-B3A, IT-B3B (45 students each)
- **Year 4**: IT-B4A, IT-B4B (45 students each)
- **Year 5+**: IT-B5A+, IT-B5B+ (45 students each)

#### Graduate Programs
- **STR-Grad**: ป.โท (โครงสร้าง) ปี 1 (40 students)
- **GEO-Grad**: ป.โท (ธรณี) ปี 1 (40 students)
- **WRE-Grad**: ป.โท (น้ำ) ปี 1 (40 students)
- **TPE-Grad**: ป.โท (ขนส่ง) ปี 1 (40 students)
- **CET-Grad**: ป.โท (CET) ปี 1 (40 students)
- **CM-Grad**: ป.โท (CM) ปี 1 (40 students)

### Rooms (51 total)

#### CB Building (Main)
- Large lecture halls: CB1103, CB2201, CB2501, CB2601 (150 capacity)
- Medium lecture halls: CB1209, CB1303, CB1304, CB1403, CB1404, CB1501, CB1504, CB2301, CB2401, CB2403, CB2404, CB2407, CB2408, etc. (80 capacity)
- Small classrooms: CB1205, CB1207, CB1301, CB1302, CB1305, CB1307, CB1401, CB1402, CB1405, CB1406, CB1407, CB1505, etc. (40 capacity)

#### Specialized Rooms
- Drawing rooms: Drawing 1, Drawing 2 (80 capacity)
- Science labs: SC2109, SC2111, SCL124, SCL216
- GYM (100 capacity)

### Instructors (34 total)

#### Structural Engineering (วิศวกรรมโครงสร้าง)
- P1 - ผศ.ดร.บุญมี ชินนาบุญ
- P2 - ศ.ดร.สมชาย ชูชีพสกุล
- P3 - ดร.จุลพจน์ จิรวัชรเดช
- P4 - ผศ.ดร.อภินัติ อัชกุล
- P5 - ศ.ดร.ชัย จาตุรพิทักษ์กุล
- P6 - รศ.ดร.ทวิช พูลเงิน
- P7 - ศ.ดร.สุทัศน์ ลีลาทวีวัฒน์
- P8 - รศ.ดร.ชัยณรงค์ อธิสกุล
- P9 - รศ.ดร.วีรชาติ ตั้งจิรภัทร
- P10 - ผศ.ดร.รักติพงษ์ สหมิตรมงคล
- P11 - ผศ.ดร.เอกชัย อยู่ประเสริฐชัย
- P12 - ดร.พีรสิทธิ์ มหาสุวรรณชัย
- P13 - ดร.กสาน จันทร์โต
- P14 - ดร.ชนิภา เนตรรัตนะ

#### Geotechnical Engineering (วิศวกรรมเทคนิคธรณี)
- P15 - ศ.ดร.วรัช ก้องกิจกุล
- P16 - รศ.ดร.สมโพธิ อยู่ไว
- P17 - ศ.ดร.พรเกษม จงประดิษฐ์
- P18 - Asst. Prof. Dr. Goran Arangjelovski
- P19 - ผศ.ดร.ชนา พุทธนานนท์

#### Construction Management (วิศวกรรมบริหารงานก่อสร้าง)
- P20 - ผศ.ดร.วุฒิพงศ์ เมืองน้อย
- P21 - ผศ.ดร.สันติ เจริญพรพัฒนา

#### Transportation Engineering (วิศวกรรมขนส่ง)
- P22 - รศ.ดร.อำพล การุณสุนทวงษ์
- P23 - ผศ.ดร.วศิน เกียรติโกมล
- P24 - รศ.ดร.วิโรจน์ ศรีสุรภานนท์
- P25 - ดร.จำเริญ เส

#### Water Resources Engineering (วิศวกรรมทรัพยากรน้ำ)
- P26 - ผศ.ดร.ดวงฤดี โฆษิตกิตติวงศ์ ก้องกิจกุล
- P27 - ผศ.ดร.ชัยวัฒน์ เอกวัฒน์พานิชย์
- P28 - ดร.วงศ์นรินทร์ คำพอ
- P29 - ผศ.ดร.ชาญชัย เพชรพงศ์พันธุ์

#### Surveying Engineering (วิศวกรรมสำรวจ)
- P30 - ผศ.ธีระ ลาภิศชยางกูล
- P31 - ดร.ธงชัย โพธิ์ทอง

#### Special Lecturers (อาจารย์พิเศษ)
- P32 - อาจารย์ตะวัน
- P33 - อาจารย์ภาณุวัฒน์
- P34 - อาจารย์พิสุทธิ์ อุ่นวงศ์

### Subjects (69 total)

#### Regular Program (TH) - Sample Courses

**Year 1**
- CVE101 - World of Civil Engineering
- CVE111 - Engineering Drawing (Lecture + Practice groups)
- CVE131 - Engineering Mechanics (Lecture + Tutorial groups)
- PHY104 - General Physics II (Fixed schedule)
- MTH102 - Mathematics II (Fixed schedule)
- LNG220 - Academic English (Fixed schedule)
- PHY192 - General Physics Laboratory II (Fixed schedule)
- GEN101 - Physical Education (Fixed schedule)

**Year 2**
- CVE200 - Probability and Statistics
- CVE235 - Civil Engineering Materials (Lecture + Lab groups)
- CVE237 - Structural Analysis I
- CVE240 - Applied Mathematics
- CVE281 - Fluid Mechanics
- CVE201 - Civil Engineering Design I
- CVE225 - Surveying Field Camp

**Year 3**
- CVE341 - Steel and Timber Design
- CVE371 - Highway Engineering
- CVE382 - Hydraulic Engineering
- CVE364 - Foundation Engineering
- CVE301 - Civil Engineering Design II
- CVE394 - Hydraulics Laboratory (groups)
- CVE300 - Civil Engineering Training

**Year 4**
- CVE403 - Computer-Aided Structural Analysis
- CVE404 - BIM
- CVE411 - Modern Construction Engineering
- CVE426 - Digital Photogrammetry
- CVE483 - Water Resources Development
- CVE465 - Geotechnical Engineering Design
- CVE474 - Urban Transportation Systems
- CVE444 - Prestressed Concrete Design
- CVE473 - Traffic Engineering

#### International Program (IT) - Sample Courses

**Year 1**
- CVE111 (Sec 31) - Engineering Drawing (Lecture + Practice groups)
- PHY104 (Sec 31) - General Physics II (Fixed schedule)
- GEN111 (Sec 31) - Man and Ethics of Living (Fixed schedule)
- MTH102 (Sec 31) - Mathematics II (Fixed schedule)
- MEN111 (Sec 31) - Engineering Materials (Fixed schedule)
- PHY192 (Sec 31) - General Physics Laboratory II (Fixed schedule)

**Year 2**
- CVE216 (Sec 31) - Principles of Finance
- CVE221 (Sec 31) - Surveying
- CVE240 (Sec 31) - Applied Mathematics
- CVE281 (Sec 31) - Fluid Mechanics (Lecture + Tutorial groups)
- CVE225 (Sec 31) - Surveying Field Camp
- GEN231 (Sec 31) - Miracle of Thinking
- CVE233 (Sec 31/32) - Mechanics of Materials (groups)
- CVE223 (Sec 31/32) - Surveying Practices (groups)

**Year 3**
- CVE303 (Sec 31) - Milestone Design Project
- CVE338 (Sec 31) - Structural Analysis II
- CVE341 (Sec 31) - Steel and Timber Design
- CVE342 (Sec 31) - Reinforced Concrete Design
- CVE371 (Sec 31) - Highway Engineering
- CVE300 (Sec 31) - Industrial Training

**Year 4**
- CVE464 (Sec 31) - Foundation Engineering
- CVE403 (Sec 31) - Computer-Aided Structural Analysis
- CVE404 (Sec 31) - BIM

### Relationships

The seeding script also creates all necessary relationships:

- **subject_years** (122 relationships): Links subjects to the years that take them
- **subject_instructors** (102 relationships): Links subjects to instructors with workload ratios
- **Academic year**: Set to "2567"

## 🔍 Verifying Seeded Data

### Check via SQLite CLI

```bash
cd backend
sqlite3 data/scheduler.db

# Check counts
SELECT COUNT(*) FROM years;      -- Should return 26
SELECT COUNT(*) FROM rooms;      -- Should return 51
SELECT COUNT(*) FROM instructors; -- Should return 34
SELECT COUNT(*) FROM subjects;   -- Should return 69

# Check sample data
SELECT * FROM years WHERE id LIKE 'TH-B1%';
SELECT * FROM instructors WHERE id = 'P1';
SELECT * FROM subjects WHERE code = 'CVE101';

# Exit
.quit
```

### Check via API

Make sure backend is running:

```bash
cd backend
npm run dev
```

Then in another terminal:

```bash
# Get all years
curl http://localhost:3000/api/years

# Get all rooms
curl http://localhost:3000/api/rooms

# Get all instructors (with busy times)
curl http://localhost:3000/api/instructors

# Get all subjects (with years and instructors)
curl http://localhost:3000/api/subjects

# Get academic year
curl http://localhost:3000/api/config/acad-year
```

### Check via Frontend

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Navigate to "ข้อมูลพื้นฐาน" (Data Management) tab
5. You should see:
   - 26 years in the Years section
   - 51 rooms in the Rooms section
   - 34 instructors in the Instructors section
   - 69 subjects in the Subjects section

## 🔄 Re-seeding

If you need to reset the database and re-seed:

```bash
cd backend

# Clear and reinitialize
npm run db:init

# Re-populate
npm run db:seed
```

**Warning**: This will delete ALL existing data and replace it with the sample data!

## 📝 Notes

- The seed script automatically clears existing data before inserting to avoid duplicates
- All relationships (subject-years, subject-instructors) are preserved
- Fixed schedule subjects have their day/time/room information set
- Instructor workload ratios are set (e.g., if 3 instructors share a subject, they might have 33.33%, 33.33%, 33.34%)
- The academic year is set to "2567" (Thai Buddhist calendar)

## 🛠️ Technical Details

### Source File
- Location: `backend/src/database/seed.ts`
- Data source: Original `Scheduler.html` (lines 339-611)

### How It Works

1. **Connects to database** using the existing connection
2. **Clears existing data** from all tables (in correct order to respect foreign keys)
3. **Inserts years** (26 records)
4. **Inserts rooms** (51 records)
5. **Inserts instructors** (34 records)
6. **Inserts subjects** (69 records)
7. **Creates subject-year relationships** (122 links)
8. **Creates subject-instructor relationships** (102 links with ratios)
9. **Sets academic year configuration** ("2567")

### Database Tables Affected

- `years`
- `rooms`
- `instructors`
- `subjects`
- `subject_years` (junction table)
- `subject_instructors` (junction table)
- `config` (academic year)

### Not Seeded

The following tables are intentionally left empty (they will be populated during scheduling):

- `instructor_availability` (busy times - to be set via UI)
- `sessions` (scheduled classes - to be created when scheduling)
- `department_constraints` (department-wide restrictions - to be configured via settings)
- `settings` (uses defaults from schema)

## 🎯 Next Steps

After seeding the database, you can:

1. **Test CRUD operations** - Add, edit, delete years, rooms, instructors, and subjects via the UI
2. **Configure instructor availability** - Click on instructors to set their busy times
3. **Add more subjects** - Use the "Add Subject" form to create additional courses
4. **Implement the scheduler** - Next phase: build the drag-and-drop calendar interface
5. **Test with real data** - Start scheduling actual classes on the calendar

---

**Sample data matches the original Scheduler.html exactly!** ✅
