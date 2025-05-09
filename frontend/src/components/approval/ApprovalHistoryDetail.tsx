import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { approvalApi } from '../../api';

interface ApprovalHistoryDetailItem {
  id: number;
  type: string;
  status: string;
  content: string;
  created_at: string;
  user_name: string;
  approver_name: string;
  action: string;
  action_at: string;
}

export const ApprovalHistoryDetail: React.FC<{ approvalId: number }> = ({ approvalId }) => {
  const [history, setHistory] = useState<ApprovalHistoryDetailItem[]>([]);

  const fetchDetail = async () => {
    const response = await approvalApi.getHistoryDetail(approvalId);
    setHistory(response.data.data);
  };

  useEffect(() => {
    fetchDetail();
  }, [approvalId]);

  const handleExcelDownload = () => {
    window.open(`/api/approvals/${approvalId}/history/export`, '_blank');
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>결재 이력 상세</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Button onClick={handleExcelDownload} sx={{ mb: 2 }}>엑셀 다운로드</Button>
        <List>
          {history.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={`[${item.type}] ${item.content}`}
                secondary={`상태: ${item.status} / 요청자: ${item.user_name} / 결재자: ${item.approver_name} / 액션: ${item.action} / 일시: ${item.action_at}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}; 