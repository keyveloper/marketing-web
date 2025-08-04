import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * 새로운 Influencer 프로필 draft 발급
 * @returns {Promise<{success: boolean, draftId?: string, draft?: object, error?: string}>}
 */
export const issueInfluencerProfileDraft = async () => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ Influencer Profile Draft 발급 요청 시작...');

    // API 호출
    const response = await apiClient.get(
      '/influencer/profile/new-draft',
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ Influencer Profile Draft 발급 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, userProfileDraft } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Profile Draft 발급에 실패했습니다.');
    }

    return {
      success: true,
      draftId: userProfileDraft.id,
      draft: userProfileDraft,
    };
  } catch (error) {
    console.error('❌ Influencer Profile Draft 발급 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile Draft 발급 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 인플루언서 프로필 조회
 * @param {string} influencerId - 인플루언서 ID
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const getInfluencerProfile = async (influencerId) => {
  try {
    console.log(`✅ Influencer Profile 조회 요청 시작... influencerId: ${influencerId}`);

    // API 호출
    const response = await apiClient.get(`/profile/info/influencer/${influencerId}`);

    console.log('✅ Influencer Profile 조회 성공:', response);

    const { result, httpStatus, msaServiceErrorCode, errorMessage } = response;

    // NOT_FOUND인 경우 프로필 없음
    if (httpStatus === 'NOT_FOUND' || msaServiceErrorCode === 'NOT_FOUND_INFLUENCER_PROFILE') {
      return {
        success: true,
        result: null,
      };
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ Influencer Profile 조회 실패:', error);
    // 404인 경우 프로필 없음으로 처리
    if (error.response?.status === 404) {
      return {
        success: true,
        result: null,
      };
    }
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * Influencer 프로필 정보 업로드
 * @param {string} userProfileDraftId - User Profile Draft UUID
 * @param {string|null} introduction - 자기소개 (선택)
 * @param {string|null} job - 직업 (선택)
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const uploadInfluencerProfileInfo = async (userProfileDraftId, introduction, job) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ Influencer Profile Info 업로드 요청 시작...');

    // 요청 body 생성
    const requestBody = {
      userProfileDraftId: userProfileDraftId,
      introduction: introduction,
      job: job
    };

    console.log('📋 Request Body:', requestBody);

    // API 호출
    const response = await apiClient.post(
      '/profile/info/influencer',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Influencer Profile Info 업로드 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, result } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Profile Info 업로드에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ Influencer Profile Info 업로드 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile Info 업로드 중 오류가 발생했습니다.',
    };
  }
};
