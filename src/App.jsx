import './App.css'
import { useEffect, useState } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { logoutUser } from './services/auth'
import { issueDraft } from './api/advertisementApi.js'
import './config/cognito'

// Pages
import Home from './pages/Home.jsx'
import Advertisement from './pages/Advertisement.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import CreateAd from './pages/CreateAd.jsx'
import DashboardAdvertiser from './pages/DashboardAdvertiser.jsx'
import DashboardInfluencer from './pages/DashboardInfluencer.jsx'
import CreateProfileAdvertiser from './pages/CreateProfileAdvertiser.jsx'
import CreateProfileInfluencer from './pages/CreateProfileInfluencer.jsx'
import ProfileAdvertiser from './pages/ProfileAdvertiser.jsx'

function App() {
  const navigate = useNavigate()

  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)

  // 인증 상태 확인
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setIsAuthenticated(true)
        console.log('✅ 인증된 사용자:', currentUser)

        // localStorage에 userId 저장
        if (currentUser.userId) {
          localStorage.setItem('userId', currentUser.userId)
        }

        // localStorage에서 userType 가져오기
        const storedUserType = localStorage.getItem('userType')
        setUserType(storedUserType)
        console.log('✅ userType:', storedUserType)
      } catch (error) {
        // 인증되지 않은 상태
        setUser(null)
        setIsAuthenticated(false)
        setUserType(null)
        console.log(`❌ 인증되지 않은 사용자: ${error}`)
      }
    }

    checkAuthState()
  }, [])

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const result = await logoutUser()
      if (result.success) {
        setIsAuthenticated(false)
        setUser(null)
        setUserType(null)
        alert('로그아웃되었습니다.')
      }
    } catch (error) {
      console.error('로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  // 글쓰기 버튼 핸들러
  const handleWriteClick = async () => {
    try {
      console.log('🟦 Draft 발급 요청 중...')
      const result = await issueDraft()

      if (result.success) {
        console.log('✅ Draft 발급 성공, draftId:', result.draftId)
        // draftId를 state로 전달하여 CreateAd 페이지로 이동
        navigate('/create-ad', {
          state: {
            draftId: result.draftId,
            draft: result.draft,
          }
        })
      } else {
        console.error('❌ Draft 발급 실패:', result.error)
        alert(`Draft 발급 실패\n\n${result.error}`)
      }
    } catch (error) {
      console.error('❌ 예상치 못한 오류:', error)
      alert('Draft 발급 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="project-root">
      {/* ===== Header (전체 페이지 공용) ===== */}
      <header className="Header-container">
        <div className="logo" onClick={() => navigate('/')}>Logo</div>
        <nav className="nav-menu">
        </nav>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <button
                className="user-info-btn"
                onClick={() => {
                  const userId = user?.userId || localStorage.getItem('userId')
                  if (userId) {
                    if (userType && userType.startsWith('ADVERTISER')) {
                      navigate(`/dashboard-advertiser/${userId}`)
                    } else if (userType && userType.startsWith('INFLUENCER')) {
                      navigate(`/dashboard-influencer/${userId}`)
                    } else if (userType && userType.startsWith('SERVICER')) {
                      navigate(`/profile-servicer/${userId}`)
                    }
                  }
                }}
              >
                {user?.username}님
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>
                로그인
              </button>
              <button className="signup-btn" onClick={() => navigate('/signup')}>
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      {/* ===== Main (라우팅 영역) ===== */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/advertisement/:id" element={<Advertisement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/create-ad" element={<CreateAd />} />
          <Route path="/dashboard-advertiser/:userId" element={<DashboardAdvertiser />} />
          <Route path="/dashboard-influencer/:userId" element={<DashboardInfluencer />} />
          <Route path="/create-profile-advertiser" element={<CreateProfileAdvertiser />} />
          <Route path="/create-profile-influencer" element={<CreateProfileInfluencer />} />
          <Route path="/profile-advertiser/:userId" element={<ProfileAdvertiser />} />
        </Routes>
      </main>

      {/* ===== Footer (전체 페이지 공용) ===== */}
      <footer className="footer-section">
        <p>Footer - 연락처 및 정보</p>
      </footer>

      {/* ADVERTISER 사용자를 위한 Floating 글쓰기 버튼 */}
      {userType && userType.startsWith('ADVERTISER') && (
        <button
          className="floating-write-btn"
          onClick={handleWriteClick}
          aria-label="글쓰기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      )}
    </div>
  )
}

export default App
