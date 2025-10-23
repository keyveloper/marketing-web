/**
 * imageApis.js API 테스트 파일
 *
 * 실행 방법:
 * 1. Node.js 환경: node src/api/images.test.js
 * 2. 브라우저 콘솔: 이 파일을 import하여 실행
 */

import {
  getImageUrlsByAdId,
  getImageById,
  getImagesByCategory,
  getFreshAdImages,
  getDeadlineAdImages,
  getHotAdImages,
  uploadImage,
  deleteImage,
  updateImage
} from './imageApis.js';

// 테스트 결과 출력 헬퍼
const logSuccess = (testName, data) => {
  console.log(`✅ ${testName} 성공:`, data);
};

const logError = (testName, error) => {
  console.error(`❌ ${testName} 실패:`, error.message);
};

// ===== 테스트 함수들 =====

// 1. 광고 ID로 이미지 가져오기 테스트
export const testGetImageUrlsByAdId = async (adId) => {
  try {
    console.log("start testGetImageUrlsByAdId!!")
    const data = await getImageUrlsByAdId(adId);
    logSuccess(`getImageUrlsByAdId(${adId})`, data);
    console.log(`  → 반환된 이미지 개수: ${data?.length || 0}`);
    return data;
  } catch (error) {
    logError(`getImageUrlsByAdId(${adId})`, error);
    throw error;
  }
};

// 1-1. 파라미터 없이 모든 이미지 가져오기
export const testGetAllImages = async () => {
  console.log('📥 파라미터 없이 모든 이미지 가져오기');
  return await testGetImageUrlsByAdId();
};

// 1-2. 특정 광고 ID로 이미지 가져오기
export const testGetImagesByAdId = async (adId = 1) => {
  console.log(`📥 광고 ID ${adId}로 이미지 가져오기`);
  return await testGetImageUrlsByAdId(adId);
};

// 1-3. 광고 ID + limit 옵션
export const testGetImagesByAdIdWithLimit = async (adId = 1, limit = 10) => {
  console.log(`📥 광고 ID ${adId}로 이미지 가져오기 (limit: ${limit})`);
  return await testGetImageUrlsByAdId(adId, { limit });
};

// 1-4. 광고 ID + 여러 옵션
export const testGetImagesByAdIdWithOptions = async (adId = 1) => {
  console.log(`📥 광고 ID ${adId}로 이미지 가져오기 (모든 옵션)`);
  return await testGetImageUrlsByAdId(adId, {
    limit: 12,
    offset: 0,
    category: 'fresh'
  });
};

// 2. 특정 이미지 가져오기 테스트
export const testGetImageById = async (id = 1) => {
  try {
    const data = await getImageById(id);
    logSuccess(`getImageById(${id})`, data);
    return data;
  } catch (error) {
    logError(`getImageById(${id})`, error);
    throw error;
  }
};

// 3. 카테고리별 이미지 가져오기 테스트
export const testGetImagesByCategory = async (category = 'hero') => {
  try {
    const data = await getImagesByCategory(category);
    logSuccess(`getImagesByCategory('${category}')`, data);
    return data;
  } catch (error) {
    logError(`getImagesByCategory('${category}')`, error);
    throw error;
  }
};

// 4. Fresh 광고 이미지 가져오기 테스트
export const testGetFreshAdImages = async (limit = 12) => {
  try {
    const data = await getFreshAdImages(limit);
    logSuccess(`getFreshAdImages(${limit})`, data);
    console.log(`  → 반환된 이미지 개수: ${data?.length || 0}`);
    return data;
  } catch (error) {
    logError(`getFreshAdImages(${limit})`, error);
    throw error;
  }
};

// 5. Deadline 광고 이미지 가져오기 테스트
export const testGetDeadlineAdImages = async (limit = 12) => {
  try {
    const data = await getDeadlineAdImages(limit);
    logSuccess(`getDeadlineAdImages(${limit})`, data);
    console.log(`  → 반환된 이미지 개수: ${data?.length || 0}`);
    return data;
  } catch (error) {
    logError(`getDeadlineAdImages(${limit})`, error);
    throw error;
  }
};

// 6. Hot 광고 이미지 가져오기 테스트
export const testGetHotAdImages = async (limit = 12) => {
  try {
    const data = await getHotAdImages(limit);
    logSuccess(`getHotAdImages(${limit})`, data);
    console.log(`  → 반환된 이미지 개수: ${data?.length || 0}`);
    return data;
  } catch (error) {
    logError(`getHotAdImages(${limit})`, error);
    throw error;
  }
};

// 7. 이미지 업로드 테스트
export const testUploadImage = async () => {
  const mockImageData = {
    title: '테스트 이미지',
    url: 'https://via.placeholder.com/250',
    category: 'test',
    description: 'API 테스트용 이미지'
  };

  try {
    const data = await uploadImage(mockImageData);
    logSuccess('uploadImage()', data);
    return data;
  } catch (error) {
    logError('uploadImage()', error);
    throw error;
  }
};

// 8. 이미지 수정 테스트
export const testUpdateImage = async (id = 1) => {
  const mockUpdateData = {
    title: '수정된 이미지',
    description: '업데이트 테스트'
  };

  try {
    const data = await updateImage(id, mockUpdateData);
    logSuccess(`updateImage(${id})`, data);
    return data;
  } catch (error) {
    logError(`updateImage(${id})`, error);
    throw error;
  }
};

// 9. 이미지 삭제 테스트
export const testDeleteImage = async (id = 999) => {
  try {
    const data = await deleteImage(id);
    logSuccess(`deleteImage(${id})`, data);
    return data;
  } catch (error) {
    logError(`deleteImage(${id})`, error);
    throw error;
  }
};

// ===== 전체 테스트 실행 =====

export const runAllTests = async () => {
  console.log('\n========================================');
  console.log('🧪 imageApis.js API 테스트 시작');
  console.log('========================================\n');

  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  // GET 요청 테스트
  console.log('📥 GET 요청 테스트\n');

  try {
    await testGetImageUrlsByAdId();
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'getImages', error });
  }

  try {
    await testGetImageById(1);
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'getImageById', error });
  }

  try {
    await testGetImagesByCategory('hero');
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'getImagesByCategory', error });
  }

  console.log('\n📊 광고 이미지 API 테스트\n');

  try {
    await testGetFreshAdImages(12);
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'getFreshAdImages', error });
  }

  try {
    await testGetDeadlineAdImages(12);
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'getDeadlineAdImages', error });
  }

  try {
    await testGetHotAdImages(12);
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'getHotAdImages', error });
  }

  // POST 요청 테스트
  console.log('\n📤 POST 요청 테스트\n');

  try {
    await testUploadImage();
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'uploadImage', error });
  }

  // PUT 요청 테스트
  console.log('\n✏️ PUT 요청 테스트\n');

  try {
    await testUpdateImage(1);
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'updateImage', error });
  }

  // DELETE 요청 테스트
  console.log('\n🗑️ DELETE 요청 테스트\n');

  try {
    await testDeleteImage(999);
    results.passed++;
  } catch (error) {
    results.failed++;
    results.errors.push({ test: 'deleteImage', error });
  }

  // 결과 출력
  console.log('\n========================================');
  console.log('📊 테스트 결과');
  console.log('========================================');
  console.log(`✅ 성공: ${results.passed}`);
  console.log(`❌ 실패: ${results.failed}`);
  console.log(`📈 성공률: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);

  if (results.errors.length > 0) {
    console.log('\n❌ 실패한 테스트 상세:');
    results.errors.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error.message}`);
    });
  }

  console.log('\n========================================\n');

  return results;
};

// 개별 테스트 실행 (선택적)
export const runQuickTest = async () => {
  console.log('🚀 빠른 테스트 실행 (Fresh, Deadline, Hot 이미지만)');

  try {
    const fresh = await testGetFreshAdImages(12);
    const deadline = await testGetDeadlineAdImages(12);
    const hot = await testGetHotAdImages(12);

    console.log('\n✅ 모든 광고 이미지 API 정상 작동');
    return { fresh, deadline, hot };
  } catch (error) {
    console.error('\n❌ 광고 이미지 API 에러 발생');
    throw error;
  }
};

// 자동 실행 (주석 해제하면 import 시 자동 실행됨)
// runAllTests();