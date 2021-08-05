export const environment = {
  production: true,
  isFeatureEnabled: true,
  isFleetEnabled: true,
  isDispatchEnabled: true,
  isComplianceEnabled: true,
  isManageEnabled: true,
  isSafetyEnabled: false,
  isAccountsEnabled: false,
  isReportsEnabled: false,

  BaseUrl: 'https://service.cloud.fleethawks.com/api/v1/',
  AssetURL: 'https://fh-cloud-service-uploads-cacentral1.s3.ca-central-1.amazonaws.com',
  AccountServiceUrl: 'http://localhost:4002/api/v1/',
  SafetyServiceUrl: 'http://localhost:4000/api/v1/',

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
    USER_POOL_ID: 'ca-central-1_F0KoWWGIh',
    REGION: 'ca-central-1',
    APP_CLIENT_ID: '1khgs3lefjv2qld1dgts0dno68'
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
