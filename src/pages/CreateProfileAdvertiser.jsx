import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProfileAdvertiser.css';
import './CreateProfileAdvertiser.css';

export default function CreateProfileAdvertiser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftId, draft } = location.state || {};

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
    industry: '',
    location: '',
    website: '',
    email: '',
    description: '',
  });

  useEffect(() => {
    // draftId가 없으면 임시 draft 생성 (개발용)
    if (!draftId) {
      console.log('⚠️ Draft가 없습니다. 임시 Draft를 생성합니다.');
      const tempDraftId = 'temp-draft-' + Date.now();
      console.log('✅ 임시 Draft ID:', tempDraftId);
    } else {
      console.log('✅ Draft 정보:', { draftId, draft });
    }
  }, [draftId, draft]);

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
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: API 연동하여 프로필 저장
    console.log('🟦 프로필 저장 시작...', formData);

    try {
      setLoading(true);

      // TODO: 실제 API 호출
      // const result = await saveAdvertiserProfile(draftId, formData);
      // if (result.success) {
      //   navigate(`/profile-advertiser/${userId}`);
      // }

      alert('프로필 생성 기능은 아직 구현되지 않았습니다.');
    } catch (error) {
      console.error('❌ 프로필 저장 실패:', error);
      setError('프로필 저장 중 오류가 발생했습니다.');
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
          <div className="background-section">
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
            <div className="profile-advertiser-image">
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
                <label htmlFor="name">회사명 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="회사명을 입력하세요"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">회사 소개 (한 줄) *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="예: 디지털 마케팅 전문 기업"
                  required
                  className="form-input"
                />
              </div>

              {/* 회사 정보 */}
              <div className="company-info-form">
                <div className="form-group">
                  <label htmlFor="industry">업종 *</label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="예: 마케팅 및 광고"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">위치 *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="예: 서울특별시 강남구"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">이메일 *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@company.com"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">웹사이트</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 회사 소개 섹션 */}
          <div className="about-section">
            <h2 className="section-title">회사 소개 *</h2>
            <div className="form-group">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="회사에 대한 자세한 설명을 입력하세요..."
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
              {loading ? '저장 중...' : '프로필 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
