import { useState, useEffect } from 'react'
import './AdCard.css'

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

// Heart 아이콘 컴포넌트
const HeartIcon = ({ isLiked, onClick }) => {
  return (
    <button
      className="ad-card-heart-btn"
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}
    >
      {isLiked ? (
        <svg
          className="heart-icon heart-filled"
          viewBox="0 0 24 24"
          fill="#e74c3c"
          stroke="#e74c3c"
          strokeWidth="1"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg
          className="heart-icon heart-outline"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#999"
          strokeWidth="1"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>
  )
}

function AdCard({ adData, onClick, onLikeToggle, likeApi, isCompleted = false }) {
  // isLiked 상태: adData.isLiked가 'LIKE'면 true (ThumbnailAdCardWithLikedInfo의 LikeStatus 참고)
  console.log('🔥 AdCard adData:', adData.advertisementId, 'isLiked:', adData.isLiked)
  const [isLiked, setIsLiked] = useState(adData.isLiked === 'LIKE')

  // adData.isLiked가 변경되면 상태 업데이트
  useEffect(() => {
    setIsLiked(adData.isLiked === 'LIKE')
  }, [adData.isLiked])

  const handleLikeClick = async () => {
    if (likeApi) {
      try {
        const newLikeStatus = !isLiked
        await likeApi(adData.advertisementId, newLikeStatus)
        setIsLiked(newLikeStatus)
        onLikeToggle && onLikeToggle(adData.advertisementId, newLikeStatus)
      } catch (error) {
        console.error('좋아요 처리 실패:', error)
      }
    } else {
      // likeApi가 없으면 로컬 상태만 변경
      const newLikeStatus = !isLiked
      setIsLiked(newLikeStatus)
      onLikeToggle && onLikeToggle(adData.advertisementId, newLikeStatus)
    }
  }

  return (
    <div
      className={`ad-card ${isCompleted ? 'ad-card-completed' : ''}`}
      onClick={() => onClick && onClick(adData.advertisementId || adData.id)}
    >
      {/* 이미지 영역 */}
      <div className="ad-card-image">
        {/* Heart 아이콘 - 우측 상단 */}
        <HeartIcon isLiked={isLiked} onClick={handleLikeClick} />
        {adData.imageUrl ? (
          <img
            src={adData.imageUrl}
            alt={adData.title || '광고 이미지'}
          />
        ) : (
          <div className="ad-card-placeholder">{adData.id + 1}</div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="ad-card-info">
        {/* channelType, reviewType */}
        <div className="ad-card-badges">
          <span className="badge badge-channel">{adData.channelType || 'INSTAGRAM'}</span>
          <span className="badge badge-review">{adData.reviewType || 'VISIT'}</span>
        </div>

        {/* title */}
        <h3 className="ad-card-title">{adData.title || '제목 없음'}</h3>
        <br />

        {/* itemInfo */}
        <p className="ad-card-item-info">{adData.itemInfo || '상품 정보 없음'}</p>

        {/* 하단: 모집 정보 & 남은 일수 */}
        <div className="ad-card-footer">
          <span className="ad-card-recruitment">
            {adData.appliedCount ?? 0}/{adData.recruitNumber ?? 10}
          </span>
          <span className="ad-card-deadline">
            {adData.recruitmentEndAt
              ? calculateDaysLeft(adData.recruitmentEndAt)
              : 'D-7'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdCard
