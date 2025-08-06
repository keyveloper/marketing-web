import { useState, useEffect } from 'react'
import { getMyAdvertisements } from '../api/myAdvertisementApi.js'
import MyAdCard from './MyAdCard.jsx'
import './MyAds.css'

/**
 * 내 광고 관리 컴포넌트
 * - 상태별 탭: 모집중(RECRUITING), 리뷰중(REVIEWING), 종료(CLOSED)
 */
function MyAds() {
  const [activeTab, setActiveTab] = useState('RECRUITING')
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(false)

  // 컴포넌트 마운트 시 광고 목록 조회
  useEffect(() => {
    fetchMyAds()
  }, [])

  const fetchMyAds = async () => {
    try {
      setLoading(true)
      console.log('🟦 내 광고 목록 조회 중...')

      const result = await getMyAdvertisements()
      console.log('🟦 API 응답 전체:', result)
      console.log('🟦 result.result:', result.result)

      if (result.success && result.result) {
        // result.result 구조 확인
        console.log('🟦 result.result 타입:', typeof result.result)
        console.log('🟦 result.result 키:', result.result ? Object.keys(result.result) : 'null')

        // result.result가 배열인 경우 직접 사용
        // 아니면 myAds, advertisements 등 다양한 필드 확인
        let ads = []
        if (Array.isArray(result.result)) {
          ads = result.result
        } else if (result.result.myAds) {
          ads = result.result.myAds
        } else if (result.result.advertisements) {
          ads = result.result.advertisements
        } else if (result.result.content) {
          ads = result.result.content
        }

        console.log('✅ 내 광고 목록:', ads)
        console.log('✅ 광고 개수:', ads.length)
        if (ads.length > 0) {
          console.log('✅ 첫 번째 광고:', ads[0])
          console.log('✅ 첫 번째 광고 reviewStatus:', ads[0]?.reviewStatus)
        }
        setAdvertisements(ads)
      } else {
        console.log('🟦 result.success 또는 result.result 없음')
        setAdvertisements([])
      }
    } catch (error) {
      console.error('내 광고 목록 조회 실패:', error)
      setAdvertisements([])
    } finally {
      setLoading(false)
    }
  }

  // 상태별 광고 필터링 (reviewStatus 기준)
  const getFilteredAds = (status) => {
    return advertisements.filter(ad => ad.reviewStatus === status)
  }

  // 탭 정보
  const tabs = [
    { id: 'RECRUITING', label: '모집중', icon: '📢' },
    { id: 'REVIEWING', label: '리뷰중', icon: '📝' },
    { id: 'CLOSED', label: '종료', icon: '📁' }
  ]

  // 현재 탭의 광고 목록
  const currentAds = getFilteredAds(activeTab)

  return (
    <div className="myads-container">
      <h2 className="myads-title">내 광고 관리</h2>

      {/* 탭 메뉴 */}
      <div className="myads-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`myads-tab ${activeTab === tab.id ? 'myads-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="myads-tab-icon">{tab.icon}</span>
            <span className="myads-tab-label">{tab.label}</span>
            <span className="myads-tab-count">{getFilteredAds(tab.id).length}</span>
          </button>
        ))}
      </div>

      {/* 광고 목록 */}
      <div className="myads-content">
        {loading ? (
          <div className="myads-loading">
            <p>광고 목록을 불러오는 중...</p>
          </div>
        ) : currentAds.length > 0 ? (
          <div className="myads-grid">
            {currentAds.map((ad) => (
              <MyAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="myads-empty">
            <p>
              {activeTab === 'RECRUITING' && '모집중인 광고가 없습니다.'}
              {activeTab === 'REVIEWING' && '리뷰 진행중인 광고가 없습니다.'}
              {activeTab === 'CLOSED' && '종료된 광고가 없습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAds
