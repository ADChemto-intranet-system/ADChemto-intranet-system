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
  MenuItem,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { facilityApi } from '../../api';

interface MaintenanceRecord {
  id: number;
  facilityId: number;
  facilityName: string;
  type: '점검' | '유지보수' | '수리';
  status: '예정' | '진행중' | '완료' | '지연';
  startDate: string;
  endDate: string;
  description: string;
  assignedTo: string;
  cost?: number;
  notes?: string;
}

export const FacilityMaintenance: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({
    type: '점검',
    status: '예정'
  });

  const fetchRecords = async () => {
    try {
      const response = await facilityApi.getMaintenanceRecords();
      setRecords(response.data.data);
    } catch (error) {
      console.error('유지보수 이력 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleOpenDialog = (record?: MaintenanceRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData(record);
    } else {
      setSelectedRecord(null);
      setFormData({
        type: '점검',
        status: '예정'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      if (!formData.facilityId || !formData.type || !formData.status || !formData.startDate || !formData.endDate || !formData.description || !formData.assignedTo) {
        alert('필수 항목을 모두 입력해 주세요.');
        return;
      }
      if (selectedRecord) {
        await facilityApi.updateMaintenanceRecord(selectedRecord.id, formData);
      } else {
        await facilityApi.createMaintenanceRecord({
          facilityId: formData.facilityId,
          type: formData.type,
          status: formData.status,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
          assignedTo: formData.assignedTo,
          cost: formData.cost,
          notes: formData.notes
        });
      }
      handleCloseDialog();
      fetchRecords();
    } catch (error) {
      console.error('유지보수 기록 저장 실패:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '예정': return 'info';
      case '진행중': return 'warning';
      case '완료': return 'success';
      case '지연': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>시설 점검/유지보수 관리</Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{ mb: 2 }}
        >
          새 점검/유지보수 등록
        </Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>시설명</TableCell>
                <TableCell>유형</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>시작일</TableCell>
                <TableCell>종료일</TableCell>
                <TableCell>담당자</TableCell>
                <TableCell>비용</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.facilityName}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(record.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(record.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{record.assignedTo}</TableCell>
                  <TableCell>{record.cost?.toLocaleString()}원</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(record)}
                    >
                      수정
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord ? '점검/유지보수 수정' : '새 점검/유지보수 등록'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="시설"
                value={formData.facilityId || ''}
                onChange={(e) => setFormData({ ...formData, facilityId: Number(e.target.value) })}
              >
                <MenuItem value={1}>회의실 A</MenuItem>
                <MenuItem value={2}>회의실 B</MenuItem>
                <MenuItem value={3}>교육실</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="유형"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceRecord['type'] })}
              >
                <MenuItem value="점검">점검</MenuItem>
                <MenuItem value="유지보수">유지보수</MenuItem>
                <MenuItem value="수리">수리</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="상태"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MaintenanceRecord['status'] })}
              >
                <MenuItem value="예정">예정</MenuItem>
                <MenuItem value="진행중">진행중</MenuItem>
                <MenuItem value="완료">완료</MenuItem>
                <MenuItem value="지연">지연</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="담당자"
                value={formData.assignedTo || ''}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="시작일"
                value={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(date) => setFormData({ ...formData, startDate: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="종료일"
                value={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(date) => setFormData({ ...formData, endDate: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="설명"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="비고"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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