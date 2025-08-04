import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * 광고주 팔로우
 * POST /api/v1/follow
 * @param {string} advertiserId - 광고주 UUID
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 * result: { advertiserId, influencerId, followStatus, createdAt, updatedAt }
 */
export const followAdvertiser = async (advertiserId) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log(`✅ Follow 요청 시작... advertiserId: ${advertiserId}`);

    const response = await apiClient.post(
      '/follow',
      { advertiserId },
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Follow 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '팔로우에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ Follow 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '팔로우 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 광고주 언팔로우
 * POST /api/v1/follow/unfollow
 * @param {string} advertiserId - 광고주 UUID
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 * result: { effectedRow }
 */
export const unfollowAdvertiser = async (advertiserId) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log(`✅ Unfollow 요청 시작... advertiserId: ${advertiserId}`);

    const response = await apiClient.post(
      '/follow/unfollow',
      { advertiserId },
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Unfollow 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '언팔로우에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ Unfollow 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '언팔로우 중 오류가 발생했습니다.',
    };
  }
};
