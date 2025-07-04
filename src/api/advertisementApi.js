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
 * 일반 광고 등록
 * @param {object} advertisementData - 광고 데이터
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const createAdvertisement = async (advertisementData) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ 광고 등록 요청 시작...', advertisementData);

    // MakeNewAdvertisementGeneralRequest 형식으로 요청 준비
    const requestBody = {
      title: advertisementData.title,
      reviewType: advertisementData.reviewType,
      channelType: advertisementData.channelType,
      recruitmentNumber: parseInt(advertisementData.recruitmentNumber, 10),
      itemName: advertisementData.itemName,
      recruitmentStartAt: advertisementData.recruitmentStartAt, // epoch time
      siteUrl: advertisementData.siteUrl || null,
      itemInfo: advertisementData.itemInfo || null,
      deliveryCategories: advertisementData.deliveryCategories || null,
      thumbnailImageMetaId: advertisementData.thumbnailImageMetaId || null,
      draftId: advertisementData.draftId,
    };

    console.log('📤 Request body:', requestBody);

    // API 호출
    const response = await apiClient.post(
      '/advertisement/general',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ 광고 등록 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, result } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '광고 등록에 실패했습니다.');
    }

    // result: { entityId, connectingResultFromApiServer }
    console.log('📋 광고 등록 결과:', {
      entityId: result.entityId,
      connectingResult: result.connectingResultFromApiServer,
    });

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 광고 등록 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '광고 등록 중 오류가 발생했습니다.',
    };
  }
};
