import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { facilityApi } from '../../api';

interface ReservationData {
  id: number;
  facilityName: string;
  userName: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: string;
}

export const FacilityReservationDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchReservations = async () => {
    try {
      const response = await facilityApi.getReservationsByDate(selectedDate);
      setReservations(response.data.data);
    } catch (error) {
      console.error('예약 데이터 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [selectedDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>시설 예약 현황</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <DatePicker<Date>
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {selectedDate.toLocaleDateString()} 예약 현황
            </Typography>
            <Grid container spacing={2}>
              {reservations.map((reservation) => (
                <Grid item xs={12} key={reservation.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{reservation.facilityName}</Typography>
                      <Typography color="textSecondary">
                        예약자: {reservation.userName}
                      </Typography>
                      <Typography>
                        시간: {new Date(reservation.startTime).toLocaleTimeString()} - 
                        {new Date(reservation.endTime).toLocaleTimeString()}
                      </Typography>
                      <Typography>
                        용도: {reservation.purpose}
                      </Typography>
                      <Typography>
                        상태: {reservation.status}
                      </Typography>
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