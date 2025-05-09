import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import { approvalApi } from '../../api';

interface ApprovalHistoryItem {
  id: number;
  type: string;
  status: string;
  content: string;
  created_at: string;
  user_name: string;
}

export const ApprovalHistory: React.FC<{ userId: number }> = ({ userId }) => {
  const [history, setHistory] = useState<ApprovalHistoryItem[]>([]);

  const fetchHistory = async () => {
    const response = await approvalApi.getHistory(userId);
    setHistory(response.data.data);
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>결재 이력</Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {history.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={`[${item.type}] ${item.content}`}
                secondary={`상태: ${item.status} / 요청자: ${item.user_name} / 일시: ${item.created_at}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}; 