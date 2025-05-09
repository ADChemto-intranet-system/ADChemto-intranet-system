import axios from 'axios';
import { API_BASE_URL } from '../config';

export const assetApi = {
  getAssets: async () => {
    return axios.get(`${API_BASE_URL}/assets`);
  },

  getAssetDetail: async (assetId: number) => {
    return axios.get(`${API_BASE_URL}/assets/${assetId}`);
  },

  createAsset: async (data: {
    name: string;
    category: string;
    serialNumber: string;
    purchaseDate: string;
    purchasePrice: number;
    status: '사용중' | '대기중' | '수리중' | '폐기';
    assignedTo?: string;
    location?: string;
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
  }) => {
    return axios.post(`${API_BASE_URL}/assets`, data);
  },

  updateAsset: async (assetId: number, data: {
    name?: string;
    category?: string;
    serialNumber?: string;
    purchaseDate?: string;
    purchasePrice?: number;
    status?: '사용중' | '대기중' | '수리중' | '폐기';
    assignedTo?: string;
    location?: string;
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
  }) => {
    return axios.put(`${API_BASE_URL}/assets/${assetId}`, data);
  },

  updateAssetStatus: async (assetId: number, status: '사용중' | '대기중' | '수리중' | '폐기') => {
    return axios.put(`${API_BASE_URL}/assets/${assetId}/status`, { status });
  },

  deleteAsset: async (assetId: number) => {
    return axios.delete(`${API_BASE_URL}/assets/${assetId}`);
  },

  getAssetHistory: async (assetId: number) => {
    return axios.get(`${API_BASE_URL}/assets/${assetId}/history`);
  },

  addAssetHistory: async (assetId: number, data: {
    type: '할당' | '반납' | '수리' | '폐기';
    description: string;
  }) => {
    return axios.post(`${API_BASE_URL}/assets/${assetId}/history`, data);
  },

  getAssignmentHistory: async (assetId: number) => {
    return axios.get(`${API_BASE_URL}/assets/${assetId}/assignment-history`);
  },

  assignOrReturnAsset: async (assetId: number, data: {
    type: '할당' | '반납';
    user: string;
    department?: string;
    description?: string;
  }) => {
    return axios.post(`${API_BASE_URL}/assets/${assetId}/assignment`, data);
  }
}; 