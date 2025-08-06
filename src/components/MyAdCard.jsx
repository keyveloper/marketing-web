import { useNavigate } from 'react-router-dom'
import './MyAdCard.css'

/**
 * 내 광고 카드 컴포넌트
 * @param {object} ad - 광고 정보
 */
function MyAdCard({ ad }) {
  const navigate = useNavigate()

  // 상태별 라벨
  const getStatusLabel = (status) => {
    switch (status) {
      case 'RECRUITING': return '모집중'
      case 'REVIEWING': return '리뷰중'
      case 'CLOSED': return '종료'
      case 'LIVE': return '진행중'
      default: return status
    }
  }

  // 리뷰 타입 라벨
  const getReviewTypeLabel = (type) => {
    switch (type) {
      case 'DELIVERY': return '배송형'
      case 'VISIT': return '방문형'
      case 'BUY': return '구매형'
      default: return type
    }
  }

  // 채널 타입 라벨
  const getChannelTypeLabel = (type) => {
    switch (type) {
      case 'BLOGGER': return '블로그'
      case 'INSTAGRAM': return '인스타그램'
      case 'YOUTUBE': return '유튜브'
      default: return type
    }
  }

  // 날짜 포맷
  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // D-Day 계산
  const getDDay = (timestamp) => {
    if (!timestamp) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(timestamp)
    targetDate.setHours(0, 0, 0, 0)
    const diff = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))

    if (diff === 0) return 'D-Day'
    if (diff > 0) return `D-${diff}`
    return `D+${Math.abs(diff)}`
  }

  const handleClick = () => {
    navigate(`/advertisement/${ad.id}`)
  }

  return (
    <div className="my-ad-card" onClick={handleClick}>
      {/* 썸네일 이미지 */}
      <div className="my-ad-card-thumbnail">
        {ad.thumbnailUrl ? (
          <img src={ad.thumbnailUrl} alt={ad.title} />
        ) : (
          <div className="my-ad-card-thumbnail-placeholder">
            <span>No Image</span>
          </div>
        )}
        {/* 상태 뱃지 */}
        <div className={`my-ad-card-badge my-ad-card-badge-${ad.reviewStatus?.toLowerCase()}`}>
          {getStatusLabel(ad.reviewStatus)}
        </div>
        {/* D-Day 뱃지 */}
        {ad.reviewStatus === 'RECRUITING' && ad.recruitmentEndAt && (
          <div className="my-ad-card-dday">
            {getDDay(ad.recruitmentEndAt)}
          </div>
        )}
      </div>

      {/* 카드 컨텐츠 */}
      <div className="my-ad-card-content">
        {/* 타입 태그 */}
        <div className="my-ad-card-tags">
          <span className="my-ad-card-tag my-ad-card-tag-review">
            {getReviewTypeLabel(ad.reviewType)}
          </span>
          <span className="my-ad-card-tag my-ad-card-tag-channel">
            {getChannelTypeLabel(ad.channelType)}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="my-ad-card-title">{ad.title}</h3>

        {/* 아이템 정보 */}
        <p className="my-ad-card-item">{ad.itemName}</p>

        {/* 모집 정보 */}
        <div className="my-ad-card-recruitment">
          <span className="my-ad-card-recruitment-icon">👥</span>
          <span className="my-ad-card-recruitment-text">모집 {ad.recruitmentNumber}명</span>
        </div>

        {/* 일정 정보 */}
        <div className="my-ad-card-schedule">
          {ad.reviewStatus === 'RECRUITING' && (
            <div className="my-ad-card-schedule-row">
              <span className="my-ad-card-schedule-label">모집기간</span>
              <span className="my-ad-card-schedule-value">
                {formatDate(ad.recruitmentStartAt)} ~ {formatDate(ad.recruitmentEndAt)}
              </span>
            </div>
          )}
          {ad.reviewStatus === 'REVIEWING' && (
            <div className="my-ad-card-schedule-row">
              <span className="my-ad-card-schedule-label">리뷰기간</span>
              <span className="my-ad-card-schedule-value">
                {formatDate(ad.reviewStartAt)} ~ {formatDate(ad.reviewEndAt)}
              </span>
            </div>
          )}
          {ad.reviewStatus === 'CLOSED' && (
            <div className="my-ad-card-schedule-row">
              <span className="my-ad-card-schedule-label">종료일</span>
              <span className="my-ad-card-schedule-value">
                {formatDate(ad.endAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAdCard
