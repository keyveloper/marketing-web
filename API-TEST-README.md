# Images API 테스트 가이드

## 📁 생성된 파일

```
marekting-web/
├── src/api/
│   ├── imageApis.js           # API 함수 (axios 사용)
│   └── images.test.js      # 테스트 코드
├── test-api.html           # 브라우저 테스트 페이지
└── API-TEST-README.md      # 이 파일
```

---

## 🚀 사용 방법

### 방법 1: 브라우저 테스트 페이지 (추천)

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **브라우저에서 테스트 페이지 열기**
   ```
   http://localhost:5173/test-api.html
   ```

3. **버튼 클릭으로 API 테스트**
   - GET 요청: 전체 이미지, 특정 이미지, 카테고리별
   - 광고 이미지: Fresh, Deadline, Hot
   - POST/PUT/DELETE: 업로드, 수정, 삭제
   - 전체 테스트: 모든 API 한번에 실행

4. **결과 확인**
   - 화면 하단의 "테스트 결과" 섹션에서 실시간 확인
   - 성공: 초록색
   - 실패: 빨간색
   - 정보: 파란색

---

### 방법 2: JavaScript 파일에서 import

```javascript
// 다른 .js 파일에서
import {
  testGetFreshAdImages,
  testGetDeadlineAdImages,
  testGetHotAdImages,
  runAllTests,
  runQuickTest
} from './src/api/images.test.js';

// 개별 테스트 실행
await testGetFreshAdImages();

// 빠른 테스트 (광고 이미지만)
const { fresh, deadline, hot } = await runQuickTest();

// 전체 테스트
const results = await runAllTests();
console.log('성공:', results.passed);
console.log('실패:', results.failed);
```

---

### 방법 3: 브라우저 콘솔

1. **개발 서버에서 애플리케이션 실행**
   ```bash
   npm run dev
   ```

2. **브라우저 개발자 도구 열기 (F12)**

3. **Console 탭에서 실행**
   ```javascript
   // 테스트 파일 import
   import('./src/api/images.test.js').then(module => {
     // 빠른 테스트
     module.runQuickTest();

     // 또는 전체 테스트
     // module.runAllTests();
   });
   ```

---

## 📋 사용 가능한 테스트 함수

### GET 요청 테스트

```javascript
// 1. 모든 이미지 가져오기
testGetImages()

// 2. 특정 이미지 가져오기
testGetImageById(1)  // ID: 1

// 3. 카테고리별 이미지
testGetImagesByCategory('hero')

// 4. Fresh 광고 이미지 (12개)
testGetFreshAdImages(12)

// 5. Deadline 광고 이미지 (12개)
testGetDeadlineAdImages(12)

// 6. Hot 광고 이미지 (12개)
testGetHotAdImages(12)
```

### POST/PUT/DELETE 테스트

```javascript
// 7. 이미지 업로드
testUploadImage()

// 8. 이미지 수정
testUpdateImage(1)  // ID: 1

// 9. 이미지 삭제
testDeleteImage(999)  // ID: 999
```

### 통합 테스트

```javascript
// 모든 API 테스트 실행
runAllTests()
// 결과:
// {
//   passed: 6,
//   failed: 3,
//   errors: [...]
// }

// 빠른 테스트 (광고 이미지만)
runQuickTest()
// 결과:
// {
//   fresh: [...],
//   deadline: [...],
//   hot: [...]
// }
```

---

## 🔧 API 서버 설정

테스트 전에 **실제 API 서버 주소**를 설정하세요:

**파일: `src/api/imageApis.js`**
```javascript
// 4행
const API_BASE_URL = 'https://your-api-server.com';  // 여기 수정!
```

---

## 📊 예상 API 응답 형식

### Fresh/Deadline/Hot 광고 이미지

```javascript
// GET /images/fresh?limit=12
[
  {
    id: 1,
    url: "https://example.com/image1.jpg",
    title: "광고 이미지 1",
    category: "fresh",
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: 2,
    url: "https://example.com/image2.jpg",
    title: "광고 이미지 2",
    category: "fresh",
    createdAt: "2025-01-15T11:00:00Z"
  }
  // ... 총 12개
]
```

---

## ✅ 테스트 체크리스트

- [ ] API 서버 주소 설정 완료
- [ ] 개발 서버 실행 (`npm run dev`)
- [ ] test-api.html 페이지 접속
- [ ] Fresh 광고 이미지 테스트
- [ ] Deadline 광고 이미지 테스트
- [ ] Hot 광고 이미지 테스트
- [ ] 전체 테스트 실행
- [ ] 콘솔에 에러 없음 확인

---

## 🐛 문제 해결

### CORS 에러 발생 시

```javascript
// src/api/images.js에서 withCredentials 추가
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // 추가
  // ...
});
```

### 타임아웃 에러 발생 시

```javascript
// src/api/imageApis.js 12행
timeout: 30000,  // 30초로 증가 (이미 설정됨)
```

### 404 Not Found 에러

- API 서버 주소가 올바른지 확인
- 엔드포인트 경로가 정확한지 확인
  - `/images/fresh`
  - `/images/deadline`
  - `/images/hot`

---

## 📝 참고사항

1. **App.jsx와 독립적**: 이 테스트는 App.jsx와 관계없이 독립적으로 실행됩니다.

2. **Mock 서버 필요**: 실제 API 서버가 없다면 다음을 시도하세요:
   ```javascript
   // images.js에서 임시로 Mock 데이터 반환
   export const getFreshAdImages = async (limit = 12) => {
     return Array.from({ length: limit }, (_, i) => ({
       id: i + 1,
       url: `https://via.placeholder.com/250/${i}`,
       title: `Fresh ${i + 1}`,
       category: 'fresh'
     }));
   };
   ```

3. **테스트 순서**: GET → POST → PUT → DELETE 순서로 테스트하는 것을 추천합니다.

---

## 🎯 다음 단계

테스트 완료 후 App.jsx에서 사용:

```javascript
// App.jsx
import { useState, useEffect } from 'react'
import { getFreshAdImages, getDeadlineAdImages, getHotAdImages } from './api/images'

function App() {
  const [freshAdImageUrl, setFreshAdImageUrl] = useState([])
  const [deadlineAdImageUrl, setDeadlineAdImageUrl] = useState([])
  const [hotAdImageUrl, setHotAdImageUrl] = useState([])

  useEffect(() => {
    const fetchImages = async () => {
      const fresh = await getFreshAdImages(12)
      const deadline = await getDeadlineAdImages(12)
      const hot = await getHotAdImages(12)

      setFreshAdImageUrl(fresh)
      setDeadlineAdImageUrl(deadline)
      setHotAdImageUrl(hot)
    }

    fetchImages()
  }, [])

  return (
    <Image12Slider images={freshAdImageUrl} />
  )
}
```