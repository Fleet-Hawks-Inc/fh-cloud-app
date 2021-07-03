export const environment = {
  production: true,
  isFeatureEnabled: true,
  isFleetEnabled: true,
  isDispatchEnabled: true,
  isComplianceEnabled: true,
  isManageEnabled: true,
  isSafetyEnabled: true,
  isAccountsEnabled: true,
  BaseUrl: 'https://fleetservice.ap-south-1.fleethawks.com/api/v1/',
  AssetURL: 'https://fh-cloud-service-uploads.s3.us-east-2.amazonaws.com',
  AccountServiceUrl: ' https://accounts.ap-south-1.fleethawks.com/api/v1/',
  SafetyUrl: 'https://safety.ap-south-1.fleethawks.com/api/v1/',
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
    USER_POOL_ID: 'us-east-2_eGDgFKKM7',
    REGION: 'us-east-2',
    APP_CLIENT_ID: '76l88g289vcgrd8jf54pbedgqq'
  },
  awsBucket: {
    bucketName: 'fh-dashboard-assets',
    accessKeyId: 'CHANGE_ME',
    secretAccessKey: 'CHANGE_ME',
    region: 'ap-south-1'
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
