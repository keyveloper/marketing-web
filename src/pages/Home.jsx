import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Image12Slider from '../components/Image12Slider.jsx'
import {
  getInitFreshAdvertisements,
  getInitDeadlineAdvertisements,
  getInitHotAdvertisements,
} from '../api/advertisementInitApi.js'
import { likeAdvertisement, unlikeAdvertisement } from '../api/likeApi.js'
import './Home.css'

function Home() {
  const navigate = useNavigate()

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
              likeApi={handleLikeApi}
            />
          </div>

          <div className="slider-container">
            <h2 className="slider-title">🔥 인기있는</h2>
            <Image12Slider
              imageUrls={hotAdImageUrl}
              adCards={hotAdCards}
              onAdClick={handleAdClick}
              likeApi={handleLikeApi}
            />
          </div>

          <div className="slider-container">
            <h2 className="slider-title">⌛ 마감임박</h2>
            <Image12Slider
              imageUrls={deadlineAdImageUrl}
              adCards={deadlineAdCards}
              onAdClick={handleAdClick}
              likeApi={handleLikeApi}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
