import apiClient from '../config/client.js';

/**
 * 광고 ID로 광고주 프로필 요약 조회
 * GET /advertisement-owner/{advertisementId}
 * @param {number} advertisementId - 광고 ID
 * @returns {Promise<{success: boolean, result?: Object, error?: string}>}
 */
export const getAdvertiserProfileByAdvertisementId = async (advertisementId) => {
  try {
    console.log(`🟦 광고주 프로필 요약 조회 중... advertisementId: ${advertisementId}`);

    const response = await apiClient.get(`/summary/advertisement-owner/${advertisementId}`);

    console.log('✅ 광고주 프로필 요약 조회 성공:', response);

    const { frontErrorCode, errorMessage, result } = response;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '광고주 프로필 조회에 실패했습니다.');
    }

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error('❌ 광고주 프로필 요약 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '광고주 프로필 조회 중 오류가 발생했습니다.',
    };
  }
};
