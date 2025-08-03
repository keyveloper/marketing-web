import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import AdCard from './AdCard.jsx'
import { getMyApplications } from '../api/myApplicationApi.js'
import './MyReviews.css'

function MyReviews({ onAdClick }) {
  const [activeTab, setActiveTab] = useState('applied') // applied, ongoing, completed, calendar
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)

  // API로 신청 목록 조회
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const result = await getMyApplications()
        if (result.success && result.result?.thumbnailAdCardWithAppliedInfo) {
          // 원본 API 응답을 그대로 저장
          console.log('🔍 원본 API 응답:', result.result.thumbnailAdCardWithAppliedInfo)
          setApplications(result.result.thumbnailAdCardWithAppliedInfo)
        }
      } catch (error) {
        console.error('❌ 내 신청 목록 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // 원본 데이터를 AdCard용으로 변환
  const toAdCardData = (app) => {
    const adInfo = app.thumbnailAdCardLikedInfo || {}
    return {
      advertisementId: adInfo.advertisementId,
      imageUrl: adInfo.presignedUrl,
      channelType: adInfo.channelType,
      reviewType: adInfo.reviewType,
      title: adInfo.title,
      itemInfo: adInfo.itemInfo,
      recruitmentEndAt: adInfo.recruitmentEndAt,
      appliedCount: adInfo.appliedCount,
      recruitNumber: adInfo.recruitNumber,
      isLiked: adInfo.isLiked,
      applyStatus: app.applicationReviewStatus,
    }
  }

  // 현재 탭의 리뷰 데이터 (applicationReviewStatus로 필터링)
  const getCurrentReviews = () => {
    if (activeTab === 'calendar') return []

    // ApplicationReviewStatus: PENDING(0), APPROVED(1), COMPLETED(2)
    switch (activeTab) {
      case 'applied':
        return applications.filter(app => app.applicationReviewStatus === 'PENDING')
      case 'ongoing':
        return applications.filter(app => app.applicationReviewStatus === 'APPROVED')
      case 'completed':
        return applications.filter(app => app.applicationReviewStatus === 'COMPLETED')
      default:
        return applications
    }
  }

  const renderCardGrid = () => {
    if (loading) {
      return (
        <div className="my-reviews-empty">
          <p>불러오는 중...</p>
        </div>
      )
    }

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
        {reviews.map((review) => {
          const adData = toAdCardData(review)
          return (
            <AdCard
              key={adData.advertisementId}
              adData={adData}
              onClick={onAdClick}
              isCompleted={review.applicationReviewStatus === 'COMPLETED'}
            />
          )
        })}
      </div>
    )
  }

  const renderCalendarView = () => {
    // 상태별 색상 매핑
    const getStatusColor = (status) => {
      switch (status) {
        case 'APPROVED':
          return { bg: '#667eea', border: '#667eea' } // 진행중 - 보라
        case 'COMPLETED':
          return { bg: '#9ca3af', border: '#9ca3af' } // 완료 - 회색
        case 'PENDING':
        default:
          return { bg: '#f59e0b', border: '#f59e0b' } // 신청 - 주황
      }
    }

    // timestamp를 YYYY-MM-DD 형식으로 변환
    const formatDate = (timestamp) => {
      if (!timestamp) return null
      const date = new Date(timestamp)
      return date.toISOString().split('T')[0]
    }

    // 원본 applications 데이터를 FullCalendar 이벤트로 변환
    const events = applications
      .filter(app => app.reviewStartAt && app.reviewEndAt) // 리뷰 일정이 있는 것만
      .map(app => {
        const adInfo = app.thumbnailAdCardLikedInfo || {}
        const colors = getStatusColor(app.applicationReviewStatus)
        // FullCalendar에서 end는 exclusive이므로 하루 추가
        const endDate = new Date(app.reviewEndAt)
        endDate.setDate(endDate.getDate() + 1)

        return {
          id: String(adInfo.advertisementId),
          title: adInfo.title,
          start: formatDate(app.reviewStartAt),
          end: endDate.toISOString().split('T')[0],
          backgroundColor: colors.bg,
          borderColor: colors.border,
          extendedProps: {
            status: app.applicationReviewStatus,
            advertisementId: adInfo.advertisementId,
          },
        }
      })

    const handleEventClick = (info) => {
      const adId = info.event.extendedProps.advertisementId
      if (onAdClick) {
        onAdClick(adId)
      }
    }

    return (
      <div className="my-reviews-calendar">
        {/* FullCalendar */}
        <div className="fullcalendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
            locale="ko"
            height="auto"
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkText="개 더보기"
          />
        </div>
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
