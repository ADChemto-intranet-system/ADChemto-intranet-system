import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { assetApi } from '../../api';

interface Asset {
  id: number;
  name: string;
  category: string;
  status: '사용중' | '대기중' | '수리중' | '폐기';
  purchaseDate: string;
}

export const AssetStatsDashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetApi.getAssets();
        setAssets(response.data.data);
      } catch (error) {
        console.error('자산 목록 조회 실패:', error);
      }
    };
    fetchAssets();
  }, []);

  // 카테고리별 분포
  const categoryCounts = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 상태별 분포
  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 연도별 구매 추이
  const yearCounts = assets.reduce((acc, asset) => {
    const year = new Date(asset.purchaseDate).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const sortedYears = Object.keys(yearCounts).sort();

  // 요약
  const total = assets.length;
  const inUse = statusCounts['사용중'] || 0;
  const waiting = statusCounts['대기중'] || 0;
  const repairing = statusCounts['수리중'] || 0;
  const disposed = statusCounts['폐기'] || 0;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>자산 통계 대시보드</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">총 자산</Typography>
              <Typography variant="h5">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">사용중</Typography>
              <Typography variant="h5" color="success.main">{inUse}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">대기중</Typography>
              <Typography variant="h5" color="info.main">{waiting}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">수리/폐기</Typography>
              <Typography variant="h5" color="error.main">{repairing + disposed}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>카테고리별 자산 분포</Typography>
            <Pie
              data={{
                labels: Object.keys(categoryCounts),
                datasets: [
                  {
                    data: Object.values(categoryCounts),
                    backgroundColor: [
                      '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1'
                    ]
                  }
                ]
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>상태별 자산 분포</Typography>
            <Pie
              data={{
                labels: Object.keys(statusCounts),
                datasets: [
                  {
                    data: Object.values(statusCounts),
                    backgroundColor: [
                      '#388e3c', '#1976d2', '#fbc02d', '#d32f2f'
                    ]
                  }
                ]
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>연도별 자산 구매 추이</Typography>
            <Bar
              data={{
                labels: sortedYears,
                datasets: [
                  {
                    label: '구매 자산 수',
                    data: sortedYears.map((year) => yearCounts[Number(year)]),
                    backgroundColor: '#1976d2'
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: { title: { display: true, text: '구매 연도' } },
                  y: { title: { display: true, text: '자산 수' }, beginAtZero: true }
                }
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 