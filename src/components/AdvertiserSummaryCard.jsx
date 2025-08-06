import './AdvertiserSummaryCard.css'

/**
 * 광고주 요약 카드 (1x3 레이아웃)
 * @param {Object} advertiser - 광고주 데이터
 * @param {string} advertiser.advertiserId - 광고주 UUID
 * @param {string} advertiser.advertiserName - 광고주 이름
 * @param {string} advertiser.advertiserProfileImageUrl - 프로필 이미지 URL
 * @param {string} advertiser.serviceInfo - 서비스 정보
 * @param {string} advertiser.locationBrief - 위치 정보
 * @param {Function} onClick - 카드 클릭 핸들러
 */
function AdvertiserSummaryCard({ advertiser, onClick }) {
  const handleClick = () => {
    if (onClick && advertiser?.advertiserId) {
      onClick(advertiser.advertiserId)
    }
  }

  return (
    <div className="advertiser-summary-card" onClick={handleClick}>
      {/* 프로필 이미지 */}
      <div className="advertiser-summary-avatar">
        {(advertiser?.advertiserProfileImageUrl || advertiser?.profileImageUrl) ? (
          <img
            src={advertiser.advertiserProfileImageUrl || advertiser.profileImageUrl}
            alt={advertiser.advertiserName || '광고주'}
          />
        ) : (
          <div className="advertiser-summary-avatar-placeholder">
            {advertiser?.advertiserName?.[0]?.toUpperCase() || 'A'}
          </div>
        )}
      </div>

      {/* 정보 영역 (세로 정렬) */}
      <div className="advertiser-summary-info">
        <span className="advertiser-summary-name">
          {advertiser?.advertiserName || '이름 없음'}
        </span>
        <span className="advertiser-summary-service">
          {advertiser?.serviceInfo || '서비스 정보 없음'}
        </span>
        <span className="advertiser-summary-location">
          {advertiser?.locationBrief || '대한민국 어딘가'}
        </span>
      </div>
    </div>
  )
}

export default AdvertiserSummaryCard
