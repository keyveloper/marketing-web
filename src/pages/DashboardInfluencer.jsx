import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { logoutUser } from '../services/auth.js'
import { issueInfluencerProfileDraft, getInfluencerProfile } from '../api/influencerProfileApi.js'
import { getLikedAdsByInfluencerId } from '../api/likeApi.js'
import CreateProfileInfluencer from './CreateProfileInfluencer.jsx'
import MyFavoriteAd from '../components/MyFavoriteAd.jsx'
import MyReviews from '../components/MyReviews.jsx'
import TimelineInsta from '../components/TimelineInsta.jsx'
import './DashboardInfluencer.css'

function DashboardInfluencer() {
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeMenu, setActiveMenu] = useState('overview')
  const [profileDraft, setProfileDraft] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [likedAds, setLikedAds] = useState([])
  const [likedAdsLoading, setLikedAdsLoading] = useState(false)

  // Mock data - 실제로는 API로 가져와야 함
  const [dashboardData, setDashboardData] = useState({
    totalApplications: 8,
    activeReviews: 5,
    completedReviews: 15,
    unreadMessages: 3,
    totalLikes: 324,
    upcomingEvents: 2
  })

  // 좋아요 Mock 데이터 (다양한 크기)
  const favoritesData = [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop', size: '1x1', title: '카페 리뷰' },
    { id: 2, imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop', size: '2x1', title: '뷰티 제품' },
    { id: 3, imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', size: '1x1', title: '패션 아이템' },
    { id: 4, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=800&fit=crop', size: '1x2', title: '레스토랑' },
    { id: 5, imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=400&fit=crop', size: '1x1', title: '햄버거' },
    { id: 6, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop', size: '2x1', title: '헤드폰' },
    { id: 7, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', size: '1x1', title: '시계' },
    { id: 8, imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop', size: '1x1', title: '카메라' },
    { id: 9, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=800&fit=crop', size: '1x2', title: '선글라스' },
    { id: 10, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', size: '1x1', title: '운동화' },
    { id: 11, imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=400&fit=crop', size: '2x1', title: '와인' },
    { id: 12, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', size: '1x1', title: '스니커즈' },
  ]

  // 타임라인 Mock 데이터
  const timelinePosts = [
    {
      id: 1,
      username: '카페_브랜드',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      location: '서울 강남구',
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop',
      caption: '새로운 메뉴가 출시되었습니다! 많은 관심 부탁드립니다 ☕✨',
      likes: 234,
      isLiked: false,
      isSaved: false,
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2시간 전
      comments: [
        { username: 'user1', text: '너무 맛있어 보여요!' },
        { username: 'user2', text: '저도 가보고 싶네요 👍' },
        { username: 'user3', text: '위치가 어디인가요?' },
      ],
    },
    {
      id: 2,
      username: '뷰티_브랜드',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      location: '부산 해운대구',
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
      caption: '신상품 립스틱 컬렉션 💄 다양한 컬러로 만나보세요!',
      likes: 567,
      isLiked: true,
      isSaved: false,
      timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5시간 전
      comments: [
        { username: 'beauty_lover', text: '색상이 너무 예뻐요' },
        { username: 'makeup_fan', text: '가격은 얼마인가요?' },
      ],
    },
    {
      id: 3,
      username: '패션_스토어',
      userAvatar: 'https://i.pravatar.cc/150?img=8',
      location: '제주도',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=800&fit=crop',
      caption: '여름 시즌 신상 의류 입고 🌞 편안한 착용감과 트렌디한 디자인!',
      likes: 892,
      isLiked: false,
      isSaved: true,
      timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1일 전
      comments: [
        { username: 'fashion_queen', text: '사이즈는 어떻게 되나요?' },
      ],
    },
    {
      id: 4,
      username: '레스토랑_공식',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      location: '서울 종로구',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop',
      caption: '오늘의 추천 메뉴 🍝 신선한 재료로 만든 파스타!',
      likes: 445,
      isLiked: false,
      isSaved: false,
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3일 전
      comments: [
        { username: 'foodie123', text: '진짜 맛있겠다' },
        { username: 'pasta_lover', text: '예약 가능한가요?' },
        { username: 'yummy_food', text: '다음 주에 가볼게요!' },
      ],
    },
  ]

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
    { id: 'applications', label: '나의 리뷰', icon: '📋' },
    { id: 'favorites', label: '좋아요', icon: '❤️' },
    { id: 'timeline', label: '타임라인', icon: '⏰' },
    { id: 'messages', label: 'DM 메시지', icon: '💬' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ]

  // 좋아요한 광고 목록 조회 핸들러
  const fetchLikedAds = async () => {
    try {
      setLikedAdsLoading(true)
      console.log('🟦 좋아요한 광고 목록 조회 중...')

      const influencerId = user?.userId || userId
      if (!influencerId) {
        console.log('🟦 userId 없음')
        setLikedAds([])
        return
      }

      // 좋아요한 광고 목록 조회 (썸네일 URL 포함)
      const likeResult = await getLikedAdsByInfluencerId(influencerId)

      if (!likeResult.success || !likeResult.result?.likedAdvertisements?.length) {
        console.log('🟦 좋아요한 광고 없음')
        setLikedAds([])
        return
      }

      // thumbnailAdCards 형태로 변환
      const likedAdsData = likeResult.result.likedAdvertisements.map(ad => ({
        advertisementId: ad.advertisementId,
        presignedUrl: ad.thumbnailUrl,
      }))

      console.log('✅ 좋아요한 광고:', likedAdsData)
      setLikedAds(likedAdsData)
    } catch (error) {
      console.error('❌ 좋아요한 광고 조회 실패:', error)
      setLikedAds([])
    } finally {
      setLikedAdsLoading(false)
    }
  }

  // 프로필 조회 핸들러
  const fetchProfile = async () => {
    try {
      setProfileLoading(true)
      console.log('🟦 Profile 조회 요청 중...')

      // user.userId로 프로필 조회
      const influencerId = user?.userId || userId
      if (!influencerId) {
        console.log('🟦 userId 없음')
        setProfileData(null)
        return
      }

      const result = await getInfluencerProfile(influencerId)

      if (result.success && result.result) {
        console.log('✅ Profile 조회 성공:', result.result)
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

  // 프로필 Draft 발급 핸들러 (새로 만들기 / 수정)
  const handleCreateProfile = async () => {
    try {
      console.log('🟦 Profile Draft 발급 요청 중...')
      const result = await issueInfluencerProfileDraft()

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
    } else if (menuId === 'favorites') {
      // 좋아요 메뉴 클릭 시 좋아요한 광고 조회
      setActiveMenu(menuId)
      await fetchLikedAds()
    } else {
      setActiveMenu(menuId)
    }
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview':
        return (
          <div className="influ-dashboard-overview">
            <h2 className="influ-dashboard-title">대시보드 개요</h2>

            <div className="influ-stats-grid">
              <div className="influ-stat-card influ-stat-card-1">
                <div className="influ-stat-icon">📋</div>
                <div className="influ-stat-content">
                  <div className="influ-stat-label">총 신청</div>
                  <div className="influ-stat-value">{dashboardData.totalApplications}</div>
                </div>
              </div>

              <div className="influ-stat-card influ-stat-card-2">
                <div className="influ-stat-icon">🟢</div>
                <div className="influ-stat-content">
                  <div className="influ-stat-label">진행 중 리뷰</div>
                  <div className="influ-stat-value">{dashboardData.activeReviews}</div>
                </div>
              </div>

              <div className="influ-stat-card influ-stat-card-3">
                <div className="influ-stat-icon">✅</div>
                <div className="influ-stat-content">
                  <div className="influ-stat-label">완료된 리뷰</div>
                  <div className="influ-stat-value">{dashboardData.completedReviews}</div>
                </div>
              </div>

              <div className="influ-stat-card influ-stat-card-4">
                <div className="influ-stat-icon">💬</div>
                <div className="influ-stat-content">
                  <div className="influ-stat-label">읽지 않은 메시지</div>
                  <div className="influ-stat-value">{dashboardData.unreadMessages}</div>
                </div>
              </div>
            </div>

            <div className="influ-main-content-grid">
              <div className="influ-content-card influ-performance-card">
                <h3>활동 지표</h3>
                <div className="influ-performance-stats">
                  <div className="influ-performance-item">
                    <span className="influ-performance-label">총 좋아요</span>
                    <span className="influ-performance-value">{dashboardData.totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="influ-performance-item">
                    <span className="influ-performance-label">다가오는 일정</span>
                    <span className="influ-performance-value">{dashboardData.upcomingEvents}건</span>
                  </div>
                  <div className="influ-performance-item">
                    <span className="influ-performance-label">완료율</span>
                    <span className="influ-performance-value">
                      {((dashboardData.completedReviews / (dashboardData.completedReviews + dashboardData.activeReviews)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="influ-content-card influ-recent-activity-card">
                <h3>최근 활동</h3>
                <div className="influ-activity-list">
                  <div className="influ-activity-item">
                    <span className="influ-activity-time">1시간 전</span>
                    <span className="influ-activity-desc">새로운 광고 신청이 승인되었습니다</span>
                  </div>
                  <div className="influ-activity-item">
                    <span className="influ-activity-time">3시간 전</span>
                    <span className="influ-activity-desc">리뷰 작성 마감일이 2일 남았습니다</span>
                  </div>
                  <div className="influ-activity-item">
                    <span className="influ-activity-time">1일 전</span>
                    <span className="influ-activity-desc">새로운 DM 메시지 2건</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'myprofile':
        return (
          <div className="influ-dashboard-section">
            {profileLoading ? (
              <div className="influ-content-card">
                <p>프로필 정보를 불러오는 중...</p>
              </div>
            ) : isEditMode && profileDraft ? (
              // 수정 모드: CreateProfileInfluencer에 기존 데이터 전달
              <CreateProfileInfluencer
                draftId={profileDraft.id}
                draft={profileDraft}
                existingData={profileData}
              />
            ) : profileData ? (
              // 조회 모드: 데이터가 있으면 수정 가능한 상태로 CreateProfileInfluencer 표시
              <CreateProfileInfluencer
                draftId={profileData.profileApiResult?.userProfileDraftId}
                draft={null}
                existingData={profileData}
              />
            ) : (
              // 프로필 없음: 새로 만들기 버튼 표시
              <div className="influ-content-card influ-profile-empty">
                <div className="influ-profile-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80">
                    <path
                      fill="#ccc"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    />
                  </svg>
                </div>
                <h3 className="influ-profile-empty-title">프로필이 없습니다</h3>
                <p className="influ-profile-empty-desc">프로필을 생성하여 나를 소개해보세요!</p>
                <button
                  className="influ-profile-create-btn"
                  onClick={handleCreateProfile}
                >
                  프로필 새로 만들기
                </button>
              </div>
            )}
          </div>
        )

      case 'applications':
        return (
          <div className="influ-dashboard-section">
            <MyReviews onAdClick={(adId) => navigate(`/advertisement/${adId}`)} />
          </div>
        )

      case 'calendar':
        return (
          <div className="influ-dashboard-section">
            <h2 className="influ-dashboard-title">달력</h2>
            <div className="influ-content-card">
              <p>일정 달력이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'favorites':
        return (
          <div className="influ-dashboard-section">
            <h2 className="influ-dashboard-title">좋아요</h2>
            {likedAdsLoading ? (
              <div className="influ-content-card">
                <p>좋아요한 광고를 불러오는 중...</p>
              </div>
            ) : (
              <MyFavoriteAd thumbnailAdCards={likedAds} />
            )}
          </div>
        )

      case 'timeline':
        return (
          <div className="influ-dashboard-section">
            <div className="influ-timeline-container">
              {timelinePosts.map((post) => (
                <TimelineInsta key={post.id} post={post} />
              ))}
            </div>
          </div>
        )

      case 'messages':
        return (
          <div className="influ-dashboard-section">
            <h2 className="influ-dashboard-title">DM 메시지</h2>
            <div className="influ-content-card">
              <p>DM 메시지 목록이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="influ-dashboard-section">
            <h2 className="influ-dashboard-title">설정</h2>
            <div className="influ-content-card">
              <p>계정 설정이 여기에 표시됩니다.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="influ-dashboard-container">
      {/* Sidebar */}
      <aside className="influ-dashboard-sidebar">
        <div className="influ-sidebar-header">
          <button
            className="influ-logout-btn"
            onClick={async () => {
              await logoutUser()
              navigate('/login')
            }}
          >
            로그아웃
          </button>
          <div className="influ-user-profile">
            <div className="influ-user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div className="influ-user-info">
              <div className="influ-user-name">{user?.username || '사용자'}</div>
              <div className="influ-user-type">인플루언서</div>
            </div>
          </div>
        </div>

        <nav className="influ-sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`influ-menu-item ${activeMenu === item.id ? 'influ-active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="influ-menu-icon">{item.icon}</span>
              <span className="influ-menu-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="influ-dashboard-main">
        <div className="influ-dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default DashboardInfluencer
