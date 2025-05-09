import axios from 'axios';
import { ApiResponse } from '../types';
import { facilityApi } from './facility';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 근태 관련 API
export const attendanceApi = {
  getList: () => api.get<ApiResponse<any[]>>('/attendances'),
  approve: (id: number) => api.put<ApiResponse<any>>(`/attendances/${id}/approve`),
  update: (id: number, data: any) => api.put<ApiResponse<any>>(`/attendances/${id}`, data),
  getStats: () => api.get<ApiResponse<any>>('/attendances/stats'),
  getStatsDetail: (filters: any) => api.get<ApiResponse<any>>('/attendances/stats/detail', { params: filters }),
};

// 예약 관련 API
export const reservationApi = {
  create: (data: any) => api.post<ApiResponse<any>>('/reservations', data),
  getList: () => api.get<ApiResponse<any[]>>('/reservations'),
  approve: (id: number) => api.put<ApiResponse<any>>(`/reservations/${id}/approve`),
  cancel: (id: number) => api.put<ApiResponse<any>>(`/reservations/${id}/cancel`),
};

// 일정 관련 API
export const scheduleApi = {
  create: (data: any) => api.post<ApiResponse<any>>('/schedules', data),
  getShared: () => api.get<ApiResponse<any[]>>('/schedules/shared'),
};

// 자산 관련 API
export const assetApi = {
  addHistory: (assetId: number, data: { action: string; memo: string }) => 
    api.post<ApiResponse<any>>(`/assets/${assetId}/history`, null, { params: { action: data.action, memo: data.memo } }),
  getHistory: (assetId: number) => 
    api.get<ApiResponse<any[]>>(`/assets/${assetId}/history`),
  getAssets: () => api.get<ApiResponse<any[]>>('/assets'),
  getAssignmentHistory: (assetId: number) => api.get<ApiResponse<any[]>>(`/assets/${assetId}/assignment-history`),
  assignOrReturnAsset: (assetId: number, data: any) => api.post<ApiResponse<any>>(`/assets/${assetId}/assignment`, data),
  getAssetHistory: (assetId: number) => api.get<ApiResponse<any[]>>(`/assets/${assetId}/history`),
  updateAsset: (assetId: number, data: any) => api.put<ApiResponse<any>>(`/assets/${assetId}`, data),
  createAsset: (data: any) => api.post<ApiResponse<any>>('/assets', data),
  deleteAsset: (assetId: number) => api.delete<ApiResponse<any>>(`/assets/${assetId}`),
  updateAssetStatus: (assetId: number, status: string) => api.put<ApiResponse<any>>(`/assets/${assetId}/status`, { status }),
  getMaintenanceRecords: (assetId: number) => api.get<ApiResponse<any[]>>(`/assets/${assetId}/maintenance`),
  createMaintenanceRecord: (assetId: number, data: any) => api.post<ApiResponse<any>>(`/assets/${assetId}/maintenance`, data),
  updateMaintenanceRecord: (recordId: number, data: any) => api.put<ApiResponse<any>>(`/maintenance/${recordId}`, data),
  deleteMaintenanceRecord: (recordId: number) => api.delete<ApiResponse<any>>(`/maintenance/${recordId}`),
  getAssetDetail: (assetId: number) => api.get<ApiResponse<any>>(`/assets/${assetId}`),
};

// 결재 관련 API
export const approvalApi = {
  addLine: (approvalId: number, data: any) => 
    api.post<ApiResponse<any>>(`/approvals/${approvalId}/lines`, data),
  approveLine: (lineId: number) => 
    api.put<ApiResponse<any>>(`/approvals/lines/${lineId}/approve`),
  getHistory: (userId: number) =>
    api.get<ApiResponse<any[]>>(`/approvals/history/${userId}`),
  getHistoryDetail: (approvalId: number) =>
    api.get<ApiResponse<any>>(`/approvals/history/detail/${approvalId}`),
  getLines: (approvalId: number) =>
    api.get<ApiResponse<any[]>>(`/approvals/${approvalId}/lines`),
};

export const adminApi = {
  getEmployees: (search: string) => api.get<ApiResponse<any[]>>(`/employees?search=${encodeURIComponent(search)}`),
  deleteEmployee: (id: number) => api.delete<ApiResponse<any>>(`/employees/${id}`),
};

export { facilityApi }; 