import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import '../config/cognito';

/**
 * Protected Route 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 보호할 컴포넌트
 * @param {string} props.requiredUserType - 필요한 사용자 타입 (예: "ADVERTISER")
 */
export default function ProtectedRoute({ children, requiredUserType }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 인증 상태 확인
        await getCurrentUser();
        setIsAuthenticated(true);

        // localStorage에서 userType 가져오기
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);

        console.log('✅ ProtectedRoute - 인증 확인:', storedUserType);
      } catch (error) {
        console.log('❌ ProtectedRoute - 인증되지 않음:', error);
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#7f8c8d'
      }}>
        로딩 중...
      </div>
    );
  }

  // 인증되지 않은 경우 → 로그인 페이지로
  if (!isAuthenticated) {
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to="/login" replace />;
  }

  // 특정 userType이 필요한 경우
  if (requiredUserType) {
    // ADVERTISER로 시작하는지 확인 (ADVERTISER_COMMON, ADVERTISER_PREMIUM 등)
    const hasAccess = userType && userType.startsWith(requiredUserType);

    if (!hasAccess) {
      alert('광고주만 접근 가능한 페이지입니다.');
      return <Navigate to="/" replace />;
    }
  }

  // 모든 조건 통과 → 컴포넌트 렌더링
  return children;
}
