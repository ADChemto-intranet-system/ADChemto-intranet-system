import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import ForumIcon from '@mui/icons-material/Forum';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

const drawerWidth = 220;
const appBarHeight = 64;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 자산 관리 클릭 시 동적 라우팅
  const handleAssetMenuClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/assets', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const assets = res.data;
      if (Array.isArray(assets) && assets.length > 0) {
        navigate(`/assets/${assets[0].id}/history`);
      } else {
        alert('등록된 자산이 없습니다.');
      }
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        alert('자산 데이터가 없습니다. (404)');
      } else {
        alert('자산 목록을 불러오지 못했습니다.');
      }
    }
  };

  const menuItems = [
    { text: '대시보드', icon: <HomeIcon />, path: '/dashboard' },
    { text: '근태 관리', icon: <AssignmentIcon />, path: '/attendances' },
    { text: '예약 관리', icon: <EventIcon />, path: '/reservations' },
    { text: '자산 관리', icon: <BusinessIcon />, onClick: handleAssetMenuClick },
    { text: '게시판', icon: <ForumIcon />, path: '/board' },
  ];

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
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
            ADChemTo 인트라넷
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text}
              onClick={item.onClick ? item.onClick : () => item.path && navigate(item.path)}
              selected={item.path ? location.pathname.startsWith(item.path) : false}
            >
              <ListItemIcon sx={{ color: '#1976d2' }}>{item.icon}</ListItemIcon>
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
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
          >
            로그아웃
          </Button>
        </Box>
      </Drawer>

      {/* 상단 AppBar */}
      <AppBar position="fixed" color="default" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: appBarHeight, ml: `${drawerWidth}px` }}>
        <Toolbar sx={{ minHeight: appBarHeight }} />
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: `${appBarHeight}px` }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 