import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 연동 시 구현
    const token = localStorage.getItem('token');
    if (token) {
      // 임시 사용자 데이터
      setUser({
        id: 1,
        email: 'admin@adchemto.com',
        name: '관리자',
        is_admin: true,
      });
    }
    setLoading(false);
  }, []);

  return { user, loading };
}; 