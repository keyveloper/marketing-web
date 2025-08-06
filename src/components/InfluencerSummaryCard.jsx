import './InfluencerSummaryCard.css'

/**
 * 인플루언서 요약 카드 (1x2 레이아웃)
 * @param {Object} influencer - 인플루언서 데이터
 * @param {string} influencer.influencerId - 인플루언서 UUID
 * @param {string} influencer.influencerName - 인플루언서 이름
 * @param {string} influencer.influencerProfileImageUrl - 프로필 이미지 URL
 * @param {string} influencer.job - 직업
 * @param {Function} onClick - 카드 클릭 핸들러
 */
function InfluencerSummaryCard({ influencer, onClick }) {
  const handleClick = () => {
    if (onClick && influencer?.influencerId) {
      onClick(influencer.influencerId)
    }
  }

  return (
    <div className="influencer-summary-card" onClick={handleClick}>
      {/* 프로필 이미지 */}
      <div className="influencer-summary-avatar">
        {influencer?.influencerProfileImageUrl ? (
          <img
            src={influencer.influencerProfileImageUrl}
            alt={influencer.influencerName || '인플루언서'}
          />
        ) : (
          <div className="influencer-summary-avatar-placeholder">
            {influencer?.influencerName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* 정보 영역 (세로 정렬) */}
      <div className="influencer-summary-info">
        <span className="influencer-summary-name">
          {influencer?.influencerName || '이름 없음'}
        </span>
        <span className="influencer-summary-job">
          {influencer?.job || '직업 미설정'}
        </span>
      </div>
    </div>
  )
}

export default InfluencerSummaryCard
