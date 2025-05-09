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
import { facilityApi } from '../../api';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface InspectionRecord {
  id: number;
  facilityId: number;
  date: string;
  type: '정기' | '수시';
  result: '정상' | '이상';
  inspector: string;
  description: string;
}

export const FacilityInspectionManagement: React.FC<{ facilityId: number }> = ({ facilityId }) => {
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<InspectionRecord>>({ type: '정기', result: '정상' });
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);
  const snackbar = useSnackbar();

  const fetchRecords = async () => {
    try {
      const response = await facilityApi.getInspectionRecords(facilityId);
      setRecords(response.data.data);
    } catch (error) {
      console.error('점검 이력 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [facilityId]);

  const handleOpenDialog = (record?: InspectionRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData(record);
    } else {
      setSelectedRecord(null);
      setFormData({ type: '정기', result: '정상' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    setFormData({ type: '정기', result: '정상' });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.date || !formData.type || !formData.result || !formData.inspector || !formData.description) {
        snackbar.showMessage('필수 항목을 모두 입력해 주세요.', 'warning');
        return;
      }
      if (selectedRecord) {
        await facilityApi.updateInspectionRecord(selectedRecord.id, formData);
      } else {
        await facilityApi.createInspectionRecord(facilityId, {
          date: formData.date,
          type: formData.type,
          result: formData.result,
          inspector: formData.inspector,
          description: formData.description
        });
      }
      handleCloseDialog();
      fetchRecords();
    } catch (error) {
      snackbar.showMessage('점검 이력 저장 실패:', 'error');
    }
  };

  const handleDelete = async (recordId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await facilityApi.deleteInspectionRecord(recordId);
        fetchRecords();
      } catch (error) {
        console.error('점검 이력 삭제 실패:', error);
      }
    }
  };

  // 통계
  const normalCount = records.filter(r => r.result === '정상').length;
  const abnormalCount = records.filter(r => r.result === '이상').length;
  const lastDate = records.length > 0 ? records.map(r => r.date).sort().reverse()[0] : null;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>시설 점검 이력</Typography>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>정상: {normalCount}건 / 이상: {abnormalCount}건 / 최근 점검일: {lastDate ? new Date(lastDate).toLocaleDateString() : '-'}</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
          점검 등록
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>일자</TableCell>
                <TableCell>유형</TableCell>
                <TableCell>결과</TableCell>
                <TableCell>점검자</TableCell>
                <TableCell>내용</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.result}</TableCell>
                  <TableCell>{record.inspector}</TableCell>
                  <TableCell>{record.description}</TableCell>
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
        <DialogTitle>{selectedRecord ? '점검 이력 수정' : '점검 등록'}</DialogTitle>
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
                onChange={(e) => setFormData({ ...formData, type: e.target.value as InspectionRecord['type'] })}
              >
                <MenuItem value="정기">정기</MenuItem>
                <MenuItem value="수시">수시</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="결과"
                value={formData.result || ''}
                onChange={(e) => setFormData({ ...formData, result: e.target.value as InspectionRecord['result'] })}
              >
                <MenuItem value="정상">정상</MenuItem>
                <MenuItem value="이상">이상</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="점검자"
                value={formData.inspector || ''}
                onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="내용"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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