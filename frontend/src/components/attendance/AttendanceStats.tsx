import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
// 차트 라이브러리 예시: recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { attendanceApi } from '../../api';

interface StatData {
  month: string;
  출근: number;
  지각: number;
  결근: number;
  조퇴: number;
}

export const AttendanceStats: React.FC = () => {
  const [data, setData] = useState<StatData[]>([]);
  const [summary, setSummary] = useState({ total: 0, late: 0, absent: 0, early: 0 });

  const fetchStats = async () => {
    // 실제 API에서 월별 통계 데이터 받아오기
    const response = await attendanceApi.getStats();
    setData(response.data.data.monthly);
    setSummary(response.data.data.summary);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>월별 근태 통계</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="month" />
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
        <Typography>총 출근: {summary.total}회</Typography>
        <Typography>지각: {summary.late}회</Typography>
        <Typography>결근: {summary.absent}회</Typography>
        <Typography>조퇴: {summary.early}회</Typography>
      </Paper>
    </Box>
  );
}; 