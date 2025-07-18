import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getCurrentUser } from 'aws-amplify/auth';
import 'swiper/css';
import 'swiper/css/pagination';
import "./Advertisement.css";
import { getAdvertisementById } from '../api/advertisementApi.js';
import { applyReview, getReviewApplicationsByAdvertisementId } from '../api/reviewApplicationApi.js';

export default function Advertisement() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 광고 ID 가져오기

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adData, setAdData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [reviewMemo, setReviewMemo] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applications, setApplications] = useState([]);

  // 사용자 타입 확인
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const currentUser = await getCurrentUser();
        const attributes = currentUser.signInDetails?.loginId;

        // Cognito의 custom:userType 속성에서 userType 가져오기
        // 또는 다른 방법으로 userType 확인
        // 임시로 localStorage에서 가져오는 방식 사용
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
        console.log('✅ 사용자 타입:', storedUserType);
      } catch (error) {
        console.error('❌ 사용자 타입 확인 실패:', error);
      }
    };

    checkUserType();
  }, []);

  // 광고 데이터 로드
  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (!id) {
        setError('광고 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        console.log(`🟦 광고 상세 조회 중... ID: ${id}`);
        setLoading(true);
        const result = await getAdvertisementById(id);

        if (result.success) {
          console.log('✅ 광고 데이터:', result.result);
          setAdData(result.result);
          setError(null);
        } else {
          console.error('❌ 광고 조회 실패:', result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error('❌ 예상치 못한 오류:', err);
        setError('광고 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id]);

  // 리뷰 신청 목록 로드
  useEffect(() => {
    const fetchApplications = async () => {
      if (!id) return;

      try {
        console.log(`🟦 리뷰 신청 목록 조회 중... 광고 ID: ${id}`);
        const result = await getReviewApplicationsByAdvertisementId(Number(id));

        if (result.success) {
          console.log('✅ 리뷰 신청 목록:', result.applications);
          setApplications(result.applications || []);
        } else {
          console.error('❌ 리뷰 신청 목록 조회 실패:', result.error);
        }
      } catch (err) {
        console.error('❌ 리뷰 신청 목록 조회 중 오류:', err);
      }
    };

    fetchApplications();
  }, [id]);

  // 리뷰 신청 폼 열기
  const handleReviewButtonClick = () => {
    setShowReviewForm(true);
  };

  // 리뷰 신청 완료 핸들러
  const handleReviewSubmit = async () => {
    if (!reviewMemo.trim()) {
      alert('메모를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('🔵 리뷰 신청:', { advertisementId: id, memo: reviewMemo });

      // 리뷰 신청 API 호출
      const result = await applyReview(Number(id), reviewMemo);

      if (result.success) {
        console.log('✅ 리뷰 신청 성공, Application ID:', result.createdApplicationId);
        alert('리뷰 신청이 완료되었습니다!');
        setShowReviewForm(false);
        setReviewMemo('');

        // 리뷰 신청 목록 새로고침
        const applicationsResult = await getReviewApplicationsByAdvertisementId(Number(id));
        if (applicationsResult.success) {
          setApplications(applicationsResult.applications || []);
        }
      } else {
        console.error('❌ 리뷰 신청 실패:', result.error);
        alert(`리뷰 신청 실패\n\n${result.error}`);
      }
    } catch (error) {
      console.error('❌ 리뷰 신청 중 오류:', error);
      alert('리뷰 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 리뷰 신청 폼 닫기
  const handleReviewFormClose = () => {
    if (window.confirm('작성 중인 메모가 삭제됩니다. 취소하시겠습니까?')) {
      setShowReviewForm(false);
      setReviewMemo('');
    }
  };

  // 타임스탬프를 한국 날짜로 포맷
  const formatKoreanDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="view-ad-page">
        <div className="view-ad-container">
          <div className="view-ad-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← 뒤로
            </button>
            <h1>광고 상세</h1>
          </div>
          <div className="loading-message">
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="view-ad-page">
        <div className="view-ad-container">
          <div className="view-ad-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← 뒤로
            </button>
            <h1>광고 상세</h1>
          </div>
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!adData) {
    return null;
  }

  // 데이터 추출
  const advertisement = adData.advertisementWithCategoriesV2;
  const images = adData.advertisementImages || [];

  // 날짜 포맷 함수
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="view-ad-page">
      <div className="view-ad-container">
        <div className="view-ad-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
          <h1>광고 상세</h1>
        </div>

        <div className="view-ad-content">
          {/* 왼쪽: 이미지 영역 */}
          <section className="view-section-left">
            <h2 className="section-title">이미지</h2>

            {images.length > 0 && (
              <div className="image-preview-swiper">
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                >
                  {images.map((image, index) => {
                    const isThumbnail = image.isThumbnail;

                    return (
                      <SwiperSlide key={index}>
                        <div
                          className={`preview-item ${isThumbnail ? 'thumbnail' : ''}`}
                        >
                          <img src={image.presignedUrl} alt={`preview-${index}`} />

                          {/* 썸네일 표시 */}
                          {isThumbnail && (
                            <div className="thumbnail-badge">
                              썸네일
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}
          </section>

          {/* 오른쪽: 광고 정보 */}
          <section className="view-section-right">
            {/* 기본 정보 */}
            <div className="view-section">
              <h2 className="section-title">기본 정보</h2>
              <div className="form-grid">
                <div className="info-display">
                  <span className="info-label">광고 제목</span>
                  <span className="info-value">{advertisement.title}</span>
                </div>

                <div className="info-display">
                  <span className="info-label">상품명</span>
                  <span className="info-value">{advertisement.itemName}</span>
                </div>

                {advertisement.siteUrl && (
                  <div className="info-display">
                    <span className="info-label">사이트 URL</span>
                    <span className="info-value">
                      <a href={advertisement.siteUrl} target="_blank" rel="noopener noreferrer">
                        {advertisement.siteUrl}
                      </a>
                    </span>
                  </div>
                )}

                {advertisement.itemInfo && (
                  <div className="info-display">
                    <span className="info-label">상품 정보</span>
                    <span className="info-value">{advertisement.itemInfo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 모집 정보 */}
            <div className="view-section">
              <h2 className="section-title">모집 정보</h2>
              <div className="form-grid">
                <div className="info-display">
                  <span className="info-label">모집 인원</span>
                  <span className="info-value">{advertisement.recruitmentNumber}명</span>
                </div>

                <div className="info-display">
                  <span className="info-label">채널 타입</span>
                  <span className="info-value">{advertisement.channelType}</span>
                </div>

                <div className="info-display">
                  <span className="info-label">리뷰 타입</span>
                  <span className="info-value">{advertisement.reviewType}</span>
                </div>

                {advertisement.categories && advertisement.categories.length > 0 && (
                  <div className="info-display">
                    <span className="info-label">배송 카테고리</span>
                    <span className="info-value">
                      {advertisement.categories.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 일정 정보 */}
            <div className="view-section">
              <h2 className="section-title">일정 정보</h2>
              <div className="form-grid">
                <div className="info-display">
                  <span className="info-label">모집 시작일</span>
                  <span className="info-value">{formatDate(advertisement.recruitmentStartAt)}</span>
                </div>

                <div className="info-display">
                  <span className="info-label">모집 종료일</span>
                  <span className="info-value">{formatDate(advertisement.recruitmentEndAt)}</span>
                </div>

                <div className="info-display">
                  <span className="info-label">당첨자 발표일</span>
                  <span className="info-value">{formatDate(advertisement.announcementAt)}</span>
                </div>

                <div className="info-display">
                  <span className="info-label">리뷰 시작일</span>
                  <span className="info-value">{formatDate(advertisement.reviewStartAt)}</span>
                </div>

                <div className="info-display">
                  <span className="info-label">리뷰 종료일</span>
                  <span className="info-value">{formatDate(advertisement.reviewEndAt)}</span>
                </div>

                <div className="info-display">
                  <span className="info-label">캠페인 종료일</span>
                  <span className="info-value">{formatDate(advertisement.endAt)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 버튼 영역 */}
          <div className="view-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              목록으로
            </button>
            {userType === 'INFLUENCER' && (
              <button
                type="button"
                className="submit-btn"
                onClick={handleReviewButtonClick}
              >
                리뷰 신청하기
              </button>
            )}
          </div>
        </div>

        {/* 리뷰 신청 목록 */}
        {applications.length > 0 && (
          <section className="review-applications-section">
            <h2 className="section-title">리뷰 신청 목록 ({applications.length})</h2>
            <div className="review-applications-list">
              {applications.map((app) => (
                <div key={app.id} className="review-application-item">
                  {/* 프로필 이미지 플레이스홀더 */}
                  <div className="review-application-avatar">
                    {app.influencerUsername?.[0]?.toUpperCase() || 'U'}
                  </div>

                  {/* 신청 정보 */}
                  <div className="review-application-content">
                    <p className="review-application-username">
                      {app.influencerUsername}
                    </p>
                    <p className="review-application-memo">
                      {app.applyMemo}
                    </p>
                  </div>
                  <span className="review-application-date">
                      {formatKoreanDate(app.createdAt)}
                    </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INFLUENCER 전용: 리뷰 신청 폼 모달 */}
        {userType === 'INFLUENCER' && showReviewForm && (
        <div className="modal-overlay" onClick={handleReviewFormClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">리뷰 신청</h2>

            <div className="modal-form-group">
              <label htmlFor="review-memo" className="modal-label">
                신청 메모 *
              </label>
              <textarea
                id="review-memo"
                className="modal-textarea"
                placeholder="광고주에게 전달할 메모를 작성하세요..."
                value={reviewMemo}
                onChange={(e) => setReviewMemo(e.target.value)}
                rows="6"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleReviewFormClose}
                disabled={isSubmitting}
                className="modal-cancel-btn"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={isSubmitting}
                className="modal-submit-btn"
              >
                {isSubmitting ? '신청 중...' : '리뷰 신청 완료하기'}
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
