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
  MenuItem,
} from '@mui/material';
import { assetApi } from '../../api';
import { AssetHistory, Asset } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface AssetHistoryFormProps {
  assetId: number;
  onSuccess?: () => void;
}

export const AssetHistoryForm: React.FC<AssetHistoryFormProps> = ({
  assetId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<AssetHistory>>({
    action: '',
    memo: '',
  });
  const [histories, setHistories] = useState<AssetHistory[]>([]);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { user } = useAuth();

  const fetchHistories = async () => {
    const response = await assetApi.getHistory(assetId);
    setHistories(response.data.data);
  };

  const fetchAsset = async () => {
    if (!assetApi.getAssetDetail) return;
    try {
      const response = await assetApi.getAssetDetail(assetId);
      setAsset(response.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchHistories();
    fetchAsset();
  }, [assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await assetApi.addHistory(assetId, {
      action: formData.action || '',
      memo: formData.memo || ''
    });
    setSnackbar({ open: true, message: '자산 이력이 추가되었습니다.' });
    fetchHistories();
    onSuccess?.();
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!asset || !assetApi.updateAsset) return;
    const prevStatus = asset.status;
    const newStatus = e.target.value;
    try {
      await assetApi.updateAsset(assetId, { ...asset, status: newStatus });
      setAsset({ ...asset, status: newStatus });
      await assetApi.addHistory(assetId, {
        action: '상태 변경',
        memo: `상태: ${prevStatus} → ${newStatus}`
      });
      setSnackbar({ open: true, message: '자산 상태가 변경되고 이력이 기록되었습니다.' });
      fetchHistories();
    } catch (e) {}
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="액션"
          value={formData.action}
          onChange={(e) => setFormData({ ...formData, action: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="메모"
          multiline
          rows={2}
          value={formData.memo}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" fullWidth>
          이력 추가
        </Button>
      </Box>

      {asset && user?.is_admin && (
        <TextField
          select
          fullWidth
          label="자산 상태"
          value={asset.status}
          onChange={handleStatusChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="사용중">사용중</MenuItem>
          <MenuItem value="점검중">점검중</MenuItem>
          <MenuItem value="폐기">폐기</MenuItem>
        </TextField>
      )}

      <List>
        {histories.map((history) => (
          <ListItem key={history.id}>
            <ListItemText
              primary={history.action}
              secondary={`${history.date ? history.date : ''} - ${history.memo ? history.memo : ''}`}
            />
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