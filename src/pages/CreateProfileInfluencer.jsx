import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadInfluencerProfileImage } from '../api/influencerProfileImageApi.js';
import { uploadInfluencerProfileInfo } from '../api/influencerProfileApi.js';
import './ProfileAdvertiser.css';
import './CreateProfileAdvertiser.css';

export default function CreateProfileInfluencer({ draftId: propDraftId, draft: propDraft, existingData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftId: stateDraftId, draft: stateDraft } = location.state || {};

  // props에서 받거나 location.state에서 받기 (props 우선)
  const draftId = propDraftId || stateDraftId;
  const draft = propDraft || stateDraft;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 프로필 입력 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    backgroundImage: null,
    backgroundImagePreview: '',
    profileImage: null,
    profileImagePreview: '',
    category: '',
    followers: '',
    channelUrl: '',
    email: '',
    description: '',
  });

  useEffect(() => {
    // existingData가 있으면 폼에 데이터 채우기
    if (existingData) {
      console.log('✅ 기존 프로필 데이터로 폼 초기화:', existingData);
      const profileInfo = existingData.profileApiResult;
      const profileImageUrl = existingData.profileImage?.presignedUrl;
      const backgroundImageUrl = existingData.backgroundImage?.presignedUrl;

      setFormData(prev => ({
        ...prev,
        title: profileInfo?.job || '',
        description: profileInfo?.introduction || '',
        channelUrl: profileInfo?.channelUrl || '',
        profileImagePreview: profileImageUrl || '',
        backgroundImagePreview: backgroundImageUrl || '',
      }));
    } else if (!draftId) {
      console.log('⚠️ Draft가 없습니다. 임시 Draft를 생성합니다.');
      const tempDraftId = 'temp-draft-' + Date.now();
      console.log('✅ 임시 Draft ID:', tempDraftId);
    } else {
      console.log('✅ Draft 정보:', { draftId, draft });
    }
  }, [draftId, draft, existingData]);

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file, imageType);
    }
  };

  // 이미지 파일 처리 함수
  const processImageFile = async (file, imageType) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 먼저 미리보기 표시
    const reader = new FileReader();
    reader.onloadend = () => {
      if (imageType === 'background') {
        setFormData(prev => ({
          ...prev,
          backgroundImage: file,
          backgroundImagePreview: reader.result
        }));
      } else if (imageType === 'profile') {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImagePreview: reader.result
        }));
      }
    };
    reader.readAsDataURL(file);

    // draftId가 있으면 서버에 업로드
    if (draftId) {
      try {
        setLoading(true);

        // ProfileImageType enum 값 매핑
        const profileImageType = imageType === 'background' ? 'BACKGROUND' : 'PROFILE';

        console.log(`🔵 ${imageType} 이미지 업로드 시작...`);
        const result = await uploadInfluencerProfileImage(draftId, profileImageType, file);

        if (result.success) {
          console.log(`✅ ${imageType} 이미지 업로드 성공:`, result.result);
          alert(`${imageType === 'background' ? '배경' : '프로필'} 이미지가 업로드되었습니다.`);
        } else {
          console.error(`❌ ${imageType} 이미지 업로드 실패:`, result.error);
          alert(`이미지 업로드 실패\n\n${result.error}`);

          // 실패 시 미리보기도 제거
          if (imageType === 'background') {
            setFormData(prev => ({
              ...prev,
              backgroundImage: null,
              backgroundImagePreview: ''
            }));
          } else if (imageType === 'profile') {
            setFormData(prev => ({
              ...prev,
              profileImage: null,
              profileImagePreview: ''
            }));
          }
        }
      } catch (error) {
        console.error(`❌ ${imageType} 이미지 업로드 중 오류:`, error);
        alert('이미지 업로드 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    } else {
      console.warn('⚠️ Draft ID가 없어 이미지를 서버에 업로드할 수 없습니다.');
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, imageType) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0], imageType);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!draftId) {
      alert('Draft ID가 없습니다. 프로필을 저장할 수 없습니다.');
      return;
    }

    console.log('🟦 프로필 저장 시작...', formData);

    try {
      setLoading(true);

      // Influencer Profile Info API 호출
      const result = await uploadInfluencerProfileInfo(
        draftId,                      // userProfileDraftId
        formData.description || null, // introduction (자기소개)
        formData.title || null        // job (직업)
      );

      if (result.success) {
        console.log('✅ 프로필 저장 성공:', result);
        alert('프로필이 성공적으로 저장되었습니다!');

        // 대시보드로 돌아가기
        navigate(-1);
      } else {
        console.error('❌ 프로필 저장 실패:', result.error);
        alert(`프로필 저장 실패\n\n${result.error}`);
      }
    } catch (error) {
      console.error('❌ 프로필 저장 중 오류:', error);
      alert('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
      navigate(-1);
    }
  };

  if (error) {
    return (
      <div className="profile-advertiser-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-advertiser-container">
      <div className="profile-advertiser-card">
        <form onSubmit={handleSubmit}>
          {/* 백그라운드 이미지 영역 */}
          <div
            className="background-section"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'background')}
          >
            {formData.backgroundImagePreview ? (
              <img
                src={formData.backgroundImagePreview}
                alt="Background Preview"
                className="background-image"
              />
            ) : (
              <div className="background-image background-placeholder">
                배경 이미지를 업로드하세요
              </div>
            )}
            <div className="image-upload-overlay">
              <label htmlFor="background-upload" className="upload-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="white"
                    d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                  />
                </svg>
                <span>배경 이미지 변경</span>
              </label>
              <input
                id="background-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'background')}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* 프로필 정보 영역 */}
          <div className="profile-advertiser-content">
            {/* 프로필 이미지 */}
            <div
              className="profile-advertiser-image"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'profile')}
            >
              {formData.profileImagePreview ? (
                <img src={formData.profileImagePreview} alt="Profile Preview" />
              ) : (
                <div className="profile-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                    <path
                      fill="#ccc"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    />
                  </svg>
                </div>
              )}
              <div className="profile-image-upload-overlay">
                <label htmlFor="profile-upload" className="profile-upload-label">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path
                      fill="white"
                      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                    />
                  </svg>
                  <span>프로필 이미지 변경</span>
                </label>
              </div>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'profile')}
                style={{ display: 'none' }}
              />
            </div>

            {/* 기본 정보 입력 폼 */}
            <div className="profile-advertiser-info">
              <div className="form-group">
                <label htmlFor="job"> 직업 </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="예: 뷰티 & 패션 크리에이터"
                  required
                  className="form-input"
                />
              </div>

              {/* 인플루언서 정보 */}
              <div className="company-info-form">
                <div className="form-group">
                  <label htmlFor="channelUrl">채널 URL</label>
                  <input
                    type="url"
                    id="channelUrl"
                    name="channelUrl"
                    value={formData.channelUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/@channel"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 자기소개 섹션 */}
          <div className="about-section">
            <h2 className="section-title">자기소개 *</h2>
            <div className="form-group">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="자신에 대한 자세한 소개를 입력하세요..."
                required
                className="form-textarea"
                rows="8"
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-cancel"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '저장 중...' : '프로필 업데이트'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
