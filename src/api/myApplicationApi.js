import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * 내 신청 목록 조회
 * GET /my-applications
 * @returns {Promise<{success: boolean, result?: {thumbnailAdCardWithAppliedInfo: Array}, error?: string}>}
 */
export const getMyApplications = async () => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ 내 신청 목록 조회 시작...');

    // API 호출
    const response = await apiClient.get(
      '/my-applications',
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ 내 신청 목록 조회 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '내 신청 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 내 신청 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '내 신청 목록 조회 중 오류가 발생했습니다.',
    };
  }
};
