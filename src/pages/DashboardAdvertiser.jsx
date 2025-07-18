import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { issueAdvertiserProfileDraft } from '../api/userProfileApi.js'
import CreateProfileAdvertiser from './CreateProfileAdvertiser.jsx'
import './DashboardAdvertiser.css'

function DashboardAdvertiser() {
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeMenu, setActiveMenu] = useState('overview')
  const [profileDraft, setProfileDraft] = useState(null)

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
    { id: 'reviews', label: '리뷰 신청', icon: '⭐' },
    { id: 'messages', label: 'DM 메시지', icon: '💬' },
    { id: 'analytics', label: '통계 분석', icon: '📈' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ]

  // 프로필 Draft 발급 핸들러
  const handleCreateProfile = async () => {
    try {
      console.log('🟦 Profile Draft 발급 요청 중...')
      const result = await issueAdvertiserProfileDraft()

      if (result.success) {
        console.log('✅ Profile Draft 발급 성공, draftId:', result.draftId)
        setProfileDraft(result.draft)
        setActiveMenu('myprofile')
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
    if (menuId === 'myprofile' && !profileDraft) {
      // 프로필 메뉴 클릭 시 Draft가 없으면 발급
      await handleCreateProfile()
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
            {profileDraft ? (
              <CreateProfileAdvertiser draftId={profileDraft.id} draft={profileDraft} />
            ) : (
              <div className="ad-content-card">
                <p>프로필 정보를 불러오는 중...</p>
              </div>
            )}
          </div>
        )

      case 'myads':
        return (
          <div className="ad-dashboard-section">
            <h2 className="ad-dashboard-title">내 광고 관리</h2>
            <div className="ad-content-card">
              <p>내 광고 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div className="ad-dashboard-section">
            <h2 className="ad-dashboard-title">리뷰 신청</h2>
            <div className="ad-content-card">
              <p>리뷰 신청 목록이 여기에 표시됩니다.</p>
            </div>
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
          <button className="ad-back-btn" onClick={() => navigate('/')}>
            ← 홈으로
          </button>
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
