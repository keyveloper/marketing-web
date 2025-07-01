import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = 'http://localhost:8080';

/**
 * 광고 이미지 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @param {number} advertisementDraftId - draft ID
 * @param {boolean} isThumbnail - 썸네일 여부
 * @returns {Promise<{success: boolean, imageInfo?: AdvertisementImageInfo, error?: string}>}
 */
export const uploadAdvertisementImage = async (file, advertisementDraftId, isThumbnail = false) => {
  try {
    // Cognito에서 idToken 가져오기
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
    }

    // FormData 생성
    const formData = new FormData();

    // meta 부분 (UploadAdvertisementImageRequestFromClient)
    const meta = {
      advertisementDraftId: advertisementDraftId,
      isThumbnail: isThumbnail,
    };
    const metaBlob = new Blob([JSON.stringify(meta)], { type: 'application/json' });
    formData.append('meta', metaBlob);

    // file 부분
    formData.append('file', file);

    console.log('📤 이미지 업로드 시작:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      draftId: advertisementDraftId,
      isThumbnail,
    });

    // API 호출
    const response = await axios.post(
      `${API_BASE_URL}/image/advertisement`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ 이미지 업로드 성공:', response.data);

    // UploadAdvertisementImageResponseToClient
    const { frontErrorCode, errorMessage, result } = response.data;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '이미지 업로드에 실패했습니다.');
    }

    // result는 AdvertisementImageInfo 타입
    // {
    //   id: Long,
    //   s3Key: String,
    //   bucketName: String,
    //   contentType: String,
    //   size: Long,
    //   originalFileName: String?
    // }
    console.log('📷 업로드된 이미지 정보:', {
      id: result.id,
      s3Key: result.s3Key,
      bucketName: result.bucketName,
      contentType: result.contentType,
      size: result.size,
      originalFileName: result.originalFileName,
    });

    return {
      success: true,
      imageInfo: result,
    };
  } catch (error) {
    console.error('❌ 이미지 업로드 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '이미지 업로드 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 광고 ID로 이미지 가져오기
 * @param {number} adId - 광고 ID
 * @returns {Promise<{success: boolean, images?: array, error?: string}>}
 */
export const fetchAdvertisementImages = async (adId) => {
  try {
    console.log('📥 광고 이미지 조회 시작:', adId);

    const response = await axios.get(
      `${API_BASE_URL}/open/image/advertisement/${adId}`
    );

    console.log('✅ 광고 이미지 조회 성공:', response.data);

    const { frontErrorCode, errorMessage, result } = response.data;

    if (frontErrorCode !== 20000) {
      throw new Error(errorMessage || '이미지 조회에 실패했습니다.');
    }

    return {
      success: true,
      images: result,
    };
  } catch (error) {
    console.error('❌ 광고 이미지 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message || '이미지 조회 중 오류가 발생했습니다.',
    };
  }
};
