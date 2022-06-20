export const environment = {
  production: true,
  isFeatureEnabled: true,
  isFleetEnabled: true,
  isDispatchEnabled: false,
  isComplianceEnabled: false,

  isManageEnabled: false,
  isSafetyEnabled: false,
  isAccountsEnabled: false,
  isUserRoles: true,

  isReportsEnabled: true,
  isAddressBook: false,
  isOrderPriceEnabled: true,

  BaseUrl: 'https://service.cloud.fleethawks.com/api/v1/',

  AssetURL: 'https://fh-cloud-service-uploads-cacentral1.s3.ca-central-1.amazonaws.com',
  AccountServiceUrl: 'https://accounts.cloud.fleethawks.com/api/v1/',
  SafetyServiceUrl: 'https://safety.cloud.fleethawks.com/api/v1/',

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
  HOSTNAME: 'myhome.anterbox.com',
  PORT: 9001,
  MQTTPATH: '/',
  mapConfig: {
    apiKey: 'lIoqoqWBD3Op-8TVFDBPM9pj3kTQKIyCuH8Q_2RDR1c'
  },
  googleConfig: {
    apiKey: 'AIzaSyDBkpMI6T1T-z_JRSd03vZ1Q-MSetM1UwI'
  },
  VSSServerWSS: 'wss://safety-cam.fleethawks.com:36301/wss',
  whiteListCarriers: ['1tUTDlq930QyBGPqkY23AQH1Bw7', '28gVOlb6UaiBgOcGzAH6Thm8k8c'],
  oneSignalAppId: "31955da2-b779-42dd-a626-ce711f141b8c"
};
