import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdvertiserProfile } from '../api/advertiserProfileApi.js';
import './ProfileAdvertiser.css';

export default function ProfileAdvertiser() {
  const navigate = useNavigate();
  const { userId } = useParams(); // URL에서 광고주 ID 가져오기

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null);

  useEffect(() => {
    const fetchAdvertiserData = async () => {
      if (!userId) {
        setError('광고주 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 프로필 정보 조회
        const result = await getAdvertiserProfile(userId);

        if (result.success && result.result) {
          const { profileApiResult, profileImage, backgroundImage } = result.result;

          // 프로필 정보 설정
          if (profileApiResult) {
            setProfileData(profileApiResult);
          }

          // 프로필 이미지 설정
          if (profileImage?.presignedUrl) {
            setProfileImageUrl(profileImage.presignedUrl);
          }

          // 배경 이미지 설정
          if (backgroundImage?.presignedUrl) {
            setBackgroundImageUrl(backgroundImage.presignedUrl);
          }
        } else if (!result.success) {
          setError(result.error || '프로필을 찾을 수 없습니다.');
        } else {
          setError('프로필을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('광고주 정보 로딩 오류:', err);
        setError('광고주 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertiserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="profile-advertiser-container">
        <div className="loading-message">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-advertiser-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-advertiser-container">
        <div className="error-message">프로필 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="profile-advertiser-container">
      <div className="profile-advertiser-card">
        {/* 백그라운드 이미지 영역 */}
        <div className="background-section">
          {backgroundImageUrl ? (
            <img src={backgroundImageUrl} alt="배경 이미지" className="background-image" />
          ) : (
            <div className="background-image background-placeholder"></div>
          )}
          <div className="company-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <path
                fill="#667eea"
                d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"
              />
            </svg>
          </div>
        </div>

        {/* 프로필 정보 영역 */}
        <div className="profile-advertiser-content">
          {/* 프로필 이미지 */}
          <div className="profile-advertiser-image">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="프로필 이미지" />
            ) : (
              <div className="profile-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                  <path
                    fill="#9ca3af"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="profile-advertiser-info">
            <h1 className="advertiser-name">{profileData.advertiserName}</h1>
            <p className="advertiser-title">{profileData.serviceInfo}</p>

            {/* 인증 배지 */}
            <div className="verified-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path
                  fill="#10B981"
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                />
              </svg>
              <span>인증된 광고주</span>
            </div>

            {/* 회사 정보 */}
            <div className="company-info">
              <p>
                <strong>위치:</strong> {profileData.locationBrief}
              </p>
              <p>
                <strong>서비스:</strong> {profileData.serviceInfo}
              </p>
            </div>

            {/* 액션 버튼들 */}
            <div className="action-buttons">
              <button className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"
                  />
                </svg>
                팔로우
              </button>
              <button className="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"
                  />
                </svg>
                문의하기
              </button>
              <button className="btn-more">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M3 9.5A1.5 1.5 0 1 1 4.5 8 1.5 1.5 0 0 1 3 9.5zM11.5 8A1.5 1.5 0 1 0 13 9.5 1.5 1.5 0 0 0 11.5 8zm-5 0A1.5 1.5 0 1 0 8 9.5 1.5 1.5 0 0 0 6.5 8z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 회사 소개 섹션 */}
        {profileData.introduction && (
          <div className="about-section">
            <h2 className="section-title">회사 소개</h2>
            <p className="about-description">{profileData.introduction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
