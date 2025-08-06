import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { issueAdvertiserProfileDraft, getAdvertiserProfile } from '../api/advertiserProfileApi.js'
import { getFollowerInfluencers } from '../api/profileSummaryApi.js'
import CreateProfileAdvertiser from './CreateProfileAdvertiser.jsx'
import UpdateAdvertiserProfile from './UpdateAdvertiserProfile.jsx'
import InfluencerSummaryCard from '../components/InfluencerSummaryCard.jsx'
import MyAds from '../components/MyAds.jsx'
import OfferedApplications from '../components/OfferedApplications.jsx'
import './DashboardAdvertiser.css'

function DashboardAdvertiser() {
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeMenu, setActiveMenu] = useState('overview')
  const [profileDraft, setProfileDraft] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [followers, setFollowers] = useState([])
  const [followersLoading, setFollowersLoading] = useState(false)

  // Mock data - 실제로는 API로 가져와야 함
  const [dashboardData, setDashboardData] = useState({
    totalAds: 12,
    activeAds: 8,
    reviewRequests: 23,
    unreadMessages: 5,
    totalViews: 1543,
    totalClicks: 287
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('인증 실패:', error)
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  const menuItems = [
    { id: 'overview', label: '대시보드 개요', icon: '📊' },
    { id: 'myprofile', label: '내 프로필', icon: '👤' },
    { id: 'myads', label: '내 광고 관리', icon: '📝' },
    { id: 'reviews', label: '받은 신청', icon: '⭐' },
    { id: 'followers', label: 'Follower 보기', icon: '👥' },
    { id: 'messages', label: 'DM 메시지', icon: '💬' },
    { id: 'analytics', label: '통계 분석', icon: '📈' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ]

  // 프로필 조회 핸들러
  const fetchProfile = async () => {
    try {
      setProfileLoading(true)
      console.log('🟦 Advertiser Profile 조회 요청 중...')

      const advertiserId = user?.userId || userId
      if (!advertiserId) {
        console.log('🟦 userId 없음')
        setProfileData(null)
        return
      }

      const result = await getAdvertiserProfile(advertiserId)

      if (result.success && result.result) {
        console.log('✅ Advertiser Profile 조회 성공:', result.result)
        setProfileData(result.result)
      } else {
        console.log('🟦 Profile 없음, 새로 만들기 필요')
        setProfileData(null)
      }
    } catch (error) {
      console.error('❌ Profile 조회 실패:', error)
      setProfileData(null)
    } finally {
      setProfileLoading(false)
    }
  }

  // 팔로워 목록 조회
  const fetchFollowers = async () => {
    try {
      setFollowersLoading(true)
      const advertiserId = user?.userId || userId
      if (!advertiserId) {
        setFollowers([])
        return
      }

      const result = await getFollowerInfluencers(advertiserId)
      if (result.success && result.result) {
        setFollowers(result.result)
      } else {
        setFollowers([])
      }
    } catch (error) {
      console.error('팔로워 조회 실패:', error)
      setFollowers([])
    } finally {
      setFollowersLoading(false)
    }
  }

  // 프로필 Draft 발급 핸들러 (새로 만들기 / 수정)
  const handleCreateProfile = async () => {
    try {
      console.log('🟦 Profile Draft 발급 요청 중...')
      const result = await issueAdvertiserProfileDraft()

      if (result.success) {
        console.log('✅ Profile Draft 발급 성공, draftId:', result.draftId)
        setProfileDraft(result.draft)
        setIsEditMode(true)
      } else {
        console.error('❌ Profile Draft 발급 실패:', result.error)
        alert(`Profile Draft 발급 실패\n\n${result.error}`)
      }
    } catch (error) {
      console.error('❌ 예상치 못한 오류:', error)
      alert('Profile Draft 발급 중 오류가 발생했습니다.')
    }
  }

  // 메뉴 클릭 핸들러
  const handleMenuClick = async (menuId) => {
    if (menuId === 'myprofile') {
      // 프로필 메뉴 클릭 시 프로필 조회
      setActiveMenu(menuId)
      setIsEditMode(false)
      await fetchProfile()
    } else if (menuId === 'followers') {
      setActiveMenu(menuId)
      await fetchFollowers()
    } else {
      setActiveMenu(menuId)
    }
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview':
        return (
          <div className="ad-dashboard-overview">
            <h2 className="ad-dashboard-title">대시보드 개요</h2>

            <div className="ad-stats-grid">
              <div className="ad-stat-card ad-stat-card-1">
                <div className="ad-stat-icon">📝</div>
                <div className="ad-stat-content">
                  <div className="ad-stat-label">총 광고</div>
                  <div className="ad-stat-value">{dashboardData.totalAds}</div>
                </div>
              </div>

              <div className="ad-stat-card ad-stat-card-2">
                <div className="ad-stat-icon">🟢</div>
                <div className="ad-stat-content">
                  <div className="ad-stat-label">활성 광고</div>
                  <div className="ad-stat-value">{dashboardData.activeAds}</div>
                </div>
              </div>

              <div className="ad-stat-card ad-stat-card-3">
                <div className="ad-stat-icon">⭐</div>
                <div className="ad-stat-content">
                  <div className="ad-stat-label">리뷰 신청</div>
                  <div className="ad-stat-value">{dashboardData.reviewRequests}</div>
                </div>
              </div>

              <div className="ad-stat-card ad-stat-card-4">
                <div className="ad-stat-icon">💬</div>
                <div className="ad-stat-content">
                  <div className="ad-stat-label">읽지 않은 메시지</div>
                  <div className="ad-stat-value">{dashboardData.unreadMessages}</div>
                </div>
              </div>
            </div>

            <div className="ad-main-content-grid">
              <div className="ad-content-card ad-performance-card">
                <h3>성과 지표</h3>
                <div className="ad-performance-stats">
                  <div className="ad-performance-item">
                    <span className="ad-performance-label">총 조회수</span>
                    <span className="ad-performance-value">{dashboardData.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="ad-performance-item">
                    <span className="ad-performance-label">총 클릭수</span>
                    <span className="ad-performance-value">{dashboardData.totalClicks.toLocaleString()}</span>
                  </div>
                  <div className="ad-performance-item">
                    <span className="ad-performance-label">클릭률</span>
                    <span className="ad-performance-value">
                      {((dashboardData.totalClicks / dashboardData.totalViews) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="ad-content-card ad-recent-activity-card">
                <h3>최근 활동</h3>
                <div className="ad-activity-list">
                  <div className="ad-activity-item">
                    <span className="ad-activity-time">2시간 전</span>
                    <span className="ad-activity-desc">새로운 리뷰 신청이 도착했습니다</span>
                  </div>
                  <div className="ad-activity-item">
                    <span className="ad-activity-time">5시간 전</span>
                    <span className="ad-activity-desc">광고 "여름 특가 이벤트"가 승인되었습니다</span>
                  </div>
                  <div className="ad-activity-item">
                    <span className="ad-activity-time">1일 전</span>
                    <span className="ad-activity-desc">새로운 DM 메시지 3건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'myprofile':
        return (
          <div className="ad-dashboard-section">
            {profileLoading ? (
              <div className="ad-content-card">
                <p>프로필 정보를 불러오는 중...</p>
              </div>
            ) : isEditMode && profileDraft ? (
              // 새로 만들기 모드: CreateProfileAdvertiser 호출
              <CreateProfileAdvertiser
                draftId={profileDraft.id}
                draft={profileDraft}
              />
            ) : profileData ? (
              // 프로필 있음: UpdateAdvertiserProfile 호출
              <UpdateAdvertiserProfile existingData={profileData} />
            ) : (
              // 프로필 없음: 새로 만들기 버튼 표시
              <div className="ad-content-card ad-profile-empty">
                <div className="ad-profile-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                    <path
                      fill="#ccc"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    />
                  </svg>
                </div>
                <h3 className="ad-profile-empty-title">프로필이 없습니다</h3>
                <p className="ad-profile-empty-desc">프로필을 생성하여 나를 소개해보세요!</p>
                <button
                  className="ad-profile-create-btn"
                  onClick={handleCreateProfile}
                >
                  프로필 새로 만들기
                </button>
              </div>
            )}
          </div>
        )

      case 'myads':
        return <MyAds />

      case 'reviews':
        return <OfferedApplications />

      case 'followers':
        return (
          <div className="ad-dashboard-section">
            <h2 className="ad-dashboard-title">Follower 보기</h2>
            {followersLoading ? (
              <div className="ad-content-card">
                <p>팔로워 목록을 불러오는 중...</p>
              </div>
            ) : followers.length > 0 ? (
              <div className="ad-followers-grid">
                {followers.map((follower, index) => (
                  <InfluencerSummaryCard
                    key={follower.influencerId || index}
                    influencer={follower}
                    onClick={(influencerId) => navigate(`/profile-influencer/${influencerId}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="ad-content-card">
                <p>아직 팔로워가 없습니다.</p>
              </div>
            )}
          </div>
        )

      case 'messages':
        return (
          <div className="ad-dashboard-section">
            <h2 className="ad-dashboard-title">DM 메시지</h2>
            <div className="ad-content-card">
              <p>DM 메시지 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="ad-dashboard-section">
            <h2 className="ad-dashboard-title">통계 분석</h2>
            <div className="ad-content-card">
              <p>상세 통계가 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="ad-dashboard-section">
            <h2 className="ad-dashboard-title">설정</h2>
            <div className="ad-content-card">
              <p>계정 설정이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="ad-dashboard-container">
      {/* Sidebar */}
      <aside className="ad-dashboard-sidebar">
        <div className="ad-sidebar-header">
          <div className="ad-user-profile">
            <div className="ad-user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div className="ad-user-info">
              <div className="ad-user-name">{user?.username || '사용자'}</div>
              <div className="ad-user-type">광고주</div>
            </div>
          </div>
        </div>

        <nav className="ad-sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`ad-menu-item ${activeMenu === item.id ? 'ad-active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="ad-menu-icon">{item.icon}</span>
              <span className="ad-menu-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ad-dashboard-main">
        <div className="ad-dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default DashboardAdvertiser
