import { useState } from 'react'
import './MyReviews.css'

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

function MyReviews({ onAdClick }) {
  const [activeTab, setActiveTab] = useState('applied') // applied, ongoing, completed, calendar

  // Mock 데이터 - 실제로는 API로 가져와야 함
  const mockReviews = {
    applied: [
      {
        id: 1,
        imageUrl: 'https://via.placeholder.com/300',
        channelType: 'INSTAGRAM',
        reviewType: 'VISIT',
        title: '신청한 광고 1',
        itemInfo: '상품 정보 예시',
        recruitmentEndAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
        currentApplicants: 3,
        maxApplicants: 10,
      },
      {
        id: 2,
        imageUrl: 'https://via.placeholder.com/300',
        channelType: 'YOUTUBE',
        reviewType: 'DELIVERY',
        title: '신청한 광고 2',
        itemInfo: '또 다른 상품 정보',
        recruitmentEndAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
        currentApplicants: 7,
        maxApplicants: 15,
      },
    ],
    ongoing: [
      {
        id: 3,
        imageUrl: 'https://via.placeholder.com/300',
        channelType: 'BLOG',
        reviewType: 'VISIT',
        title: '진행 중인 리뷰 1',
        itemInfo: '진행 중인 상품',
        recruitmentEndAt: Date.now() + 10 * 24 * 60 * 60 * 1000,
        currentApplicants: 5,
        maxApplicants: 10,
      },
    ],
    completed: [
      {
        id: 4,
        imageUrl: 'https://via.placeholder.com/300',
        channelType: 'INSTAGRAM',
        reviewType: 'DELIVERY',
        title: '완료된 리뷰 1',
        itemInfo: '완료된 상품 정보',
        recruitmentEndAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        currentApplicants: 10,
        maxApplicants: 10,
      },
    ],
  }

  // 현재 탭의 리뷰 데이터
  const getCurrentReviews = () => {
    if (activeTab === 'calendar') return []
    return mockReviews[activeTab] || []
  }

  const renderCardGrid = () => {
    const reviews = getCurrentReviews()

    if (reviews.length === 0) {
      return (
        <div className="my-reviews-empty">
          <p>리뷰가 없습니다.</p>
        </div>
      )
    }

    return (
      <div className="my-reviews-grid">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="ad-card"
            onClick={() => onAdClick && onAdClick(review.id)}
          >
            {/* 이미지 영역 */}
            <div className="ad-card-image">
              <img src={review.imageUrl} alt={review.title} />
            </div>

            {/* 정보 영역 */}
            <div className="ad-card-info">
              {/* channelType, reviewType */}
              <div className="ad-card-badges">
                <span className="badge badge-channel">{review.channelType}</span>
                <span className="badge badge-review">{review.reviewType}</span>
              </div>

              {/* title */}
              <h3 className="ad-card-title">{review.title}</h3>
              <br />

              {/* itemInfo */}
              <p className="ad-card-item-info">{review.itemInfo}</p>

              {/* 하단: 모집 정보 & 남은 일수 */}
              <div className="ad-card-footer">
                <span className="ad-card-recruitment">
                  {review.currentApplicants}/{review.maxApplicants}
                </span>
                <span className="ad-card-deadline">
                  {calculateDaysLeft(review.recruitmentEndAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderCalendarView = () => {
    return (
      <div className="my-reviews-calendar">
        <p>달력 뷰 (추후 구현)</p>
      </div>
    )
  }

  return (
    <div className="my-reviews-container">
      <h2 className="my-reviews-title">나의 리뷰</h2>

      {/* 탭 네비게이션 */}
      <nav className="my-reviews-nav">
        <button
          className={`my-reviews-tab ${activeTab === 'applied' ? 'active' : ''}`}
          onClick={() => setActiveTab('applied')}
        >
          신청현황
        </button>
        <button
          className={`my-reviews-tab ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          진행중
        </button>
        <button
          className={`my-reviews-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          완료된
        </button>
        <button
          className={`my-reviews-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          달력뷰
        </button>
      </nav>

      {/* 컨텐츠 영역 */}
      <div className="my-reviews-content">
        {activeTab === 'calendar' ? renderCalendarView() : renderCardGrid()}
      </div>
    </div>
  )
}

export default MyReviews
