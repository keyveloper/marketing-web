import './App.css'
import Image12Slider from './components/Image12Slider.jsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // ✅ ← 이거 추가!
import {
  getImageUrlsByAdId
} from './api/imageApis.js'
import { getCurrentUser } from 'aws-amplify/auth'
import { logoutUser } from './services/auth'
import './config/cognito'

function App() {
  // 🎮 Controller
  const navigate = useNavigate()

  // main List: cut 12 items
  const [freshAdImageUrl , setFreshAdImageUrl] = useState([])

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('🟦 getImageUrlsByAdId 호출 중...')
        const res = await getImageUrlsByAdId(249)

        // ✅ presignedUrl만 추출
        const urls = res?.result?.map(item => item.presignedUrl) || []

        console.log('✅ 추출된 presignedUrl 리스트:', urls)
        setFreshAdImageUrl(urls)
      } catch (error) {
        console.error('❌ 이미지 로드 실패:', error)
      }
    }

    fetchImages()
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
  const handleWriteClick = () => {
    // TODO: 글쓰기 페이지로 이동하거나 모달 열기
    console.log('글쓰기 버튼 클릭')
    alert('글쓰기 기능은 곧 구현될 예정입니다!')
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
                <span className="user-info">{user?.username}님</span>
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
            <h1>Hero Section</h1>
            <p>메인 히어로 섹션입니다</p>

            <div className="slider-container">
              <h2 className="slider-title">🆕 최신 등록된</h2>
              <Image12Slider imageUrls={freshAdImageUrl} />
            </div>

            <div className="slider-container">
              <h2 className="slider-title">🔥 인기있는</h2>
              <Image12Slider imageUrls={freshAdImageUrl} />
            </div>

            <div className="slider-container">
              <h2 className="slider-title">⌛ 마감임박</h2>
              <Image12Slider imageUrls={freshAdImageUrl} />
            </div>

            <div className="slider-container">
              <h2 className="slider-title">최신 광고</h2>
              <Image12Slider imageUrls={freshAdImageUrl} />
            </div>

            <div className="slider-container">
              <h2 className="slider-title">특별 광고</h2>
              <Image12Slider imageUrls={freshAdImageUrl} />
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
