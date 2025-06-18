import './App.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useState, useEffect } from 'react'
import { getImages } from './api/imageApis.js'  // API 함수 import

function App() {
  // 상태 관리
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchImages()
  }, [])

  // API 호출 함수
  const fetchImages = async () => {
    try {
      setLoading(true)
      const data = await getImages()  // API 호출
      setImages(data)  // 결과 저장
      setError(null)
    } catch (err) {
      setError('이미지를 불러오는데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
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
            <button className="login-btn">로그인</button>
            <button className="signup-btn">회원가입</button>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-content">
            <h1>Hero Section</h1>
            <p>메인 히어로 섹션입니다</p>

            <div className="hero-grid-container">
              {/* 로딩 중 */}
              {loading && <p>로딩 중...</p>}

              {/* 에러 발생 */}
              {error && <p style={{ color: 'red' }}>{error}</p>}

              {/* 데이터 로드 완료 */}
              {!loading && !error && (
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={20}
                  slidesPerView={'auto'}
                  pagination={{ clickable: true }}
                  className="hero-swiper"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={image.id || index}>
                      <div className="hero-grid-item">
                        <img
                          src={image.url}
                          alt={image.title || `이미지 ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </section>

        <section className="feature-section">
          <h2>Features Section</h2>
          <p>주요 기능 소개 섹션입니다</p>
        </section>

        <footer className="footer-section">
          <p>Footer - 연락처 및 정보</p>
        </footer>
      </div>
    </>
  )
}

export default App