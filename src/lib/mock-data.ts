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
  /** Links this row to a real Supabase Auth account. Absent in local/demo mode. */
  authUserId?: string;
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
// Initial (empty) state. All real data lives in Supabase; nothing is seeded.
// ---------------------------------------------------------------------------

/** Placeholder shown only before a real session resolves; never rendered to a signed-in user. */
export const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  email: '',
  role: 'student',
  avatar: '',
};

export const INITIAL_USERS: User[] = [];
export const INITIAL_LEAVES: LeaveRequest[] = [];
export const INITIAL_FOOD_ORDERS: FoodOrder[] = [];
export const INITIAL_DELIVERIES: ExternalDelivery[] = [];
export const INITIAL_FEES: FeePayment[] = [];
export const INITIAL_COMPLAINTS: Complaint[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_ROOMS: Room[] = [];
export const INITIAL_LOST_FOUND: LostFoundItem[] = [];
export const INITIAL_ROOM_CHANGES: RoomChangeRequest[] = [];
export const INITIAL_NOTICES: Notice[] = [];
