import apiClient from '../config/client.js';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Advertiser 프로필 이미지 업로드
 * @param {string} advertiserProfileDraftId - Advertiser Profile Draft UUID
 * @param {string} profileImageType - 프로필 이미지 타입 (enum: ProfileImageType)
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const uploadAdvertiserProfileImage = async (advertiserProfileDraftId, profileImageType, file) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ Advertiser Profile Image 업로드 요청 시작...');
    console.log('📎 File:', file.name, 'Type:', file.type, 'Size:', file.size);
    console.log('📋 Draft ID:', advertiserProfileDraftId);
    console.log('🖼️ Image Type:', profileImageType);

    // FormData 생성
    const formData = new FormData();

    // meta 정보를 JSON으로 추가 (RequestPart "meta")
    const meta = {
      advertiserProfileDraftId: advertiserProfileDraftId,
      profileImageType: profileImageType
    };

    // meta를 Blob으로 변환하여 추가 (application/json 타입)
    formData.append('meta', new Blob([JSON.stringify(meta)], { type: 'application/json' }));

    // 파일 추가 (RequestPart "file")
    formData.append('file', file);

    // API 호출
    const response = await apiClient.post(
      '/profile/image/advertiser',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Advertiser Profile Image 업로드 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, result } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Profile Image 업로드에 실패했습니다.');
    }

    return {
      success: true,
      result: result, // SaveUserProfileImageResult
    };
  } catch (error) {
    console.error('❌ Advertiser Profile Image 업로드 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile Image 업로드 중 오류가 발생했습니다.',
    };
  }
};

/**
 * Influencer 프로필 이미지 업로드
 * @param {string} influencerProfileDraftId - Influencer Profile Draft UUID
 * @param {string} profileImageType - 프로필 이미지 타입 (enum: ProfileImageType)
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
 */
export const uploadInfluencerProfileImage = async (influencerProfileDraftId, profileImageType, file) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    console.log('✅ Influencer Profile Image 업로드 요청 시작...');
    console.log('📎 File:', file.name, 'Type:', file.type, 'Size:', file.size);
    console.log('📋 Draft ID:', influencerProfileDraftId);
    console.log('🖼️ Image Type:', profileImageType);

    // FormData 생성
    const formData = new FormData();

    // draftId 정보를 JSON으로 추가 (RequestPart "draftId")
    const meta = {
      influencerProfileDraftId: influencerProfileDraftId,
      profileImageType: profileImageType
    };

    // meta를 Blob으로 변환하여 추가 (application/json 타입)
    formData.append('draftId', new Blob([JSON.stringify(meta)], { type: 'application/json' }));

    // 파일 추가 (RequestPart "file")
    formData.append('file', file);

    // API 호출
    const response = await apiClient.post(
      '/profile/image/influencer',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Influencer Profile Image 업로드 성공:', response);

    // response는 이미 data만 추출된 상태 (interceptor 때문)
    const { frontErrorCode, errorMessage, result } = response;

    // frontErrorCode 20000이 성공 코드
    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || 'Profile Image 업로드에 실패했습니다.');
    }

    return {
      success: true,
      result: result, // SaveUserProfileImageResult
    };
  } catch (error) {
    console.error('❌ Influencer Profile Image 업로드 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || 'Profile Image 업로드 중 오류가 발생했습니다.',
    };
  }
};
