export const environment = {
  production: true,
  isFeatureEnabled: false,
  BaseUrl: 'https://service.cloud.fleethawks.com/api/v1/',
  AssetURL: 'https://fh-cloud-service-uploads-ue1.s3.us-east-1.amazonaws.com',
  temp: 'search',
  LoginUrl: 'users/login',
  ApiKey: '',
  mapBox: {
    accessToken: 'pk.eyJ1Ijoia3VuYWxmbGVldGhhd2tzIiwiYSI6ImNrNzRuZW9qdjA1bHkzcW5ra3hjejNzenoifQ.CeUFzFnbOiG-XP6FRqiqtQ'
  },
  // congitoConfig: {
  //   USER_POOL_ID: 'us-east-2_YNgmnLURY',
  //   REGION: 'us-east-2',
  //   APP_CLIENT_ID: '77ihpijtlrk6kt7e2ufma285il'
  // },
  congitoConfig: {
    USER_POOL_ID: 'us-east-1_EtYcKjB24',
    REGION: 'us-east-1',
    APP_CLIENT_ID: '4tq993ckrr489rihejjc6tkvjn'
  },
  awsBucket: {
    bucketName: 'fh-cloud-service-uploads-ue1',
  
    region: 'us-east-1'
  },
  HOSTNAME: 'myhome.anterbox.com',
  PORT : 9001,
  MQTTPATH : '/',
  mapConfig: {
    apiKey: 'lIoqoqWBD3Op-8TVFDBPM9pj3kTQKIyCuH8Q_2RDR1c'
  },
  googleConfig: {
    apiKey: 'AIzaSyDBkpMI6T1T-z_JRSd03vZ1Q-MSetM1UwI'
  }
};
