import './App.css'
import Image12Slider from './components/Image12Slider.jsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // ✅ ← 이거 추가!
import { getCurrentUser } from 'aws-amplify/auth'
import { logoutUser } from './services/auth'
import {
  issueDraft,
  getInitFreshAdvertisements,
  getInitDeadlineAdvertisements,
  getAdvertisementById
} from './api/advertisementApi.js'
import './config/cognito'

function App() {
  // 🎮 Controller
  const navigate = useNavigate()

  // main List: cut 12 items
  const [freshAdImageUrl , setFreshAdImageUrl] = useState([])
  const [deadlineAdImageUrl, setDeadlineAdImageUrl] = useState([])

  // 광고 카드 전체 데이터 (ID 포함)
  const [freshAdCards, setFreshAdCards] = useState([])
  const [deadlineAdCards, setDeadlineAdCards] = useState([])

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

  // 초기화 - Fresh & Deadline 광고 데이터 로드
  useEffect(() => {
    const fetchInitAdvertisements = async () => {
      try {
        console.log('🟦 초기화 데이터 로드 중...')

        // Fresh 광고 데이터 로드
        const freshRes = await getInitFreshAdvertisements()
        if (freshRes.success) {
          const cards = freshRes.result?.thumbnailAdCards || []
          // 전체 카드 데이터 저장 (ID 포함)
          setFreshAdCards(cards)
          // presignedUrl만 추출하여 imageUrls에 저장
          const freshUrls = cards.map(card => card.presignedUrl)
          console.log('✅ Fresh 광고 URLs:', freshUrls)
          setFreshAdImageUrl(freshUrls)
        } else {
          console.error('❌ Fresh 광고 로드 실패:', freshRes.error)
        }

        // Deadline 광고 데이터 로드
        const deadlineRes = await getInitDeadlineAdvertisements()
        if (deadlineRes.success) {
          const cards = deadlineRes.result?.thumbnailAdCards || []
          // 전체 카드 데이터 저장 (ID 포함)
          setDeadlineAdCards(cards)
          // presignedUrl만 추출하여 imageUrls에 저장
          const deadlineUrls = cards.map(card => card.presignedUrl)
          console.log('✅ Deadline 광고 URLs:', deadlineUrls)
          setDeadlineAdImageUrl(deadlineUrls)
        } else {
          console.error('❌ Deadline 광고 로드 실패:', deadlineRes.error)
        }
      } catch (error) {
        console.error('❌ 초기화 데이터 로드 실패:', error)
      }
    }

    fetchInitAdvertisements()
  }, [])

  // 광고 클릭 핸들러
  const handleAdClick = (advertisementId) => {
    console.log(`🟦 광고 클릭 - ID: ${advertisementId}`)
    navigate(`/advertisement/${advertisementId}`)
  }

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
    <>
      <div className="project-root">
        <header className="Header-container">
          <div className="logo">Logo</div>
          <nav className="nav-menu">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
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

        <section className="banner-section">
          <div className="banner-item banner-item-1">
            <span>Item 1</span>
          </div>
          <div className="banner-item banner-item-2">
            <span>Item 2</span>
          </div>
          <div className="banner-item banner-item-3">
            <span>Item 3</span>
          </div>
          <div className="banner-item banner-item-4">
            <span>Item 4</span>
          </div>
          <div className="banner-item banner-item-5">
            <span>Item 5</span>
          </div>
        </section>

        <section className="hero-section">
          <div className="hero-content">
            <div className="slider-container">
              <h2 className="slider-title">🆕 최신 등록된</h2>
              <Image12Slider
                imageUrls={freshAdImageUrl}
                adCards={freshAdCards}
                onAdClick={handleAdClick}
              />
            </div>

            <div className="slider-container">
              <h2 className="slider-title">🔥 인기있는</h2>
              <Image12Slider
                imageUrls={freshAdImageUrl}
                adCards={freshAdCards}
                onAdClick={handleAdClick}
              />
            </div>

            <div className="slider-container">
              <h2 className="slider-title">⌛ 마감임박</h2>
              <Image12Slider
                imageUrls={deadlineAdImageUrl}
                adCards={deadlineAdCards}
                onAdClick={handleAdClick}
              />
            </div>
          </div>
        </section>


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
    </>
  )
}

export default App
