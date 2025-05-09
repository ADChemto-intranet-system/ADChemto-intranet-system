import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  is_notice: boolean;
  created_at: string;
  author_name: string;
}

const BOARD_ID = 1; // seed 기준 사내 게시판 id

const BoardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/posts/?board_id=${BOARD_ID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (err) {
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">사내 게시판</Typography>
        <Button variant="contained" onClick={() => navigate('/board/write')}>
          글쓰기
        </Button>
      </Box>
      {error ? (
        <Typography variant="h6" color="error" sx={{ mt: 5 }}>
          {error}
        </Typography>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'auto' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>구분</TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell>작성자</TableCell>
                  <TableCell>작성일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow
                    key={post.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/board/${post.id}`)}
                  >
                    <TableCell>
                      {post.is_notice ? (
                        <Chip label="📢 공지" color="warning" size="small" />
                      ) : (
                        <Chip label="💬 커뮤니티" color="primary" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default BoardPage; 