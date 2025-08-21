import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * 리뷰 신청
 * @param {number} advertisementId - 광고 ID
 * @param {string} applyMemo - 신청 메모
 * @returns {Promise<{success: boolean, createdApplicationId?: number, error?: string}>}
 */
export const applyReview = async (advertisementId, applyMemo) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ 리뷰 신청 요청 시작...');
    console.log('📋 광고 ID:', advertisementId);
    console.log('📝 신청 메모:', applyMemo);

    // 요청 body 생성
    const requestBody = {
      advertisementId: advertisementId,
      applyMemo: applyMemo
    };

    // API 호출
    const response = await apiClient.post(
      '/review-application',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ 리뷰 신청 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, createdApplicationId } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '리뷰 신청에 실패했습니다.');
    }

    return {
      success: true,
      createdApplicationId: createdApplicationId,
    };
  } catch (error) {
    console.error('❌ 리뷰 신청 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '리뷰 신청 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 광고별 리뷰 신청 목록 조회
 * @param {number} advertisementId - 광고 ID
 * @returns {Promise<{success: boolean, applications?: Array, error?: string}>}
 */
export const getReviewApplicationsByAdvertisementId = async (advertisementId) => {
  try {
    console.log(`✅ 광고 ID ${advertisementId}의 리뷰 신청 목록 조회 시작...`);

    // API 호출 (인증 불필요 - open endpoint)
    const response = await apiClient.get(`/open/review-applications/${advertisementId}`);

    console.log('✅ 리뷰 신청 목록 조회 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, applications } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '리뷰 신청 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      applications: applications,
    };
  } catch (error) {
    console.error('❌ 리뷰 신청 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '리뷰 신청 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 광고별 리뷰 신청 목록 조회 (소유권 정보 포함 - 인증 필요)
 * @param {number} advertisementId - 광고 ID
 * @returns {Promise<{success: boolean, applications?: Array, error?: string}>}
 */
export const getReviewApplicationsWithOwnership = async (advertisementId) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log(`✅ 광고 ID ${advertisementId}의 리뷰 신청 목록 (소유권 포함) 조회 시작...`);

    // API 호출 (인증 필요)
    const response = await apiClient.get(
      `/review-applications/${advertisementId}/with-ownership`,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ 리뷰 신청 목록 (소유권 포함) 조회 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, applications } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '리뷰 신청 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      applications: applications,
    };
  } catch (error) {
    console.error('❌ 리뷰 신청 목록 (소유권 포함) 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '리뷰 신청 목록 조회 중 오류가 발생했습니다.',
    };
  }
};
