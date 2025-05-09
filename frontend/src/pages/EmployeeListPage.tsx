import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: number;
  name_kr: string;
  name_en: string;
  email: string;
  department: { name: string };
  position: { name: string };
  phone_number?: string;
}

const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(response.data);
      } catch (err) {
        setError('직원 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error" sx={{ mt: 5 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        직원 목록
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'auto' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름(한글)</TableCell>
                <TableCell>이름(영문)</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>부서</TableCell>
                <TableCell>직위</TableCell>
                <TableCell>전화번호</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
                  <TableCell>{emp.name_kr}</TableCell>
                  <TableCell>{emp.name_en}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.department?.name}</TableCell>
                  <TableCell>{emp.position?.name}</TableCell>
                  <TableCell>{emp.phone_number || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default EmployeeListPage; 