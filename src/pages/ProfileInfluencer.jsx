import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInfluencerProfile } from '../api/influencerProfileApi.js';
import './ProfileInfluencer.css';

export default function ProfileInfluencer() {
  const navigate = useNavigate();
  const { userId } = useParams(); // URL에서 인플루언서 ID 가져오기

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null);

  useEffect(() => {
    const fetchInfluencerData = async () => {
      if (!userId) {
        setError('인플루언서 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🟦 인플루언서 프로필 조회 시작, userId:', userId);

        // 프로필 정보 조회
        const result = await getInfluencerProfile(userId);
        console.log('🟦 인플루언서 프로필 API 응답:', result);

        if (result.success && result.result) {
          const { profileApiResult, profileImage, backgroundImage } = result.result;

          // 프로필 정보 설정
          if (profileApiResult) {
            setProfileData(profileApiResult);
          } else {
            // profileApiResult가 없으면 result.result 자체를 사용
            setProfileData(result.result);
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
        console.error('인플루언서 정보 로딩 오류:', err);
        setError('인플루언서 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencerData();
  }, [userId]);

  if (loading) {
    return (
      <div className="profile-influencer-container">
        <div className="loading-message">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-influencer-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-influencer-container">
        <div className="error-message">프로필 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="profile-influencer-container">
      <div className="profile-influencer-card">
        {/* 백그라운드 이미지 영역 */}
        <div className="background-section">
          {backgroundImageUrl ? (
            <img src={backgroundImageUrl} alt="배경 이미지" className="background-image" />
          ) : (
            <div className="background-image background-placeholder"></div>
          )}
          <div className="influencer-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <path
                fill="#667eea"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              />
            </svg>
          </div>
        </div>

        {/* 프로필 정보 영역 */}
        <div className="profile-influencer-content">
          {/* 프로필 이미지 */}
          <div className="profile-influencer-image">
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
          <div className="profile-influencer-info">
            <h1 className="influencer-name">{profileData.influencerName || profileData.username || '이름 없음'}</h1>
            <p className="influencer-job">{profileData.job || '직업 미등록'}</p>

            {/* 인증 배지 */}
            <div className="verified-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path
                  fill="#10B981"
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                />
              </svg>
              <span>인증된 인플루언서</span>
            </div>

            {/* 액션 버튼들 */}
            <div className="action-buttons">
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

        {/* 자기 소개 섹션 */}
        {profileData.introduction && (
          <div className="about-section">
            <h2 className="section-title">자기 소개</h2>
            <p className="about-description">{profileData.introduction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
