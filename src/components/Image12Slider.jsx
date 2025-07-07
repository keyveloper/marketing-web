import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

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
                  className="hero-grid-item"
                  onClick={() => adCard && onAdClick && onAdClick(adCard.advertisementId)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={url}
                    alt={`이미지 ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </SwiperSlide>
            )
          })
        ) : (
          Array.from({ length: 8 }, (_, index) => (
            <SwiperSlide key={index}>
              <div className="hero-grid-item">
                <span>{index + 1}</span>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  )
}

export default Image12Slider
