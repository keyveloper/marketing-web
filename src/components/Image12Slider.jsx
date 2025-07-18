import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './Image12Slider.css'

// 남은 일수 계산 함수
const calculateDaysLeft = (recruitmentEndAt) => {
  const now = Date.now()
  const endTime = recruitmentEndAt
  const diffMs = endTime - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return '마감'
  if (diffDays === 0) return '오늘 마감'
  return `D-${diffDays}`
}

function Image12Slider({ imageUrls = [], adCards = [], onAdClick, spaceBetween = 20 }) {
  console.log(`imageUrls: ${imageUrls}`)
  console.log('imageUrls:', Array.isArray(imageUrls), imageUrls)
  console.log('adCards:', adCards)

  return (
    <div className="image-slider-container">
      <Swiper
        modules={[Pagination]}
        spaceBetween={spaceBetween}
        slidesPerView="auto"
        pagination={{ clickable: true }}
        className="hero-swiper"
      >
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => {
            const adCard = adCards[index]
            return (
              <SwiperSlide key={index}>
                <div
                  className="ad-card"
                  onClick={() => adCard && onAdClick && onAdClick(adCard.advertisementId)}
                >
                  {/* 이미지 영역 */}
                  <div className="ad-card-image">
                    <img
                      src={url}
                      alt={adCard?.title || `이미지 ${index + 1}`}
                    />
                  </div>

                  {/* 정보 영역 */}
                  <div className="ad-card-info">
                    {/* channelType, reviewType */}
                    <div className="ad-card-badges">
                      <span className="badge badge-channel">{adCard?.channelType || 'INSTAGRAM'}</span>
                      <span className="badge badge-review">{adCard?.reviewType || 'VISIT'}</span>
                    </div>

                    {/* title */}
                    <h3 className="ad-card-title">{adCard?.title || '제목 없음'}</h3>
                    <br></br>

                    {/* itemInfo */}
                    <p className="ad-card-item-info">{adCard?.itemInfo || '상품 정보 없음'}</p>
                    {/* 하단: 모집 정보 & 남은 일수 */}
                    <div className="ad-card-footer">
                      <span className="ad-card-recruitment">0/10</span>
                      <span className="ad-card-deadline">
                        {adCard?.recruitmentEndAt
                          ? calculateDaysLeft(adCard.recruitmentEndAt)
                          : 'D-7'}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })
        ) : (
          Array.from({ length: 8 }, (_, index) => (
            <SwiperSlide key={index}>
              <div className="ad-card">
                <div className="ad-card-image">
                  <div className="ad-card-placeholder">{index + 1}</div>
                </div>
                <div className="ad-card-info">
                  <div className="ad-card-badges">
                    <span className="badge badge-channel">INSTAGRAM</span>
                    <span className="badge badge-review">VISIT</span>
                  </div>
                  <h3 className="ad-card-title">샘플 제목</h3>
                  <p className="ad-card-item-info">샘플 상품 정보</p>
                  <div className="ad-card-footer">
                    <span className="ad-card-recruitment">0/10</span>
                    <span className="ad-card-deadline">D-7</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  )
}

export default Image12Slider
