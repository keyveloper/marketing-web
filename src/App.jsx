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
import MainAdvertisements from './pages/MainAdvertisements.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import CreateAd from './pages/CreateAd.jsx'
import DashboardAdvertiser from './pages/DashboardAdvertiser.jsx'
import DashboardInfluencer from './pages/DashboardInfluencer.jsx'
import CreateProfileAdvertiser from './pages/CreateProfileAdvertiser.jsx'
import CreateProfileInfluencer from './pages/CreateProfileInfluencer.jsx'
import ProfileAdvertiser from './pages/ProfileAdvertiser.jsx'
import ProfileInfluencer from './pages/ProfileInfluencer.jsx'

function App() {
  const navigate = useNavigate()

  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [isNotiOpen, setIsNotiOpen] = useState(false)
  const [isLogoutMode, setIsLogoutMode] = useState(false)
  const [logoutProgress, setLogoutProgress] = useState(0)

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
        alert('로그아웃되었습니다.')
        // 전체 페이지 새로고침으로 광고 데이터 갱신
        window.location.href = '/'
      }
    } catch (error) {
      console.error('로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  // 메뉴 항목들
  const menuItems = [
    { id: 'write', label: '광고 작성', icon: '✍️', action: async () => {
      try {
        console.log('🟦 Draft 발급 요청 중...')
        const result = await issueDraft()
        if (result.success) {
          console.log('✅ Draft 발급 성공, draftId:', result.draftId)
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
    }},
    { id: 'dashboard', label: '대시보드', icon: '📊', action: () => {
      const userId = user?.userId || localStorage.getItem('userId')
      if (userId && userType) {
        navigate(`/dashboard-advertiser/${userId}`)
      }
    }},
    { id: 'myads', label: '내 광고', icon: '📋', action: () => alert('내 광고 페이지') },
    { id: 'stats', label: '통계', icon: '📈', action: () => alert('통계 페이지') },
    { id: 'messages', label: '메시지', icon: '💬', action: () => alert('메시지 페이지') },
    { id: 'calendar', label: '달력', icon: '📅', action: () => alert('달력 페이지') },
    { id: 'favorites', label: '즐겨찾기', icon: '⭐', action: () => alert('즐겨찾기 페이지') },
    { id: 'settings', label: '설정', icon: '⚙️', action: () => alert('설정 페이지') },
  ]

  // 각도 계산 함수
  const getAngle = (clientX, clientY, centerX, centerY) => {
    const dx = clientX - centerX
    const dy = clientY - centerY
    return Math.atan2(dy, dx) * (180 / Math.PI)
  }

  // 드래그 시작
  const handleDragStart = (e) => {
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = getAngle(e.clientX, e.clientY, centerX, centerY)
    setStartAngle(angle - rotation)
  }

  // 드래그 중
  const handleDragMove = (e) => {
    if (!isDragging) return
    const floatingBtn = document.querySelector('.floating-btn')
    if (!floatingBtn) return
    const rect = floatingBtn.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = getAngle(e.clientX, e.clientY, centerX, centerY)
    setRotation(angle - startAngle)
  }

  // 드래그 종료
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // 휠 스크롤 핸들러 (아래 스크롤 = 왼쪽 회전)
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY
    // 아래로 스크롤(deltaY > 0) = 왼쪽으로 회전(rotation 증가)
    // 위로 스크롤(deltaY < 0) = 오른쪽으로 회전(rotation 감소)
    setRotation(prev => prev + delta * 0.2)
  }

  // 전역 마우스 이벤트
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, startAngle, rotation])

  // floating-hover-area에 wheel 이벤트 등록
  useEffect(() => {
    if (isMenuOpen) {
      const hoverArea = document.querySelector('.floating-hover-area')
      if (hoverArea) {
        hoverArea.addEventListener('wheel', handleWheel, { passive: false })
        return () => {
          hoverArea.removeEventListener('wheel', handleWheel)
        }
      }
    }
  }, [isMenuOpen, rotation])

  // 메뉴 펼치기 애니메이션
  useEffect(() => {
    if (isMenuOpen) {
      setMenuExpanded(false)
      setTimeout(() => setMenuExpanded(true), 50)
    } else {
      setMenuExpanded(false)
    }
  }, [isMenuOpen])

  // 1.4초 호버시 로그아웃 모드 전환
  useEffect(() => {
    let progressInterval = null
    let logoutTimer = null

    if (isMenuOpen && !isLogoutMode) {
      // 프로그레스 애니메이션 (1.4초 동안 0 -> 100)
      const startTime = Date.now()
      const duration = 1400 // 1.4초

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / duration) * 100, 100)
        setLogoutProgress(progress)
      }, 50)

      // 1.4초 후 로그아웃 모드로 전환
      logoutTimer = setTimeout(() => {
        setIsLogoutMode(true)
        setLogoutProgress(100)
      }, duration)
    } else if (!isMenuOpen) {
      // 메뉴 닫히면 리셋
      setIsLogoutMode(false)
      setLogoutProgress(0)
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval)
      if (logoutTimer) clearTimeout(logoutTimer)
    }
  }, [isMenuOpen, isLogoutMode])

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
        <div className="search-container">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="검색..."
          />
        </div>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <button
                className="my-service-btn"
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
                aria-label="내 서비스"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="9" r="3"></circle>
                  <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"></path>
                </svg>
                <span>내 서비스</span>
              </button>
              <button
                className="logout-btn"
                onClick={handleLogout}
                aria-label="로그아웃"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>로그아웃</span>
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
          <Route path="/advertisements" element={<MainAdvertisements />} />
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
          <Route path="/profile-influencer/:userId" element={<ProfileInfluencer />} />
        </Routes>
      </main>

      {/* ===== Footer (전체 페이지 공용) ===== */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-company">
              <h3 className="footer-logo">BRAND NAME</h3>
              <p className="footer-slogan">브랜드와 인플루언서를 연결합니다</p>
            </div>
            <div className="footer-links">
              <div className="footer-link-group">
                <h4>서비스</h4>
                <a href="#">광고 등록</a>
                <a href="#">인플루언서 찾기</a>
                <a href="#">캠페인 관리</a>
              </div>
              <div className="footer-link-group">
                <h4>고객지원</h4>
                <a href="#">자주 묻는 질문</a>
                <a href="#">1:1 문의</a>
                <a href="#">공지사항</a>
              </div>
              <div className="footer-link-group">
                <h4>회사</h4>
                <a href="#">회사 소개</a>
                <a href="#">채용</a>
                <a href="#">블로그</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-info">
              <p>(주)브랜드 이름 | 대표: 000 | 사업자등록번호: 000-00-00000</p>
              <p>서울특별시 강남구 테헤란로 000, 000000</p>
              <p>고객센터: 010-0000-0000 | 이메일: didehdrb21@naver.com</p>
            </div>
            <div className="footer-legal">
              <a href="#">이용약관</a>
              <span>|</span>
              <a href="#">개인정보처리방침</a>
              <span>|</span>
              <a href="#">광고 정책</a>
            </div>
            <p className="footer-copyright">© 2024 ReviewMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ===== Notification Floating Button (Right Middle) - 로그인 시에만 표시 ===== */}
      {isAuthenticated && (
      <div className="noti-floating-container">
        <div
          className="noti-floating-btn"
          onClick={() => setIsNotiOpen(!isNotiOpen)}
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
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>

        {/* Notification Panel */}
        {isNotiOpen && (
          <div className="noti-panel">
            <div className="noti-header">
              <h3>알림</h3>
            </div>
            <div className="noti-list">
              <div className="noti-item">
                <div className="noti-icon">📢</div>
                <div className="noti-content">
                  <p className="noti-title">새로운 광고 신청이 있습니다</p>
                  <p className="noti-time">5분 전</p>
                </div>
              </div>
              <div className="noti-item">
                <div className="noti-icon">✅</div>
                <div className="noti-content">
                  <p className="noti-title">리뷰가 승인되었습니다</p>
                  <p className="noti-time">1시간 전</p>
                </div>
              </div>
              <div className="noti-item">
                <div className="noti-icon">💬</div>
                <div className="noti-content">
                  <p className="noti-title">새로운 메시지가 도착했습니다</p>
                  <p className="noti-time">3시간 전</p>
                </div>
              </div>
              <div className="noti-item">
                <div className="noti-icon">⭐</div>
                <div className="noti-content">
                  <p className="noti-title">광고가 마감되었습니다</p>
                  <p className="noti-time">어제</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* ADVERTISER 사용자를 위한 Floating 버튼 */}
      {userType && userType.startsWith('ADVERTISER') && (
        <div
          className="floating-btn-container"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          {/* 프로그레스 링 */}
          {isMenuOpen && (
            <svg
              className="logout-progress-ring"
              width="84"
              height="84"
              viewBox="0 0 84 84"
            >
              <circle
                className="logout-progress-bg"
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke="rgba(255,180,180,0.6)"
                strokeWidth="12"
              />
              <circle
                className="logout-progress-bar"
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke={isLogoutMode ? "#ef4444" : "#f87171"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - logoutProgress / 100)}`}
                style={{
                  transition: 'stroke 0.3s ease, stroke-dashoffset 0.05s linear',
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center'
                }}
              />
            </svg>
          )}

          <button
            className={`floating-btn ${isLogoutMode ? 'logout-mode' : ''}`}
            onClick={isLogoutMode ? handleLogout : () => {}}
            aria-label={isLogoutMode ? "로그아웃" : "메뉴"}
          >
            {isLogoutMode ? (
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
                className="logout-icon"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            ) : (
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
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            )}
          </button>

          {/* 원형 hover 영역 - floating-menu 포함 */}
          {isMenuOpen && (
            <div className="floating-hover-area">
              <div
                className="floating-menu"
                style={{ transform: `rotate(${rotation}deg)` }}
                onMouseDown={handleDragStart}
              >
                {menuItems.map((item, index) => {
                  const angle = (360 / menuItems.length) * index
                  const radius = 120
                  const x = Math.cos((angle - 90) * Math.PI / 180) * radius
                  const y = Math.sin((angle - 90) * Math.PI / 180) * radius
                  const itemRotation = -rotation

                  return (
                    <button
                      key={item.id}
                      className="floating-menu-item"
                      style={{
                        transform: menuExpanded
                          ? `translate(${x}px, ${y}px) rotate(${itemRotation}deg) scale(1)`
                          : `translate(0px, 0px) rotate(${itemRotation}deg) scale(0.3)`,
                        opacity: menuExpanded ? 1 : 0,
                        transitionDelay: `${index * 0.05}s`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        item.action()
                        setIsMenuOpen(false)
                      }}
                      title={item.label}
                    >
                      <span className="menu-item-icon">{item.icon}</span>
                      <span className="menu-item-label">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
