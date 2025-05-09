import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name_kr: '',
    name_en: '',
    department_id: '',
    position_id: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/users/', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
            직원 등록
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              size="medium"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              size="medium"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="name_kr"
              label="한글 이름"
              id="name_kr"
              value={formData.name_kr}
              onChange={handleChange}
              size="medium"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="name_en"
              label="영문 이름"
              id="name_en"
              value={formData.name_en}
              onChange={handleChange}
              size="medium"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              name="department_id"
              label="부서"
              id="department_id"
              value={formData.department_id}
              onChange={handleChange}
              size="medium"
            >
              <MenuItem value="1">연구개발팀</MenuItem>
              <MenuItem value="2">생산팀</MenuItem>
              <MenuItem value="3">영업팀</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              name="position_id"
              label="직위"
              id="position_id"
              value={formData.position_id}
              onChange={handleChange}
              size="medium"
            >
              <MenuItem value="1">사원</MenuItem>
              <MenuItem value="2">대리</MenuItem>
              <MenuItem value="3">과장</MenuItem>
              <MenuItem value="4">차장</MenuItem>
              <MenuItem value="5">부장</MenuItem>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2, py: 1.5 }}
              size="large"
            >
              등록
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  size="large"
                >
                  로그인으로 돌아가기
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage; 