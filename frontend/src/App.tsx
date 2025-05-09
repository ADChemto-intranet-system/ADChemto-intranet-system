import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import { AttendanceList } from './components/attendance/AttendanceList';
import { ReservationForm } from './components/reservation/ReservationForm';
import { ScheduleForm } from './components/schedule/ScheduleForm';
import { AssetHistoryForm } from './components/asset/AssetHistoryForm';
import { ApprovalLineForm } from './components/approval/ApprovalLineForm';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';

// 래퍼 컴포넌트 추가
const AssetHistoryFormWrapper = () => {
  const { assetId } = useParams();
  return <AssetHistoryForm assetId={Number(assetId)} />;
};

const ApprovalLineFormWrapper = () => {
  const { approvalId } = useParams();
  return <ApprovalLineForm approvalId={Number(approvalId)} />;
};

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/attendances"
              element={
                <PrivateRoute>
                  <Layout>
                    <AttendanceList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <PrivateRoute>
                  <Layout>
                    <ReservationForm />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/schedules"
              element={
                <PrivateRoute>
                  <Layout>
                    <ScheduleForm />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/assets/:assetId/history"
              element={
                <PrivateRoute>
                  <Layout>
                    <AssetHistoryFormWrapper />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/approvals/:approvalId/lines"
              element={
                <PrivateRoute>
                  <Layout>
                    <ApprovalLineFormWrapper />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/board"
              element={
                <PrivateRoute>
                  <Layout>
                    <BoardPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 