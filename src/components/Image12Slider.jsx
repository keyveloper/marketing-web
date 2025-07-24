import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import AdCard from './AdCard.jsx'
import 'swiper/css'
import 'swiper/css/pagination'
import './Image12Slider.css'

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
            const adData = adCard ? {
              ...adCard,
              imageUrl: url,
              currentApplicants: 0,
              maxApplicants: 10,
            } : {
              imageUrl: url,
              title: `이미지 ${index + 1}`,
              channelType: 'INSTAGRAM',
              reviewType: 'VISIT',
              itemInfo: '상품 정보 없음',
              currentApplicants: 0,
              maxApplicants: 10,
            }

            return (
              <SwiperSlide key={index}>
                <AdCard adData={adData} onClick={onAdClick} />
              </SwiperSlide>
            )
          })
        ) : (
          Array.from({ length: 8 }, (_, index) => (
            <SwiperSlide key={index}>
              <AdCard
                adData={{
                  id: index,
                  imageUrl: null,
                  channelType: 'INSTAGRAM',
                  reviewType: 'VISIT',
                  title: '샘플 제목',
                  itemInfo: '샘플 상품 정보',
                  currentApplicants: 0,
                  maxApplicants: 10,
                }}
                onClick={onAdClick}
              />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  )
}

export default Image12Slider
