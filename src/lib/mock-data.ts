export type UserRole = 'student' | 'warden' | 'director';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  roomNumber?: string;
  block?: string;
  course?: string;
  year?: string;
  phone?: string;
  parentPhone?: string;
  balance?: number;
  attendanceToday?: 'present' | 'on-leave' | 'outpass' | 'library';
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  type: 'general' | 'home' | 'outpass' | 'library' | 'class';
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  actualArrivalTime?: string; // Stamped ONLY upon actual arrival at gate / check-in
  reason: string;
  destination?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  createdAt: string;
  foodRequirements?: {
    breakfast: boolean;
    lunch: boolean;
    tea: boolean;
    dinner: boolean;
  };
  medicalCertName?: string;
}

export interface FoodOrder {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'tea' | 'dinner';
  date: string;
  name: string;
  description: string;
  calories: number;
  cutoffTime: string; // e.g. "07:00 AM" or ISO string
  price: number;
  ordered: boolean;
  dietary: 'veg' | 'non-veg' | 'vegan';
}

export interface ExternalDelivery {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  department?: string;
  date?: string;
  platform: 'Swiggy' | 'Zomato' | 'Instamart' | 'Zepto' | 'Blinkit' | 'Domino\'s' | 'Other';
  restaurantOrStore: string;
  itemsSummary: string;
  expectedTime: string; // e.g., "08:15 PM"
  actualArrivalTime?: string; // Stamped ONLY upon actual arrival at security gate
  status: 'en-route' | 'arrived-gate' | 'collected';
  orderedAt: string;
  deliveryPartnerPhone?: string;
  amount?: number;
}

export interface FeePayment {
  id: string;
  studentId?: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidOn?: string;
  receiptNo?: string;
  category: 'tuition' | 'hostel' | 'mess' | 'amenities';
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: 'plumbing' | 'electrical' | 'wifi' | 'food' | 'security' | 'other';
  title: string;
  description: string;
  imageUrl?: string;
  status: 'submitted' | 'in-progress' | 'resolved';
  createdAt: string;
  assignedTo?: string;
  resolvedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval' | 'alert' | 'info' | 'payment';
  link?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  block: 'A' | 'B' | 'C' | 'D';
  capacity: number;
  occupied: number;
  status: 'available' | 'full' | 'maintenance';
  students: { id: string; name: string; course: string; avatar: string }[];
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: 'electronics' | 'clothing' | 'books' | 'keys' | 'other';
  status: 'open' | 'resolved';
  reportedBy: string; // student name
  studentId: string;
  date: string;
  imageUrl?: string;
}

export interface RoomChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  currentRoom: string;
  requestedBlock: 'A' | 'B' | 'C' | 'D' | 'Any';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  priority: 'normal' | 'high' | 'urgent';
  targetAudience: 'All' | 'A' | 'B' | 'C' | 'D';
  author: string;
  date: string;
}

// ---------------------------------------------------------------------------
// INITIAL MOCK DATA
// ---------------------------------------------------------------------------

export const INITIAL_USERS: User[] = [
  {
    id: 'student-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@chavara.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roomNumber: '304A',
    block: 'Block B (St. Teresa Wing)',
    course: 'B.Tech Computer Science & Engineering',
    year: '3rd Year',
    phone: '+91 98765 43210',
    parentPhone: '+91 98765 43211',
    balance: 150,
    attendanceToday: 'present',
  },
  {
    id: 'student-2',
    name: 'Diya Patel',
    email: 'diya.patel@chavara.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    roomNumber: '304B',
    block: 'Block B (St. Teresa Wing)',
    course: 'B.Tech Artificial Intelligence',
    year: '3rd Year',
    phone: '+91 98765 43212',
    parentPhone: '+91 98765 43213',
    balance: 0,
    attendanceToday: 'outpass',
  },
  {
    id: 'student-3',
    name: 'Riya Nair',
    email: 'riya.nair@chavara.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    roomNumber: '201A',
    block: 'Block A (St. Mary Wing)',
    course: 'B.Arch Architecture',
    year: '4th Year',
    phone: '+91 98765 43214',
    parentPhone: '+91 98765 43215',
    balance: 0,
    attendanceToday: 'on-leave',
  },
  {
    id: 'student-4',
    name: 'Kavya Iyer',
    email: 'kavya.iyer@chavara.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roomNumber: '105C',
    block: 'Block C (St. Clare Wing)',
    course: 'M.Sc Data Science',
    year: '1st Year',
    phone: '+91 98765 43216',
    parentPhone: '+91 98765 43217',
    balance: 450,
    attendanceToday: 'library',
  },
  {
    id: 'student-5',
    name: 'Meera Menon',
    email: 'meera.menon@chavara.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    roomNumber: '402B',
    block: 'Block D (St. Agnes Wing)',
    course: 'B.Com Honours',
    year: '2nd Year',
    phone: '+91 98765 43218',
    parentPhone: '+91 98765 43219',
    balance: 0,
    attendanceToday: 'present',
  },
  {
    id: 'warden-1',
    name: 'Dr. Sr. Mary Thomas',
    email: 'mary.thomas@chavara.edu',
    role: 'warden',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    block: 'Block A & B Chief Warden',
    phone: '+91 98000 11111',
  },
  {
    id: 'director-1',
    name: "Rev. Sr. Celine D'Souza",
    email: 'celine.dsouza@chavara.edu',
    role: 'director',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98000 00000',
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'LR-2026-001',
    studentId: 'student-1',
    studentName: 'Ananya Sharma',
    roomNumber: '304A',
    type: 'outpass',
    startDate: '2026-07-25',
    startTime: '14:30',
    endTime: '19:00',
    actualArrivalTime: '18:45', // Marked upon arrival at gate
    reason: 'Project work and reference book purchase at Central Tech Library',
    destination: 'Lulu Mall & Central Tech Library, City Center',
    status: 'completed',
    createdAt: '2026-07-25T09:15:00Z',
  },
  {
    id: 'LR-2026-002',
    studentId: 'student-1',
    studentName: 'Ananya Sharma',
    roomNumber: '304A',
    type: 'home',
    startDate: '2026-07-30',
    endDate: '2026-08-02',
    startTime: '16:00',
    endTime: '18:00',
    // No actualArrivalTime yet (only marked upon arrival!)
    reason: "Attending cousin's wedding ceremony in Bangalore",
    destination: 'Indiranagar, Bangalore',
    status: 'pending',
    createdAt: '2026-07-24T18:20:00Z',
    foodRequirements: { breakfast: true, lunch: false, tea: false, dinner: false },
  },
  {
    id: 'LR-2026-003',
    studentId: 'student-2',
    studentName: 'Diya Patel',
    roomNumber: '304B',
    type: 'outpass',
    startDate: '2026-07-25',
    startTime: '15:00',
    endTime: '20:00',
    // Currently out / pending review, arrival time NOT marked!
    reason: 'Dental appointment at Apollo Clinic',
    destination: 'Apollo Dental Clinic, MG Road',
    status: 'pending',
    createdAt: '2026-07-25T11:00:00Z',
  },
  {
    id: 'LR-2026-004',
    studentId: 'student-3',
    studentName: 'Riya Nair',
    roomNumber: '201A',
    type: 'home',
    startDate: '2026-07-24',
    endDate: '2026-07-27',
    startTime: '10:00',
    endTime: '17:00',
    // Active outing/leave outside campus, arrival time NOT marked!
    reason: 'Family religious function at hometown',
    destination: 'Trivandrum, Kerala',
    status: 'approved',
    createdAt: '2026-07-22T14:10:00Z',
    foodRequirements: { breakfast: false, lunch: false, tea: false, dinner: false },
  },
  {
    id: 'LR-2026-005',
    studentId: 'student-4',
    studentName: 'Kavya Iyer',
    roomNumber: '105C',
    type: 'library',
    startDate: '2026-07-25',
    startTime: '18:00',
    endTime: '22:30',
    // Active evening study pass, arrival time NOT marked!
    reason: 'Late night research reading for AI thesis submission',
    destination: 'Chavara Central Digital Library',
    status: 'approved',
    createdAt: '2026-07-25T12:00:00Z',
  },
  {
    id: 'LR-2026-006',
    studentId: 'student-1',
    studentName: 'Ananya Sharma',
    roomNumber: '304A',
    type: 'class',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    actualArrivalTime: '10:15 AM', // Marked upon return to class/hostel
    reason: 'Viral fever and severe migraine (Medical leave)',
    status: 'completed',
    createdAt: '2026-07-14T08:30:00Z',
    medicalCertName: 'Apollo_Medical_Certificate_Ananya.pdf',
  }
];

export const INITIAL_FOOD_ORDERS: FoodOrder[] = [
  {
    id: 'FO-001',
    mealType: 'breakfast',
    date: '2026-07-25',
    name: 'South Indian Special: Steamed Idli & Medu Vada',
    description: '4 Soft Idlis, 1 Crispy Vada served with coconut chutney and Mysore sambar + Filter Coffee / Tea.',
    calories: 420,
    cutoffTime: '07:30 AM',
    price: 45,
    ordered: true,
    dietary: 'veg',
  },
  {
    id: 'FO-002',
    mealType: 'lunch',
    date: '2026-07-25',
    name: 'Kerala Red Rice Feast with Malabar Fish Curry / Paneer Roast',
    description: 'Traditional Matta Rice, Malabar Fish Curry (Non-veg) or Kadai Paneer (Veg), Avial, Thoran, Rasam, Curd and Papad.',
    calories: 780,
    cutoffTime: '11:00 AM',
    price: 90,
    ordered: true,
    dietary: 'non-veg',
  },
  {
    id: 'FO-003',
    mealType: 'tea',
    date: '2026-07-25',
    name: 'Evening Refreshment: Pazham Pori (Banana Fritters) & Chai',
    description: '2 Hot golden Kerala banana fritters served with spiced masala cardamom tea.',
    calories: 290,
    cutoffTime: '03:30 PM',
    price: 35,
    ordered: true,
    dietary: 'veg',
  },
  {
    id: 'FO-004',
    mealType: 'dinner',
    date: '2026-07-25',
    name: 'Aromatic Thalassery Ghee Rice & Chicken Curry / Vegetable Kurma',
    description: 'Fragrant jeerakasala rice cooked in pure desi ghee, served with Malabar chicken curry or rich vegetable coconut kurma + salad.',
    calories: 650,
    cutoffTime: '06:30 PM',
    price: 95,
    ordered: false,
    dietary: 'non-veg',
  },
];

export const INITIAL_DELIVERIES: ExternalDelivery[] = [
  {
    id: 'DEL-2026-001',
    studentId: 'student-1',
    studentName: 'Ananya Sharma',
    roomNumber: '304A',
    department: 'B.Tech Computer Science',
    date: '2026-07-25',
    platform: 'Swiggy',
    restaurantOrStore: 'Meghana Foods (Residency Road)',
    itemsSummary: '1x Boneless Chicken Biryani, 1x Thums Up 500ml',
    expectedTime: '08:15 PM',
    actualArrivalTime: '08:14 PM', // Marked upon arrival at gate!
    status: 'arrived-gate',
    orderedAt: '2026-07-25T19:30:00Z',
    deliveryPartnerPhone: '+91 98700 12345',
    amount: 380,
  },
  {
    id: 'DEL-2026-002',
    studentId: 'student-2',
    studentName: 'Diya Patel',
    roomNumber: '304B',
    department: 'B.Tech AI & Data Science',
    date: '2026-07-25',
    platform: 'Swiggy',
    restaurantOrStore: 'Truffles Cafe & Bakery',
    itemsSummary: '1x All American Cheese Burger, 1x Chocolate Peri Peri Fries',
    expectedTime: '08:40 PM',
    // No actualArrivalTime yet (en-route, arrival time NOT marked!)
    status: 'en-route',
    orderedAt: '2026-07-25T19:45:00Z',
    deliveryPartnerPhone: '+91 98700 54321',
    amount: 420,
  },
  {
    id: 'DEL-2026-003',
    studentId: 'student-4',
    studentName: 'Kavya Iyer',
    roomNumber: '105C',
    department: 'M.Sc Computer Science',
    date: '2026-07-25',
    platform: 'Instamart',
    restaurantOrStore: 'Swiggy Instamart Grocery',
    itemsSummary: 'Amul Milk 1L, Britannia Whole Wheat Bread, Nescafé Coffee Jar',
    expectedTime: '07:50 PM',
    actualArrivalTime: '07:48 PM', // Marked upon arrival at gate!
    status: 'collected',
    orderedAt: '2026-07-25T18:50:00Z',
    amount: 240,
  },
  {
    id: 'DEL-2026-004',
    studentId: 'student-3',
    studentName: 'Riya Nair',
    roomNumber: '201A',
    department: 'B.Tech Electronics',
    date: '2026-07-25',
    platform: 'Zepto',
    restaurantOrStore: 'Zepto Quick Store',
    itemsSummary: 'Lays Magic Masala 3x, Diet Coke 4-pack, Cadbury Dairy Milk',
    expectedTime: '06:30 PM',
    actualArrivalTime: '06:28 PM', // Marked upon arrival at gate!
    status: 'collected',
    orderedAt: '2026-07-25T17:40:00Z',
    amount: 310,
  },
];

export const INITIAL_FEES: FeePayment[] = [
  {
    id: 'FEE-2026-01',
    studentId: 'student-1',
    title: 'Semester 6 Tuition & Hostel Accommodation Fee',
    amount: 1250,
    dueDate: '2026-07-10',
    status: 'paid',
    paidOn: '2026-07-05',
    receiptNo: 'CHV-REC-884920',
    category: 'hostel',
  },
  {
    id: 'FEE-2026-02',
    studentId: 'student-1',
    title: 'Quarterly Mess Advance & Kitchen Maintenance',
    amount: 450,
    dueDate: '2026-07-15',
    status: 'paid',
    paidOn: '2026-07-12',
    receiptNo: 'CHV-REC-885104',
    category: 'mess',
  },
  {
    id: 'FEE-2026-03',
    studentId: 'student-1',
    title: 'Monsoon Semester Amenities & High-Speed Wi-Fi Fee',
    amount: 150,
    dueDate: '2026-07-31',
    status: 'pending',
    category: 'amenities',
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-001',
    studentId: 'student-1',
    studentName: 'Ananya Sharma',
    roomNumber: '304A',
    category: 'wifi',
    title: 'Wi-Fi router signal drop in Block B 3rd Floor hallway',
    description: 'The 5GHz network (Chavara_Student_5G) frequently disconnects in Room 304A and 304B during evening peak hours (7 PM - 10 PM). Please reset or upgrade access point B-03.',
    status: 'in-progress',
    createdAt: '2026-07-23T19:40:00Z',
    assignedTo: 'Mr. Rajesh Kumar (IT Support Lead)',
  },
  {
    id: 'CMP-2026-002',
    studentId: 'student-1',
    studentName: 'Ananya Sharma',
    roomNumber: '304A',
    category: 'plumbing',
    title: 'Bathroom sink faucet continuous water dripping',
    description: 'The hot water tap washer in Room 304A attached bathroom is worn out and dripping continuously. Needs plumber replacement.',
    status: 'submitted',
    createdAt: '2026-07-25T08:10:00Z',
  },
  {
    id: 'CMP-2026-003',
    studentId: 'student-3',
    studentName: 'Riya Nair',
    roomNumber: '201A',
    category: 'electrical',
    title: 'Study table power socket tube light flickering',
    description: 'LED fluorescent tube above the second study desk flickers when laptop charger is plugged in.',
    status: 'resolved',
    createdAt: '2026-07-20T11:20:00Z',
    assignedTo: 'Mr. Suresh (Campus Electrician)',
    resolvedAt: '2026-07-21T16:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Outing Logged & Approved! 📍',
    message: 'Your local outing request (LR-2026-001) to Lulu Mall & Central Tech Library has been approved by Dr. Sr. Mary Thomas. Movement logged in campus register.',
    timestamp: '10 mins ago',
    read: false,
    type: 'approval',
    link: '/student/outpass',
  },
  {
    id: 'NOTIF-2',
    title: 'Dinner Order Cutoff Warning 🍛',
    message: 'Cutoff for ordering Thalassery Ghee Rice & Chicken Curry ends at 06:30 PM today. Place your order now!',
    timestamp: '1 hour ago',
    read: false,
    type: 'alert',
    link: '/student/food-orders',
  },
  {
    id: 'NOTIF-3',
    title: 'Fee Payment Due Reminder 💳',
    message: 'Monsoon Semester Amenities Fee ($150) is due by July 31st, 2026. Avoid late charges by paying online.',
    timestamp: '1 day ago',
    read: true,
    type: 'payment',
    link: '/student/fee-payment',
  },
  {
    id: 'NOTIF-4',
    title: 'Hostel Curfew & Movement Timing Notice 🏛️',
    message: 'All students on local outings must log their return in the portal or check in at the campus security desk before 08:30 PM sharp.',
    timestamp: '2 days ago',
    read: true,
    type: 'info',
  },
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'RM-304A',
    roomNumber: '304A',
    block: 'B',
    capacity: 2,
    occupied: 2,
    status: 'full',
    students: [
      { id: 'student-1', name: 'Ananya Sharma', course: 'B.Tech CSE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'student-2', name: 'Diya Patel', course: 'B.Tech AI', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'RM-201A',
    roomNumber: '201A',
    block: 'A',
    capacity: 2,
    occupied: 1,
    status: 'available',
    students: [
      { id: 'student-3', name: 'Riya Nair', course: 'B.Arch', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'RM-105C',
    roomNumber: '105C',
    block: 'C',
    capacity: 3,
    occupied: 1,
    status: 'available',
    students: [
      { id: 'student-4', name: 'Kavya Iyer', course: 'M.Sc Data Science', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'RM-402B',
    roomNumber: '402B',
    block: 'D',
    capacity: 2,
    occupied: 1,
    status: 'available',
    students: [
      { id: 'student-5', name: 'Meera Menon', course: 'B.Com Honours', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'RM-102A',
    roomNumber: '102A',
    block: 'A',
    capacity: 2,
    occupied: 0,
    status: 'available',
    students: [],
  },
  {
    id: 'RM-305B',
    roomNumber: '305B',
    block: 'B',
    capacity: 2,
    occupied: 0,
    status: 'maintenance',
    students: [],
  },
];

export const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'LF-2026-001',
    type: 'lost',
    title: 'Blue Hydroflask Water Bottle',
    description: 'Lost my blue 32oz Hydroflask with a NASA sticker somewhere near the Central Library or Mess Hall.',
    category: 'other',
    status: 'open',
    reportedBy: 'Kavya Iyer',
    studentId: 'student-4',
    date: '2026-07-26T10:00:00Z',
  },
  {
    id: 'LF-2026-002',
    type: 'found',
    title: 'AirPods Pro Case',
    description: 'Found a white AirPods Pro case (no earbuds inside) on the 2nd floor of Block B.',
    category: 'electronics',
    status: 'open',
    reportedBy: 'Diya Patel',
    studentId: 'student-2',
    date: '2026-07-27T14:30:00Z',
  }
];

export const INITIAL_ROOM_CHANGES: RoomChangeRequest[] = [
  {
    id: 'RC-2026-001',
    studentId: 'student-3',
    studentName: 'Riya Nair',
    currentRoom: '201A',
    requestedBlock: 'C',
    reason: 'My architecture studio classes are all in the South Campus, so moving to Block C would save me a lot of commute time.',
    status: 'pending',
    createdAt: '2026-07-26T09:15:00Z',
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'NOTICE-001',
    title: 'Water Supply Maintenance',
    message: 'There will be no water supply in Block B from 10:00 AM to 2:00 PM tomorrow due to overhead tank cleaning. Please plan accordingly.',
    priority: 'urgent',
    targetAudience: 'B',
    author: 'Dr. Sr. Mary Thomas',
    date: '2026-09-01T10:00:00Z',
  },
  {
    id: 'NOTICE-002',
    title: 'Hostel Day Celebrations & Feast',
    message: 'Join us for the annual Chavara Hostel Day celebrations this Saturday at 6:30 PM in the central courtyard! Special dinner will be served.',
    priority: 'high',
    targetAudience: 'All',
    author: 'Dr. Sr. Mary Thomas',
    date: '2026-08-31T18:30:00Z',
  }
];
