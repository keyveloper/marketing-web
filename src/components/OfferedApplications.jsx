import { useState, useEffect } from 'react'
import { getOfferedApplications } from '../api/myAdvertisementApi.js'
import './OfferedApplications.css'

/**
 * 받은 신청 컴포넌트
 */
function OfferedApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  useEffect(() => {
    fetchOfferedApplications()
  }, [])

  const fetchOfferedApplications = async () => {
    try {
      setLoading(true)
      console.log('🟦 받은 신청 목록 조회 중...')

      const result = await getOfferedApplications()
      console.log('🟦 API 응답 전체:', result)
      console.log('🟦 result.result:', result.result)

      if (result.success && result.result) {
        // 실제 API 구조: result.result.offeredApplicationInfos 배열
        const offeredApps = result.result.offeredApplicationInfos || []

        console.log('✅ 받은 신청 목록:', offeredApps)

        // 광고 정보가 각 객체에 직접 포함되어 있으므로 advertisement 객체로 매핑
        const flatApplications = offeredApps.map(app => ({
          ...app,
          advertisement: {
            advertisementId: app.advertisementId,
            title: app.title,
            thumbnailUrl: app.thumbnailUrl,
            reviewType: app.reviewType,
            channelType: app.channelType,
            itemName: app.itemName,
            recruitmentNumber: app.recruitmentNumber,
            recruitmentStartAt: app.recruitmentStartAt,
            recruitmentEndAt: app.recruitmentEndAt,
            reviewStartAt: app.reviewStartAt,
            reviewEndAt: app.reviewEndAt,
          }
        }))

        console.log('✅ 매핑된 신청 목록:', flatApplications)

        // applicationCreatedAt 기준 내림차순 정렬 (최신순)
        flatApplications.sort((a, b) => b.applicationCreatedAt - a.applicationCreatedAt)
        setApplications(flatApplications)
      } else {
        setApplications([])
      }
    } catch (error) {
      console.error('받은 신청 목록 조회 실패:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  // 날짜 포맷
  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 신청 상태 라벨
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return '대기중'
      case 'APPROVED': return '승인'
      case 'REJECTED': return '거절'
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

  // 팝업 닫기
  const closePopup = () => {
    setSelectedApplication(null)
  }

  // 팝업 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target.className === 'offered-popup-overlay') {
      closePopup()
    }
  }

  return (
    <div className="offered-container">
      <h2 className="offered-title">받은 신청</h2>

      {loading ? (
        <div className="offered-loading">
          <p>신청 목록을 불러오는 중...</p>
        </div>
      ) : applications.length > 0 ? (
        <div className="offered-list">
          {applications.map((app, index) => (
            <div
              key={`${app.applicationId}-${index}`}
              className="offered-row"
              onClick={() => setSelectedApplication(app)}
            >
              {/* 썸네일 */}
              <div className="offered-row-thumbnail">
                {app.advertisement?.thumbnailUrl ? (
                  <img src={app.advertisement.thumbnailUrl} alt={app.advertisement.title} />
                ) : (
                  <div className="offered-row-thumbnail-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>

              {/* 광고 제목 */}
              <div className="offered-row-ad-title">
                <span className="offered-row-label">광고</span>
                <span className="offered-row-value">{app.advertisement?.title || '-'}</span>
              </div>

              {/* 신청자 */}
              <div className="offered-row-username">
                <span className="offered-row-label">신청자</span>
                <span className="offered-row-value">{app.influencerUsername || '-'}</span>
              </div>

              {/* 메모 */}
              <div className="offered-row-memo">
                <span className="offered-row-label">메모</span>
                <span className="offered-row-value">{app.applyMemo || '-'}</span>
              </div>

              {/* 상태 */}
              <div className={`offered-row-status offered-status-${app.applicationReviewStatus?.toLowerCase()}`}>
                {getStatusLabel(app.applicationReviewStatus)}
              </div>

              {/* 신청일 */}
              <div className="offered-row-date">
                {formatDate(app.applicationCreatedAt)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="offered-empty">
          <p>받은 신청이 없습니다.</p>
        </div>
      )}

      {/* 상세 팝업 */}
      {selectedApplication && (
        <div className="offered-popup-overlay" onClick={handleOverlayClick}>
          <div className="offered-popup">
            <div className="offered-popup-header">
              <h3>신청서 상세</h3>
              <button className="offered-popup-close" onClick={closePopup}>×</button>
            </div>

            <div className="offered-popup-content">
              {/* 광고 정보 섹션 */}
              <div className="offered-popup-section">
                <h4 className="offered-popup-section-title">광고 정보</h4>

                <div className="offered-popup-ad-header">
                  {selectedApplication.advertisement?.thumbnailUrl && (
                    <img
                      src={selectedApplication.advertisement.thumbnailUrl}
                      alt={selectedApplication.advertisement.title}
                      className="offered-popup-thumbnail"
                    />
                  )}
                  <div className="offered-popup-ad-info">
                    <h5>{selectedApplication.advertisement?.title}</h5>
                    <div className="offered-popup-ad-tags">
                      <span className="offered-popup-tag">
                        {getReviewTypeLabel(selectedApplication.advertisement?.reviewType)}
                      </span>
                      <span className="offered-popup-tag">
                        {getChannelTypeLabel(selectedApplication.advertisement?.channelType)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="offered-popup-field-grid">
                  <div className="offered-popup-field">
                    <label>아이템명</label>
                    <span>{selectedApplication.advertisement?.itemName || '-'}</span>
                  </div>
                  <div className="offered-popup-field">
                    <label>모집인원</label>
                    <span>{selectedApplication.advertisement?.recruitmentNumber || 0}명</span>
                  </div>
                  <div className="offered-popup-field">
                    <label>모집기간</label>
                    <span>
                      {formatDate(selectedApplication.advertisement?.recruitmentStartAt)} ~ {formatDate(selectedApplication.advertisement?.recruitmentEndAt)}
                    </span>
                  </div>
                  <div className="offered-popup-field">
                    <label>리뷰기간</label>
                    <span>
                      {formatDate(selectedApplication.advertisement?.reviewStartAt)} ~ {formatDate(selectedApplication.advertisement?.reviewEndAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 신청자 정보 섹션 */}
              <div className="offered-popup-section">
                <h4 className="offered-popup-section-title">신청자 정보</h4>

                <div className="offered-popup-field-grid">
                  <div className="offered-popup-field">
                    <label>이름</label>
                    <span>{selectedApplication.influencerUsername || '-'}</span>
                  </div>
                  <div className="offered-popup-field">
                    <label>이메일</label>
                    <span>{selectedApplication.influencerEmail || '-'}</span>
                  </div>
                  <div className="offered-popup-field">
                    <label>연락처</label>
                    <span>{selectedApplication.influencerMobile || '-'}</span>
                  </div>
                  <div className="offered-popup-field">
                    <label>신청일</label>
                    <span>{formatDate(selectedApplication.applicationCreatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* 신청 내용 섹션 */}
              <div className="offered-popup-section">
                <h4 className="offered-popup-section-title">신청 내용</h4>

                <div className="offered-popup-field">
                  <label>신청 상태</label>
                  <span className={`offered-popup-status offered-status-${selectedApplication.applicationReviewStatus?.toLowerCase()}`}>
                    {getStatusLabel(selectedApplication.applicationReviewStatus)}
                  </span>
                </div>

                <div className="offered-popup-field offered-popup-field-full">
                  <label>신청 메모</label>
                  <p className="offered-popup-memo">{selectedApplication.applyMemo || '작성된 메모가 없습니다.'}</p>
                </div>
              </div>
            </div>

            <div className="offered-popup-footer">
              <button className="offered-popup-btn offered-popup-btn-secondary" onClick={closePopup}>
                닫기
              </button>
              {selectedApplication.applicationReviewStatus === 'PENDING' && (
                <>
                  <button className="offered-popup-btn offered-popup-btn-reject">
                    거절
                  </button>
                  <button className="offered-popup-btn offered-popup-btn-approve">
                    승인
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OfferedApplications
