import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import './DashboardAdvertiser.css'

function DashboardAdvertiser() {
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeMenu, setActiveMenu] = useState('overview')

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
    { id: 'myads', label: '내 광고 관리', icon: '📝' },
    { id: 'reviews', label: '리뷰 신청', icon: '⭐' },
    { id: 'messages', label: 'DM 메시지', icon: '💬' },
    { id: 'analytics', label: '통계 분석', icon: '📈' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ]

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <h2 className="dashboard-title">대시보드 개요</h2>

            <div className="stats-grid">
              <div className="stat-card stat-card-1">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <div className="stat-label">총 광고</div>
                  <div className="stat-value">{dashboardData.totalAds}</div>
                </div>
              </div>

              <div className="stat-card stat-card-2">
                <div className="stat-icon">🟢</div>
                <div className="stat-content">
                  <div className="stat-label">활성 광고</div>
                  <div className="stat-value">{dashboardData.activeAds}</div>
                </div>
              </div>

              <div className="stat-card stat-card-3">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-label">리뷰 신청</div>
                  <div className="stat-value">{dashboardData.reviewRequests}</div>
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
                <h3>성과 지표</h3>
                <div className="performance-stats">
                  <div className="performance-item">
                    <span className="performance-label">총 조회수</span>
                    <span className="performance-value">{dashboardData.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-label">총 클릭수</span>
                    <span className="performance-value">{dashboardData.totalClicks.toLocaleString()}</span>
                  </div>
                  <div className="performance-item">
                    <span className="performance-label">클릭률</span>
                    <span className="performance-value">
                      {((dashboardData.totalClicks / dashboardData.totalViews) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="content-card recent-activity-card">
                <h3>최근 활동</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-time">2시간 전</span>
                    <span className="activity-desc">새로운 리뷰 신청이 도착했습니다</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">5시간 전</span>
                    <span className="activity-desc">광고 "여름 특가 이벤트"가 승인되었습니다</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">1일 전</span>
                    <span className="activity-desc">새로운 DM 메시지 3건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'myads':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">내 광고 관리</h2>
            <div className="content-card">
              <p>내 광고 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">리뷰 신청</h2>
            <div className="content-card">
              <p>리뷰 신청 목록이 여기에 표시됩니다.</p>
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

      case 'analytics':
        return (
          <div className="dashboard-section">
            <h2 className="dashboard-title">통계 분석</h2>
            <div className="content-card">
              <p>상세 통계가 여기에 표시됩니다.</p>
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
              <div className="user-type">광고주</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
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

export default DashboardAdvertiser