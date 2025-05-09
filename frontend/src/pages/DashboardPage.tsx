import React, { useEffect, useState } from 'react';
import {
  Box, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Paper, Grid, Card, CardContent, Divider, CircularProgress
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import ForumIcon from '@mui/icons-material/Forum';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const drawerWidth = 300; // 좌측 메뉴바 확장

const menuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/dashboard' },
  { text: '근태 관리', icon: <AssignmentIcon />, path: '/attendances' },
  { text: '예약 관리', icon: <EventIcon />, path: '/reservations' },
  { text: '자산 관리', icon: <BusinessIcon />, path: '/assets' },
  { text: '게시판', icon: <ForumIcon />, path: '/board' },
];

const DashboardPage: React.FC = () => {
  // 실제 데이터 연동 예시 (더미 데이터 or API)
  const [notices, setNotices] = useState([
    { id: 1, title: '시스템 점검 안내', date: '2025-05-10' },
    { id: 2, title: '신규 자산 등록 안내', date: '2025-05-08' },
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, type: '결재', status: '진행중', content: '지출 결재', date: '2025-05-07' },
    { id: 2, type: '예약', status: '대기', content: '회의실 예약', date: '2025-05-06' },
  ]);
  const [posts, setPosts] = useState([
    { id: 1, title: '[공지] 5월 휴무 안내', date: '2025-05-05' },
    { id: 2, title: '[커뮤니티] 점심 메뉴 추천', date: '2025-05-04' },
  ]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 실제 결재 데이터 연동 예시 (API)
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/approvals', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setApprovals(res.data))
      .catch(() => setApprovals([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f7f7' }}>
      {/* 좌측 전체 메뉴 */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#f4f6fa' },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 700 }}>
            ADChemTo 인트라넷
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => window.location.href = item.path}>
              <ListItemIcon sx={{ color: '#333' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 'auto' }} />
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          >
            로그아웃
          </Button>
        </Box>
      </Drawer>

      {/* 메인 컨텐츠 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* 대시보드 위젯/카드 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>공지사항</Typography>
                <Divider sx={{ mb: 1 }} />
                {notices.map((n) => (
                  <Typography key={n.id} variant="body2">- {n.title} ({n.date})</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>업무 현황</Typography>
                <Divider sx={{ mb: 1 }} />
                {tasks.map((t) => (
                  <Typography key={t.id} variant="body2">{t.type}: {t.content} ({t.status})</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>최근 게시물</Typography>
                <Divider sx={{ mb: 1 }} />
                {posts.map((p) => (
                  <Typography key={p.id} variant="body2">- {p.title} ({p.date})</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 하단: 최근 결재 내역 */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>최근 결재 내역</Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : approvals.length > 0 ? (
              approvals.slice(0, 5).map((a: any) => (
                <Typography key={a.id} variant="body2">
                  - {a.created_at?.slice(0, 10)}: {a.type} ({a.status})
                </Typography>
              ))
            ) : (
              <Typography variant="body2">최근 결재 내역이 없습니다.</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage; 