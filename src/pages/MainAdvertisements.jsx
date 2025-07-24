import { useNavigate } from 'react-router-dom'
import AdCard from '../components/AdCard.jsx'
import './MainAdvertisements.css'

function MainAdvertisements() {
  const navigate = useNavigate()

  // Mock 광고 데이터
  const advertisementsData = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop',
      channelType: 'INSTAGRAM',
      reviewType: 'VISIT',
      title: '신상 카페 방문 리뷰',
      itemInfo: '서울 강남구 신논현역 근처 새로 오픈한 카페',
      currentApplicants: 5,
      maxApplicants: 10,
      recruitmentEndAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      channelType: 'YOUTUBE',
      reviewType: 'DELIVERY',
      title: '신상 립스틱 컬렉션',
      itemInfo: '2025 S/S 시즌 한정판 립스틱 5종',
      currentApplicants: 8,
      maxApplicants: 15,
      recruitmentEndAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
      channelType: 'BLOG',
      reviewType: 'VISIT',
      title: '여름 시즌 패션 아이템',
      itemInfo: '트렌디한 여름 의류 및 액세서리',
      currentApplicants: 3,
      maxApplicants: 10,
      recruitmentEndAt: Date.now() + 10 * 24 * 60 * 60 * 1000,
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      channelType: 'INSTAGRAM',
      reviewType: 'VISIT',
      title: '이탈리안 레스토랑',
      itemInfo: '신선한 재료로 만든 정통 이탈리안 파스타',
      currentApplicants: 7,
      maxApplicants: 12,
      recruitmentEndAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=400&fit=crop',
      channelType: 'YOUTUBE',
      reviewType: 'DELIVERY',
      title: '프리미엄 햄버거',
      itemInfo: '100% 순수 소고기 패티 수제 버거',
      currentApplicants: 12,
      maxApplicants: 20,
      recruitmentEndAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: 6,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      channelType: 'BLOG',
      reviewType: 'DELIVERY',
      title: '무선 헤드폰',
      itemInfo: '노이즈 캔슬링 프리미엄 헤드폰',
      currentApplicants: 6,
      maxApplicants: 10,
      recruitmentEndAt: Date.now() + 8 * 24 * 60 * 60 * 1000,
    },
    {
      id: 7,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      channelType: 'INSTAGRAM',
      reviewType: 'DELIVERY',
      title: '스마트 워치',
      itemInfo: '건강 관리 기능이 탑재된 최신 스마트워치',
      currentApplicants: 9,
      maxApplicants: 15,
      recruitmentEndAt: Date.now() + 6 * 24 * 60 * 60 * 1000,
    },
    {
      id: 8,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
      channelType: 'YOUTUBE',
      reviewType: 'DELIVERY',
      title: '미러리스 카메라',
      itemInfo: '4K 동영상 촬영 가능한 프로페셔널 카메라',
      currentApplicants: 4,
      maxApplicants: 8,
      recruitmentEndAt: Date.now() + 12 * 24 * 60 * 60 * 1000,
    },
    {
      id: 9,
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
      channelType: 'BLOG',
      reviewType: 'VISIT',
      title: '선글라스 브랜드샵',
      itemInfo: 'UV 차단 프리미엄 선글라스 컬렉션',
      currentApplicants: 11,
      maxApplicants: 20,
      recruitmentEndAt: Date.now() + 4 * 24 * 60 * 60 * 1000,
    },
  ]

  const handleAdClick = (adId) => {
    navigate(`/advertisement/${adId}`)
  }

  return (
    <div className="main-advertisements">
      <div className="main-advertisements-header">
        <h1 className="main-advertisements-title">전체 광고</h1>
        <p className="main-advertisements-subtitle">다양한 브랜드와 함께하는 리뷰 기회</p>
      </div>

      <div className="main-advertisements-grid">
        {advertisementsData.map((ad) => (
          <AdCard key={ad.id} adData={ad} onClick={handleAdClick} />
        ))}
      </div>
    </div>
  )
}

export default MainAdvertisements
