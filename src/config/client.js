import axios from "axios";

// API 기본 URL 설정 (환경에 따라 자동 변경)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
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

// axios 인스턴스 export (다른 곳에서도 사용 가능)
export default apiClient;
