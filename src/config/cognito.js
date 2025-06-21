import { Amplify } from 'aws-amplify';

// AWS Amplify Cognito 설정
Amplify.configure({
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION,
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_APP_CLIENT_ID,
    }
  }
});

export default Amplify;