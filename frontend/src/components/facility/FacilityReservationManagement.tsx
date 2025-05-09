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
  Chip,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { NotificationsActive, NotificationsOff } from '@mui/icons-material';
import { facilityApi } from '../../api';
import { ExcelDownloadButton } from '../common/ExcelDownloadButton';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface Reservation {
  id: number;
  facilityId: number;
  facilityName: string;
  userName: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: '대기' | '승인' | '거절';
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate: string;
  };
  notificationEnabled: boolean;
}

export const FacilityReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [formData, setFormData] = useState<Partial<Reservation>>({
    status: '대기',
    isRecurring: false,
    notificationEnabled: true
  });
  const snackbar = useSnackbar();

  const fetchReservations = async () => {
    try {
      const response = await facilityApi.getReservationsByDate(new Date());
      setReservations(response.data.data);
    } catch (error) {
      snackbar.showMessage('예약 목록 조회 실패', 'error');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleOpenDialog = (reservation?: Reservation) => {
    if (reservation) {
      setSelectedReservation(reservation);
      setFormData(reservation);
    } else {
      setSelectedReservation(null);
      setFormData({
        status: '대기',
        isRecurring: false,
        notificationEnabled: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      if (!formData.facilityId || !formData.startTime || !formData.endTime || !formData.purpose) {
        snackbar.showMessage('필수 항목을 모두 입력해 주세요.', 'warning');
        return;
      }
      if (selectedReservation) {
        await facilityApi.updateReservation(selectedReservation.id, formData);
        snackbar.showMessage('예약이 수정되었습니다.', 'success');
      } else {
        await facilityApi.createReservation({
          facilityId: formData.facilityId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          purpose: formData.purpose,
          isRecurring: formData.isRecurring,
          recurringPattern: formData.isRecurring ? {
            frequency: formData.recurringPattern?.frequency || 'weekly',
            endDate: formData.recurringPattern?.endDate || new Date().toISOString()
          } : undefined,
          notificationEnabled: formData.notificationEnabled
        });
        snackbar.showMessage('예약이 등록되었습니다.', 'success');
      }
      handleCloseDialog();
      fetchReservations();
    } catch (error) {
      snackbar.showMessage('예약 저장 실패', 'error');
    }
  };

  const handleStatusChange = async (reservationId: number, newStatus: '승인' | '거절') => {
    try {
      await facilityApi.updateReservationStatus(reservationId, newStatus);
      snackbar.showMessage('예약 상태가 변경되었습니다.', 'success');
      fetchReservations();
    } catch (error) {
      snackbar.showMessage('예약 상태 변경 실패', 'error');
    }
  };

  const handleNotificationToggle = async (reservationId: number, enabled: boolean) => {
    try {
      await facilityApi.updateReservationNotification(reservationId, enabled);
      snackbar.showMessage('알림 설정이 변경되었습니다.', 'success');
      fetchReservations();
    } catch (error) {
      snackbar.showMessage('알림 설정 변경 실패', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '대기': return 'warning';
      case '승인': return 'success';
      case '거절': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>시설 예약 관리</Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
          >
            새 예약 등록
          </Button>
          <ExcelDownloadButton data={reservations} fileName="시설예약목록" />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>시설명</TableCell>
                <TableCell>예약자</TableCell>
                <TableCell>시작 시간</TableCell>
                <TableCell>종료 시간</TableCell>
                <TableCell>용도</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>반복</TableCell>
                <TableCell>알림</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.facilityName}</TableCell>
                  <TableCell>{reservation.userName}</TableCell>
                  <TableCell>{new Date(reservation.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(reservation.endTime).toLocaleString()}</TableCell>
                  <TableCell>{reservation.purpose}</TableCell>
                  <TableCell>
                    <Chip
                      label={reservation.status}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {reservation.isRecurring ? '반복' : '일회성'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleNotificationToggle(reservation.id, !reservation.notificationEnabled)}
                      color={reservation.notificationEnabled ? 'primary' : 'default'}
                    >
                      {reservation.notificationEnabled ? <NotificationsActive /> : <NotificationsOff />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {reservation.status === '대기' && (
                      <>
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleStatusChange(reservation.id, '승인')}
                          sx={{ mr: 1 }}
                        >
                          승인
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleStatusChange(reservation.id, '거절')}
                        >
                          거절
                        </Button>
                      </>
                    )}
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(reservation)}
                      sx={{ ml: 1 }}
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
          {selectedReservation ? '예약 수정' : '새 예약 등록'}
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
                fullWidth
                label="용도"
                value={formData.purpose || ''}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="시작일"
                value={formData.startTime ? new Date(formData.startTime) : null}
                onChange={(date) => setFormData({ ...formData, startTime: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker
                label="시작 시간"
                value={formData.startTime ? new Date(formData.startTime) : null}
                onChange={(time) => setFormData({ ...formData, startTime: time?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="종료일"
                value={formData.endTime ? new Date(formData.endTime) : null}
                onChange={(date) => setFormData({ ...formData, endTime: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker
                label="종료 시간"
                value={formData.endTime ? new Date(formData.endTime) : null}
                onChange={(time) => setFormData({ ...formData, endTime: time?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRecurring || false}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  />
                }
                label="반복 예약"
              />
            </Grid>
            {formData.isRecurring && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="반복 주기"
                    value={formData.recurringPattern?.frequency || 'weekly'}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurringPattern: {
                        frequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                        endDate: formData.recurringPattern?.endDate || new Date().toISOString()
                      }
                    })}
                  >
                    <MenuItem value="daily">매일</MenuItem>
                    <MenuItem value="weekly">매주</MenuItem>
                    <MenuItem value="monthly">매월</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="반복 종료일"
                    value={formData.recurringPattern?.endDate ? new Date(formData.recurringPattern.endDate) : null}
                    onChange={(date) => setFormData({
                      ...formData,
                      recurringPattern: {
                        frequency: formData.recurringPattern?.frequency || 'weekly',
                        endDate: date?.toISOString() || new Date().toISOString()
                      }
                    })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notificationEnabled || false}
                    onChange={(e) => setFormData({ ...formData, notificationEnabled: e.target.checked })}
                  />
                }
                label="알림 활성화"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedReservation ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 