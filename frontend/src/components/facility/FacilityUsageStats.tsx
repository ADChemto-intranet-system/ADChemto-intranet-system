import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, TextField, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { facilityApi } from '../../api';

interface UsageStats {
  facilityName: string;
  totalReservations: number;
  totalHours: number;
  byTimeSlot: {
    timeSlot: string;
    count: number;
  }[];
  byPurpose: {
    purpose: string;
    count: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const FacilityUsageStats: React.FC = () => {
  const [stats, setStats] = useState<UsageStats[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [period, setPeriod] = useState<string>('week');

  const fetchStats = async () => {
    try {
      const response = await facilityApi.getUsageStats({
        facilityId: selectedFacility === 'all' ? undefined : selectedFacility,
        period
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('통계 데이터 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedFacility, period]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>시설 사용 통계</Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="시설 선택"
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
            >
              <MenuItem value="all">전체 시설</MenuItem>
              <MenuItem value="1">회의실 A</MenuItem>
              <MenuItem value="2">회의실 B</MenuItem>
              <MenuItem value="3">교육실</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="기간"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="week">최근 1주일</MenuItem>
              <MenuItem value="month">최근 1개월</MenuItem>
              <MenuItem value="year">최근 1년</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>시간대별 사용 현황</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats[0]?.byTimeSlot}>
                <XAxis dataKey="timeSlot" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="예약 수" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>용도별 사용 현황</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats[0]?.byPurpose}
                  dataKey="count"
                  nameKey="purpose"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats[0]?.byPurpose.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>시설별 사용 통계</Typography>
            <Grid container spacing={2}>
              {stats.map((stat) => (
                <Grid item xs={12} md={4} key={stat.facilityName}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{stat.facilityName}</Typography>
                      <Typography>총 예약 수: {stat.totalReservations}건</Typography>
                      <Typography>총 사용 시간: {stat.totalHours}시간</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 