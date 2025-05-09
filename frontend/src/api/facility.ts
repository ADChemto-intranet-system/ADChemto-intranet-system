import axios from 'axios';
import { API_BASE_URL } from '../config';

export const facilityApi = {
  getReservationsByDate: async (date: Date) => {
    return axios.get(`${API_BASE_URL}/facilities/reservations`, {
      params: {
        date: date.toISOString().split('T')[0]
      }
    });
  },

  createReservation: async (data: {
    facilityId: number;
    startTime: string;
    endTime: string;
    purpose: string;
    isRecurring?: boolean;
    recurringPattern?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      endDate: string;
    };
    notificationEnabled?: boolean;
  }) => {
    return axios.post(`${API_BASE_URL}/facilities/reservations`, data);
  },

  updateReservation: async (reservationId: number, data: {
    startTime?: string;
    endTime?: string;
    purpose?: string;
    isRecurring?: boolean;
    recurringPattern?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      endDate: string;
    };
    notificationEnabled?: boolean;
  }) => {
    return axios.put(`${API_BASE_URL}/facilities/reservations/${reservationId}`, data);
  },

  updateReservationStatus: async (reservationId: number, status: '승인' | '거절') => {
    return axios.put(`${API_BASE_URL}/facilities/reservations/${reservationId}/status`, { status });
  },

  updateReservationNotification: async (reservationId: number, enabled: boolean) => {
    return axios.put(`${API_BASE_URL}/facilities/reservations/${reservationId}/notification`, { enabled });
  },

  cancelReservation: async (reservationId: number) => {
    return axios.delete(`${API_BASE_URL}/facilities/reservations/${reservationId}`);
  },

  getFacilityList: async () => {
    return axios.get(`${API_BASE_URL}/facilities`);
  },

  getFacilityDetail: async (facilityId: number) => {
    return axios.get(`${API_BASE_URL}/facilities/${facilityId}`);
  },

  getUsageStats: async (params: {
    facilityId?: string;
    period: string;
  }) => {
    return axios.get(`${API_BASE_URL}/facilities/stats/usage`, {
      params
    });
  },

  getMaintenanceRecords: async () => {
    return axios.get(`${API_BASE_URL}/facilities/maintenance`);
  },

  createMaintenanceRecord: async (data: {
    facilityId: number;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    description: string;
    assignedTo: string;
    cost?: number;
    notes?: string;
  }) => {
    return axios.post(`${API_BASE_URL}/facilities/maintenance`, data);
  },

  updateMaintenanceRecord: async (recordId: number, data: {
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    assignedTo?: string;
    cost?: number;
    notes?: string;
  }) => {
    return axios.put(`${API_BASE_URL}/facilities/maintenance/${recordId}`, data);
  },

  getInspectionRecords: async (facilityId: number) => {
    return axios.get(`${API_BASE_URL}/facilities/${facilityId}/inspections`);
  },

  createInspectionRecord: async (facilityId: number, data: {
    date: string;
    type: '정기' | '수시';
    result: '정상' | '이상';
    inspector: string;
    description: string;
  }) => {
    return axios.post(`${API_BASE_URL}/facilities/${facilityId}/inspections`, data);
  },

  updateInspectionRecord: async (recordId: number, data: {
    date?: string;
    type?: '정기' | '수시';
    result?: '정상' | '이상';
    inspector?: string;
    description?: string;
  }) => {
    return axios.put(`${API_BASE_URL}/inspections/${recordId}`, data);
  },

  deleteInspectionRecord: async (recordId: number) => {
    return axios.delete(`${API_BASE_URL}/inspections/${recordId}`);
  },

  getList: async () => {
    return axios.get(`${API_BASE_URL}/facilities`);
  },

  create: async (data: any) => {
    return axios.post(`${API_BASE_URL}/facilities`, data);
  },

  update: async (facilityId: number, data: any) => {
    return axios.put(`${API_BASE_URL}/facilities/${facilityId}`, data);
  },

  delete: async (facilityId: number) => {
    return axios.delete(`${API_BASE_URL}/facilities/${facilityId}`);
  },

  get: async (facilityId: number) => {
    return axios.get(`${API_BASE_URL}/facilities/${facilityId}`);
  }
}; 