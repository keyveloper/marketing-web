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

  // 샘플 카드 데이터 생성 함수 (fetch 실패 시 사용)
  const generateSampleCards = (count = 4) => {
    return Array.from({ length: count }, (_, index) => ({
      advertisementId: `sample-${index}`,
      imageUrl: null,
      channelType: index % 3 === 0 ? 'YOUTUBE' : index % 2 === 0 ? 'BLOGGER' : 'INSTAGRAM',
      reviewType: index % 3 === 0 ? 'BUY' : index % 2 === 0 ? 'DELIVERY' : 'VISIT',
      title: `샘플 광고 제목 ${index + 1}`,
      itemInfo: '샘플 상품 정보입니다',
      appliedCount: Math.floor(Math.random() * 10),
      recruitNumber: 10,
    }))
  }

  // 배너 데이터 (캠페인 이미지 - Unsplash 상업용)
  const bannerItems = [
    { id: 1, label: '신규 캠페인', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop' },
    { id: 2, label: '인기 브랜드', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=300&fit=crop' },
    { id: 3, label: '특별 프로모션', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop' },
    { id: 4, label: '신규 인플루언서', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop' },
    { id: 5, label: '이벤트 안내', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=300&fit=crop' },
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
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            speed={800}
            loop={true}
            className="banner-swiper"
          >
            {bannerItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="banner-slide">
                  <img src={item.image} alt={item.label} className="banner-image" />
                  <span className="banner-label">{item.label}</span>
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
              onMouseEnter={() => setActiveBanner(index)}
            >
              <img src={item.image} alt={item.label} className="banner-image" />
              <span className="banner-label">{item.label}</span>
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
                {(freshAdCards.length > 0 ? freshAdCards : generateSampleCards()).map((card, index) => (
                  <AdRowCard
                    key={card.advertisementId || index}
                    adData={{
                      ...card,
                      imageUrl: freshAdImageUrl[index] || card.imageUrl,
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
                {(hotAdCards.length > 0 ? hotAdCards : generateSampleCards()).map((card, index) => (
                  <AdRowCard
                    key={card.advertisementId || index}
                    adData={{
                      ...card,
                      imageUrl: hotAdImageUrl[index] || card.imageUrl,
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
                {(deadlineAdCards.length > 0 ? deadlineAdCards : generateSampleCards()).map((card, index) => (
                  <AdRowCard
                    key={card.advertisementId || index}
                    adData={{
                      ...card,
                      imageUrl: deadlineAdImageUrl[index] || card.imageUrl,
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
