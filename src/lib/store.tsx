'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { toast } from 'sonner';

interface ChavaraStoreContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  
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
  addNotice: (notice: Omit<Notice, 'id' | 'date' | 'author'>) => void;
  
  // Quick Filtered Getters
  studentLeaves: LeaveRequest[];
  pendingLeaves: LeaveRequest[];
  unreadNotificationCount: number;
}

const ChavaraStoreContext = createContext<ChavaraStoreContextType | undefined>(undefined);

const STORE_KEY = 'CHAVARA_HOSTEL_STORE_V1';

export function ChavaraStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(INITIAL_USERS[0]); // Ananya Sharma (Student) by default
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

  // Load from localStorage if available
  useEffect(() => {
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
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
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

  const switchRole = (role: UserRole) => {
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

  const addLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'roomNumber'>) => {
    const newId = `LR-2026-00${leaveRequests.length + 1}`;
    const newReq: LeaveRequest = {
      ...req,
      id: newId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: currentUser.roomNumber || '304A',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newReq, ...prev]);

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
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status };
        }
        return item;
      })
    );

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
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (l.studentId === studentId && (l.status === 'approved' || l.status === 'in-progress') && !l.actualArrivalTime) {
          return { ...l, status: 'completed', actualArrivalTime: nowTime };
        }
        return l;
      })
    );
    const targetUser = users.find((u) => u.id === studentId);
    toast.success('Return & Gate Arrival Logged!', {
      description: `${targetUser?.name || 'Student'} checked in at turnstile (Actual Arrival marked at ${nowTime}).`,
    });
  };

  const toggleFoodOrder = (id: string) => {
    setFoodOrders((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.ordered;
          toast.success(nextState ? `Ordered: ${item.name}` : `Cancelled order: ${item.name}`, {
            description: nextState ? 'Meal booked for today.' : 'Order removed from kitchen tally.',
          });
          return { ...item, ordered: nextState };
        }
        return item;
      })
    );
  };

  const addExternalDelivery = (deliv: Omit<ExternalDelivery, 'id' | 'status' | 'orderedAt' | 'studentId' | 'studentName'>) => {
    const newId = `DEL-2026-00${externalDeliveries.length + 1}`;
    const newDeliv: ExternalDelivery = {
      ...deliv,
      id: newId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: deliv.roomNumber || currentUser.roomNumber || '304A',
      department: deliv.department || currentUser.course || 'B.Tech Computer Science',
      date: deliv.date || new Date().toISOString().split('T')[0],
      status: 'en-route',
      orderedAt: new Date().toISOString(),
    };
    setExternalDeliveries((prev) => [newDeliv, ...prev]);

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
    const target = externalDeliveries.find((d) => d.id === id);
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
    setFeePayments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const receiptNo = `CHV-REC-${Math.floor(100000 + Math.random() * 900000)}`;
          toast.success('Payment completed successfully! 🎉', {
            description: `Paid $${item.amount} for ${item.title}. Receipt #${receiptNo} generated.`,
          });
          return { ...item, status: 'paid', paidOn: new Date().toISOString().split('T')[0], receiptNo };
        }
        return item;
      })
    );
  };

  const addComplaint = (comp: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'roomNumber'>) => {
    const newId = `CMP-2026-00${complaints.length + 1}`;
    const newComp: Complaint = {
      ...comp,
      id: newId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: currentUser.roomNumber || '304A',
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComp, ...prev]);

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
    setComplaints((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            assignedTo: assignedTo || item.assignedTo,
            resolvedAt: status === 'resolved' ? new Date().toISOString() : item.resolvedAt,
          };
        }
        return item;
      })
    );
    toast.success(`Complaint ${id} status updated to ${status.toUpperCase()}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.info('All notifications marked as read.');
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const reportLostFoundItem = (item: Omit<LostFoundItem, 'id' | 'status' | 'reportedBy' | 'studentId' | 'date'>) => {
    const newId = `LF-2026-00${lostFoundItems.length + 1}`;
    const newItem: LostFoundItem = {
      ...item,
      id: newId,
      status: 'open',
      reportedBy: currentUser.name,
      studentId: currentUser.id,
      date: new Date().toISOString(),
    };
    setLostFoundItems((prev) => [newItem, ...prev]);
    toast.success(`${item.type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`);
  };

  const resolveLostFoundItem = (id: string) => {
    setLostFoundItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'resolved' } : item))
    );
    toast.success('Item marked as resolved!');
  };

  const submitRoomChangeRequest = (req: Omit<RoomChangeRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'currentRoom'>) => {
    const newId = `RC-2026-00${roomChangeRequests.length + 1}`;
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
    
    addNotification({
      title: 'New Room Change Request 🛏️',
      message: `${currentUser.name} (Room ${currentUser.roomNumber}) requested a transfer to Block ${req.requestedBlock}.`,
      type: 'alert',
      link: '/warden/room-changes',
    });

    toast.success('Room change request submitted to Warden!');
  };

  const updateRoomChangeStatus = (id: string, status: RoomChangeRequest['status']) => {
    setRoomChangeRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          addNotification({
            title: `Room Change ${status === 'approved' ? 'Approved ✅' : 'Rejected ❌'}`,
            message: `Your request to transfer to Block ${req.requestedBlock} was ${status} by the Warden.`,
            type: status === 'approved' ? 'approval' : 'alert',
            link: '/student/room-change',
          });
          return { ...req, status };
        }
        return req;
      })
    );
    toast.success(`Room change request ${status}!`);
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'date' | 'author'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `NOTICE-2026-00${notices.length + 1}`,
      author: currentUser.name,
      date: new Date().toISOString(),
    };
    setNotices((prev) => [newNotice, ...prev]);

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
