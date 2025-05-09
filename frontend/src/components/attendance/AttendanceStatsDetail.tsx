import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { attendanceApi } from '../../api';

interface StatData {
  date: string;
  출근: number;
  지각: number;
  결근: number;
  조퇴: number;
}

export const AttendanceStatsDetail: React.FC = () => {
  const [data, setData] = useState<StatData[]>([]);
  const [filters, setFilters] = useState({
    start: '',
    end: '',
    user: '',
    department: '',
  });

  const fetchStats = async () => {
    // 실제 API에서 필터 적용 통계 데이터 받아오기
    const response = await attendanceApi.getStatsDetail(filters);
    setData(response.data.data);
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const handleExcelDownload = () => {
    // 실제 엑셀 다운로드 API 호출 예시
    window.open(`/api/attendance/export?start=${filters.start}&end=${filters.end}&user=${filters.user}&department=${filters.department}`, '_blank');
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>근태 통계 상세</Typography>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="시작일"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.start}
          onChange={(e) => setFilters({ ...filters, start: e.target.value })}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="종료일"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.end}
          onChange={(e) => setFilters({ ...filters, end: e.target.value })}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="사용자"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="부서"
          select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="연구개발팀">연구개발팀</MenuItem>
          <MenuItem value="생산팀">생산팀</MenuItem>
          <MenuItem value="영업팀">영업팀</MenuItem>
        </TextField>
        <Button variant="contained" onClick={fetchStats}>검색</Button>
        <Button onClick={handleExcelDownload}>엑셀 다운로드</Button>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="출근" fill="#1976d2" />
            <Bar dataKey="지각" fill="#ff9800" />
            <Bar dataKey="결근" fill="#e53935" />
            <Bar dataKey="조퇴" fill="#43a047" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">상세 리스트</Typography>
        {/* 실제 상세 리스트 테이블 등 추가 가능 */}
      </Paper>
    </Box>
  );
}; 