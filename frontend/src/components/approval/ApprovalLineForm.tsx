import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { approvalApi } from '../../api';
import { ApprovalLine } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

interface ApprovalLineFormProps {
  approvalId: number;
  onSuccess?: () => void;
}

export const ApprovalLineForm: React.FC<ApprovalLineFormProps> = ({
  approvalId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<ApprovalLine>>({
    approver_id: 0,
    order: 0,
  });
  const [lines, setLines] = useState<ApprovalLine[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { user } = useAuth();
  const { send } = useNotification();

  const fetchLines = async () => {
    if (!approvalApi.getLines) return;
    try {
      const response = await approvalApi.getLines(approvalId);
      setLines(response.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchLines();
  }, [approvalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await approvalApi.addLine(approvalId, formData);
    setSnackbar({ open: true, message: '결재선이 추가되었습니다.' });
    fetchLines();
    onSuccess?.();
  };

  const handleApprove = async (lineId: number) => {
    await approvalApi.approveLine(lineId);
    setSnackbar({ open: true, message: '결재가 승인되었습니다.' });
    if (user) {
      await send(user.id, '결재가 승인되었습니다.');
    }
    fetchLines();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="결재자 ID"
          type="number"
          value={formData.approver_id}
          onChange={(e) =>
            setFormData({ ...formData, approver_id: parseInt(e.target.value) })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="순서"
          type="number"
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) })
          }
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" fullWidth>
          결재선 추가
        </Button>
      </Box>

      <List>
        {lines.map((line) => (
          <ListItem key={line.id}>
            <ListItemText
              primary={`결재자: ${line.approver_id}`}
              secondary={`순서: ${line.order} / 상태: ${line.status}`}
            />
            <ListItemSecondaryAction>
              {line.status === 'pending' && line.approver_id === user?.id && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApprove(line.id)}
                >
                  승인
                </Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}; 