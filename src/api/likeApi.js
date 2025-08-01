import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * 좋아요
 * POST /api/v1/like/ad
 * @param {number} advertisementId - 광고 ID
 * @returns {Promise<{success: boolean, result?: {likedAdvertisement?: object}, error?: string}>}
 */
export const likeAdvertisement = async (advertisementId) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log(`✅ 좋아요 요청 시작... advertisementId: ${advertisementId}`);

    const requestBody = {
      advertisementId: advertisementId,
    };

    // API 호출
    const response = await apiClient.post(
      '/api/v1/like/ad',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ 좋아요 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '좋아요에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 좋아요 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '좋아요 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 좋아요 취소
 * POST /api/v1/like/ad/unlike
 * @param {number} advertisementId - 광고 ID
 * @returns {Promise<{success: boolean, result?: {effectedRow?: number}, error?: string}>}
 */
export const unlikeAdvertisement = async (advertisementId) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log(`✅ 좋아요 취소 요청 시작... advertisementId: ${advertisementId}`);

    const requestBody = {
      advertisementId: advertisementId,
    };

    // API 호출
    const response = await apiClient.post(
      '/api/v1/like/ad/unlike',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ 좋아요 취소 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '좋아요 취소에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 좋아요 취소 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '좋아요 취소 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 인플루언서가 좋아요한 광고 목록 조회
 * GET /api/v1/like/influencer/{influencerId}
 * @param {string} influencerId - 인플루언서 UUID
 * @returns {Promise<{success: boolean, result?: {influencerId: string, advertisementIds: number[]}, error?: string}>}
 */
export const getLikedAdsByInfluencerId = async (influencerId) => {
  try {
    console.log(`✅ 좋아요한 광고 목록 조회 시작... influencerId: ${influencerId}`);

    // API 호출
    const response = await apiClient.get(`/api/v1/like/influencer/${influencerId}`);

    console.log('✅ 좋아요한 광고 목록 조회 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '좋아요한 광고 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 좋아요한 광고 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '좋아요한 광고 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 광고를 좋아요한 인플루언서 목록 조회
 * GET /api/v1/like/advertisement/{advertisementId}
 * @param {number} advertisementId - 광고 ID
 * @returns {Promise<{success: boolean, result?: {advertisementId: number, influencerIds: string[]}, error?: string}>}
 */
export const getInfluencersByAdId = async (advertisementId) => {
  try {
    console.log(`✅ 좋아요한 인플루언서 목록 조회 시작... advertisementId: ${advertisementId}`);

    // API 호출
    const response = await apiClient.get(`/api/v1/like/advertisement/${advertisementId}`);

    console.log('✅ 좋아요한 인플루언서 목록 조회 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '좋아요한 인플루언서 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 좋아요한 인플루언서 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '좋아요한 인플루언서 목록 조회 중 오류가 발생했습니다.',
    };
  }
};
