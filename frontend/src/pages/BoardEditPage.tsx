import React, { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';

const BoardEditPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(res.data.title);
        setContent(res.data.content);
        setIsNotice(res.data.is_notice);
      } catch (err) {
        setError('게시글 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/posts/${postId}`,
        {
          title,
          content,
          is_notice: isNotice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate(`/board/${postId}`), 1000);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || '게시글 수정 중 오류가 발생했습니다.'
      );
    }
  };

  if (loading) {
    return <Typography sx={{ mt: 10, textAlign: 'center' }}>로딩 중...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          게시글 수정
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            게시글이 수정되었습니다.
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
              저장
            </Button>
            <Button
              variant="text"
              sx={{ ml: 2 }}
              onClick={() => navigate(`/board/${postId}`)}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BoardEditPage; 