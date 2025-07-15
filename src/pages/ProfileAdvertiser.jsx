import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfileAdvertiser.css';

export default function ProfileAdvertiser() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 광고주 ID 가져오기 (선택사항)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [advertiserData, setAdvertiserData] = useState(null);

  // 샘플 데이터 (추후 API 연동)
  const sampleData = {
    advertiserId: 'ADV12345',
    name: '스마트 마케팅',
    title: '디지털 마케팅 전문 기업',
    backgroundImage: 'https://via.placeholder.com/1400x220/667eea/FFFFFF?text=Company+Banner',
    profileImage: 'https://via.placeholder.com/200x200/667eea/FFFFFF?text=Logo',
    companyInfo: {
      industry: '마케팅 및 광고',
      location: '서울특별시 강남구',
      website: 'https://smartmarketing.example.com',
      email: 'contact@smartmarketing.com',
    },
    stats: {
      totalCampaigns: 127,
      activeReviewers: 1542,
      successRate: 98,
    },
    description: `
      스마트 마케팅은 데이터 기반의 효율적인 마케팅 솔루션을 제공하는 전문 기업입니다.
      10년 이상의 경험을 바탕으로 다양한 업종의 고객사와 함께 성공적인 캠페인을 진행해왔습니다.
      인플루언서 마케팅부터 디지털 광고까지, 통합적인 마케팅 전략을 제공합니다.
    `,
  };

  useEffect(() => {
    // TODO: 실제 API 호출로 광고주 데이터 가져오기
    // const fetchAdvertiserData = async () => {
    //   try {
    //     setLoading(true);
    //     const result = await getAdvertiserById(id);
    //     if (result.success) {
    //       setAdvertiserData(result.data);
    //     } else {
    //       setError(result.error);
    //     }
    //   } catch (err) {
    //     setError('광고주 정보를 불러오는 중 오류가 발생했습니다.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchAdvertiserData();

    // 현재는 샘플 데이터 사용
    setAdvertiserData(sampleData);
  }, [id]);

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

  if (!advertiserData) {
    return null;
  }

  return (
    <div className="profile-advertiser-container">
      <div className="profile-advertiser-card">
        {/* 백그라운드 이미지 영역 */}
        <div className="background-section">
          <img src={advertiserData.backgroundImage} alt="Company Background" className="background-image" />
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
            <img src={advertiserData.profileImage} alt="Company Logo" />
          </div>

          {/* 기본 정보 */}
          <div className="profile-advertiser-info">
            <h1 className="advertiser-name">{advertiserData.name}</h1>
            <p className="advertiser-title">{advertiserData.title}</p>

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
                <strong>업종:</strong> {advertiserData.companyInfo.industry}
              </p>
              <p>
                <strong>위치:</strong> {advertiserData.companyInfo.location}
              </p>
              <p>
                <strong>이메일:</strong>{' '}
                <a href={`mailto:${advertiserData.companyInfo.email}`} className="contact-link">
                  {advertiserData.companyInfo.email}
                </a>
              </p>
              <a
                href={advertiserData.companyInfo.website}
                className="website-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {advertiserData.companyInfo.website}
              </a>
            </div>

            {/* 통계 정보 */}
            <div className="stats-section">
              <div className="stat-item">
                <span className="stat-value">{advertiserData.stats.totalCampaigns}</span>
                <span className="stat-label">총 캠페인</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">{advertiserData.stats.activeReviewers.toLocaleString()}</span>
                <span className="stat-label">활성 리뷰어</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">{advertiserData.stats.successRate}%</span>
                <span className="stat-label">성공률</span>
              </div>
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
        <div className="about-section">
          <h2 className="section-title">회사 소개</h2>
          <p className="about-description">{advertiserData.description}</p>
        </div>
      </div>
    </div>
  );
}
