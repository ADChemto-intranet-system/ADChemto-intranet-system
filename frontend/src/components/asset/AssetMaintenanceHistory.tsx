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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { assetApi } from '../../api';
import { ExcelDownloadButton } from '../common/ExcelDownloadButton';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface MaintenanceRecord {
  id: number;
  assetId: number;
  date: string;
  type: '정기점검' | '수리';
  description: string;
  cost: number;
  manager: string;
}

interface Asset {
  id: number;
  name: string;
}

export const AssetMaintenanceHistory: React.FC<{ assetId: number }> = ({ assetId }) => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({ type: '정기점검' });
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const snackbar = useSnackbar();

  const fetchRecords = async () => {
    try {
      const response = await assetApi.getMaintenanceRecords(assetId);
      setRecords(response.data.data);
    } catch (error) {
      snackbar.showMessage('유지보수 이력 조회 실패', 'error');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [assetId]);

  const handleOpenDialog = (record?: MaintenanceRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData(record);
    } else {
      setSelectedRecord(null);
      setFormData({ type: '정기점검' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    setFormData({ type: '정기점검' });
  };

  const handleSubmit = async () => {
    try {
      if (selectedRecord) {
        await assetApi.updateMaintenanceRecord(selectedRecord.id, formData);
        snackbar.showMessage('이력이 수정되었습니다.', 'success');
      } else {
        await assetApi.createMaintenanceRecord(assetId, formData);
        snackbar.showMessage('이력이 등록되었습니다.', 'success');
      }
      handleCloseDialog();
      fetchRecords();
    } catch (error) {
      snackbar.showMessage('유지보수 이력 저장 실패', 'error');
    }
  };

  const handleDelete = async (recordId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await assetApi.deleteMaintenanceRecord(recordId);
        snackbar.showMessage('이력이 삭제되었습니다.', 'success');
        fetchRecords();
      } catch (error) {
        snackbar.showMessage('유지보수 이력 삭제 실패', 'error');
      }
    }
  };

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>유지보수 이력</Typography>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>총 유지보수 비용: {totalCost.toLocaleString()}원</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            이력 등록
          </Button>
          <ExcelDownloadButton data={records} fileName="유지보수이력" />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>일자</TableCell>
                <TableCell>유형</TableCell>
                <TableCell>내용</TableCell>
                <TableCell>비용</TableCell>
                <TableCell>담당자</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.cost?.toLocaleString()}원</TableCell>
                  <TableCell>{record.manager}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleOpenDialog(record)}>수정</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(record.id)}>삭제</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedRecord ? '이력 수정' : '이력 등록'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="일자"
                value={formData.date ? new Date(formData.date) : null}
                onChange={(date) => setFormData({ ...formData, date: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="유형"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceRecord['type'] })}
              >
                <MenuItem value="정기점검">정기점검</MenuItem>
                <MenuItem value="수리">수리</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="내용"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="비용"
                value={formData.cost || ''}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="담당자"
                value={formData.manager || ''}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedRecord ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 