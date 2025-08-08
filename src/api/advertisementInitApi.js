import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Cognito에서 idToken 가져오기 (Influencer인 경우만, 그 외는 null 반환)
 */
const getIdToken = async () => {
  try {
    // userType이 INFLUENCER인 경우만 토큰 반환
    const userType = localStorage.getItem('userType');
    if (!userType || !userType.startsWith('INFLUENCER')) {
      console.log('🟦 비로그인 또는 Influencer가 아님 - Authorization 없이 호출');
      return null;
    }

    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    console.log('🟦 비로그인 상태');
    return null;
  }
};

/**
 * Fresh 광고 목록 조회 (최신 등록)
 * - 비로그인: 좋아요 정보 없이 반환
 * - 로그인: 좋아요 정보 포함 반환
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const getInitFreshAdvertisements = async () => {
  try {
    const idToken = await getIdToken();

    console.log('🟦 Fresh 광고 목록 조회 시작...', idToken ? '(로그인)' : '(비로그인)');

    const headers = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    const response = await apiClient.get('/init/advertisement/fresh', { headers });

    console.log('✅ Fresh 광고 목록 조회 성공:', response);
    console.log('✅ Fresh thumbnailAdCards:', response.result?.thumbnailAdCards);
    console.log('✅ Fresh isLiked 값들:', response.result?.thumbnailAdCards?.map(card => ({ id: card.advertisementId, isLiked: card.isLiked })));

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Fresh 광고 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ Fresh 광고 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Fresh 광고 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * Deadline 광고 목록 조회 (마감 임박)
 * - 비로그인: 좋아요 정보 없이 반환
 * - 로그인: 좋아요 정보 포함 반환
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const getInitDeadlineAdvertisements = async () => {
  try {
    const idToken = await getIdToken();

    console.log('🟦 Deadline 광고 목록 조회 시작...', idToken ? '(로그인)' : '(비로그인)');

    const headers = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    const response = await apiClient.get('/init/advertisement/deadline', { headers });

    console.log('✅ Deadline 광고 목록 조회 성공:', response);
    console.log('✅ Deadline isLiked 값들:', response.result?.thumbnailAdCards?.map(card => ({ id: card.advertisementId, isLiked: card.isLiked })));

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Deadline 광고 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ Deadline 광고 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Deadline 광고 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * Hot 광고 목록 조회 (인기 - 지원자 수 기준)
 * - 비로그인: 좋아요 정보 없이 반환
 * - 로그인: 좋아요 정보 포함 반환
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const getInitHotAdvertisements = async () => {
  try {
    const idToken = await getIdToken();

    console.log('🟦 Hot 광고 목록 조회 시작...', idToken ? '(로그인)' : '(비로그인)');

    const headers = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    const response = await apiClient.get('/init/advertisement/hot', { headers });

    console.log('✅ Hot 광고 목록 조회 성공:', response);
    console.log('✅ Hot isLiked 값들:', response.result?.thumbnailAdCards?.map(card => ({ id: card.advertisementId, isLiked: card.isLiked })));

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Hot 광고 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ Hot 광고 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Hot 광고 목록 조회 중 오류가 발생했습니다.',
    };
  }
};
