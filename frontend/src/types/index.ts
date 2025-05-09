// 공통 타입 정의
export interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

// 근태 관련 타입
export interface Attendance {
  id: number;
  user_id: number;
  date: string;
  status: string;
  approved: boolean;
  approver_id?: number;
  approved_at?: string;
}

// 예약 관련 타입
export interface Reservation {
  id: number;
  facility_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  purpose: string;
  status: string;
  repeat_rule?: string;
}

// 일정 관련 타입
export interface Schedule {
  id: number;
  title: string;
  content: string;
  start_time: string;
  end_time: string;
  type: string;
  owner_id: number;
  shared_with: string;
  is_repeat: boolean;
  repeat_rule?: string;
}

// 자산 관련 타입
export interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  manager_id: number;
}

export interface AssetHistory {
  id: number;
  asset_id: number;
  user_id: number;
  action: string;
  date: string;
  memo: string;
}

// 결재 관련 타입
export interface Approval {
  id: number;
  title: string;
  content: string;
  user_id: number;
  status: string;
  created_at: string;
}

export interface ApprovalLine {
  id: number;
  approval_id: number;
  approver_id: number;
  order: number;
  status: string;
  decided_at?: string;
} 