import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadAdvertisementImage } from "../api/advertisementImageApi.js";
import { createAdvertisement } from "../api/advertisementApi.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import "./CreateAd.css";

export default function CreateAd() {
  const navigate = useNavigate();
  const location = useLocation();

  // location.state에서 draftId와 draft 정보 가져오기
  const { draftId, draft } = location.state || {};

  const [form, setForm] = useState({
    title: "",
    itemName: "",
    recruitmentNumber: "",
    channelType: "",
    reviewType: "",
    deliveryCategories: [],
    recruitmentStartAt: "",
    siteUrl: "",
    itemInfo: "",
  });

  const [images, setImages] = useState([]); // 업로드된 이미지 정보 (서버 응답 포함)
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnailImageId, setThumbnailImageId] = useState(null); // 썸네일로 선택된 이미지 ID
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // draftId 유효성 검증
  useEffect(() => {
    if (!draftId) {
      alert('잘못된 접근입니다. Draft를 먼저 발급받아야 합니다.');
      navigate('/', { replace: true });
    } else {
      console.log('✅ Draft ID:', draftId);
      console.log('✅ Draft 정보:', draft);
    }
  }, [draftId, draft, navigate]);

  // 채널 타입 옵션
  const channelTypes = [
    { value: "BLOGGER", label: "블로거", code: 0 },
    { value: "YOUTUBER", label: "유튜버", code: 1 },
    { value: "INSTAGRAM", label: "인스타그램", code: 2 },
    { value: "THREAD", label: "쓰레드", code: 3 },
  ];

  // 리뷰 타입 옵션
  const reviewTypes = [
    { value: "VISITED", label: "방문형", code: 0 },
    { value: "DELIVERY", label: "배송형", code: 1 },
    { value: "ARTICLE", label: "기사형", code: 2 },
    { value: "BUY", label: "구매형", code: 3 },
    { value: "RECEIPT", label: "영수증형", code: 4 },
    { value: "LONG_FORM", label: "롱폼", code: 5 },
    { value: "SHORT_FROM", label: "숏폼", code: 6 },
  ];

  // 배송 카테고리 옵션
  const deliveryCategories = [
    { value: "ALL", label: "전체", code: -1 },
    { value: "LIFE", label: "생활", code: 0 },
    { value: "SERVICE", label: "서비스", code: 1 },
    { value: "DIGITAL", label: "디지털", code: 2 },
    { value: "BEAUTY", label: "뷰티", code: 3 },
    { value: "FASSION", label: "패션", code: 4 },
    { value: "BOOK", label: "도서", code: 5 },
    { value: "FOOD", label: "식품", code: 6 },
    { value: "PET", label: "반려동물", code: 7 },
  ];

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // 배송 카테고리 다중 선택 핸들러
  const handleDeliveryCategoryChange = (categoryValue) => {
    setForm((prevForm) => {
      const currentCategories = prevForm.deliveryCategories || [];
      const isSelected = currentCategories.includes(categoryValue);

      if (isSelected) {
        // 이미 선택된 경우 제거
        return {
          ...prevForm,
          deliveryCategories: currentCategories.filter(c => c !== categoryValue),
        };
      } else {
        // 선택되지 않은 경우 추가
        return {
          ...prevForm,
          deliveryCategories: [...currentCategories, categoryValue],
        };
      }
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    // 이미지 파일만 필터링
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length !== files.length) {
      alert('이미지 파일만 업로드 가능합니다.');
    }

    if (imageFiles.length === 0) return;

    setUploading(true);

    for (const file of imageFiles) {
      try {
        // 미리보기 먼저 생성
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);

        // 모든 이미지는 기본적으로 썸네일이 아님
        const isThumbnail = false;

        console.log(`📤 이미지 업로드 중... (썸네일: ${isThumbnail})`);

        // API 호출하여 서버에 업로드
        const result = await uploadAdvertisementImage(file, draftId, isThumbnail);

        if (result.success) {
          console.log('✅ 이미지 업로드 성공:', result.imageInfo);
          // imageInfo: { id, s3Key, bucketName, contentType, size, originalFileName }

          // 첫 번째 이미지를 기본 썸네일로 설정
          const isFirstImage = images.length === 0;
          if (isFirstImage) {
            setThumbnailImageId(result.imageInfo.id);
          }

          setImages(prev => [...prev, {
            file,
            imageInfo: result.imageInfo,
            isThumbnail,
          }]);
        } else {
          console.error('❌ 이미지 업로드 실패:', result.error);
          alert(`이미지 업로드 실패: ${result.error}`);
          // 미리보기에서 제거
          setImagePreviews(prev => prev.slice(0, -1));
        }
      } catch (error) {
        console.error('❌ 이미지 처리 중 오류:', error);
        alert('이미지 처리 중 오류가 발생했습니다.');
      }
    }

    setUploading(false);
  };

  const removeImage = (index) => {
    // 삭제할 이미지가 썸네일인 경우 처리
    const removedImage = images[index];
    if (removedImage?.imageInfo?.id === thumbnailImageId) {
      // 남은 이미지 중 첫 번째를 썸네일로 설정
      const remainingImages = images.filter((_, i) => i !== index);
      if (remainingImages.length > 0) {
        setThumbnailImageId(remainingImages[0].imageInfo.id);
      } else {
        setThumbnailImageId(null);
      }
    }

    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 썸네일 선택 핸들러
  const handleThumbnailChange = (imageId) => {
    setThumbnailImageId(imageId);
  };

  // Drag & Drop 핸들러
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // currentTarget이 실제 이벤트가 등록된 요소 (image-upload-area)
    // relatedTarget이 마우스가 이동한 요소
    // 자식 요소로 이동한 경우는 무시
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const validate = () => {
    const e = {};

    // 필수 필드 검증
    if (!form.title.trim()) e.title = "제목을 입력해주세요.";
    if (!form.itemName.trim()) e.itemName = "상품명을 입력해주세요.";
    if (!form.recruitmentNumber || form.recruitmentNumber <= 0) {
      e.recruitmentNumber = "모집 인원을 입력해주세요.";
    }
    if (!form.channelType) e.channelType = "채널 타입을 선택해주세요.";
    if (!form.reviewType) e.reviewType = "리뷰 타입을 선택해주세요.";

    // 배송형인 경우 배송 카테고리 필수 검증 (최소 1개 이상 선택)
    if (form.reviewType === "DELIVERY" && (!form.deliveryCategories || form.deliveryCategories.length === 0)) {
      e.deliveryCategories = "배송 카테고리를 최소 1개 이상 선택해주세요.";
    }

    if (!form.recruitmentStartAt) e.recruitmentStartAt = "모집 시작일을 선택해주세요.";

    // siteUrl 검증 (URL 형식 체크)
    if (!form.siteUrl.trim()) {
      e.siteUrl = "사이트 URL을 입력해주세요.";
    } else {
      try {
        new URL(form.siteUrl);
      } catch {
        e.siteUrl = "올바른 URL 형식이 아닙니다. (예: https://example.com)";
      }
    }

    // itemInfo 검증
    if (!form.itemInfo.trim()) e.itemInfo = "상품 정보를 입력해주세요.";

    if (images.length === 0) e.images = "최소 1개의 이미지를 업로드해주세요.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("🔵 onSubmit 함수 호출됨!");
    console.log("Form 데이터:", form);

    // 검증 실패 시
    if (!validate()) {
      console.log("❌ Validation 실패:", errors);
      // 이미지가 없는 경우 특별히 alert 표시
      if (images.length === 0) {
        alert("⚠️ 최소 1개의 이미지를 업로드해주세요!");
      }
      return;
    }

    setSubmitting(true);
    try {
      // recruitmentStartAt을 epoch time milliseconds로 변환
      const advertisementData = {
        ...form,
        recruitmentStartAt: form.recruitmentStartAt
          ? new Date(form.recruitmentStartAt).getTime()
          : null,
        thumbnailImageMetaId: thumbnailImageId, // 썸네일 이미지 ID 포함
        draftId, // draft ID 포함
      };

      console.log("광고 생성:", advertisementData);
      console.log("이미지:", images);
      console.log("썸네일 이미지 ID:", thumbnailImageId);

      // 실제 API 호출로 광고 생성
      const result = await createAdvertisement(advertisementData);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("✅ 광고 생성 성공:", result.result);
      alert("광고가 성공적으로 등록되었습니다!");
      navigate("/");
    } catch (err) {
      alert(`광고 등록 중 오류가 발생했습니다.\n\n${err.message}`);
      console.error("Unexpected error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-ad-page">
      <div className="create-ad-container">
        <div className="create-ad-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
          <h1>광고 등록</h1>
        </div>

        <form className="create-ad-form" onSubmit={onSubmit} noValidate>
          {/* 왼쪽: 이미지 업로드 섹션 */}
          <section
            className="form-section-left"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h2 className="section-title">이미지 업로드 *</h2>
            <div
              className={`image-upload-area ${errors.images ? 'error' : ''} ${isDragging ? 'dragging' : ''}`}
            >
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={uploading}
              />
              {isDragging && (
                <label htmlFor="image-upload" className="upload-label">
                  <div className="upload-placeholder">
                    {uploading ? (
                      <>
                        <span className="upload-icon">⏳</span>
                        <p>이미지 업로드 중...</p>
                      </>
                    ) : (
                      <>
                        <span className="upload-icon">📷</span>
                        <p>이미지를 선택하거나 드래그하세요</p>
                        <span className="upload-hint">최대 10개까지 업로드 가능</span>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>
            {errors.images && (
              <div className="error-message-box">
                ⚠️ {errors.images}
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className={`image-preview-swiper ${isDragging ? 'dragging' : ''}`}>
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {imagePreviews.map((preview, index) => {
                    const imageInfo = images[index]?.imageInfo;
                    const isThumbnail = imageInfo?.id === thumbnailImageId;

                    return (
                      <SwiperSlide key={index} style={{ width: '100%', height: '100%' }}>
                        <div
                          className={`preview-item ${isThumbnail ? 'thumbnail' : ''}`}
                        >
                          <img src={preview} alt={`preview-${index}`} />

                          {/* 썸네일 선택 체크박스 */}
                          <label
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '12px',
                              fontWeight: isThumbnail ? 'bold' : 'normal',
                              color: isThumbnail ? '#1976d2' : '#666',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isThumbnail}
                              onChange={() => imageInfo && handleThumbnailChange(imageInfo.id)}
                              disabled={!imageInfo}
                              style={{ marginRight: '4px' }}
                            />
                            썸네일
                          </label>

                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}
          </section>

          {/* 오른쪽: 나머지 정보 섹션들 */}
          <section className="form-section-right">
            {/* 기본 정보 섹션 */}
            <div className="form-section">
            <h2 className="section-title">기본 정보</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="title">광고 제목 *</label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="광고 제목을 입력하세요"
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="itemName">상품명 *</label>
                <input
                  id="itemName"
                  name="itemName"
                  value={form.itemName}
                  onChange={onChange}
                  placeholder="상품명을 입력하세요"
                />
                {errors.itemName && <span className="error-text">{errors.itemName}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="siteUrl">사이트 URL *</label>
                <input
                  id="siteUrl"
                  name="siteUrl"
                  type="url"
                  value={form.siteUrl}
                  onChange={onChange}
                  placeholder="https://example.com/product"
                />
                {errors.siteUrl && <span className="error-text">{errors.siteUrl}</span>}
              </div>

              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="itemInfo">상품 정보 *</label>
                <textarea
                  id="itemInfo"
                  name="itemInfo"
                  value={form.itemInfo}
                  onChange={onChange}
                  placeholder="상품에 대한 상세 정보를 입력하세요"
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                {errors.itemInfo && <span className="error-text">{errors.itemInfo}</span>}
              </div>
            </div>
            </div>

            {/* 모집 정보 섹션 */}
            <div className="form-section">
            <h2 className="section-title">모집 정보</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="recruitmentNumber">모집 인원 *</label>
                <input
                  id="recruitmentNumber"
                  name="recruitmentNumber"
                  type="number"
                  min="1"
                  value={form.recruitmentNumber}
                  onChange={onChange}
                  placeholder="모집 인원을 입력하세요"
                />
                {errors.recruitmentNumber && (
                  <span className="error-text">{errors.recruitmentNumber}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="channelType">채널 타입 *</label>
                <select
                  id="channelType"
                  name="channelType"
                  value={form.channelType}
                  onChange={onChange}
                >
                  <option value="">선택하세요</option>
                  {channelTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.channelType && (
                  <span className="error-text">{errors.channelType}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="reviewType">리뷰 타입 *</label>
                <select
                  id="reviewType"
                  name="reviewType"
                  value={form.reviewType}
                  onChange={onChange}
                >
                  <option value="">선택하세요</option>
                  {reviewTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.reviewType && (
                  <span className="error-text">{errors.reviewType}</span>
                )}
              </div>

              {/* 배송형인 경우 카테고리 선택 필드 표시 */}
              {form.reviewType === "DELIVERY" && (
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label>배송 카테고리 * (복수 선택 가능)</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '12px',
                    marginTop: '8px',
                  }}>
                    {deliveryCategories.map((category) => (
                      <label
                        key={category.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          backgroundColor: form.deliveryCategories.includes(category.value) ? '#e3f2fd' : '#fff',
                          transition: 'all 0.2s',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={form.deliveryCategories.includes(category.value)}
                          onChange={() => handleDeliveryCategoryChange(category.value)}
                          style={{ marginRight: '8px' }}
                        />
                        <span>{category.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.deliveryCategories && (
                    <span className="error-text">{errors.deliveryCategories}</span>
                  )}
                </div>
              )}
            </div>
            </div>

            {/* 일정 정보 섹션 */}
            <div className="form-section">
            <h2 className="section-title">일정 정보</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="recruitmentStartAt">모집 시작일 *</label>
                <input
                  id="recruitmentStartAt"
                  name="recruitmentStartAt"
                  type="datetime-local"
                  value={form.recruitmentStartAt}
                  onChange={onChange}
                />
                {errors.recruitmentStartAt && (
                  <span className="error-text">{errors.recruitmentStartAt}</span>
                )}
              </div>
            </div>
            </div>
          </section>

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || uploading}
            >
              {uploading ? "이미지 업로드 중..." : submitting ? "등록 중..." : "광고 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
