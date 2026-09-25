'use client';

/**
 * Chavara data store — dual-mode.
 *
 * When NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 * (.env.local), all data lives in Supabase: fetched on mount, written on every
 * action, and kept live across portals via Realtime subscriptions.
 *
 * When they are not set, the store behaves exactly as before: seeded from
 * mock-data and persisted to localStorage. The public context API is identical
 * in both modes, so pages never need to know which one is active.
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  UserRole,
  LeaveRequest,
  FoodOrder,
  ExternalDelivery,
  FeePayment,
  Complaint,
  NotificationItem,
  Room,
  LostFoundItem,
  RoomChangeRequest,
  GUEST_USER,
  INITIAL_USERS,
  INITIAL_LEAVES,
  INITIAL_FOOD_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_FEES,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ROOMS,
  INITIAL_LOST_FOUND,
  INITIAL_ROOM_CHANGES,
  INITIAL_NOTICES,
  Notice,
} from './mock-data';
import {
  supabase,
  isSupabaseConfigured,
  userFromRow,
  leaveFromRow,
  leaveToRow,
  foodOrderFromRow,
  deliveryFromRow,
  deliveryToRow,
  feeFromRow,
  complaintFromRow,
  complaintToRow,
  notificationFromRow,
  notificationToRow,
  roomFromRow,
  lostFoundFromRow,
  lostFoundToRow,
  roomChangeFromRow,
  roomChangeToRow,
  noticeFromRow,
  noticeToRow,
} from './supabase';
import { toast } from 'sonner';

/**
 * 'local'         — no Supabase configured; old frictionless demo picker.
 * 'loading'       — cloud mode, checking for an existing session.
 * 'authenticated' — cloud mode, real signed-in Supabase Auth session.
 * 'unauthenticated' — cloud mode, no session; app should show the login page.
 */
type AuthStatus = 'local' | 'loading' | 'authenticated' | 'unauthenticated';

interface ChavaraStoreContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  authStatus: AuthStatus;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  changeOwnPassword: (newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  /** Current session's access token, for calling the /api/admin/* routes. Null outside cloud mode. */
  getAccessToken: () => Promise<string | null>;

  users: User[];
  leaveRequests: LeaveRequest[];
  foodOrders: FoodOrder[];
  externalDeliveries: ExternalDelivery[];
  feePayments: FeePayment[];
  complaints: Complaint[];
  notifications: NotificationItem[];
  rooms: Room[];
  lostFoundItems: LostFoundItem[];
  roomChangeRequests: RoomChangeRequest[];
  notices: Notice[];

  // Actions
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'roomNumber'>) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;
  bulkApproveLeaves: (ids: string[]) => void;
  bulkRejectLeaves: (ids: string[]) => void;
  logStudentReturn: (studentId: string) => void;
  toggleFoodOrder: (id: string) => void;
  addExternalDelivery: (deliv: Omit<ExternalDelivery, 'id' | 'status' | 'orderedAt' | 'studentId' | 'studentName'>) => void;
  updateDeliveryStatus: (id: string, status: ExternalDelivery['status']) => void;
  markDeliveryCollected: (id: string) => void;
  payFee: (id: string) => void;
  addComplaint: (comp: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'roomNumber'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status'], assignedTo?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  reportLostFoundItem: (item: Omit<LostFoundItem, 'id' | 'status' | 'reportedBy' | 'studentId' | 'date'>) => void;
  resolveLostFoundItem: (id: string) => void;
  submitRoomChangeRequest: (req: Omit<RoomChangeRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'currentRoom'>) => void;
  updateRoomChangeStatus: (id: string, status: RoomChangeRequest['status']) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date' | 'author' | 'targetAudience'> & { targetAudience?: Notice['targetAudience'] }) => void;

  // Quick Filtered Getters
  studentLeaves: LeaveRequest[];
  pendingLeaves: LeaveRequest[];
  unreadNotificationCount: number;

  /** True when the store is backed by Supabase rather than local mocks. */
  isCloudSynced: boolean;
}

const ChavaraStoreContext = createContext<ChavaraStoreContextType | undefined>(undefined);

const STORE_KEY = 'CHAVARA_HOSTEL_STORE_V1';
const USER_KEY = 'CHAVARA_HOSTEL_CURRENT_USER_V1';

/** Unique-enough, human-readable ids (multi-client safe, unlike length+1). */
const genId = (prefix: string) =>
  `${prefix}-${String(Date.now()).slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

/** Fire-and-forget Supabase write with error surfacing. */
const dbWrite = (label: string, run: () => PromiseLike<{ error: { message: string } | null }>) => {
  if (!supabase) return;
  Promise.resolve(run()).then(({ error }) => {
    if (error) {
      console.error(`Supabase write failed [${label}]`, error);
      toast.error('Cloud sync failed', { description: `${label}: ${error.message}` });
    }
  });
};

export function ChavaraStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(GUEST_USER);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>(INITIAL_FOOD_ORDERS);
  const [externalDeliveries, setExternalDeliveries] = useState<ExternalDelivery[]>(INITIAL_DELIVERIES);
  const [feePayments, setFeePayments] = useState<FeePayment[]>(INITIAL_FEES);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND);
  const [roomChangeRequests, setRoomChangeRequests] = useState<RoomChangeRequest[]>(INITIAL_ROOM_CHANGES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(isSupabaseConfigured ? 'loading' : 'local');
  const usersRef = useRef(users);
  usersRef.current = users;

  /* ------------------------- Supabase mode: fetching ------------------------- */

  const fetchTable = async (table: string) => {
    if (!supabase) return;
    const order = (q: any, col: string, asc = false) => q.order(col, { ascending: asc });
    try {
      switch (table) {
        case 'users': {
          const { data, error } = await order(supabase.from('users').select('*'), 'id', true);
          if (!error && data) {
            const mapped: User[] = data.map(userFromRow);
            setUsers(mapped);
            // keep currentUser fresh (e.g. attendance changed elsewhere)
            setCurrentUserState((prev) => mapped.find((u) => u.id === prev.id) ?? prev);
          }
          break;
        }
        case 'leave_requests': {
          const { data, error } = await order(supabase.from('leave_requests').select('*'), 'created_at');
          if (!error && data) setLeaveRequests(data.map(leaveFromRow));
          break;
        }
        case 'food_orders': {
          const { data, error } = await order(supabase.from('food_orders').select('*'), 'id', true);
          if (!error && data) setFoodOrders(data.map(foodOrderFromRow));
          break;
        }
        case 'external_deliveries': {
          const { data, error } = await order(supabase.from('external_deliveries').select('*'), 'ordered_at');
          if (!error && data) setExternalDeliveries(data.map(deliveryFromRow));
          break;
        }
        case 'fee_payments': {
          const { data, error } = await order(supabase.from('fee_payments').select('*'), 'id', true);
          if (!error && data) setFeePayments(data.map(feeFromRow));
          break;
        }
        case 'complaints': {
          const { data, error } = await order(supabase.from('complaints').select('*'), 'created_at');
          if (!error && data) setComplaints(data.map(complaintFromRow));
          break;
        }
        case 'notifications': {
          const { data, error } = await order(supabase.from('notifications').select('*'), 'created_at');
          if (!error && data) setNotifications(data.map(notificationFromRow));
          break;
        }
        case 'rooms': {
          const { data, error } = await order(supabase.from('rooms').select('*'), 'room_number', true);
          if (!error && data) setRooms(data.map(roomFromRow));
          break;
        }
        case 'lost_found_items': {
          const { data, error } = await order(supabase.from('lost_found_items').select('*'), 'date');
          if (!error && data) setLostFoundItems(data.map(lostFoundFromRow));
          break;
        }
        case 'room_change_requests': {
          const { data, error } = await order(supabase.from('room_change_requests').select('*'), 'created_at');
          if (!error && data) setRoomChangeRequests(data.map(roomChangeFromRow));
          break;
        }
        case 'notices': {
          const { data, error } = await order(supabase.from('notices').select('*'), 'date');
          if (!error && data) setNotices(data.map(noticeFromRow));
          break;
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${table} from Supabase`, e);
    }
  };

  const ALL_TABLES = [
    'users', 'leave_requests', 'food_orders', 'external_deliveries',
    'fee_payments', 'complaints', 'notifications', 'rooms',
    'lost_found_items', 'room_change_requests', 'notices',
  ];

  /** Fetches all tables, then resolves currentUser from the given auth user id. */
  const loadForAuthUser = async (authUserId: string): Promise<User | null> => {
    const { data: profile, error } = await supabase!
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (error || !profile) {
      // The account no longer exists server-side, so any sign-out request would be
      // rejected with a 403. Drop the stored session locally without a network call.
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
          .forEach((k) => localStorage.removeItem(k));
      } catch { /* ignore */ }
      setAuthStatus('unauthenticated');
      toast.error('No portal profile is linked to this account.', {
        description: 'Ask a warden or director to check your account setup.',
      });
      return null;
    }

    const resolvedUser = userFromRow(profile);
    setCurrentUserState(resolvedUser);
    await Promise.all(ALL_TABLES.map(fetchTable));
    setAuthStatus('authenticated');
    return resolvedUser;
  };

  // Initial load
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      try {
        localStorage.removeItem(STORE_KEY);
        localStorage.removeItem(USER_KEY);
      } catch { /* ignore */ }
      supabase.auth.getSession()
        .then(({ data }) => {
          if (data.session) {
            return loadForAuthUser(data.session.user.id);
          }
          setAuthStatus('unauthenticated');
        })
        .catch((e) => {
          console.error('Supabase session check failed', e);
          toast.error('Could not reach Supabase.');
          setAuthStatus('unauthenticated');
        })
        .finally(() => setIsLoaded(true));
      return;
    }

    // Restore the demo session (which user/role is active) in local mode.
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setCurrentUserState(JSON.parse(savedUser));
    } catch { /* ignore */ }

    // Local mode: hydrate everything from localStorage as before.
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.leaveRequests) setLeaveRequests(parsed.leaveRequests);
        if (parsed.foodOrders) setFoodOrders(parsed.foodOrders);
        if (parsed.externalDeliveries) setExternalDeliveries(parsed.externalDeliveries);
        if (parsed.feePayments) setFeePayments(parsed.feePayments);
        if (parsed.complaints) setComplaints(parsed.complaints);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.lostFoundItems) setLostFoundItems(parsed.lostFoundItems);
        if (parsed.roomChangeRequests) setRoomChangeRequests(parsed.roomChangeRequests);
        if (parsed.notices) setNotices(parsed.notices);
        if (parsed.currentUser) setCurrentUserState(parsed.currentUser);
      }
    } catch (e) {
      console.error('Failed to load Chavara store from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime: any change from any client refreshes that table for everyone.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const sb = supabase;
    let channel = sb.channel('chavara-db-live');
    for (const table of ALL_TABLES) {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => { void fetchTable(table); }
      );
    }
    channel.subscribe();
    return () => { void sb.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------------- persistence ----------------------------- */

  // Always remember which demo user is active (local mode only — cloud mode
  // relies on the real Supabase Auth session instead).
  useEffect(() => {
    if (!isLoaded || isSupabaseConfigured) return;
    try { localStorage.setItem(USER_KEY, JSON.stringify(currentUser)); } catch { /* ignore */ }
  }, [currentUser, isLoaded]);

  // React to sign-out/session-expiry events (e.g. another tab logging out).
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setAuthStatus('unauthenticated');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Local mode only: persist the full dataset (in cloud mode the DB owns it).
  useEffect(() => {
    if (!isLoaded || isSupabaseConfigured) return;
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          leaveRequests,
          foodOrders,
          externalDeliveries,
          feePayments,
          complaints,
          notifications,
          lostFoundItems,
          roomChangeRequests,
          notices,
          currentUser,
        })
      );
    } catch (e) {
      console.error('Failed to save Chavara store to localStorage', e);
    }
  }, [leaveRequests, foodOrders, externalDeliveries, feePayments, complaints, notifications, lostFoundItems, roomChangeRequests, notices, currentUser, isLoaded]);

  /* -------------------------------- actions -------------------------------- */

  const switchRole = (role: UserRole) => {
    if (isSupabaseConfigured) {
      toast.error('Demo role-switching is disabled — sign in with a real account.');
      return;
    }
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUserState(found);
      toast.success(`Switched portal view to ${found.name} (${role.toUpperCase()})`);
    }
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    toast.success(`Logged in as ${user.name}`);
  };

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string; user?: User }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, error: 'Cloud login is not configured on this deployment.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { ok: false, error: error?.message ?? 'Invalid email or password.' };
    }
    const resolvedUser = await loadForAuthUser(data.user.id);
    if (!resolvedUser) {
      return { ok: false, error: 'No portal profile is linked to this account.' };
    }
    return { ok: true, user: resolvedUser };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setAuthStatus('unauthenticated');
    toast.info('Signed out.');
  };

  const changeOwnPassword = async (newPassword: string): Promise<{ ok: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, error: 'Not available in local demo mode.' };
    }
    if (newPassword.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    toast.success('Password changed successfully.');
    return { ok: true };
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    dbWrite('notification', () => supabase!.from('notifications').insert(notificationToRow(newNotif)));
  };

  const addLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'roomNumber'>) => {
    const newId = genId('LR-2026');
    const newReq: LeaveRequest = {
      ...req,
      id: newId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: currentUser.roomNumber || 'Not assigned',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
    dbWrite('leave request', () => supabase!.from('leave_requests').insert(leaveToRow(newReq)));

    // Add alert notification for warden
    addNotification({
      title: 'New Leave Request Submitted 📨',
      message: `${currentUser.name} (${currentUser.roomNumber}) submitted a new ${req.type.toUpperCase()} request. Pending your approval.`,
      type: 'alert',
      link: '/warden/approvals',
    });

    toast.success('Leave request submitted successfully!', {
      description: `Request ID: ${newId}. Currently in pending review queue.`,
    });
  };

  const updateLeaveStatus = (id: string, status: LeaveRequest['status']) => {
    setLeaveRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    dbWrite('leave status', () => supabase!.from('leave_requests').update({ status }).eq('id', id));

    const target = leaveRequests.find((l) => l.id === id);
    if (target && status === 'approved') {
      // Automatically sync student location status for Warden supervisory view
      const newStatus =
        target.type === 'outpass' ? 'outpass' :
        target.type === 'home' ? 'on-leave' :
        target.type === 'library' ? 'library' : 'present';

      setUsers((prev) =>
        prev.map((u) => (u.id === target.studentId ? { ...u, attendanceToday: newStatus } : u))
      );
      dbWrite('student location', () =>
        supabase!.from('users').update({ attendance_today: newStatus }).eq('id', target.studentId)
      );
    }

    if (target) {
      addNotification({
        title: `Movement Log ${status === 'approved' ? 'Approved & Registered ✅' : 'Rejected ❌'}`,
        message: `Your ${target.type.toUpperCase()} request (${target.id}) has been ${status} by Warden. Location register updated.`,
        type: status === 'approved' ? 'approval' : 'alert',
        link: `/student/${target.type === 'home' ? 'home-leave' : target.type === 'outpass' ? 'outpass' : 'leave-requests'}`,
      });

      toast[status === 'approved' ? 'success' : 'error'](`Request ${id} marked as ${status.toUpperCase()}`);
    }
  };

  const approveLeave = (id: string) => updateLeaveStatus(id, 'approved');
  const rejectLeave = (id: string) => updateLeaveStatus(id, 'rejected');
  const bulkApproveLeaves = (ids: string[]) => {
    ids.forEach((id) => updateLeaveStatus(id, 'approved'));
  };
  const bulkRejectLeaves = (ids: string[]) => {
    ids.forEach((id) => updateLeaveStatus(id, 'rejected'));
  };

  const logStudentReturn = (studentId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setUsers((prev) =>
      prev.map((u) => (u.id === studentId ? { ...u, attendanceToday: 'present' } : u))
    );
    dbWrite('student return', () =>
      supabase!.from('users').update({ attendance_today: 'present' }).eq('id', studentId)
    );
    const completed = leaveRequests.filter(
      (l) => l.studentId === studentId && (l.status === 'approved' || l.status === 'in-progress') && !l.actualArrivalTime
    );
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (l.studentId === studentId && (l.status === 'approved' || l.status === 'in-progress') && !l.actualArrivalTime) {
          return { ...l, status: 'completed', actualArrivalTime: nowTime };
        }
        return l;
      })
    );
    completed.forEach((l) => {
      dbWrite('leave completion', () =>
        supabase!.from('leave_requests').update({ status: 'completed', actual_arrival_time: nowTime }).eq('id', l.id)
      );
    });
    const targetUser = users.find((u) => u.id === studentId);
    toast.success('Return & Gate Arrival Logged!', {
      description: `${targetUser?.name || 'Student'} checked in at turnstile (Actual Arrival marked at ${nowTime}).`,
    });
  };

  const toggleFoodOrder = (id: string) => {
    const target = foodOrders.find((f) => f.id === id);
    if (!target) return;
    const nextState = !target.ordered;
    setFoodOrders((prev) => prev.map((item) => (item.id === id ? { ...item, ordered: nextState } : item)));
    dbWrite('food order', () => supabase!.from('food_orders').update({ ordered: nextState }).eq('id', id));
    toast.success(nextState ? `Ordered: ${target.name}` : `Cancelled order: ${target.name}`, {
      description: nextState ? 'Meal booked for today.' : 'Order removed from kitchen tally.',
    });
  };

  const addExternalDelivery = (deliv: Omit<ExternalDelivery, 'id' | 'status' | 'orderedAt' | 'studentId' | 'studentName'>) => {
    const newId = genId('DEL-2026');
    const newDeliv: ExternalDelivery = {
      ...deliv,
      id: newId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: deliv.roomNumber || currentUser.roomNumber || 'Not assigned',
      department: deliv.department || currentUser.course || 'Not set',
      date: deliv.date || new Date().toISOString().split('T')[0],
      status: 'en-route',
      orderedAt: new Date().toISOString(),
    };
    setExternalDeliveries((prev) => [newDeliv, ...prev]);
    dbWrite('delivery log', () => supabase!.from('external_deliveries').insert(deliveryToRow(newDeliv)));

    // Notify Warden / Security Gate
    addNotification({
      title: `New ${deliv.platform} Delivery Arriving 🛵`,
      message: `Room ${newDeliv.roomNumber} (${currentUser.name} - ${newDeliv.department}) logged an incoming ${deliv.platform} order from ${deliv.restaurantOrStore} for ${newDeliv.date}. Expected at gate: ${deliv.expectedTime}.`,
      type: 'info',
      link: '/warden/food-analytics',
    });

    toast.success(`${deliv.platform} Delivery Logged for ${newDeliv.date}!`, {
      description: `Room ${newDeliv.roomNumber} (${newDeliv.department}) alerted Gate Security for package arrival from ${deliv.restaurantOrStore}.`,
    });
  };

  const updateDeliveryStatus = (id: string, status: ExternalDelivery['status']) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const target = externalDeliveries.find((d) => d.id === id);
    const stampArrival = (status === 'arrived-gate' || status === 'collected') && target && !target.actualArrivalTime;
    setExternalDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = { ...d, status };
          if ((status === 'arrived-gate' || status === 'collected') && !d.actualArrivalTime) {
            updated.actualArrivalTime = nowTime;
          }
          return updated;
        }
        return d;
      })
    );
    dbWrite('delivery status', () =>
      supabase!.from('external_deliveries')
        .update(stampArrival ? { status, actual_arrival_time: nowTime } : { status })
        .eq('id', id)
    );
    if (target && status === 'arrived-gate') {
      addNotification({
        title: `${target.platform} Delivery Arrived at Gate! 📦`,
        message: `Your food order from ${target.restaurantOrStore} is waiting at the main security gate (Actual Arrival: ${nowTime}). Please collect it.`,
        type: 'alert',
        link: '/student/food-orders',
      });
      toast.info(`Order ${id} arrived at gate at ${nowTime}! Student alerted.`);
    }
  };

  const markDeliveryCollected = (id: string) => {
    updateDeliveryStatus(id, 'collected');
    toast.success('Delivery marked as Collected!', {
      description: 'Enjoy your meal! Please dispose of food packaging responsibly.',
    });
  };

  const payFee = (id: string) => {
    const target = feePayments.find((f) => f.id === id);
    if (!target) return;
    const receiptNo = `CHV-REC-${Math.floor(100000 + Math.random() * 900000)}`;
    const paidOn = new Date().toISOString().split('T')[0];
    setFeePayments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'paid', paidOn, receiptNo } : item))
    );
    dbWrite('fee payment', () =>
      supabase!.from('fee_payments').update({ status: 'paid', paid_on: paidOn, receipt_no: receiptNo }).eq('id', id)
    );
    toast.success('Payment completed successfully! 🎉', {
      description: `Paid $${target.amount} for ${target.title}. Receipt #${receiptNo} generated.`,
    });
  };

  const addComplaint = (comp: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'roomNumber'>) => {
    const newId = genId('CMP-2026');
    const newComp: Complaint = {
      ...comp,
      id: newId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: currentUser.roomNumber || 'Not assigned',
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComp, ...prev]);
    dbWrite('complaint', () => supabase!.from('complaints').insert(complaintToRow(newComp)));

    addNotification({
      title: 'New Maintenance Complaint Logged 🛠️',
      message: `${currentUser.name} logged a [${comp.category.toUpperCase()}] complaint: "${comp.title}".`,
      type: 'alert',
      link: '/warden/complaints',
    });

    toast.success('Complaint ticket created!', {
      description: `Ticket ID: ${newId}. Our campus maintenance team will review shortly.`,
    });
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], assignedTo?: string) => {
    const target = complaints.find((c) => c.id === id);
    const resolvedAt = status === 'resolved' ? new Date().toISOString() : target?.resolvedAt;
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, assignedTo: assignedTo || item.assignedTo, resolvedAt }
          : item
      )
    );
    dbWrite('complaint status', () =>
      supabase!.from('complaints')
        .update({
          status,
          assigned_to: assignedTo || target?.assignedTo || null,
          resolved_at: resolvedAt ?? null,
        })
        .eq('id', id)
    );
    toast.success(`Complaint ${id} status updated to ${status.toUpperCase()}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    dbWrite('notification read', () => supabase!.from('notifications').update({ read: true }).eq('id', id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    dbWrite('notifications read-all', () => supabase!.from('notifications').update({ read: true }).eq('read', false));
    toast.info('All notifications marked as read.');
  };

  const reportLostFoundItem = (item: Omit<LostFoundItem, 'id' | 'status' | 'reportedBy' | 'studentId' | 'date'>) => {
    const newId = genId('LF-2026');
    const newItem: LostFoundItem = {
      ...item,
      id: newId,
      status: 'open',
      reportedBy: currentUser.name,
      studentId: currentUser.id,
      date: new Date().toISOString(),
    };
    setLostFoundItems((prev) => [newItem, ...prev]);
    dbWrite('lost & found', () => supabase!.from('lost_found_items').insert(lostFoundToRow(newItem)));
    toast.success(`${item.type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`);
  };

  const resolveLostFoundItem = (id: string) => {
    setLostFoundItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'resolved' } : item))
    );
    dbWrite('lost & found resolve', () => supabase!.from('lost_found_items').update({ status: 'resolved' }).eq('id', id));
    toast.success('Item marked as resolved!');
  };

  const submitRoomChangeRequest = (req: Omit<RoomChangeRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'currentRoom'>) => {
    const newId = genId('RC-2026');
    const newReq: RoomChangeRequest = {
      ...req,
      id: newId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      currentRoom: currentUser.roomNumber || 'Unknown',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setRoomChangeRequests((prev) => [newReq, ...prev]);
    dbWrite('room change request', () => supabase!.from('room_change_requests').insert(roomChangeToRow(newReq)));

    addNotification({
      title: 'New Room Change Request 🛏️',
      message: `${currentUser.name} (Room ${currentUser.roomNumber}) requested a transfer to Block ${req.requestedBlock}.`,
      type: 'alert',
      link: '/warden/room-changes',
    });

    toast.success('Room change request submitted to Warden!');
  };

  const updateRoomChangeStatus = (id: string, status: RoomChangeRequest['status']) => {
    const target = roomChangeRequests.find((r) => r.id === id);
    setRoomChangeRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
    dbWrite('room change status', () => supabase!.from('room_change_requests').update({ status }).eq('id', id));
    if (target) {
      addNotification({
        title: `Room Change ${status === 'approved' ? 'Approved ✅' : 'Rejected ❌'}`,
        message: `Your request to transfer to Block ${target.requestedBlock} was ${status} by the Warden.`,
        type: status === 'approved' ? 'approval' : 'alert',
        link: '/student/room-change',
      });
    }
    toast.success(`Room change request ${status}!`);
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'date' | 'author' | 'targetAudience'> & { targetAudience?: Notice['targetAudience'] }) => {
    const newNotice: Notice = {
      ...notice,
      targetAudience: notice.targetAudience ?? 'All',
      id: genId('NOTICE-2026'),
      author: currentUser.name,
      date: new Date().toISOString(),
    };
    setNotices((prev) => [newNotice, ...prev]);
    dbWrite('notice', () => supabase!.from('notices').insert(noticeToRow(newNotice)));

    // Send push notification for High or Urgent notices
    if (notice.priority === 'high' || notice.priority === 'urgent') {
      addNotification({
        title: `Broadcast: ${notice.title} 📢`,
        message: notice.message,
        type: notice.priority === 'urgent' ? 'alert' : 'info',
      });
    }
    toast.success('Broadcast sent successfully!');
  };

  const studentLeaves = currentUser.role === 'student'
    ? leaveRequests.filter((l) => l.studentId === currentUser.id)
    : leaveRequests;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <ChavaraStoreContext.Provider
      value={{
        currentUser,
        switchRole,
        setCurrentUser,
        authStatus,
        login,
        logout,
        changeOwnPassword,
        getAccessToken,
        users,
        leaveRequests,
        foodOrders,
        externalDeliveries,
        feePayments,
        complaints,
        notifications,
        rooms,
        lostFoundItems,
        roomChangeRequests,
        notices,
        addLeaveRequest,
        updateLeaveStatus,
        approveLeave,
        rejectLeave,
        bulkApproveLeaves,
        bulkRejectLeaves,
        logStudentReturn,
        toggleFoodOrder,
        addExternalDelivery,
        updateDeliveryStatus,
        markDeliveryCollected,
        payFee,
        addComplaint,
        updateComplaintStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        reportLostFoundItem,
        resolveLostFoundItem,
        submitRoomChangeRequest,
        updateRoomChangeStatus,
        addNotice,
        studentLeaves,
        pendingLeaves,
        unreadNotificationCount,
        isCloudSynced: isSupabaseConfigured,
      }}
    >
      {children}
    </ChavaraStoreContext.Provider>
  );
}

export function useChavaraStore() {
  const context = useContext(ChavaraStoreContext);
  if (!context) {
    throw new Error('useChavaraStore must be used within a ChavaraStoreProvider');
  }
  return context;
}
