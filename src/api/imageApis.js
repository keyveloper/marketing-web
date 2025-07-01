import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = 'http://localhost:8081'; // 실제 서버 주소로 변경

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 10초 타임아웃
});

// 요청 인터셉터 (선택사항 - 토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 예: 인증 토큰 추가
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (선택사항 - 에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // data만 반환
  },
  (error) => {
    console.error('API 에러:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ===== 이미지 API 함수들 =====

// 광고 ID로 이미지 가져오기
export const getImageUrlsByAdId = async (adId = {}) => {
  try {
    const data = await apiClient.get(`/open/image/advertisement/${adId}`);
    return data;
  } catch (error) {
    console.error('이미지 목록 가져오기 실패:', error);
    throw error;
  }
};

// 특정 이미지 가져오기
export const getImageById = async (id) => {
  try {
    const data = await apiClient.get(`/images/${id}`);
    return data;
  } catch (error) {
    console.error('이미지 가져오기 실패:', error);
    throw error;
  }
};

// 카테고리별 이미지 가져오기
export const getImagesByCategory = async (category) => {
  try {
    const data = await apiClient.get('/images', {
      params: { category } // 쿼리 파라미터
    });
    return data;
  } catch (error) {
    console.error('카테고리별 이미지 가져오기 실패:', error);
    throw error;
  }
};

// Fresh 광고 이미지 가져오기 (12개로 제한)
export const getFreshAdImages = async (limit = 12) => {
  try {
    const data = await apiClient.get('/images/fresh', {
      params: { limit }
    });
    return data;
  } catch (error) {
    console.error('Fresh 광고 이미지 가져오기 실패:', error);
    throw error;
  }
};

// Deadline 광고 이미지 가져오기 (12개로 제한)
export const getDeadlineAdImages = async (limit = 12) => {
  try {
    const data = await apiClient.get('/images/deadline', {
      params: { limit }
    });
    return data;
  } catch (error) {
    console.error('Deadline 광고 이미지 가져오기 실패:', error);
    throw error;
  }
};

// Hot 광고 이미지 가져오기 (12개로 제한)
export const getHotAdImages = async (limit = 12) => {
  try {
    const data = await apiClient.get('/images/hot', {
      params: { limit }
    });
    return data;
  } catch (error) {
    console.error('Hot 광고 이미지 가져오기 실패:', error);
    throw error;
  }
};

// 이미지 업로드
export const uploadImage = async (imageData) => {
  try {
    const data = await apiClient.post('/images', imageData);
    return data;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

// 이미지 삭제
export const deleteImage = async (id) => {
  try {
    const data = await apiClient.delete(`/images/${id}`);
    return data;
  } catch (error) {
    console.error('이미지 삭제 실패:', error);
    throw error;
  }
};

// 이미지 수정
export const updateImage = async (id, imageData) => {
  try {
    const data = await apiClient.put(`/images/${id}`, imageData);
    return data;
  } catch (error) {
    console.error('이미지 수정 실패:', error);
    throw error;
  }
};

// axios 인스턴스 export (다른 곳에서도 사용 가능)
export default apiClient;