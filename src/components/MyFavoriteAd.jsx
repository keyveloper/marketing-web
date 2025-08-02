import { useNavigate } from 'react-router-dom'
import './MyFavoriteAd.css'

/**
 * MyFavoriteAd - Pinterest 스타일 좋아요 광고 목록
 * @param {Array} thumbnailAdCards - 광고 카드 리스트
 *   - advertisementId: Long
 *   - presignedUrl: String
 *   - title: String
 *   - itemInfo: String
 *   - channelType: String
 *   - reviewType: String
 *   - recruitNumber: Int
 *   - appliedCount: Int
 *   - recruitmentEndAt: Long
 */
function MyFavoriteAd({ thumbnailAdCards = [] }) {
  const navigate = useNavigate()

  // 카드 클릭 시 광고 상세 페이지로 이동
  const handleCardClick = (advertisementId) => {
    console.log(`🟦 광고 클릭 - ID: ${advertisementId}`)
    navigate(`/advertisement/${advertisementId}`)
  }

  // 레고 블럭 스타일 패턴 (ㄱ, ㄴ 모양 형성)
  // 패턴: 2x1 + 1x1 + 1x1 = ㄱ모양, 1x2 + 1x1 + 1x1 = ㄴ모양
  const getSizeClass = (index) => {
    const pattern = [
      '2x1', '1x1', '1x2',   // ㄱ 모양
      '1x1', '1x1', '2x1',   // ㄴ 모양
      '1x2', '2x1', '1x1',   // 역ㄱ 모양
      '1x1', '3x1', '1x1',   // 가로 긴 블럭
      '2x2', '1x1', '1x1',   // 큰 블럭 + 작은 블럭
      '1x1', '1x1', '1x1',   // 작은 블럭들
    ]
    return pattern[index % pattern.length]
  }

  // 남은 일수 계산
  const calculateDaysLeft = (recruitmentEndAt) => {
    const now = Date.now()
    const diffMs = recruitmentEndAt - now
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return '마감'
    if (diffDays === 0) return '오늘 마감'
    return `D-${diffDays}`
  }

  if (thumbnailAdCards.length === 0) {
    return (
      <div className="myfav-empty">
        <div className="myfav-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
            <path
              fill="#ccc"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
        <h3 className="myfav-empty-title">좋아요한 광고가 없습니다</h3>
        <p className="myfav-empty-desc">마음에 드는 광고에 좋아요를 눌러보세요!</p>
      </div>
    )
  }

  return (
    <div className="myfav-container">
      <div className="myfav-grid">
        {thumbnailAdCards.map((card, index) => {
          const sizeClass = getSizeClass(index)

          return (
            <div
              key={card.advertisementId}
              className={`myfav-card myfav-card-${sizeClass}`}
              onClick={() => handleCardClick(card.advertisementId)}
            >
              {/* 이미지 */}
              <div className="myfav-card-image">
                {card.presignedUrl ? (
                  <img src={card.presignedUrl} alt={card.title} />
                ) : (
                  <div className="myfav-card-placeholder">No Image</div>
                )}

                {/* 오버레이 정보 */}
                <div className="myfav-card-overlay">
                  <div className="myfav-card-badges">
                    <span className="myfav-badge myfav-badge-channel">{card.channelType}</span>
                    <span className="myfav-badge myfav-badge-review">{card.reviewType}</span>
                  </div>
                </div>

                {/* D-Day 배지 */}
                <div className="myfav-card-dday">
                  {calculateDaysLeft(card.recruitmentEndAt)}
                </div>
              </div>

              {/* 카드 정보 */}
              <div className="myfav-card-info">
                <h3 className="myfav-card-title">{card.title}</h3>
                {card.itemInfo && (
                  <p className="myfav-card-item">{card.itemInfo}</p>
                )}
                <div className="myfav-card-footer">
                  <span className="myfav-card-recruit">
                    {card.appliedCount}/{card.recruitNumber}명
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyFavoriteAd
