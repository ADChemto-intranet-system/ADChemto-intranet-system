import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  is_notice: boolean;
  created_at: string;
  updated_at: string;
  author_name: string;
  user_id: number;
}

const BoardDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  // 현재 로그인한 사용자 정보(토큰에서 추출 or /auth/me 등으로 받아와야 함)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data);
      } catch (err) {
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(res.data.id);
        setIsAdmin(res.data.position === '사장'); // 관리자 여부
      } catch {
        setCurrentUserId(null);
        setIsAdmin(false);
      }
    };
    fetchPost();
    fetchMe();
  }, [postId]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/board');
    } catch (err: any) {
      setDeleteError(err?.response?.data?.detail || '삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <Typography sx={{ mt: 10, textAlign: 'center' }}>로딩 중...</Typography>;
  }
  if (error || !post) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error" sx={{ mt: 5 }}>
          {error || '게시글을 찾을 수 없습니다.'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {post.is_notice ? (
            <Chip label="📢 공지" color="warning" size="small" sx={{ mr: 1 }} />
          ) : (
            <Chip label="💬 커뮤니티" color="primary" size="small" sx={{ mr: 1 }} />
          )}
          <Typography variant="h5">{post.title}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          작성자: {post.author_name} | 작성일: {new Date(post.created_at).toLocaleString()}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
          {post.content}
        </Typography>
        {(isAdmin || currentUserId === post.user_id) && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={() => navigate(`/board/edit/${post.id}`)}>
              수정
            </Button>
            <Button variant="outlined" color="error" onClick={() => setShowDelete(true)}>
              삭제
            </Button>
          </Box>
        )}
        <Button sx={{ mt: 2 }} onClick={() => navigate('/board')}>
          목록으로
        </Button>
        <Dialog open={showDelete} onClose={() => setShowDelete(false)}>
          <DialogTitle>게시글 삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>정말로 이 게시글을 삭제하시겠습니까?</DialogContentText>
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDelete(false)}>취소</Button>
            <Button color="error" onClick={handleDelete}>삭제</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default BoardDetailPage; 