import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Image12Slider from '../components/Image12Slider.jsx'
import AdRowCard from '../components/AdRowCard.jsx'
import {
  getInitFreshAdvertisements,
  getInitDeadlineAdvertisements,
  getInitHotAdvertisements,
} from '../api/advertisementInitApi.js'
import { likeAdvertisement, unlikeAdvertisement } from '../api/likeApi.js'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  // 화면 크기 감지 (768px 이하면 모바일)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // 배너 상태 추적 (마지막으로 호버된 배너 인덱스)
  const [activeBanner, setActiveBanner] = useState(0)

  // 배너 데이터
  const bannerItems = [
    { id: 1, label: 'Item 1', color: '#FFB3BA' },
    { id: 2, label: 'Item 2', color: '#FFDFBA' },
    { id: 3, label: 'Item 3', color: '#FFFFBA' },
    { id: 4, label: 'Item 4', color: '#BAFFC9' },
    { id: 5, label: 'Item 5', color: '#BAE1FF' },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // main List: cut 12 items
  const [freshAdImageUrl, setFreshAdImageUrl] = useState([])
  const [deadlineAdImageUrl, setDeadlineAdImageUrl] = useState([])
  const [hotAdImageUrl, setHotAdImageUrl] = useState([])

  // 광고 카드 전체 데이터 (ID 포함)
  const [freshAdCards, setFreshAdCards] = useState([])
  const [deadlineAdCards, setDeadlineAdCards] = useState([])
  const [hotAdCards, setHotAdCards] = useState([])

  // 초기화 - Fresh & Deadline 광고 데이터 로드
  useEffect(() => {
    const fetchInitAdvertisements = async () => {
      try {
        console.log('🟦 초기화 데이터 로드 중...')

        // Fresh 광고 데이터 로드
        const freshRes = await getInitFreshAdvertisements()
        if (freshRes.success) {
          const cards = freshRes.result?.thumbnailAdCards || []
          setFreshAdCards(cards)
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
          setDeadlineAdCards(cards)
          const deadlineUrls = cards.map(card => card.presignedUrl)
          console.log('✅ Deadline 광고 URLs:', deadlineUrls)
          setDeadlineAdImageUrl(deadlineUrls)
        } else {
          console.error('❌ Deadline 광고 로드 실패:', deadlineRes.error)
        }

        // Hot 광고 데이터 로드
        const hotRes = await getInitHotAdvertisements()
        if (hotRes.success) {
          const cards = hotRes.result?.thumbnailAdCards || []
          setHotAdCards(cards)
          const hotUrls = cards.map(card => card.presignedUrl)
          console.log('✅ Hot 광고 URLs:', hotUrls)
          setHotAdImageUrl(hotUrls)
        } else {
          console.error('❌ Hot 광고 로드 실패:', hotRes.error)
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

  // 좋아요/좋아요 취소 API 호출 핸들러
  const handleLikeApi = async (advertisementId, isLiked) => {
    console.log(`🟦 좋아요 API 호출 - ID: ${advertisementId}, isLiked: ${isLiked}`)

    if (isLiked) {
      // 좋아요 요청
      const result = await likeAdvertisement(advertisementId)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } else {
      // 좋아요 취소 요청
      const result = await unlikeAdvertisement(advertisementId)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    }
  }

  return (
    <>
      {isMobile ? (
        /* 모바일: Swiper 슬라이더 */
        <section className="banner-section-mobile">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="banner-swiper"
          >
            {bannerItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="banner-slide"
                  style={{ backgroundColor: item.color }}
                >
                  <span>{item.label}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ) : (
        /* 데스크톱: 상태 기반 호버 효과 */
        <section className="banner-section">
          {bannerItems.map((item, index) => (
            <div
              key={item.id}
              className={`banner-item ${activeBanner === index ? 'banner-active' : ''}`}
              style={{ backgroundColor: item.color }}
              onMouseEnter={() => setActiveBanner(index)}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </section>
      )}

      <section className="hero-section">
        <div className="hero-content">
          <div className="slider-container">
            <h2 className="slider-title">🆕 최신 등록된</h2>
            {isMobile ? (
              <div className="mobile-card-list">
                {freshAdCards.map((card, index) => (
                  <AdRowCard
                    key={card.advertisementId || index}
                    adData={{
                      ...card,
                      imageUrl: freshAdImageUrl[index],
                    }}
                    onClick={handleAdClick}
                    likeApi={handleLikeApi}
                  />
                ))}
              </div>
            ) : (
              <Image12Slider
                imageUrls={freshAdImageUrl}
                adCards={freshAdCards}
                onAdClick={handleAdClick}
                likeApi={handleLikeApi}
              />
            )}
          </div>

          <div className="slider-container">
            <h2 className="slider-title">🔥 인기있는</h2>
            {isMobile ? (
              <div className="mobile-card-list">
                {hotAdCards.map((card, index) => (
                  <AdRowCard
                    key={card.advertisementId || index}
                    adData={{
                      ...card,
                      imageUrl: hotAdImageUrl[index],
                    }}
                    onClick={handleAdClick}
                    likeApi={handleLikeApi}
                  />
                ))}
              </div>
            ) : (
              <Image12Slider
                imageUrls={hotAdImageUrl}
                adCards={hotAdCards}
                onAdClick={handleAdClick}
                likeApi={handleLikeApi}
              />
            )}
          </div>

          <div className="slider-container">
            <h2 className="slider-title">⌛ 마감임박</h2>
            {isMobile ? (
              <div className="mobile-card-list">
                {deadlineAdCards.map((card, index) => (
                  <AdRowCard
                    key={card.advertisementId || index}
                    adData={{
                      ...card,
                      imageUrl: deadlineAdImageUrl[index],
                    }}
                    onClick={handleAdClick}
                    likeApi={handleLikeApi}
                  />
                ))}
              </div>
            ) : (
              <Image12Slider
                imageUrls={deadlineAdImageUrl}
                adCards={deadlineAdCards}
                onAdClick={handleAdClick}
                likeApi={handleLikeApi}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
