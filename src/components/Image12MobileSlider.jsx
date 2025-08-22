import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import AdRowCard from './AdRowCard.jsx'
import 'swiper/css'
import 'swiper/css/pagination'
import './Image12MobileSlider.css'

function Image12MobileSlider({ imageUrls = [], adCards = [], onAdClick, likeApi }) {
  // 12개 카드 데이터 준비
  const prepareCardData = () => {
    if (imageUrls.length > 0) {
      return imageUrls.slice(0, 12).map((url, index) => {
        const adCard = adCards[index]
        return adCard ? {
          ...adCard,
          imageUrl: url,
        } : {
          id: index,
          imageUrl: url,
          title: `광고 ${index + 1}`,
          channelType: 'INSTAGRAM',
          reviewType: 'VISIT',
          itemInfo: '상품 정보 없음',
          appliedCount: 0,
          recruitNumber: 10,
        }
      })
    }
    // 샘플 데이터 12개
    return Array.from({ length: 12 }, (_, index) => ({
      id: index,
      imageUrl: null,
      channelType: index % 3 === 0 ? 'YOUTUBE' : index % 2 === 0 ? 'BLOGGER' : 'INSTAGRAM',
      reviewType: index % 3 === 0 ? 'BUY' : index % 2 === 0 ? 'DELIVERY' : 'VISIT',
      title: `샘플 광고 제목 ${index + 1}`,
      itemInfo: '샘플 상품 정보입니다',
      appliedCount: Math.floor(Math.random() * 10),
      recruitNumber: 10,
    }))
  }

  const cardDataList = prepareCardData()

  return (
    <div className="mobile-slider-container">
      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        className="mobile-swiper"
      >
        {cardDataList.map((adData, index) => (
          <SwiperSlide key={index} className="mobile-slide">
            <AdRowCard
              adData={adData}
              onClick={onAdClick}
              likeApi={likeApi}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Image12MobileSlider
