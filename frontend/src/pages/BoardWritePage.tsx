import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BOARD_ID = 1;

const BoardWritePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/posts/',
        {
          board_id: BOARD_ID,
          title,
          content,
          is_notice: isNotice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate('/board'), 1000);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || '게시글 작성 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          글쓰기
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            게시글이 등록되었습니다.
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <FormControlLabel
            control={
              <Switch
                checked={isNotice}
                onChange={(e) => setIsNotice(e.target.checked)}
                color="warning"
              />
            }
            label="공지로 등록 (관리자만 가능)"
            sx={{ mb: 2 }}
          />
          <TextField
            label="제목"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="내용"
            fullWidth
            required
            multiline
            minRows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">
              등록
            </Button>
            <Button
              variant="text"
              sx={{ ml: 2 }}
              onClick={() => navigate('/board')}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BoardWritePage; 