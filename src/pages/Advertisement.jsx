import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getCurrentUser } from 'aws-amplify/auth';
import 'swiper/css';
import 'swiper/css/pagination';
import "./Advertisement.css";
import { getAdvertisementById } from '../api/advertisementApi.js';
import { applyReview, getReviewApplicationsByAdvertisementId, getReviewApplicationsWithOwnership } from '../api/reviewApplicationApi.js';
import { getAdvertiserProfileByAdvertisementId } from '../api/profileSummaryApi.js';

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
  const [activeTab, setActiveTab] = useState('detail'); // 'detail', 'applications', 'reviews'
  const [advertiserProfile, setAdvertiserProfile] = useState(null);

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

  // 리뷰 신청 목록 로드 (userType에 따라 다른 API 호출)
  useEffect(() => {
    const fetchApplications = async () => {
      if (!id) return;

      try {
        console.log(`🟦 리뷰 신청 목록 조회 중... 광고 ID: ${id}, userType: ${userType}`);

        let result;
        if (userType === 'INFLUENCER') {
          // INFLUENCER인 경우 소유권 정보 포함 API 호출
          result = await getReviewApplicationsWithOwnership(Number(id));
        } else {
          // 그 외 (ADVERTISER 또는 비로그인)는 open API 호출
          result = await getReviewApplicationsByAdvertisementId(Number(id));
        }

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
  }, [id, userType]);

  // 광고주 프로필 요약 조회
  useEffect(() => {
    const fetchAdvertiserProfile = async () => {
      if (!id) return;

      try {
        console.log(`🟦 광고주 프로필 조회 중... 광고 ID: ${id}`);
        const result = await getAdvertiserProfileByAdvertisementId(Number(id));

        if (result.success) {
          console.log('✅ 광고주 프로필:', result.result);
          setAdvertiserProfile(result.result);
        } else {
          console.error('❌ 광고주 프로필 조회 실패:', result.error);
        }
      } catch (err) {
        console.error('❌ 광고주 프로필 조회 중 오류:', err);
      }
    };

    fetchAdvertiserProfile();
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
      <div className="ad-view-page">
        <div className="ad-view-container">
          <div className="ad-view-header">
            <button className="ad-view-back-btn" onClick={() => navigate(-1)}>
              ← 뒤로
            </button>
            <h1>광고 상세</h1>
          </div>
          <div className="ad-view-loading-message">
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="ad-view-page">
        <div className="ad-view-container">
          <div className="ad-view-header">
            <button className="ad-view-back-btn" onClick={() => navigate(-1)}>
              ← 뒤로
            </button>
            <h1>광고 상세</h1>
          </div>
          <div className="ad-view-error-message">
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

  // 날짜 포맷 함수 (시간 제외)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="ad-view-page">
      <div className="ad-view-container">
        {/* 광고주 프로필 카드 */}
        <div
          className="ad-view-advertiser-card"
          onClick={() => {
            if (advertiserProfile?.advertiserId) {
              navigate(`/profile-advertiser/${advertiserProfile.advertiserId}`);
            }
          }}
        >
          <div className="ad-view-advertiser-avatar">
            {advertiserProfile?.profileImageUrl ? (
              <img src={advertiserProfile.profileImageUrl} alt="프로필" />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="ad-view-advertiser-default-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            )}
          </div>
          <div className="ad-view-advertiser-info">
            <span className="ad-view-advertiser-name">{advertiserProfile?.advertiserName || '광고주 이름'}</span>
            <span className="ad-view-advertiser-service">{advertiserProfile?.serviceInfo || '서비스 정보'}</span>
            <span className="ad-view-advertiser-location">{advertiserProfile?.locationBrief || '대한민국 어딘가'}</span>
          </div>
        </div>

        <div className="ad-view-content">
          {/* 왼쪽: 이미지 영역 */}
          <section className="ad-view-section-left">
            {images.length > 0 && (
              <div className="ad-view-image-preview-swiper">
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
                          className={`ad-view-preview-item ${isThumbnail ? 'ad-view-thumbnail' : ''}`}
                        >
                          <img src={image.presignedUrl} alt={`preview-${index}`} />

                          {/* 썸네일 표시 */}
                          {isThumbnail && (
                            <div className="ad-view-thumbnail-badge">
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
          <section className="ad-view-section-right">
            {/* 제목 */}
            <h2 className="ad-view-title">{advertisement.title}</h2>

            {/* 채널 타입, 리뷰 타입 */}
            <div className="ad-view-badges">
              <span className="ad-view-badge ad-view-badge-channel">{advertisement.channelType}</span>
              <span className="ad-view-badge ad-view-badge-review">{advertisement.reviewType}</span>
            </div>

            {/* 제공내역 */}
            <div className="ad-view-info-display">
              <span className="ad-view-info-label">제공내역</span>
              <span className="ad-view-info-value">{advertisement.itemName}</span>
            </div>

            {/* 모집 인원 */}
            <div className="ad-view-info-display">
              <span className="ad-view-info-label">모집 인원</span>
              <span className="ad-view-info-value">{advertisement.recruitmentNumber}명</span>
            </div>

            {advertisement.itemInfo && (
              <div className="ad-view-info-display">
                <span className="ad-view-info-label">상품 정보</span>
                <span className="ad-view-info-value">{advertisement.itemInfo}</span>
              </div>
            )}

            {advertisement.siteUrl && (
              <div className="ad-view-info-display">
                <span className="ad-view-info-label">사이트 URL</span>
                <span className="ad-view-info-value">
                  <a href={advertisement.siteUrl} target="_blank" rel="noopener noreferrer">
                    {advertisement.siteUrl}
                  </a>
                </span>
              </div>
            )}

            {/* 모집일정 */}
            <div className="ad-view-info-display">
              <span className="ad-view-info-label">모집일정</span>
              <span className="ad-view-info-value">
                {formatDate(advertisement.recruitmentStartAt)} - {formatDate(advertisement.recruitmentEndAt)}
              </span>
            </div>

            {/* 당첨 발표일 */}
            <div className="ad-view-info-display">
              <span className="ad-view-info-label">당첨 발표일</span>
              <span className="ad-view-info-value">{formatDate(advertisement.announcementAt)}</span>
            </div>

            {/* 리뷰일정 */}
            <div className="ad-view-info-display">
              <span className="ad-view-info-label">리뷰일정</span>
              <span className="ad-view-info-value">
                {formatDate(advertisement.reviewStartAt)} - {formatDate(advertisement.reviewEndAt)}
              </span>
            </div>

            {/* 배송 카테고리 (있을 경우) */}
            {advertisement.categories && advertisement.categories.length > 0 && (
              <div className="ad-view-info-display">
                <span className="ad-view-info-label">배송 카테고리</span>
                <span className="ad-view-info-value">
                  {advertisement.categories.join(', ')}
                </span>
              </div>
            )}

            {/* INFLUENCER 전용: 리뷰 신청 버튼 */}
            {userType === 'INFLUENCER' && (
              <button
                className="ad-view-review-apply-btn"
                onClick={handleReviewButtonClick}
              >
                리뷰 신청하기
              </button>
            )}

          </section>
        </div>

        {/* 서브 네비게이션 */}
        <div className="ad-view-sub-nav">
          <button
            className={`ad-view-sub-nav-item ${activeTab === 'detail' ? 'ad-view-sub-nav-active' : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            상세정보
          </button>
          <button
            className={`ad-view-sub-nav-item ${activeTab === 'applications' ? 'ad-view-sub-nav-active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            신청 목록
          </button>
          <button
            className={`ad-view-sub-nav-item ${activeTab === 'reviews' ? 'ad-view-sub-nav-active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            리뷰 현황
          </button>
        </div>

        {/* 탭 콘텐츠 영역 */}
        <div className="ad-view-nav-content">
          {/* 상세정보 탭 */}
          {activeTab === 'detail' && (
            <div className="ad-view-tab-panel">
              <p>상세정보 내용이 여기에 표시됩니다.</p>
            </div>
          )}

          {/* 신청 목록 탭 */}
          {activeTab === 'applications' && (
            <div className="ad-view-tab-panel">
              {applications.length > 0 ? (
                <section className="ad-view-review-applications-section">
                  <h2 className="ad-view-section-title">리뷰 신청 목록 ({applications.length})</h2>
                  <div className="ad-view-review-applications-list">
                    {applications.map((app) => (
                      <div key={app.id} className={`ad-view-review-application-item ${app.isOwner ? 'ad-view-review-application-mine' : ''}`}>
                        {/* 프로필 이미지 플레이스홀더 */}
                        <div className="ad-view-review-application-avatar">
                          {app.influencerUsername?.[0]?.toUpperCase() || 'U'}
                        </div>

                        {/* 신청 정보 */}
                        <div className="ad-view-review-application-content">
                          <p className="ad-view-review-application-username">
                            {app.influencerUsername}
                            {app.isOwner && <span className="ad-view-review-application-mine-badge">내 신청</span>}
                          </p>
                          <p className="ad-view-review-application-memo">
                            {app.applyMemo}
                          </p>
                        </div>
                        <span className="ad-view-review-application-date">
                          {formatKoreanDate(app.createdAt)}
                        </span>
                        {/* isOwner인 경우 수정 아이콘 표시 */}
                        {app.isOwner && (
                          <button className="ad-view-review-application-edit-btn" title="수정">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <p>아직 신청한 리뷰가 없습니다.</p>
              )}
            </div>
          )}

          {/* 리뷰 현황 탭 */}
          {activeTab === 'reviews' && (
            <div className="ad-view-tab-panel">
              <p>리뷰 현황 내용이 여기에 표시됩니다.</p>
            </div>
          )}
        </div>

        {/* INFLUENCER 전용: 리뷰 신청 폼 모달 */}
        {userType === 'INFLUENCER' && showReviewForm && (
        <div className="ad-view-modal-overlay" onClick={handleReviewFormClose}>
          <div className="ad-view-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="ad-view-modal-title">리뷰 신청</h2>

            <div className="ad-view-modal-form-group">
              <label htmlFor="review-memo" className="ad-view-modal-label">
                신청 메모 *
              </label>
              <textarea
                id="review-memo"
                className="ad-view-modal-textarea"
                placeholder="광고주에게 전달할 메모를 작성하세요..."
                value={reviewMemo}
                onChange={(e) => setReviewMemo(e.target.value)}
                rows="6"
              />
            </div>

            <div className="ad-view-modal-actions">
              <button
                type="button"
                onClick={handleReviewFormClose}
                disabled={isSubmitting}
                className="ad-view-modal-cancel-btn"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={isSubmitting}
                className="ad-view-modal-submit-btn"
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
