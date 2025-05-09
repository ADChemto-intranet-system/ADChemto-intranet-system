import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { facilityApi } from '../../api';

interface Facility {
  id: number;
  name: string;
  location: string;
  status: string;
}

export const FacilityList: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', status: '사용가능' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const fetchFacilities = async () => {
    const response = await facilityApi.getList();
    setFacilities(response.data.data);
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleAdd = async () => {
    await facilityApi.create(form);
    setSnackbar({ open: true, message: '시설이 등록되었습니다.' });
    setOpen(false);
    setForm({ name: '', location: '', status: '사용가능' });
    fetchFacilities();
  };

  const handleDelete = async (id: number) => {
    await facilityApi.delete(id);
    setSnackbar({ open: true, message: '시설이 삭제되었습니다.' });
    fetchFacilities();
  };

  return (
    <Box>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
        시설 등록
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>위치</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.name}</TableCell>
                <TableCell>{f.location}</TableCell>
                <TableCell>{f.status}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(f.id)}>
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>시설 등록</DialogTitle>
        <DialogContent>
          <TextField
            label="이름"
            fullWidth
            sx={{ mb: 2 }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="위치"
            fullWidth
            sx={{ mb: 2 }}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <TextField
            label="상태"
            fullWidth
            sx={{ mb: 2 }}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={handleAdd} variant="contained">등록</Button>
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