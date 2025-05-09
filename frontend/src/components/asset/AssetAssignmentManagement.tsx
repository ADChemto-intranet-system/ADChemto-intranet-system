import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { assetApi } from '../../api';

interface Asset {
  id: number;
  name: string;
  status: '사용중' | '대기중' | '수리중' | '폐기';
  assignedTo?: string;
}

interface AssignmentHistory {
  id: number;
  assetId: number;
  type: '할당' | '반납';
  date: string;
  user: string;
  department?: string;
  description?: string;
}

export const AssetAssignmentManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [history, setHistory] = useState<AssignmentHistory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<AssignmentHistory>>({ type: '할당' });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const fetchAssets = async () => {
    try {
      const response = await assetApi.getAssets();
      setAssets(response.data.data);
    } catch (error) {
      console.error('자산 목록 조회 실패:', error);
    }
  };

  const fetchHistory = async (assetId: number) => {
    try {
      const response = await assetApi.getAssignmentHistory(assetId);
      setHistory(response.data.data);
    } catch (error) {
      console.error('할당/반납 이력 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpenDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({ type: '할당', assetId: asset.id });
    fetchHistory(asset.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
    setFormData({ type: '할당' });
    setHistory([]);
  };

  const handleSubmit = async () => {
    if (!selectedAsset) return;
    try {
      await assetApi.assignOrReturnAsset(selectedAsset.id, formData);
      handleCloseDialog();
      fetchAssets();
    } catch (error) {
      console.error('자산 할당/반납 실패:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>자산 할당/반납 관리</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>자산명</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>담당자</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.status}</TableCell>
                  <TableCell>{asset.assignedTo || '-'}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleOpenDialog(asset)}>
                      할당/반납
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>자산 {formData.type === '할당' ? '할당' : '반납'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="유형"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as '할당' | '반납' })}
              >
                <MenuItem value="할당">할당</MenuItem>
                <MenuItem value="반납">반납</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="담당자"
                value={formData.user || ''}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="부서"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="비고"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>이력</Typography>
          <TableContainer sx={{ mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>일자</TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>담당자</TableCell>
                  <TableCell>부서</TableCell>
                  <TableCell>비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{new Date(h.date).toLocaleDateString()}</TableCell>
                    <TableCell>{h.type}</TableCell>
                    <TableCell>{h.user}</TableCell>
                    <TableCell>{h.department || '-'}</TableCell>
                    <TableCell>{h.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {formData.type === '할당' ? '할당' : '반납'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 