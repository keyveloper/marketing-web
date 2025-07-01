import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * 새로운 광고 draft 발급
 * @returns {Promise<{success: boolean, draftId?: number, draft?: object, error?: string}>}
 */
export const issueDraft = async () => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ Draft 발급 요청 시작...');

    // API 호출
    const response = await apiClient.post(
      '/advertisement/new-draft',
      {}, // body는 비어있음
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ Draft 발급 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, advertisementDraft } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Draft 발급에 실패했습니다.');
    }

    return {
      success: true,
      draftId: advertisementDraft.id,
      draft: advertisementDraft,
    };
  } catch (error) {
    console.error('❌ Draft 발급 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Draft 발급 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 광고 생성 (draft 사용)
 * @param {object} advertisementData - 광고 데이터
 * @param {number} draftId - draft ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createAdvertisement = async (advertisementData, draftId) => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ 광고 생성 요청 시작...', { draftId, advertisementData });

    // API 호출 (실제 엔드포인트에 맞게 수정 필요)
    const response = await apiClient.post(
      '/advertisement',
      {
        ...advertisementData,
        draftId,
      },
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ 광고 생성 성공:', response);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ 광고 생성 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '광고 생성 중 오류가 발생했습니다.',
    };
  }
};
