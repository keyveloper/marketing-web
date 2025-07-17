import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { issueInfluencerProfileDraft } from '../api/userProfileApi.js'
import CreateProfileInfluencer from './CreateProfileInfluencer.jsx'
import './DashboardAdvertiser.css'

function DashboardInfluencer() {
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeMenu, setActiveMenu] = useState('overview')
  const [profileDraft, setProfileDraft] = useState(null)

  // Mock data - 실제로는 API로 가져와야 함
  const [dashboardData, setDashboardData] = useState({
    totalApplications: 8,
    activeReviews: 5,
    completedReviews: 15,
    unreadMessages: 3,
    totalLikes: 324,
    upcomingEvents: 2
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
    { id: 'applications', label: '신청 현황', icon: '📋' },
    { id: 'calendar', label: '달력', icon: '📅' },
    { id: 'favorites', label: '좋아요', icon: '❤️' },
    { id: 'timeline', label: '타임라인', icon: '⏰' },
    { id: 'messages', label: 'DM 메시지', icon: '💬' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ]

  // 프로필 Draft 발급 핸들러
  const handleCreateProfile = async () => {
    try {
      console.log('🟦 Profile Draft 발급 요청 중...')
      const result = await issueInfluencerProfileDraft()

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
          <div className="dashboard-overview">
            <h2 className="dashboard-title">대시보드 개요</h2>

            <div className="stats-grid">
              <div className="stat-card stat-card-1">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-label">총 신청</div>
                  <div className="stat-value">{dashboardData.totalApplications}</div>
                </div>
              </div>

              <div className="stat-card stat-card-2">
                <div className="stat-icon">🟢</div>
                <div className="stat-content">
                  <div className="stat-label">진행 중 리뷰</div>
                  <div className="stat-value">{dashboardData.activeReviews}</div>
                </div>
              </div>

              <div className="stat-card stat-card-3">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-label">완료된 리뷰</div>
                  <div className="stat-value">{dashboardData.completedReviews}</div>
                </div>
              </div>

              <div className="stat-card stat-card-4">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <div className="stat-label">읽지 않은 메시지</div>
                  <div className="stat-value">{dashboardData.unreadMessages}</div>
                </div>
              </div>
            </div>

            <div className="main-content-grid">
              <div className="content-card performance-card">
                <h3>활동 지표</h3>
                <div className="performance-stats">
                  <div className="performance-item">
                    <span className="performance-label">총 좋아요</span>
                    <span className="performance-value">{dashboardData.totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-label">다가오는 일정</span>
                    <span className="performance-value">{dashboardData.upcomingEvents}건</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-label">완료율</span>
                    <span className="performance-value">
                      {((dashboardData.completedReviews / (dashboardData.completedReviews + dashboardData.activeReviews)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="content-card recent-activity-card">
                <h3>최근 활동</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-time">1시간 전</span>
                    <span className="activity-desc">새로운 광고 신청이 승인되었습니다</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">3시간 전</span>
                    <span className="activity-desc">리뷰 작성 마감일이 2일 남았습니다</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">1일 전</span>
                    <span className="activity-desc">새로운 DM 메시지 2건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'myprofile':
        return (
          <div className="dashboard-section">
            {profileDraft ? (
              <CreateProfileInfluencer draftId={profileDraft.id} draft={profileDraft} />
            ) : (
              <div className="content-card">
                <p>프로필 정보를 불러오는 중...</p>
              </div>
            )}
          </div>
        )

      case 'applications':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">신청 현황</h2>
            <div className="content-card">
              <p>신청한 광고 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">달력</h2>
            <div className="content-card">
              <p>일정 달력이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'favorites':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">좋아요</h2>
            <div className="content-card">
              <p>좋아요한 광고 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'timeline':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">타임라인</h2>
            <div className="content-card">
              <p>활동 타임라인이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'messages':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">DM 메시지</h2>
            <div className="content-card">
              <p>DM 메시지 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">설정</h2>
            <div className="content-card">
              <p>계정 설정이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← 홈으로
          </button>
          <div className="user-profile">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-info">
              <div className="user-name">{user?.username || '사용자'}</div>
              <div className="user-type">인플루언서</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default DashboardInfluencer
