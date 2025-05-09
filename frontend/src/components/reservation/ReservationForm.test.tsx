import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationForm } from './ReservationForm';

// Mock API
jest.mock('../../api', () => ({
  reservationApi: {
    create: jest.fn().mockResolvedValue({}),
  },
}));

describe('ReservationForm', () => {
  it('폼 입력 및 예약 생성 성공 시 알림 표시', async () => {
    render(<ReservationForm />);
    fireEvent.change(screen.getByLabelText('시설 ID'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('목적'), { target: { value: '테스트 예약' } });
    fireEvent.click(screen.getByRole('button', { name: /예약하기/i }));
    await waitFor(() => {
      expect(screen.getByText('예약이 생성되었습니다.')).toBeInTheDocument();
    });
  });

  it('반복 예약 체크박스 클릭 시 반복 규칙 입력란 노출', () => {
    render(<ReservationForm />);
    fireEvent.click(screen.getByLabelText('반복 예약'));
    expect(screen.getByLabelText('반복 규칙')).toBeInTheDocument();
  });
}); 