/**
 * Supabase client + row mappers for Chavara Residence OS.
 *
 * The database uses snake_case columns (see supabase/schema.sql); the app uses
 * the camelCase types from mock-data.ts. Each entity gets a fromRow/toRow pair
 * so the store and the seed script share one source of mapping truth.
 *
 * If NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set,
 * `supabase` is null and the store falls back to local mock/localStorage mode.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  User,
  LeaveRequest,
  FoodOrder,
  ExternalDelivery,
  FeePayment,
  Complaint,
  NotificationItem,
  Room,
  LostFoundItem,
  RoomChangeRequest,
  Notice,
} from './mock-data';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Accept either name: ANON_KEY (legacy JWT keys) or PUBLISHABLE_KEY (new sb_publishable_ keys).
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;

/* ------------------------------- row mappers ------------------------------- */
/* fromRow: DB row -> app type. toRow: app type -> DB row. Nulls become
   undefined on read so optional-field checks in pages keep working. */

const opt = <T>(v: T | null | undefined): T | undefined => (v === null ? undefined : v);

export const userFromRow = (r: any): User => ({
  id: r.id,
  name: r.name,
  email: r.email,
  role: r.role,
  avatar: r.avatar,
  roomNumber: opt(r.room_number),
  block: opt(r.block),
  course: opt(r.course),
  year: opt(r.year),
  phone: opt(r.phone),
  parentPhone: opt(r.parent_phone),
  balance: r.balance === null ? undefined : Number(r.balance),
  attendanceToday: opt(r.attendance_today),
  authUserId: opt(r.auth_user_id),
});

export const userToRow = (u: User) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  room_number: u.roomNumber ?? null,
  block: u.block ?? null,
  course: u.course ?? null,
  year: u.year ?? null,
  phone: u.phone ?? null,
  parent_phone: u.parentPhone ?? null,
  balance: u.balance ?? null,
  attendance_today: u.attendanceToday ?? null,
});

export const leaveFromRow = (r: any): LeaveRequest => ({
  id: r.id,
  studentId: r.student_id,
  studentName: r.student_name,
  roomNumber: r.room_number,
  type: r.type,
  startDate: r.start_date,
  endDate: opt(r.end_date),
  startTime: opt(r.start_time),
  endTime: opt(r.end_time),
  actualArrivalTime: opt(r.actual_arrival_time),
  reason: r.reason,
  destination: opt(r.destination),
  status: r.status,
  createdAt: r.created_at,
  foodRequirements: opt(r.food_requirements),
  medicalCertName: opt(r.medical_cert_name),
});

export const leaveToRow = (l: LeaveRequest) => ({
  id: l.id,
  student_id: l.studentId,
  student_name: l.studentName,
  room_number: l.roomNumber,
  type: l.type,
  start_date: l.startDate,
  end_date: l.endDate ?? null,
  start_time: l.startTime ?? null,
  end_time: l.endTime ?? null,
  actual_arrival_time: l.actualArrivalTime ?? null,
  reason: l.reason,
  destination: l.destination ?? null,
  status: l.status,
  created_at: l.createdAt,
  food_requirements: l.foodRequirements ?? null,
  medical_cert_name: l.medicalCertName ?? null,
});

export const foodOrderFromRow = (r: any): FoodOrder => ({
  id: r.id,
  mealType: r.meal_type,
  date: r.date,
  name: r.name,
  description: r.description,
  calories: r.calories,
  cutoffTime: r.cutoff_time,
  price: Number(r.price),
  ordered: r.ordered,
  dietary: r.dietary,
});

export const foodOrderToRow = (f: FoodOrder) => ({
  id: f.id,
  meal_type: f.mealType,
  date: f.date,
  name: f.name,
  description: f.description,
  calories: f.calories,
  cutoff_time: f.cutoffTime,
  price: f.price,
  ordered: f.ordered,
  dietary: f.dietary,
});

export const deliveryFromRow = (r: any): ExternalDelivery => ({
  id: r.id,
  studentId: r.student_id,
  studentName: r.student_name,
  roomNumber: r.room_number,
  department: opt(r.department),
  date: opt(r.date),
  platform: r.platform,
  restaurantOrStore: r.restaurant_or_store,
  itemsSummary: r.items_summary,
  expectedTime: r.expected_time,
  actualArrivalTime: opt(r.actual_arrival_time),
  status: r.status,
  orderedAt: r.ordered_at,
  deliveryPartnerPhone: opt(r.delivery_partner_phone),
  amount: r.amount === null ? undefined : Number(r.amount),
});

export const deliveryToRow = (d: ExternalDelivery) => ({
  id: d.id,
  student_id: d.studentId,
  student_name: d.studentName,
  room_number: d.roomNumber,
  department: d.department ?? null,
  date: d.date ?? null,
  platform: d.platform,
  restaurant_or_store: d.restaurantOrStore,
  items_summary: d.itemsSummary,
  expected_time: d.expectedTime,
  actual_arrival_time: d.actualArrivalTime ?? null,
  status: d.status,
  ordered_at: d.orderedAt,
  delivery_partner_phone: d.deliveryPartnerPhone ?? null,
  amount: d.amount ?? null,
});

export const feeFromRow = (r: any): FeePayment => ({
  id: r.id,
  studentId: opt(r.student_id),
  title: r.title,
  amount: Number(r.amount),
  dueDate: r.due_date,
  status: r.status,
  paidOn: opt(r.paid_on),
  receiptNo: opt(r.receipt_no),
  category: r.category,
});

export const feeToRow = (f: FeePayment) => ({
  id: f.id,
  student_id: f.studentId ?? null,
  title: f.title,
  amount: f.amount,
  due_date: f.dueDate,
  status: f.status,
  paid_on: f.paidOn ?? null,
  receipt_no: f.receiptNo ?? null,
  category: f.category,
});

export const complaintFromRow = (r: any): Complaint => ({
  id: r.id,
  studentId: r.student_id,
  studentName: r.student_name,
  roomNumber: r.room_number,
  category: r.category,
  title: r.title,
  description: r.description,
  imageUrl: opt(r.image_url),
  status: r.status,
  createdAt: r.created_at,
  assignedTo: opt(r.assigned_to),
  resolvedAt: opt(r.resolved_at),
});

export const complaintToRow = (c: Complaint) => ({
  id: c.id,
  student_id: c.studentId,
  student_name: c.studentName,
  room_number: c.roomNumber,
  category: c.category,
  title: c.title,
  description: c.description,
  image_url: c.imageUrl ?? null,
  status: c.status,
  created_at: c.createdAt,
  assigned_to: c.assignedTo ?? null,
  resolved_at: c.resolvedAt ?? null,
});

export const notificationFromRow = (r: any): NotificationItem => ({
  id: r.id,
  title: r.title,
  message: r.message,
  timestamp: r.timestamp_label,
  read: r.read,
  type: r.type,
  link: opt(r.link),
});

export const notificationToRow = (n: NotificationItem) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  timestamp_label: n.timestamp,
  read: n.read,
  type: n.type,
  link: n.link ?? null,
});

export const roomFromRow = (r: any): Room => ({
  id: r.id,
  roomNumber: r.room_number,
  block: r.block,
  capacity: r.capacity,
  occupied: r.occupied,
  status: r.status,
  students: r.students ?? [],
});

export const roomToRow = (r: Room) => ({
  id: r.id,
  room_number: r.roomNumber,
  block: r.block,
  capacity: r.capacity,
  occupied: r.occupied,
  status: r.status,
  students: r.students,
});

export const lostFoundFromRow = (r: any): LostFoundItem => ({
  id: r.id,
  type: r.type,
  title: r.title,
  description: r.description,
  category: r.category,
  status: r.status,
  reportedBy: r.reported_by,
  studentId: r.student_id,
  date: r.date,
  imageUrl: opt(r.image_url),
});

export const lostFoundToRow = (i: LostFoundItem) => ({
  id: i.id,
  type: i.type,
  title: i.title,
  description: i.description,
  category: i.category,
  status: i.status,
  reported_by: i.reportedBy,
  student_id: i.studentId,
  date: i.date,
  image_url: i.imageUrl ?? null,
});

export const roomChangeFromRow = (r: any): RoomChangeRequest => ({
  id: r.id,
  studentId: r.student_id,
  studentName: r.student_name,
  currentRoom: r.current_room,
  requestedBlock: r.requested_block,
  reason: r.reason,
  status: r.status,
  createdAt: r.created_at,
});

export const roomChangeToRow = (r: RoomChangeRequest) => ({
  id: r.id,
  student_id: r.studentId,
  student_name: r.studentName,
  current_room: r.currentRoom,
  requested_block: r.requestedBlock,
  reason: r.reason,
  status: r.status,
  created_at: r.createdAt,
});

export const noticeFromRow = (r: any): Notice => ({
  id: r.id,
  title: r.title,
  message: r.message,
  priority: r.priority,
  targetAudience: r.target_audience,
  author: r.author,
  date: r.date,
});

export const noticeToRow = (n: Notice) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  priority: n.priority,
  target_audience: n.targetAudience,
  author: n.author,
  date: n.date,
});
