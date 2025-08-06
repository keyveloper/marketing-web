import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Cognito에서 idToken 가져오기
 */
const getIdToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    console.log('🟦 비로그인 상태');
    return null;
  }
};

/**
 * 내 광고 목록 조회 (광고주 전용)
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 * result: {
 *   advertisements: [{
 *     id, advertiserId, title, reviewType, channelType, recruitmentNumber,
 *     itemName, recruitmentStartAt, recruitmentEndAt, announcementAt,
 *     reviewStartAt, reviewEndAt, endAt, liveStatus, reviewStatus,
 *     siteUrl, itemInfo, draftId, createdAt, updatedAt
 *   }]
 * }
 */
export const getMyAdvertisements = async () => {
  try {
    const idToken = await getIdToken();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('🟦 내 광고 목록 조회 시작...');

    const response = await apiClient.get('/my-advertisement', {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });

    console.log('✅ 내 광고 목록 조회 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '내 광고 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 내 광고 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '내 광고 목록 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 받은 신청 목록 조회 (광고주 전용)
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 * result: {
 *   offeredAdvertisements: [{
 *     offeredAdvertisementSummary: {
 *       advertisementId, title, reviewType, channelType, recruitmentNumber,
 *       itemName, thumbnailUrl, recruitmentStartAt, recruitmentEndAt,
 *       reviewStartAt, reviewEndAt, ...
 *     },
 *     offeredApplicationInfos: [{
 *       applicationId, influencerId, influencerUsername, influencerEmail,
 *       influencerMobile, applicationReviewStatus, applyMemo,
 *       applicationCreatedAt, applicationUpdatedAt
 *     }]
 *   }]
 * }
 */
export const getOfferedApplications = async () => {
  try {
    const idToken = await getIdToken();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('🟦 받은 신청 목록 조회 시작...');

    const response = await apiClient.get('/my-advertisement/offered-applications', {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });

    console.log('✅ 받은 신청 목록 조회 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '받은 신청 목록 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 받은 신청 목록 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '받은 신청 목록 조회 중 오류가 발생했습니다.',
    };
  }
};
