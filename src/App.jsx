import './App.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function App() {

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
            <div className="hero-grid-container">
              <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                pagination={{ clickable: true }}
                breakpoints={{
                  600: {
                    slidesPerView: 4,
                  },
                  900: {
                    slidesPerView: 6,
                  },
                  1200: {
                    slidesPerView: 7,
                  },
                }}
                className="hero-swiper"
              >
                <SwiperSlide>
                  <div className="hero-grid-item">1</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-grid-item">2</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-grid-item">3</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-grid-item">4</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-grid-item">5</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-grid-item">6</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-grid-item">7</div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="hero-grid-item">8</div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <h2>Features Section</h2>
          <p>주요 기능 소개 섹션입니다</p>
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
