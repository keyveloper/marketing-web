import { signUp, confirmSignUp, signIn, signOut, fetchUserAttributes } from 'aws-amplify/auth';

/**
 * 전화번호를 국제 형식으로 변환
 * 010-1234-5678 → +821012345678
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';

  // 숫자만 추출
  const cleaned = phone.replace(/[^0-9]/g, '');

  // 이미 +82로 시작하는 경우
  if (phone.startsWith('+82')) {
    return phone.replace(/[^0-9+]/g, '');
  }

  // 010으로 시작하는 경우
  if (cleaned.startsWith('010')) {
    return `+82${cleaned.substring(1)}`;
  }

  // 그 외의 경우
  return `+82${cleaned}`;
}

/**
 * Cognito 회원가입
 */
export async function registerUser({ username, email, password, phoneNumber, name, userType }) {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
          phone_number: formattedPhone,
          name,
          'custom:userType': userType,
        },
      },
    });

    return {
      success: true,
      isSignUpComplete,
      userId,
      nextStep, // { signUpStep: 'CONFIRM_SIGN_UP', ... }
      username,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return {
      success: false,
      error: error.message,
      code: error.name || error.code,
    };
  }
}

/**
 * 이메일/SMS 인증 코드 확인
 */
export async function confirmUserSignUp(username, code) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username,
      confirmationCode: code,
    });

    return {
      success: true,
      isSignUpComplete,
      nextStep,
    };
  } catch (error) {
    console.error('Confirm sign up error:', error);
    return {
      success: false,
      error: error.message,
      code: error.name || error.code,
    };
  }
}

/**
 * 로그인
 */
export async function loginUser(username, password) {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username,
      password,
    });

    // 로그인 성공 시 사용자 속성 가져오기
    if (isSignedIn) {
      try {
        const userAttributes = await fetchUserAttributes();
        const userType = userAttributes['custom:userType'];

        // userType을 localStorage에 저장
        if (userType) {
          localStorage.setItem('userType', userType);
          console.log('✅ userType 저장됨:', userType);
        }
      } catch (attrError) {
        console.error('사용자 속성 가져오기 실패:', attrError);
        // 속성 가져오기 실패해도 로그인은 성공으로 처리
      }
    }

    return {
      success: true,
      isSignedIn,
      nextStep,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message,
      code: error.name || error.code,
    };
  }
}

/**
 * 로그아웃
 */
export async function logoutUser() {
  try {
    await signOut();

    // localStorage에서 userType 삭제
    localStorage.removeItem('userType');
    console.log('✅ userType 삭제됨');

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Cognito 에러 메시지를 한글로 변환
 */
export function getErrorMessage(code) {
  const errorMessages = {
    UsernameExistsException: '이미 존재하는 아이디입니다.',
    InvalidPasswordException: '비밀번호가 정책을 만족하지 않습니다.',
    InvalidParameterException: '입력값이 올바르지 않습니다. (이메일/전화번호 형식 확인)',
    UserNotFoundException: '존재하지 않는 사용자입니다.',
    NotAuthorizedException: '아이디 또는 비밀번호가 올바르지 않습니다.',
    UserNotConfirmedException: '이메일/SMS 인증이 완료되지 않았습니다.',
    CodeMismatchException: '인증 코드가 일치하지 않습니다.',
    ExpiredCodeException: '인증 코드가 만료되었습니다.',
    LimitExceededException: '시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.',
    TooManyRequestsException: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
  };

  return errorMessages[code] || '알 수 없는 오류가 발생했습니다.';
}