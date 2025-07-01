import apiClient from '../config/client.js';

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