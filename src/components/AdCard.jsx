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

function AdCard({ adData, onClick }) {
  return (
    <div className="ad-card" onClick={() => onClick && onClick(adData.advertisementId || adData.id)}>
      {/* 이미지 영역 */}
      <div className="ad-card-image">
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
            {adData.currentApplicants || 0}/{adData.maxApplicants || 10}
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
