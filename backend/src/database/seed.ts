import db from './connection';

/**
 * Seed script to populate database with sample data from original Scheduler.html
 */

// Sample Years Data
const years = [
  // --- ปริญญาตรี (Undergraduate) ---
  // หลักสูตรปกติ (TH)
  { id: 'TH-B1A', name: 'ป.ตรี (ปกติ) ปี 1 (A)', count: 45 },
  { id: 'TH-B1B', name: 'ป.ตรี (ปกติ) ปี 1 (B)', count: 45 },
  { id: 'TH-B2A', name: 'ป.ตรี (ปกติ) ปี 2 (A)', count: 45 },
  { id: 'TH-B2B', name: 'ป.ตรี (ปกติ) ปี 2 (B)', count: 45 },
  { id: 'TH-B3A', name: 'ป.ตรี (ปกติ) ปี 3 (A)', count: 45 },
  { id: 'TH-B3B', name: 'ป.ตรี (ปกติ) ปี 3 (B)', count: 45 },
  { id: 'TH-B4A', name: 'ป.ตรี (ปกติ) ปี 4 (A)', count: 45 },
  { id: 'TH-B4B', name: 'ป.ตรี (ปกติ) ปี 4 (B)', count: 45 },
  { id: 'TH-B5A+', name: 'ป.ตรี (ปกติ) ปีสูง (A)', count: 45 },
  { id: 'TH-B5B+', name: 'ป.ตรี (ปกติ) ปีสูง (B)', count: 45 },

  // หลักสูตรนานาชาติ (IT)
  { id: 'IT-B1A', name: 'ป.ตรี (Inter) ปี 1 (A)', count: 45 },
  { id: 'IT-B1B', name: 'ป.ตรี (Inter) ปี 1 (B)', count: 45 },
  { id: 'IT-B2A', name: 'ป.ตรี (Inter) ปี 2 (A)', count: 45 },
  { id: 'IT-B2B', name: 'ป.ตรี (Inter) ปี 2 (B)', count: 45 },
  { id: 'IT-B3A', name: 'ป.ตรี (Inter) ปี 3 (A)', count: 45 },
  { id: 'IT-B3B', name: 'ป.ตรี (Inter) ปี 3 (B)', count: 45 },
  { id: 'IT-B4A', name: 'ป.ตรี (Inter) ปี 4 (A)', count: 45 },
  { id: 'IT-B4B', name: 'ป.ตรี (Inter) ปี 4 (B)', count: 45 },
  { id: 'IT-B5A+', name: 'ป.ตรี (Inter) ปีสูง (A)', count: 45 },
  { id: 'IT-B5B+', name: 'ป.ตรี (Inter) ปีสูง (B)', count: 45 },

  // --- ปริญญาโท (Master's) - หลักสูตรปกติ ---
  { id: 'STR-Grad', name: 'ป.โท (โครงสร้าง) ปี 1', count: 40 },
  { id: 'GEO-Grad', name: 'ป.โท (ธรณี) ปี 1', count: 40 },
  { id: 'WRE-Grad', name: 'ป.โท (น้ำ) ปี 1', count: 40 },
  { id: 'TPE-Grad', name: 'ป.โท (ขนส่ง) ปี 1', count: 40 },
  // --- ปริญญาโท (Master's) - หลักสูตรพิเศษ ---
  { id: 'CET-Grad', name: 'ป.โท (CET) ปี 1', count: 40 },
  { id: 'CM-Grad', name: 'ป.โท (CM) ปี 1', count: 40 },
];

// Sample Rooms Data
const rooms = [
  { id: 'CB1103', name: 'CB1103', cap: 150 },
  { id: 'CB1205', name: 'CB1205', cap: 40 },
  { id: 'CB1207', name: 'CB1207', cap: 40 },
  { id: 'CB1209', name: 'CB1209', cap: 80 },
  { id: 'CB1301', name: 'CB1301', cap: 40 },
  { id: 'CB1302', name: 'CB1302', cap: 40 },
  { id: 'CB1303', name: 'CB1303', cap: 80 },
  { id: 'CB1304', name: 'CB1304', cap: 80 },
  { id: 'CB1305', name: 'CB1305', cap: 40 },
  { id: 'CB1307', name: 'CB1307', cap: 40 },
  { id: 'CB1401', name: 'CB1401', cap: 40 },
  { id: 'CB1402', name: 'CB1402', cap: 40 },
  { id: 'CB1403', name: 'CB1403', cap: 80 },
  { id: 'CB1404', name: 'CB1404', cap: 80 },
  { id: 'CB1405', name: 'CB1405', cap: 40 },
  { id: 'CB1406', name: 'CB1406', cap: 40 },
  { id: 'CB1407', name: 'CB1407', cap: 40 },
  { id: 'CB1501', name: 'CB1501', cap: 80 },
  { id: 'CB1504', name: 'CB1504', cap: 80 },
  { id: 'CB1505', name: 'CB1505', cap: 40 },
  { id: 'CB2201', name: 'CB2201', cap: 150 },
  { id: 'CB2301', name: 'CB2301', cap: 80 },
  { id: 'CB2401', name: 'CB2401', cap: 80 },
  { id: 'CB2402', name: 'CB2402', cap: 40 },
  { id: 'CB2403', name: 'CB2403', cap: 80 },
  { id: 'CB2404', name: 'CB2404', cap: 80 },
  { id: 'CB2405', name: 'CB2405', cap: 40 },
  { id: 'CB2406', name: 'CB2406', cap: 40 },
  { id: 'CB2407', name: 'CB2407', cap: 80 },
  { id: 'CB2408', name: 'CB2408', cap: 80 },
  { id: 'CB2501', name: 'CB2501', cap: 150 },
  { id: 'CB2502', name: 'CB2502', cap: 80 },
  { id: 'CB2503', name: 'CB2503', cap: 80 },
  { id: 'CB2504', name: 'CB2504', cap: 80 },
  { id: 'CB2505', name: 'CB2505', cap: 100 },
  { id: 'CB2506', name: 'CB2506', cap: 120 },
  { id: 'CB2507', name: 'CB2507', cap: 120 },
  { id: 'CB2601', name: 'CB2601', cap: 150 },
  { id: 'CB2602', name: 'CB2602', cap: 80 },
  { id: 'CB2603', name: 'CB2603', cap: 80 },
  { id: 'CB2604', name: 'CB2604', cap: 80 },
  { id: 'CB2605', name: 'CB2605', cap: 100 },
  { id: 'CB2606', name: 'CB2606', cap: 120 },
  { id: 'CB2607', name: 'CB2607', cap: 200 },
  { id: 'Drawing 1', name: 'Drawing 1', cap: 80 },
  { id: 'Drawing 2', name: 'Drawing 2', cap: 80 },
  { id: 'SC2109', name: 'SC2109', cap: 230 },
  { id: 'SC2111', name: 'SC2111', cap: 120 },
  { id: 'SCL124', name: 'SCL124', cap: 200 },
  { id: 'SCL216', name: 'SCL216', cap: 440 },
  { id: 'GYM', name: 'GYM', cap: 100 }
];

// Sample Instructors Data
const instructors = [
  // --- วิศวกรรมโครงสร้าง ---
  { id: 'P1', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'บุญมี', lname: 'ชินนาบุญ', tel: '02 470 9147', email: 'boonme.chi@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P2', prefix: 'ศาสตราจารย์ ดร.', fname: 'สมชาย', lname: 'ชูชีพสกุล', tel: '02 470 8003', email: 'somchai.chu@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P3', prefix: 'ดร.', fname: 'จุลพจน์', lname: 'จิรวัชรเดช', tel: '02 470 9149', email: 'julapot.chi@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P4', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'อภินัติ', lname: 'อัชกุล', tel: '02 470 9148', email: 'aphinat.ash@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P5', prefix: 'ศาสตราจารย์ ดร.', fname: 'ชัย', lname: 'จาตุรพิทักษ์กุล', tel: '02 470 9314', email: 'chai.jat@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P6', prefix: 'รองศาสตราจารย์ ดร.', fname: 'ทวิช', lname: 'พูลเงิน', tel: '02 470 9145', email: 'tawich.pul@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P7', prefix: 'ศาสตราจารย์ ดร.', fname: 'สุทัศน์', lname: 'ลีลาทวีวัฒน์', tel: '02 470 9131', email: 'sutat.lee@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P8', prefix: 'รองศาสตราจารย์ ดร.', fname: 'ชัยณรงค์', lname: 'อธิสกุล', tel: '02 470 9143', email: 'chainarong.ath@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P9', prefix: 'รองศาสตราจารย์ ดร.', fname: 'วีรชาติ', lname: 'ตั้งจิรภัทร', tel: '02 470 9322', email: 'weerachart.tan@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P10', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'รักติพงษ์', lname: 'สหมิตรมงคล', tel: '02 470 9312', email: 'raktipong.sah@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P11', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'เอกชัย', lname: 'อยู่ประเสริฐชัย', tel: '02 470 9321', email: 'ekkachai.yoo@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P12', prefix: 'ดร.', fname: 'พีรสิทธิ์', lname: 'มหาสุวรรณชัย', tel: '02 470 9138', email: 'peerasit.mahasu@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P13', prefix: 'ดร.', fname: 'กสาน', lname: 'จันทร์โต', tel: '02 470 9313', email: 'kasan.cha@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },
  { id: 'P14', prefix: 'ดร.', fname: 'ชนิภา', lname: 'เนตรรัตนะ', tel: '', email: 'chanipa.netr@kmutt.ac.th', field: 'วิศวกรรมโครงสร้าง' },

  // --- วิศวกรรมเทคนิคธรณี ---
  { id: 'P15', prefix: 'ศาสตราจารย์ ดร.', fname: 'วรัช', lname: 'ก้องกิจกุล', tel: '02 470 9304', email: 'warat.kon@kmutt.ac.th', field: 'วิศวกรรมเทคนิคธรณี' },
  { id: 'P16', prefix: 'รองศาสตราจารย์ ดร.', fname: 'สมโพธิ', lname: 'อยู่ไว', tel: '02 470 9308', email: 'sompote.you@kmutt.ac.th', field: 'วิศวกรรมเทคนิคธรณี' },
  { id: 'P17', prefix: 'ศาสตราจารย์ ดร.', fname: 'พรเกษม', lname: 'จงประดิษฐ์', tel: '02 470 9305', email: 'pornkasem.jon@kmutt.ac.th', field: 'วิศวกรรมเทคนิคธรณี' },
  { id: 'P18', prefix: 'Asst. Prof. Dr.', fname: 'Goran', lname: 'Arangjelovski', tel: '02 470 9146', email: 'goran.ara@kmutt.ac.th', field: 'วิศวกรรมเทคนิคธรณี' },
  { id: 'P19', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'ชนา', lname: 'พุทธนานนท์', tel: '02 470 9320', email: 'chana.phu@kmutt.ac.th', field: 'วิศวกรรมเทคนิคธรณี' },

  // --- วิศวกรรมบริหารงานก่อสร้าง ---
  { id: 'P20', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'วุฒิพงศ์', lname: 'เมืองน้อย', tel: '02 470 8313', email: 'wutthipong.mou@kmutt.ac.th', field: 'วิศวกรรมบริหารงานก่อสร้าง' },
  { id: 'P21', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'สันติ', lname: 'เจริญพรพัฒนา', tel: '02 470 8313', email: 'santi.cha@kmutt.ac.th', field: 'วิศวกรรมบริหารงานก่อสร้าง' },

  // --- วิศวกรรมขนส่ง ---
  { id: 'P22', prefix: 'รองศาสตราจารย์ ดร.', fname: 'อำพล', lname: 'การุณสุนทวงษ์', tel: '02 470 9150', email: 'ampol.kar@kmutt.ac.th', field: 'วิศวกรรมขนส่ง' },
  { id: 'P23', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'วศิน', lname: 'เกียรติโกมล', tel: '02 470 9140', email: 'vasin.kia@kmutt.ac.th', field: 'วิศวกรรมขนส่ง' },
  { id: 'P24', prefix: 'รองศาสตราจารย์ ดร.', fname: 'วิโรจน์', lname: 'ศรีสุรภานนท์', tel: '02 470 9142', email: 'viroat.sri@kmutt.ac.th', field: 'วิศวกรรมขนส่ง' },
  { id: 'P25', prefix: 'ดร.', fname: 'จำเริญ', lname: 'เส', tel: '', email: 'chamroeun.se01@kmutt.ac.th', field: 'วิศวกรรมขนส่ง' },

  // --- วิศวกรรมทรัพยากรน้ำ ---
  { id: 'P26', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'ดวงฤดี', lname: 'โฆษิตกิตติวงศ์ ก้องกิจกุล', tel: '02 470 9310', email: 'duangrudee.kos@kmutt.ac.th', field: 'วิศวกรรมทรัพยากรน้ำ' },
  { id: 'P27', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'ชัยวัฒน์', lname: 'เอกวัฒน์พานิชย์', tel: '02 470 9302', email: 'chaiwat.ekk@kmutt.ac.th', field: 'วิศวกรรมทรัพยากรน้ำ' },
  { id: 'P28', prefix: 'ดร.', fname: 'วงศ์นรินทร์', lname: 'คำพอ', tel: '02 470 9310', email: 'wongnarin.kom@kmutt.ac.th', field: 'วิศวกรรมทรัพยากรน้ำ' },
  { id: 'P29', prefix: 'ผู้ช่วยศาสตราจารย์ ดร.', fname: 'ชาญชัย', lname: 'เพชรพงศ์พันธุ์', tel: '02 470 9319', email: 'chanchai.pet@kmutt.ac.th', field: 'วิศวกรรมทรัพยากรน้ำ' },

  // --- วิศวกรรมสำรวจ ---
  { id: 'P30', prefix: 'ผู้ช่วยศาสตราจารย์', fname: 'ธีระ', lname: 'ลาภิศชยางกูล', tel: '02 470 9137', email: 'theera.lil@kmutt.ac.th', field: 'วิศวกรรมสำรวจ' },
  { id: 'P31', prefix: 'ดร.', fname: 'ธงชัย', lname: 'โพธิ์ทอง', tel: '02 470 9144', email: 'thongchai.pho@kmutt.ac.th', field: 'วิศวกรรมสำรวจ' },

  // --- อาจารย์พิเศษ / อื่นๆ ---
  { id: 'P32', prefix: 'อาจารย์', fname: 'ตะวัน', lname: '', tel: '', email: '', field: 'อาจารย์พิเศษ' },
  { id: 'P33', prefix: 'อาจารย์', fname: 'ภาณุวัฒน์', lname: '', tel: '', email: '', field: 'อาจารย์พิเศษ' },
  { id: 'P34', prefix: 'อาจารย์', fname: 'พิสุทธิ์', lname: 'อุ่นวงศ์', tel: '', email: '', field: 'อาจารย์พิเศษ' }
];

// Sample Subjects Data (abbreviated - full list would be very long)
const subjects = [
  // --- YEAR 1 (TH-B1) ---
  { id: "TH1_101", code: "CVE101", section: "1", name: "World of Civil Engineering", credit: 2, workload: 2, splitPattern: [2], year: ["TH-B1A", "TH-B1B"], instructors: [{id:'P19', ratio:33.33}, {id:'P29', ratio:33.33}, {id:'P12', ratio:33.34}], is_fixed: 0 },
  { id: "TH1_111_L", code: "CVE111", section: "1", name: "Engineering Drawing (Lect)", credit: 2, workload: 2, splitPattern: [2], year: ["TH-B1A", "TH-B1B"], instructors: [{id:'P34', ratio:100}], is_fixed: 0 },
  { id: "TH1_131_L", code: "CVE131", section: "1", name: "Engineering Mechanics (Lect)", credit: 2, workload: 2, splitPattern: [2], year: ["TH-B1A", "TH-B1B"], instructors: [{id:'P8', ratio:50}, {id:'P12', ratio:50}], is_fixed: 0 },

  // วิชาแยกกลุ่ม (Practice/Tut)
  { id: "TH1_111_G1", code: "CVE111", section: "1 (Prac)", name: "Engineering Drawing (Prac G1)", credit: 1, workload: 3, splitPattern: [3], year: ["TH-B1A"], instructors: [{id:'P34', ratio:100}], is_fixed: 0 },
  { id: "TH1_111_G2", code: "CVE111", section: "2 (Prac)", name: "Engineering Drawing (Prac G2)", credit: 1, workload: 3, splitPattern: [3], year: ["TH-B1B"], instructors: [{id:'P34', ratio:100}], is_fixed: 0 },
  { id: "TH1_131_G1", code: "CVE131", section: "1 (Tut)", name: "Engineering Mechanics (Tut G1)", credit: 1, workload: 2, splitPattern: [2], year: ["TH-B1A"], instructors: [{id:'P8', ratio:50}, {id:'P12', ratio:50}], is_fixed: 0 },
  { id: "TH1_131_G2", code: "CVE131", section: "2 (Tut)", name: "Engineering Mechanics (Tut G2)", credit: 1, workload: 2, splitPattern: [2], year: ["TH-B1B"], instructors: [{id:'P8', ratio:50}, {id:'P12', ratio:50}], is_fixed: 0 },

  // วิชา Fixed (Science/GenEd)
  { id: "TH1_PHY104_L", code: "PHY104", section: "1", name: "General Physics II (Lec)", credit: 2, workload: 2, splitPattern: [2], year: ["TH-B1A", "TH-B1B"], instructors: [], is_fixed: 1, fixed_day: "MON", fixed_start: 2, fixed_room: "CB2201" },
  { id: "TH1_MTH102", code: "MTH102", section: "1", name: "Mathematics II", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B1A", "TH-B1B"], instructors: [], is_fixed: 1, fixed_day: "TUE", fixed_start: 0, fixed_room: "CB2201" },
  { id: "TH1_PHY104_T", code: "PHY104", section: "1", name: "General Physics II (Tut)", credit: 1, workload: 1, splitPattern: [1], year: ["TH-B1A", "TH-B1B"], instructors: [], is_fixed: 1, fixed_day: "TUE", fixed_start: 3, fixed_room: "CB2201" },
  { id: "TH1_LNG220", code: "LNG220", section: "1", name: "Academic English", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B1A", "TH-B1B"], instructors: [], is_fixed: 1, fixed_day: "WED", fixed_start: 1, fixed_room: "CB2301" },
  { id: "TH1_PHY192", code: "PHY192", section: "1", name: "General Physics Laboratory II", credit: 1, workload: 2, splitPattern: [2], year: ["TH-B1A", "TH-B1B"], instructors: [], is_fixed: 1, fixed_day: "THU", fixed_start: 0, fixed_room: "SCL216" },
  { id: "TH1_GEN101", code: "GEN101", section: "1", name: "Physical Education", credit: 1, workload: 2, splitPattern: [2], year: ["TH-B1A", "TH-B1B"], instructors: [], is_fixed: 1, fixed_day: "THU", fixed_start: 2, fixed_room: "GYM" },

  // --- YEAR 2 (TH-B2) ---
  { id: "TH2_200", code: "CVE200", section: "1", name: "Probability and Statistics", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B2A", "TH-B2B"], instructors: [{id:'P29', ratio:100}], is_fixed: 0 },
  { id: "TH2_235_L", code: "CVE235", section: "1", name: "Civil Eng. Materials (Lec)", credit: 2, workload: 2, splitPattern: [2], year: ["TH-B2A", "TH-B2B"], instructors: [{id:'P9', ratio:50}, {id:'P10', ratio:50}], is_fixed: 0 },
  { id: "TH2_237", code: "CVE237", section: "1", name: "Structural Analysis I", credit: 3, workload: 3, splitPattern: [2, 1], year: ["TH-B2A", "TH-B2B"], instructors: [{id:'P1', ratio:100}], is_fixed: 0 },
  { id: "TH2_240", code: "CVE240", section: "1", name: "Applied Mathematics", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B2A", "TH-B2B"], instructors: [{id:'P14', ratio:50}, {id:'P8', ratio:50}], is_fixed: 0 },
  { id: "TH2_281", code: "CVE281", section: "1", name: "Fluid Mechanics", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B2A", "TH-B2B"], instructors: [{id:'P28', ratio:100}], is_fixed: 0 },
  { id: "TH2_201", code: "CVE201", section: "1", name: "Civil Engineering Design I", credit: 2, workload: 4, splitPattern: [4], year: ["TH-B2A", "TH-B2B"], instructors: [{id:'P16', ratio:50}, {id:'P8', ratio:50}], is_fixed: 0 },
  { id: "TH2_225", code: "CVE225", section: "1", name: "Surveying Field Camp", credit: 1, workload: 3, splitPattern: [3], year: ["TH-B2A", "TH-B2B"], instructors: [{id:'P31', ratio:50}, {id:'P30', ratio:50}], is_fixed: 0 },

  // วิชาแยกกลุ่ม (Lab)
  { id: "TH2_235_G1", code: "CVE235", section: "1 (Lab)", name: "Civil Eng. Materials (Lab G1)", credit: 1, workload: 3, splitPattern: [3], year: ["TH-B2A"], instructors: [{id:'P14', ratio:25}, {id:'P10', ratio:25}, {id:'P9', ratio:25}, {id:'P12', ratio:25}], is_fixed: 0 },
  { id: "TH2_235_G2", code: "CVE235", section: "2 (Lab)", name: "Civil Eng. Materials (Lab G2)", credit: 1, workload: 3, splitPattern: [3], year: ["TH-B2B"], instructors: [{id:'P14', ratio:25}, {id:'P10', ratio:25}, {id:'P9', ratio:25}, {id:'P12', ratio:25}], is_fixed: 0 },

  // --- YEAR 3 (TH-B3) ---
  { id: "TH3_341", code: "CVE341", section: "1", name: "Steel and Timber Design", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B3A", "TH-B3B"], instructors: [{id:'P13', ratio:100}], is_fixed: 0 },
  { id: "TH3_371", code: "CVE371", section: "1", name: "Highway Engineering", credit: 3, workload: 3, splitPattern: [2, 1], year: ["TH-B3A", "TH-B3B"], instructors: [{id:'P24', ratio:33.33}, {id:'P23', ratio:33.33}, {id:'P22', ratio:33.34}], is_fixed: 0 },
  { id: "TH3_382", code: "CVE382", section: "1", name: "Hydraulic Engineering", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B3A", "TH-B3B"], instructors: [{id:'P27', ratio:50}, {id:'P26', ratio:50}], is_fixed: 0 },
  { id: "TH3_364", code: "CVE364", section: "1", name: "Foundation Engineering", credit: 3, workload: 3, splitPattern: [2, 1], year: ["TH-B3A", "TH-B3B"], instructors: [{id:'P16', ratio:50}, {id:'P17', ratio:50}], is_fixed: 0 },
  { id: "TH3_301", code: "CVE301", section: "1", name: "Civil Engineering Design II", credit: 2, workload: 4, splitPattern: [1, 3], year: ["TH-B3A", "TH-B3B"], instructors: [{id:'P9', ratio:100}], is_fixed: 0 },
  { id: "TH3_300", code: "CVE300", section: "1", name: "Civil Engineering Training", credit: 0, workload: 0, splitPattern: [], year: ["TH-B3A", "TH-B3B"], instructors: [], is_fixed: 0 },

  // วิชาแยกกลุ่ม (Lab)
  { id: "TH3_394_G1", code: "CVE394", section: "1", name: "Hydraulics Laboratory (G1)", credit: 1, workload: 3, splitPattern: [3], year: ["TH-B3A"], instructors: [{id:'P27', ratio:25}, {id:'P26', ratio:25}, {id:'P28', ratio:25}, {id:'P29', ratio:25}], is_fixed: 0 },
  { id: "TH3_394_G2", code: "CVE394", section: "2", name: "Hydraulics Laboratory (G2)", credit: 1, workload: 3, splitPattern: [3], year: ["TH-B3B"], instructors: [{id:'P27', ratio:25}, {id:'P26', ratio:25}, {id:'P28', ratio:25}, {id:'P29', ratio:25}], is_fixed: 0 },

  // --- YEAR 4 (TH-B4) ---
  { id: "TH4_403", code: "CVE403", section: "1", name: "Computer-Aided Structural Analysis", credit: 3, workload: 3, splitPattern: [1, 2], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P1', ratio:100}], is_fixed: 0 },
  { id: "TH4_404", code: "CVE404", section: "1", name: "BIM", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P32', ratio:50}, {id:'P12', ratio:50}], is_fixed: 0 },
  { id: "TH4_411", code: "CVE411", section: "1", name: "Modern Construction Engineering", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P20', ratio:100}], is_fixed: 0 },
  { id: "TH4_426", code: "CVE426", section: "1", name: "Digital Photogrammetry", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P30', ratio:100}], is_fixed: 0 },
  { id: "TH4_483", code: "CVE483", section: "1", name: "Water Resources Development", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P27', ratio:25}, {id:'P29', ratio:25}, {id:'P28', ratio:25}, {id:'P26', ratio:25}], is_fixed: 0 },
  { id: "TH4_465", code: "CVE465", section: "1", name: "Geotechnical Engineering Design", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P17', ratio:25}, {id:'P16', ratio:25}, {id:'P19', ratio:25}, {id:'P15', ratio:25}], is_fixed: 0 },
  { id: "TH4_474", code: "CVE474", section: "1", name: "Urban Transportation Systems", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P24', ratio:100}], is_fixed: 0 },
  { id: "TH4_444", code: "CVE444", section: "1", name: "Prestressed Concrete Design", credit: 3, workload: 3, splitPattern: [3], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P10', ratio:100}], is_fixed: 0 },
  { id: "TH4_473", code: "CVE473", section: "1", name: "Traffic Engineering", credit: 3, workload: 3, splitPattern: [2, 1], year: ["TH-B4A", "TH-B4B"], instructors: [{id:'P23', ratio:100}], is_fixed: 0 },

  // --- INTERNATIONAL PROGRAM ---
  // --- YEAR 1 (IT-B1) ---
  { id: "IT1_111", code: "CVE111", section: "31", name: "Engineering Drawing (Lect)", credit: 2, workload: 2, splitPattern: [2], year: ["IT-B1A", "IT-B1B"], instructors: [{id:'P18', ratio:100}], is_fixed: 0 },

  // วิชาแยกกลุ่ม (Practice)
  { id: "IT1_111_G31", code: "CVE111", section: "31 (Prac)", name: "Engineering Drawing (Prac G31)", credit: 1, workload: 3, splitPattern: [3], year: ["IT-B1A"], instructors: [{id:'P18', ratio:100}], is_fixed: 0 },
  { id: "IT1_111_G32", code: "CVE111", section: "32 (Prac)", name: "Engineering Drawing (Prac G32)", credit: 1, workload: 3, splitPattern: [3], year: ["IT-B1B"], instructors: [{id:'P18', ratio:100}], is_fixed: 0 },

  // วิชา Fixed (Science/GenEd)
  { id: "IT1_PHY104_L", code: "PHY104", section: "31", name: "General Physics II (Lec)", credit: 2, workload: 2, splitPattern: [2], year: ["IT-B1A", "IT-B1B"], instructors: [], is_fixed: 1, fixed_day: "MON", fixed_start: 0, fixed_room: "CB2201" },
  { id: "IT1_GEN111", code: "GEN111", section: "31", name: "Man and Ethics of Living", credit: 3, workload: 3, splitPattern: [3], year: ["IT-B1A", "IT-B1B"], instructors: [], is_fixed: 1, fixed_day: "TUE", fixed_start: 1, fixed_room: "CB2301" },
  { id: "IT1_PHY104_T", code: "PHY104", section: "31", name: "General Physics II (Tut)", credit: 1, workload: 1, splitPattern: [1], year: ["IT-B1A", "IT-B1B"], instructors: [], is_fixed: 1, fixed_day: "TUE", fixed_start: 5, fixed_room: "CB2201" },
  { id: "IT1_PHY192", code: "PHY192", section: "31", name: "General Physics Laboratory II", credit: 1, workload: 2, splitPattern: [2], year: ["IT-B1A", "IT-B1B"], instructors: [], is_fixed: 1, fixed_day: "WED", fixed_start: 7, fixed_room: "SCL216" },
  { id: "IT1_MTH102", code: "MTH102", section: "31", name: "Mathematics II", credit: 3, workload: 3, splitPattern: [3], year: ["IT-B1A", "IT-B1B"], instructors: [], is_fixed: 1, fixed_day: "THU", fixed_start: 0, fixed_room: "CB2201" },
  { id: "IT1_MEN111", code: "MEN111", section: "31", name: "Engineering Materials", credit: 3, workload: 3, splitPattern: [3], year: ["IT-B1A", "IT-B1B"], instructors: [], is_fixed: 1, fixed_day: "FRI", fixed_start: 1, fixed_room: "CB2401" },

  // --- YEAR 2 (IT-B2) ---
  { id: "IT2_216", code: "CVE216", section: "31", name: "Principles of Finance", credit: 3, workload: 3, splitPattern: [3], year: ["IT-B2A", "IT-B2B"], instructors: [{id:'P34', ratio:100}], is_fixed: 0 },
  { id: "IT2_221", code: "CVE221", section: "31", name: "Surveying", credit: 3, workload: 3, splitPattern: [2, 2], year: ["IT-B2A", "IT-B2B"], instructors: [{id:'P31', ratio:50}, {id:'P30', ratio:50}], is_fixed: 0 },
  { id: "IT2_240", code: "CVE240", section: "31", name: "Applied Mathematics", credit: 3, workload: 3, splitPattern: [2, 2], year: ["IT-B2A", "IT-B2B"], instructors: [{id:'P14', ratio:50}, {id:'P8', ratio:50}], is_fixed: 0 },
  { id: "IT2_281", code: "CVE281", section: "31", name: "Fluid Mechanics", credit: 2, workload: 2, splitPattern: [2], year: ["IT-B2A", "IT-B2B"], instructors: [{id:'P26', ratio:100}], is_fixed: 0 },
  { id: "IT2_225", code: "CVE225", section: "31", name: "Surveying Field Camp", credit: 1, workload: 3, splitPattern: [3], year: ["IT-B2A", "IT-B2B"], instructors: [{id:'P31', ratio:50}, {id:'P30', ratio:50}], is_fixed: 0 },
  { id: "IT2_GEN231", code: "GEN231", section: "31", name: "Miracle of Thinking", credit: 3, workload: 3, splitPattern: [3], year: ["IT-B2A", "IT-B2B"], instructors: [{id:'P18', ratio:50}, {id:'P26', ratio:50}], is_fixed: 0 },

  // วิชาแยกกลุ่ม
  { id: "IT2_233_G31", code: "CVE233", section: "31", name: "Mechanics of Materials (G31)", credit: 3, workload: 4, splitPattern: [2, 2], year: ["IT-B2A"], instructors: [{id:'P3', ratio:50}, {id:'P11', ratio:50}], is_fixed: 0 },
  { id: "IT2_233_G32", code: "CVE233", section: "32", name: "Mechanics of Materials (G32)", credit: 3, workload: 4, splitPattern: [2, 2], year: ["IT-B2B"], instructors: [{id:'P3', ratio:50}, {id:'P11', ratio:50}], is_fixed: 0 },

  { id: "IT2_223_G31", code: "CVE223", section: "31", name: "Surveying Practices (G31)", credit: 1, workload: 3, splitPattern: [3], year: ["IT-B2A"], instructors: [{id:'P31', ratio:50}, {id:'P30', ratio:50}], is_fixed: 0 },
  { id: "IT2_223_G32", code: "CVE223", section: "32", name: "Surveying Practices (G32)", credit: 1, workload: 3, splitPattern: [3], year: ["IT-B2B"], instructors: [{id:'P31', ratio:50}, {id:'P30', ratio:50}], is_fixed: 0 },

  { id: "IT2_281_G31", code: "CVE281", section: "31 (Tut)", name: "Fluid Mechanics (Tut G31)", credit: 1, workload: 1, splitPattern: [2], year: ["IT-B2A"], instructors: [{id:'P26', ratio:100}], is_fixed: 0 },
  { id: "IT2_281_G32", code: "CVE281", section: "32 (Tut)", name: "Fluid Mechanics (Tut G32)", credit: 1, workload: 1, splitPattern: [2], year: ["IT-B2B"], instructors: [{id:'P26', ratio:100}], is_fixed: 0 },

  // --- YEAR 3 (IT-B3) ---
  { id: "IT3_303", code: "CVE303", section: "31", name: "Milestone Design Project", credit: 1, workload: 3, splitPattern: [3], year: ["IT-B3A", "IT-B3B"], instructors: [{id:'P7', ratio:100}], is_fixed: 0 },
  { id: "IT3_338", code: "CVE338", section: "31", name: "Structural Analysis II", credit: 3, workload: 3, splitPattern: [3, 1], year: ["IT-B3A", "IT-B3B"], instructors: [{id:'P4', ratio:100}], is_fixed: 0 },
  { id: "IT3_341", code: "CVE341", section: "31", name: "Steel and Timber Design", credit: 4, workload: 6, splitPattern: [3, 3], year: ["IT-B3A", "IT-B3B"], instructors: [{id:'P4', ratio:100}], is_fixed: 0 },
  { id: "IT3_342", code: "CVE342", section: "31", name: "Reinforced Concrete Design", credit: 4, workload: 6, splitPattern: [3, 3], year: ["IT-B3A", "IT-B3B"], instructors: [{id:'P13', ratio:50}, {id:'P6', ratio:50}], is_fixed: 0 },
  { id: "IT3_371", code: "CVE371", section: "31", name: "Highway Engineering", credit: 3, workload: 3, splitPattern: [2, 2], year: ["IT-B3A", "IT-B3B"], instructors: [{id:'P24', ratio:25}, {id:'P23', ratio:25}, {id:'P22', ratio:25}, {id:'P25', ratio:25}], is_fixed: 0 },
  { id: "IT3_300", code: "CVE300", section: "31", name: "Industrial Training", credit: 0, workload: 0, splitPattern: [], year: ["IT-B3A", "IT-B3B"], instructors: [], is_fixed: 0 },

  // --- YEAR 4 (IT-B4) ---
  { id: "IT4_464", code: "CVE464", section: "31", name: "Foundation Engineering", credit: 3, workload: 3, splitPattern: [1, 3], year: ["IT-B4A", "IT-B4B"], instructors: [{id:'P16', ratio:25}, {id:'P17', ratio:25}, {id:'P19', ratio:25}, {id:'P18', ratio:25}], is_fixed: 0 },
  { id: "IT4_403", code: "CVE403", section: "31", name: "Computer-Aided Structural Analysis", credit: 3, workload: 3, splitPattern: [3], year: ["IT-B4A", "IT-B4B"], instructors: [{id:'P33', ratio:100}], is_fixed: 0 },
  { id: "IT4_404", code: "CVE404", section: "31", name: "BIM", credit: 3, workload: 3, splitPattern: [3], year: ["IT-B4A", "IT-B4B"], instructors: [{id:'P19', ratio:100}], is_fixed: 0 }
];

/**
 * Main seeding function
 */
export function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('  🧹 Clearing existing data...');
    db.prepare('DELETE FROM subject_instructors').run();
    db.prepare('DELETE FROM subject_years').run();
    db.prepare('DELETE FROM subjects').run();
    db.prepare('DELETE FROM instructor_availability').run();
    db.prepare('DELETE FROM instructors').run();
    db.prepare('DELETE FROM rooms').run();
    db.prepare('DELETE FROM years').run();

    // Insert years
    console.log('  📅 Inserting years...');
    const insertYear = db.prepare("INSERT INTO years (id, name, count, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))");
    for (const year of years) {
      insertYear.run(year.id, year.name, year.count);
    }
    console.log(`    ✅ Inserted ${years.length} years`);

    // Insert rooms
    console.log('  🏢 Inserting rooms...');
    const insertRoom = db.prepare("INSERT INTO rooms (id, name, capacity, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))");
    for (const room of rooms) {
      insertRoom.run(room.id, room.name, room.cap);
    }
    console.log(`    ✅ Inserted ${rooms.length} rooms`);

    // Insert instructors
    console.log('  👨‍🏫 Inserting instructors...');
    const insertInstructor = db.prepare(`
      INSERT INTO instructors (id, prefix, first_name, last_name, telephone, email, field, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    for (const instructor of instructors) {
      insertInstructor.run(
        instructor.id,
        instructor.prefix,
        instructor.fname,
        instructor.lname,
        instructor.tel || '',
        instructor.email || '',
        instructor.field
      );
    }
    console.log(`    ✅ Inserted ${instructors.length} instructors`);

    // Insert subjects
    console.log('  📚 Inserting subjects...');
    const insertSubject = db.prepare(`
      INSERT INTO subjects (
        id, code, section, name, credit, workload, split_pattern,
        is_fixed, fixed_day, fixed_start, fixed_room,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const insertSubjectYear = db.prepare(`
      INSERT INTO subject_years (subject_id, year_id) VALUES (?, ?)
    `);

    const insertSubjectInstructor = db.prepare(`
      INSERT INTO subject_instructors (subject_id, instructor_id, ratio) VALUES (?, ?, ?)
    `);

    for (const subject of subjects) {
      // Insert subject
      insertSubject.run(
        subject.id,
        subject.code,
        subject.section,
        subject.name,
        subject.credit,
        subject.workload,
        JSON.stringify(subject.splitPattern),
        subject.is_fixed,
        subject.fixed_day || null,
        subject.fixed_start !== undefined ? subject.fixed_start : null,
        subject.fixed_room || null
      );

      // Insert subject-year relationships
      if (subject.year && subject.year.length > 0) {
        for (const yearId of subject.year) {
          insertSubjectYear.run(subject.id, yearId);
        }
      }

      // Insert subject-instructor relationships
      if (subject.instructors && subject.instructors.length > 0) {
        for (const inst of subject.instructors) {
          insertSubjectInstructor.run(subject.id, inst.id, inst.ratio);
        }
      }
    }
    console.log(`    ✅ Inserted ${subjects.length} subjects with relationships`);

    // Update academic year config
    console.log('  ⚙️  Setting academic year...');
    db.prepare(`
      INSERT OR REPLACE INTO config (key, value, updated_at)
      VALUES ('academic_year', '2567', datetime('now'))
    `).run();
    console.log('    ✅ Set academic year to 2567');

    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Years: ${years.length}`);
    console.log(`   - Rooms: ${rooms.length}`);
    console.log(`   - Instructors: ${instructors.length}`);
    console.log(`   - Subjects: ${subjects.length}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
  process.exit(0);
}
