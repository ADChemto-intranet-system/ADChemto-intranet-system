import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Snackbar } from '@mui/material';
import { facilityApi } from '../../api';

interface Facility {
  id: number;
  name: string;
  location: string;
  status: string;
}

export const FacilityDetail: React.FC<{ facilityId: number }> = ({ facilityId }) => {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', status: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const fetchFacility = async () => {
    const response = await facilityApi.get(facilityId);
    setFacility(response.data.data);
    setForm(response.data.data);
  };

  useEffect(() => {
    fetchFacility();
  }, [facilityId]);

  const handleUpdate = async () => {
    await facilityApi.update(facilityId, form);
    setSnackbar({ open: true, message: '시설 정보가 수정되었습니다.' });
    setEdit(false);
    fetchFacility();
  };

  const handleDelete = async () => {
    await facilityApi.delete(facilityId);
    setSnackbar({ open: true, message: '시설이 삭제되었습니다.' });
    // 페이지 이동 등 추가 처리 필요
  };

  const handleExcelDownload = () => {
    // 실제 엑셀 다운로드 API 호출 예시
    window.open(`/api/facilities/${facilityId}/export`, '_blank');
  };

  if (!facility) return <Typography>로딩 중...</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>시설 상세</Typography>
      {edit ? (
        <Box>
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
          <Button variant="contained" onClick={handleUpdate} sx={{ mr: 2 }}>저장</Button>
          <Button onClick={() => setEdit(false)}>취소</Button>
        </Box>
      ) : (
        <Box>
          <Typography>이름: {facility.name}</Typography>
          <Typography>위치: {facility.location}</Typography>
          <Typography>상태: {facility.status}</Typography>
          <Button variant="outlined" sx={{ mt: 2, mr: 2 }} onClick={() => setEdit(true)}>수정</Button>
          <Button color="error" sx={{ mt: 2, mr: 2 }} onClick={handleDelete}>삭제</Button>
          <Button sx={{ mt: 2 }} onClick={handleExcelDownload}>엑셀 다운로드</Button>
        </Box>
      )}
      {/* 시설 이력 조회 컴포넌트 등 추가 가능 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Paper>
  );
}; 