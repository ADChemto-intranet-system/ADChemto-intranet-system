export const useNotification = () => {
  const send = async (userId: number, message: string) => {
    // 실제 알림 API 연동 예시
    // await fetch('/api/notify', {
    //   method: 'POST',
    //   body: JSON.stringify({ userId, message }),
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // 여기서는 콘솔로 대체
    console.log(`알림: 사용자 ${userId} - ${message}`);
  };
  return { send };
}; 