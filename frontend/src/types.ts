export interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

export interface Attendance {
  id: number;
  user_id: number;
  date: string;
  check_in: string;
  check_out: string;
  status: 'pending' | 'approved' | 'rejected';
  user: User;
}

export interface Reservation {
  id: number;
  facility_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  user: User;
  repeat_rule?: string;
}

export interface Schedule {
  id: number;
  user_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_shared: boolean;
  user: User;
  content?: string;
  type?: string;
  shared_with?: string;
  is_repeat?: boolean;
  repeat_rule?: string;
}

export interface Asset {
  id: number;
  name: string;
  category: string;
  status: string;
  assigned_to: number | null;
  user: User | null;
}

export interface AssetHistory {
  id: number;
  asset_id: number;
  user_id: number;
  action: string;
  description: string;
  created_at: string;
  user: User;
  memo?: string;
  date?: string;
}

export interface Approval {
  id: number;
  user_id: number;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  created_at: string;
  user: User;
}

export interface ApprovalLine {
  id: number;
  approval_id: number;
  approver_id: number;
  order: number;
  status: 'pending' | 'approved' | 'rejected';
  approver: User;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
} 