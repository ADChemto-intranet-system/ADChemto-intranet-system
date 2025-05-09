import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { reservationApi } from '../../api';
import { Reservation } from '../../types';

interface ReservationFormProps {
  onSuccess?: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Reservation>>({
    facility_id: 0,
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    purpose: '',
    repeat_rule: '',
  });
  const [isRepeat, setIsRepeat] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        repeat_rule: isRepeat ? formData.repeat_rule : undefined,
      };
      await reservationApi.create(data);
      setSnackbar({ open: true, message: '예약이 생성되었습니다.' });
      onSuccess?.();
    } catch (error) {
      setSnackbar({ open: true, message: '예약 생성에 실패했습니다.' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500 }}>
      <TextField
        fullWidth
        label="시설 ID"
        type="number"
        value={formData.facility_id}
        onChange={(e) =>
          setFormData({ ...formData, facility_id: parseInt(e.target.value) })
        }
        sx={{ mb: 2 }}
      />

      <DateTimePicker
        label="시작 시간"
        value={formData.start_time ? new Date(formData.start_time) : null}
        onChange={(date: Date | null) =>
          setFormData({ ...formData, start_time: date ? date.toISOString() : '' })
        }
        renderInput={(params) => <TextField {...params} sx={{ mb: 2, width: '100%' }} />}
      />

      <DateTimePicker
        label="종료 시간"
        value={formData.end_time ? new Date(formData.end_time) : null}
        onChange={(date: Date | null) =>
          setFormData({ ...formData, end_time: date ? date.toISOString() : '' })
        }
        renderInput={(params) => <TextField {...params} sx={{ mb: 2, width: '100%' }} />}
      />

      <TextField
        fullWidth
        label="목적"
        value={formData.purpose}
        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isRepeat}
            onChange={(e) => setIsRepeat(e.target.checked)}
          />
        }
        label="반복 예약"
        sx={{ mb: 2 }}
      />

      {isRepeat && (
        <TextField
          fullWidth
          label="반복 규칙"
          value={formData.repeat_rule}
          onChange={(e) => setFormData({ ...formData, repeat_rule: e.target.value })}
          sx={{ mb: 2 }}
        />
      )}

      <Button type="submit" variant="contained" fullWidth>
        예약하기
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}; 