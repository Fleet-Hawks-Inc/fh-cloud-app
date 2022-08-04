export const environment = {
  production: true,
  isFeatureEnabled: true,
  isFleetEnabled: true,
  isDispatchEnabled: false,
  isComplianceEnabled: false,
  isManageEnabled: false,
  isSafetyEnabled: false,
  isAccountsEnabled: false,
  isReportsEnabled: true,
  isUserRoles: true,
  isAddressBook: false,
  isOrderPriceEnabled: false,

  BaseUrl: "https://fleetservice.ap-south-1.fleethawks.com/api/v1/",
  AssetURL: "https://fh-cloud-service-uploads.s3.us-east-2.amazonaws.com",
  AccountServiceUrl: "https://accounts.ap-south-1.fleethawks.com/api/v1/",
  SafetyServiceUrl: "https://safety.ap-south-1.fleethawks.com/api/v1/",
  EldServiceUrl: "https://eld.us-east-2.fleethawks.com/api/v1/",
  temp: "search",
  LoginUrl: "users/login",
  ApiKey: "",
  mapBox: {
    accessToken:
      "pk.eyJ1Ijoia3VuYWxmbGVldGhhd2tzIiwiYSI6ImNrNzRuZW9qdjA1bHkzcW5ra3hjejNzenoifQ.CeUFzFnbOiG-XP6FRqiqtQ",
  },
  // congitoConfig: {
  //   USER_POOL_ID: 'us-east-2_YNgmnLURY',
  //   REGION: 'us-east-2',
  //   APP_CLIENT_ID: '77ihpijtlrk6kt7e2ufma285il'
  // },
  congitoConfig: {
    USER_POOL_ID: "us-east-2_eGDgFKKM7",
    REGION: "us-east-2",
    APP_CLIENT_ID: "76l88g289vcgrd8jf54pbedgqq",
  },
  awsBucket: {
    bucketName: "fh-dashboard-assets",
    accessKeyId: "CHANGE_ME",
    secretAccessKey: "CHANGE_ME",
    region: "ap-south-1",
  },
  HOSTNAME: "myhome.anterbox.com",
  PORT: 9001,
  MQTTPATH: "/",
  mapConfig: {
    apiKey: "lIoqoqWBD3Op-8TVFDBPM9pj3kTQKIyCuH8Q_2RDR1c",
  },
  googleConfig: {
    apiKey: "AIzaSyDBkpMI6T1T-z_JRSd03vZ1Q-MSetM1UwI",
  },
  VSSServerWSS: "wss://safety-cam.fleethawks.com:36301/wss",
  whiteListCarriers: [
    "1y4CwKYhlU7I5FluMq2NOCCMZvj",
    "21zpEs5A3MWtK9LeFEkOcsc5Szc",
    "23HFz4o1X79Xh3lcBEJumnolmnt",
  ],
  oneSignalAppId: "ca6dd5d4-b40a-433f-ba97-c196eeaa62b1",
  testCarrier: ["21zpEs5A3MWtK9LeFEkOcsc5Szc"],
};
