import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import "./Advertisement.css";

export default function Advertisement() {
  const navigate = useNavigate();

  // 샘플 이미지 데이터
  const [imagePreviews] = useState([
    "https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Image+1",
    "https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Image+2",
    "https://via.placeholder.com/800x600/45B7D1/FFFFFF?text=Image+3",
  ]);

  const [thumbnailImageId] = useState(0);

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

            {imagePreviews.length > 0 && (
              <div className="image-preview-swiper">
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {imagePreviews.map((preview, index) => {
                    const isThumbnail = index === thumbnailImageId;

                    return (
                      <SwiperSlide key={index} style={{ width: '100%', height: '100%' }}>
                        <div
                          className={`preview-item ${isThumbnail ? 'thumbnail' : ''}`}
                        >
                          <img src={preview} alt={`preview-${index}`} />

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
                  <span className="info-value">여름 신상 의류 체험단 모집</span>
                </div>

                <div className="info-display">
                  <span className="info-label">상품명</span>
                  <span className="info-value">프리미엄 린넨 셔츠</span>
                </div>

                <div className="info-display">
                  <span className="info-label">사이트 URL</span>
                  <span className="info-value">https://example.com/product/12345</span>
                </div>

                <div className="info-display">
                  <span className="info-label">상품 정보</span>
                  <span className="info-value">
                    100% 천연 린넨 소재로 제작된 프리미엄 셔츠입니다.
                    통풍이 잘 되어 여름철 착용하기 좋으며, 세련된 디자인으로
                    다양한 스타일에 매치 가능합니다.
                  </span>
                </div>
              </div>
            </div>

            {/* 모집 정보 */}
            <div className="form-section">
              <h2 className="section-title">모집 정보</h2>
              <div className="form-grid">
                <div className="info-display">
                  <span className="info-label">모집 인원</span>
                  <span className="info-value">10명</span>
                </div>

                <div className="info-display">
                  <span className="info-label">채널 타입</span>
                  <span className="info-value">블로거</span>
                </div>

                <div className="info-display">
                  <span className="info-label">리뷰 타입</span>
                  <span className="info-value">배송형</span>
                </div>

                <div className="info-display">
                  <span className="info-label">배송 카테고리</span>
                  <span className="info-value">패션, 뷰티</span>
                </div>
              </div>
            </div>

            {/* 일정 정보 */}
            <div className="form-section">
              <h2 className="section-title">일정 정보</h2>
              <div className="form-grid">
                <div className="info-display">
                  <span className="info-label">모집 시작일</span>
                  <span className="info-value">2025-01-15 10:00</span>
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
