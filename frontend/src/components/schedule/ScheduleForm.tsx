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
import { scheduleApi } from '../../api';
import { Schedule } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ScheduleFormProps {
  onSuccess?: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Schedule>>({
    title: '',
    content: '',
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    type: '',
    shared_with: '',
    is_repeat: false,
    repeat_rule: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scheduleApi.create(formData);
      setSnackbar({ open: true, message: '일정이 생성되었습니다.' });
      onSuccess?.();
    } catch (error) {
      setSnackbar({ open: true, message: '일정 생성에 실패했습니다.' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500 }}>
      <TextField
        fullWidth
        label="제목"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="내용"
        multiline
        rows={4}
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
        label="유형"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="공유대상 (쉼표로 구분)"
        value={formData.shared_with}
        onChange={(e) => setFormData({ ...formData, shared_with: e.target.value })}
        sx={{ mb: 2 }}
      />

      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => setSharedUsers(formData.shared_with?.split(',').map(s => s.trim()).filter(Boolean) || [])}
      >
        공유 대상 적용
      </Button>

      {sharedUsers.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <strong>공유자:</strong> {sharedUsers.join(', ')}
        </Box>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.is_repeat}
            onChange={(e) =>
              setFormData({ ...formData, is_repeat: e.target.checked })
            }
          />
        }
        label="반복 일정"
        sx={{ mb: 2 }}
      />

      {formData.is_repeat && (
        <TextField
          fullWidth
          label="반복 규칙"
          value={formData.repeat_rule}
          onChange={(e) => setFormData({ ...formData, repeat_rule: e.target.value })}
          sx={{ mb: 2 }}
        />
      )}

      <Button type="submit" variant="contained" fullWidth>
        일정 등록
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