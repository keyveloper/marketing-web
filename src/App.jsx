import './App.css'
import Image12Slider from './components/Image12Slider.jsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // ✅ ← 이거 추가!
import {
  getImageUrlsByAdId
} from './api/imageApis.js'

function App() {
  // 🎮 Controller
  const navigate = useNavigate()

  // main List: cut 12 items
  const [freshAdImageUrl , setFreshAdImageUrl] = useState([])


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
            <button className="login-btn">로그인</button>
            <button className="signup-btn" onClick={() => navigate('/signup')}>
              회원가입
            </button>
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
            <Image12Slider imageUrls={freshAdImageUrl} />
          </div>
        </section>

        <section className="feature-section">
          <h2>Features Section</h2>
          <p>주요 기능 소개 섹션입니다!</p>
        </section>

        <section className="about-section">
          <h2>About Section</h2>
          <p>회사 또는 서비스 소개 섹션입니다</p>
        </section>

        <section className="cta-section">
          <h2>Call to Action</h2>
          <p>행동 유도 섹션입니다</p>
        </section>

        <footer className="footer-section">
          <p>Footer - 연락처 및 정보</p>
        </footer>
      </div>
    </>
  )
}

export default App
