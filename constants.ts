
import { Department, User, LogType } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'd5', name: 'ผู้บริหาร' },
  { id: 'd1', name: 'งานบริหารงานทั่วไป' },
  { id: 'd2', name: 'งานทรัพยากรสารสนเทศ' },
  { id: 'd3', name: 'งานบริการสารสนเทศและส่งเสริมการเรียนรู้' },
  { id: 'd4', name: 'งานเทคโนโลยีสารสนเทศ' },
];

export const USERS: User[] = [
  // งานบริหารงานทั่วไป (2)
  { id: 'u1', name: 'นางสาวอณุภา  ทานะรมณ์', email: 'anupha.t@lawasri.tru.ac.th', departmentId: 'd1', pin: '1412' },
  { id: 'u2', name: 'นางสาวพิชญนันท์  พรมพิทักษ์', email: 'kiattisak.b@example.com', departmentId: 'd1', pin: '1234' },

  // งานทรัพยากรสารสนเทศ (5)
  { id: 'u3', name: 'นางสาวหทัยรัตน์  	เสวกพันธ์', email: 'jiraporn.s@example.com', departmentId: 'd2', pin: '1234' },
  { id: 'u4', name: 'นางสาวชวนชม  	สมนึก', email: 'thanawat.s@example.com', departmentId: 'd2', pin: '1234' },
  { id: 'u5', name: 'นางสาวเรวดี  	วงษ์สุวรรณ์', email: 'nanthida.b@example.com', departmentId: 'd2', pin: '1234' },
  { id: 'u6', name: 'นางสิริมาตย์  	จันทร์ขาว', email: 'theeradej.k@example.com', departmentId: 'd2', pin: '1234' },
  { id: 'u7', name: 'นางราตรี  		คงขุนทด', email: 'wannapa.k@example.com', departmentId: 'd2', pin: '1234' },

  // งานบริการสารสนเทศและส่งเสริมการเรียนรู้ (9)
  { id: 'u8', name: 'นางปิติรัตน์  	อินทุม', email: 'surachai.c@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u9', name: 'นายประสิทธิ์  	อ่วมเนียม', email: 'kanjana.s@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u10', name: 'ว่าที่ ร.ต.อำนาจ  	มะลิวัลย์', email: 'porntip.s@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u11', name: 'นางสาวนฤมล  	สุขเกษม', email: 'aree.y@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u12', name: 'นางวรนุช  		โพธิ์สุวรรณ', email: 'nattapon.s@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u13', name: 'นางสาวจันทร์จิรา  เกตุยา', email: 'piyaporn.n@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u14', name: 'นางสาวสงวน  	ชื่นชมกลิ่น', email: 'wipawee.r@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u15', name: 'นางสาวเพ็ญพิชชา  สิทธิวรยศ', email: 'chaiwat.p@example.com', departmentId: 'd3', pin: '1234' },
  { id: 'u16', name: 'นางชุลีรัตน์  	จันทร์สว่าง', email: 'sasithorn.b@example.com', departmentId: 'd3', pin: '1234' },

  // งานเทคโนโลยีสารสนเทศ (8)
  { id: 'u17', name: 'นางอัญชลี  		เขื่อนขันธ์', email: 'jakkrit.k@example.com', departmentId: 'd4', pin: '1234' },
  { id: 'u18', name: 'นายธงชัย  		ไสวงาม', email: 'kanda.j@example.com', departmentId: 'd4', pin: '1234' },
  { id: 'u19', name: 'นายวันชัย  		ปิดตานัง', email: 'supot.r@example.com', departmentId: 'd4', pin: '1234' },
  { id: 'u20', name: 'นางสาวสุกัญญา  	บุญทวี', email: 'amornrat.s@example.com', departmentId: 'd4', pin: '1234' },
  { id: 'u21', name: 'นายพัชรพงศ์	บุตรอำภัย', email: 'pongsakorn.h@example.com', departmentId: 'd4', pin: '1234' },
  { id: 'u22', name: 'นายนิวัตชัย		พางาม', email: 'thippawan.d@example.com', departmentId: 'd4', pin: '1234' },
  { id: 'u23', name: 'นายณัฐธัญพงศ์  ศรนารายณ์', email: 'noppadol.o@example.com', departmentId: 'd4', pin: '1234' },
  { id: 'u24', name: 'นายไกลาส  กลิ่นเทียน ', email: 'ratchanee.i@example.com', departmentId: 'd4', pin: '1234' },
  
  // ผู้บริหาร (3)
  { id: 'u25', name: 'ผศ.ไชยพล  กลิ่นจันทร์', email: 'bancha.k@example.com', departmentId: 'd5', pin: '1234' },
  { id: 'u26', name: 'อาจารย์ปัญญ์ชลี  	เต่าทอง', email: 'wimon.n@example.com', departmentId: 'd5', pin: '1234' },
  { id: 'u27', name: 'อาจารย์ ดร.สุธิษา  เชญชาญ', email: 'udom.w@example.com', departmentId: 'd5', pin: '1234' },
];

export const PAPER_TO_TREE_RATIO = 10000; // 10,000 sheets = 1 tree

export const ECO_POINTS_CONFIG: Record<LogType, { pointsPerSheet: number }> = {
  'Single-Sided': {
    pointsPerSheet: -2, // Penalty for each sheet of paper used
  },
  'Double-Sided': {
    pointsPerSheet: 1, // Reward for each sheet of paper used (promotes saving)
  },
  'Copy': {
    pointsPerSheet: -2, // Same penalty as single-sided
  },
  'Digital': {
    pointsPerSheet: 2, // Reward for each page sent digitally (paper saved)
  },
  'Envelope': {
    pointsPerSheet: -2, // Penalty per envelope
  },
  'Reuse': {
    pointsPerSheet: 1, // Reward for reusing paper
  }
};

export const PAPER_SAVING_TIPS: string[] = [
    "ก่อนพิมพ์ ลองปรับขนาดตัวอักษรและระยะขอบให้เล็กลง เพื่อให้เนื้อหาพอดีในหน้าเดียว",
    "ใช้การตรวจทานและแก้ไขเอกสารบนหน้าจอคอมพิวเตอร์แทนการพิมพ์ออกมาตรวจสอบ",
    "ใช้ลายเซ็นดิจิทัล (Digital Signature) แทนการพิมพ์เอกสารออกมาเพื่อเซ็นชื่อ",
    "แชร์เอกสารผ่าน Cloud Storage หรืออีเมล แทนการพิมพ์แจกจ่ายในที่ประชุม",
    "คิดให้ดีก่อนพิมพ์ทุกครั้ง: เอกสารฉบับนี้จำเป็นต้องพิมพ์ออกมาจริงๆ หรือไม่?",
    "ตั้งค่าการพิมพ์สองหน้า (Duplex Printing) เป็นค่าเริ่มต้นของเครื่องพิมพ์ในสำนักงาน",
    "รวบรวมกระดาษที่ใช้แล้วหน้าเดียวไว้ในถาด 'Reuse' ข้างเครื่องพิมพ์เสมอ"
];
