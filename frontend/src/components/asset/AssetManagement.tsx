import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Edit, Delete, Assignment, History } from '@mui/icons-material';
import { assetApi } from '../../api';
import { ExcelDownloadButton } from '../common/ExcelDownloadButton';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface Asset {
  id: number;
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  status: '사용중' | '대기중' | '수리중' | '폐기';
  assignedTo?: string;
  location?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

interface AssetHistory {
  id: number;
  assetId: number;
  type: '할당' | '반납' | '수리' | '폐기';
  date: string;
  description: string;
  user: string;
}

export const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetHistory, setAssetHistory] = useState<AssetHistory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const snackbar = useSnackbar();

  const fetchAssets = async () => {
    try {
      const response = await assetApi.getAssets();
      setAssets(response.data.data);
    } catch (error) {
      snackbar.showMessage('자산 목록 조회 실패', 'error');
    }
  };

  const fetchAssetHistory = async (assetId: number) => {
    try {
      const response = await assetApi.getAssetHistory(assetId);
      setAssetHistory(response.data.data);
    } catch (error) {
      snackbar.showMessage('자산 이력 조회 실패', 'error');
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpenDialog = (asset?: Asset) => {
    if (asset) {
      setSelectedAsset(asset);
      setFormData(asset);
    } else {
      setSelectedAsset(null);
      setFormData({
        status: '대기중'
      });
    }
    setOpenDialog(true);
  };

  const handleOpenHistoryDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    fetchAssetHistory(asset.id);
    setOpenHistoryDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
    setFormData({});
  };

  const handleCloseHistoryDialog = () => {
    setOpenHistoryDialog(false);
    setSelectedAsset(null);
    setAssetHistory([]);
  };

  const handleSubmit = async () => {
    try {
      if (selectedAsset) {
        await assetApi.updateAsset(selectedAsset.id, formData);
        snackbar.showMessage('자산이 수정되었습니다.', 'success');
      } else {
        await assetApi.createAsset(formData);
        snackbar.showMessage('자산이 등록되었습니다.', 'success');
      }
      handleCloseDialog();
      fetchAssets();
    } catch (error) {
      snackbar.showMessage('자산 저장 실패', 'error');
    }
  };

  const handleDelete = async (assetId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await assetApi.deleteAsset(assetId);
        snackbar.showMessage('자산이 삭제되었습니다.', 'success');
        fetchAssets();
      } catch (error) {
        snackbar.showMessage('자산 삭제 실패', 'error');
      }
    }
  };

  const handleStatusChange = async (assetId: number, newStatus: Asset['status']) => {
    try {
      await assetApi.updateAssetStatus(assetId, newStatus);
      fetchAssets();
    } catch (error) {
      console.error('자산 상태 변경 실패:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '사용중': return 'success';
      case '대기중': return 'info';
      case '수리중': return 'warning';
      case '폐기': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>자산 관리</Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
          >
            새 자산 등록
          </Button>
          <ExcelDownloadButton data={assets} fileName="자산목록" />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>자산명</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell>시리얼 번호</TableCell>
                <TableCell>구매일</TableCell>
                <TableCell>구매가</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>담당자</TableCell>
                <TableCell>위치</TableCell>
                <TableCell>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>{new Date(asset.purchaseDate).toLocaleDateString()}</TableCell>
                  <TableCell>{asset.purchasePrice.toLocaleString()}원</TableCell>
                  <TableCell>
                    <Chip
                      label={asset.status}
                      color={getStatusColor(asset.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{asset.assignedTo || '-'}</TableCell>
                  <TableCell>{asset.location || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="이력 조회">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenHistoryDialog(asset)}
                      >
                        <History />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="수정">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(asset)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="삭제">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAsset ? '자산 수정' : '새 자산 등록'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="자산명"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="카테고리"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="컴퓨터">컴퓨터</MenuItem>
                <MenuItem value="모니터">모니터</MenuItem>
                <MenuItem value="프린터">프린터</MenuItem>
                <MenuItem value="가구">가구</MenuItem>
                <MenuItem value="기타">기타</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="시리얼 번호"
                value={formData.serialNumber || ''}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="구매일"
                value={formData.purchaseDate ? new Date(formData.purchaseDate) : null}
                onChange={(date) => setFormData({ ...formData, purchaseDate: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="구매가"
                value={formData.purchasePrice || ''}
                onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="상태"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Asset['status'] })}
              >
                <MenuItem value="사용중">사용중</MenuItem>
                <MenuItem value="대기중">대기중</MenuItem>
                <MenuItem value="수리중">수리중</MenuItem>
                <MenuItem value="폐기">폐기</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="담당자"
                value={formData.assignedTo || ''}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="위치"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="마지막 점검일"
                value={formData.lastMaintenanceDate ? new Date(formData.lastMaintenanceDate) : null}
                onChange={(date) => setFormData({ ...formData, lastMaintenanceDate: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="다음 점검일"
                value={formData.nextMaintenanceDate ? new Date(formData.nextMaintenanceDate) : null}
                onChange={(date) => setFormData({ ...formData, nextMaintenanceDate: date?.toISOString() })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedAsset ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openHistoryDialog} onClose={handleCloseHistoryDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAsset?.name} 자산 이력
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>일자</TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>설명</TableCell>
                  <TableCell>처리자</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assetHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{new Date(history.date).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={history.type}
                        color={getStatusColor(history.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{history.description}</TableCell>
                    <TableCell>{history.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 