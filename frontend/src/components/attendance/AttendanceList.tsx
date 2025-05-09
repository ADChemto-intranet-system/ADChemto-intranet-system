import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { attendanceApi } from '../../api';
import { Attendance } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export const AttendanceList: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { user } = useAuth();

  const columns: GridColDef[] = [
    { field: 'date', headerName: '날짜', width: 150 },
    { field: 'status', headerName: '상태', width: 120, renderCell: (params: GridRenderCellParams) => {
      switch (params.value) {
        case 'approved': return '승인';
        case 'rejected': return '반려';
        default: return '대기';
      }
    } },
    {
      field: 'actions',
      headerName: '액션',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          {user?.is_admin && params.row.status !== 'approved' && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleApprove(params.row.id)}
              sx={{ mr: 1 }}
            >
              승인
            </Button>
          )}
          {user?.is_admin && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              수정
            </Button>
          )}
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await attendanceApi.getList();
      setAttendances(response.data.data);
    } catch (error) {
      setSnackbar({ open: true, message: '근태 목록을 불러오는데 실패했습니다.' });
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await attendanceApi.approve(id);
      setSnackbar({ open: true, message: '근태가 승인되었습니다.' });
      fetchAttendances();
    } catch (error) {
      setSnackbar({ open: true, message: '근태 승인에 실패했습니다.' });
    }
  };

  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAttendance(null);
  };

  const handleUpdate = async () => {
    if (!selectedAttendance) return;
    try {
      await attendanceApi.update(selectedAttendance.id, selectedAttendance);
      setSnackbar({ open: true, message: '근태가 수정되었습니다.' });
      handleCloseDialog();
      fetchAttendances();
    } catch (error) {
      setSnackbar({ open: true, message: '근태 수정에 실패했습니다.' });
    }
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={attendances}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>근태 수정</DialogTitle>
        <DialogContent>
          {selectedAttendance && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="상태"
                value={selectedAttendance.status}
                onChange={(e) =>
                  setSelectedAttendance({
                    ...selectedAttendance,
                    status: e.target.value as 'pending' | 'approved' | 'rejected',
                  })
                }
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleUpdate} variant="contained">
            수정
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}; 