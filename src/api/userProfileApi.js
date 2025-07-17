import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * 새로운 Advertiser 프로필 draft 발급
 * @returns {Promise<{success: boolean, draftId?: string, draft?: object, error?: string}>}
 */
export const issueAdvertiserProfileDraft = async () => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ Advertiser Profile Draft 발급 요청 시작...');

    // API 호출
    const response = await apiClient.get(
      '/advertiser/profile/new-draft',
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      }
    );

    console.log('✅ Advertiser Profile Draft 발급 성공:', response);

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
    console.error('❌ Advertiser Profile Draft 발급 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile Draft 발급 중 오류가 발생했습니다.',
    };
  }
};

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
 * Draft ID로 프로필 draft 조회
 * @param {string} draftId - Draft UUID
 * @returns {Promise<{success: boolean, draft?: object, error?: string}>}
 */
export const getUserProfileDraftById = async (draftId) => {
  try {
    console.log(`✅ Profile Draft 조회 시작... draftId: ${draftId}`);

    // API 호출
    const response = await apiClient.get(`/user/profile/draft/${draftId}`);

    console.log('✅ Profile Draft 조회 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, userProfileDraft } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Profile Draft 조회에 실패했습니다.');
    }

    return {
      success: true,
      draft: userProfileDraft,
    };
  } catch (error) {
    console.error('❌ Profile Draft 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile Draft 조회 중 오류가 발생했습니다.',
    };
  }
};

/**
 * Advertiser 프로필 정보 업로드
 * @param {string} userProfileDraftId - User Profile Draft UUID
 * @param {string} serviceInfo - 서비스 정보
 * @param {string} locationBrief - 위치 간략 정보
 * @param {string|null} introduction - 소개 (선택)
 * @returns {Promise<{success: boolean, effectedRows?: number, error?: string}>}
 */
export const uploadAdvertiserProfileInfo = async (userProfileDraftId, serviceInfo, locationBrief, introduction) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ Advertiser Profile Info 업로드 요청 시작...');

    // 요청 body 생성
    const requestBody = {
      userProfileDraftId: userProfileDraftId,
      serviceInfo: serviceInfo,
      locationBrief: locationBrief,
      introduction: introduction
    };

    console.log('📋 Request Body:', requestBody);

    // API 호출
    const response = await apiClient.post(
      '/profile/info/advertiser',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Advertiser Profile Info 업로드 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, effectedRows } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Profile Info 업로드에 실패했습니다.');
    }

    return {
      success: true,
      effectedRows: effectedRows,
    };
  } catch (error) {
    console.error('❌ Advertiser Profile Info 업로드 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile Info 업로드 중 오류가 발생했습니다.',
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
