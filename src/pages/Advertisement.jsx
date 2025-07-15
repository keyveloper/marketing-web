import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import "./Advertisement.css";
import { getAdvertisementById } from '../api/advertisementApi.js';

export default function Advertisement() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 광고 ID 가져오기

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adData, setAdData] = useState(null);

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

  // 로딩 중
  if (loading) {
    return (
      <div className="create-ad-page">
        <div className="create-ad-container">
          <div className="create-ad-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← 뒤로
            </button>
            <h1>광고 상세</h1>
          </div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="create-ad-page">
        <div className="create-ad-container">
          <div className="create-ad-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← 뒤로
            </button>
            <h1>광고 상세</h1>
          </div>
          <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
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
    <div className="create-ad-page">
      <div className="create-ad-container">
        <div className="create-ad-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
          <h1>광고 상세</h1>
        </div>

        <div className="create-ad-form">
          {/* 왼쪽: 이미지 영역 */}
          <section className="form-section-left">
            <h2 className="section-title">이미지</h2>

            {images.length > 0 && (
              <div className="image-preview-swiper">
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {images.map((image, index) => {
                    const isThumbnail = image.isThumbnail;

                    return (
                      <SwiperSlide key={index} style={{ width: '100%', height: '100%' }}>
                        <div
                          className={`preview-item ${isThumbnail ? 'thumbnail' : ''}`}
                        >
                          <img src={image.presignedUrl} alt={`preview-${index}`} />

                          {/* 썸네일 표시 */}
                          {isThumbnail && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                backgroundColor: 'rgba(25, 118, 210, 0.9)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#fff',
                              }}
                            >
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
          <section className="form-section-right">
            {/* 기본 정보 */}
            <div className="form-section">
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
            <div className="form-section">
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
            <div className="form-section">
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
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              목록으로
            </button>
            <button
              type="button"
              className="submit-btn"
            >
              지원하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
