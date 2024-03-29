// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isFeatureEnabled: true,

  BaseUrl: "http://localhost:3000/api/v1/",
  AccountServiceUrl: "http://localhost:4002/api/v1/",
  SafetyServiceUrl: "http://localhost:4000/api/v1/",
  EldServiceUrl: "http://localhost:5001/api/v1/",
  // BaseUrl: 'https://fleetservice.ap-south-1.fleethawks.com/api/v1/',
  // AccountServiceUrl: ' https://accounts.ap-south-1.fleethawks.com/api/v1/',
  // SafetyServiceUrl: 'http://localhost:4000/api/v1/',

  // AccountServiceUrl: "http://localhost:4002/api/v1/",

  // SafetyServiceUrl: 'http://localhost:4000/api/v1/',
  // BaseUrl: "https://fleetservice.ap-south-1.fleethawks.com/api/v1/",
  // AccountServiceUrl: ' https://accounts.ap-south-1.fleethawks.com/api/v1/',
  // SafetyServiceUrl: "https://safety.ap-south-1.fleethawks.com/api/v1/",

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

  AssetURL: "https://fh-cloud-service-uploads.s3.us-east-2.amazonaws.com",
  safetyURL: "http://localhost:4000/api/v1/",
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
    bucketName: "fh-cloud-service-uploads",
    accessKeyId: "Change_me",
    secretAccessKey: "Change_me",
    region: "us-east-1",
  },
  HOSTNAME: "myhome.anterbox.com",
  PORT: 9001,
  MQTTPATH: "/",
  mapConfig: {
    apiKey: "lIoqoqWBD3Op-8TVFDBPM9pj3kTQKIyCuH8Q_2RDR1c",
  },
  googleConfig: {
    apiKey: "AIzaSyDRt9SGmd-mzAsC30SofiwDRtHw592Og5E",
  },
  VSSServerWSS: "wss://safety-cam.fleethawks.com:36301/wss",

  whiteListCarriers: [
    "1y4CwKYhlU7I5FluMq2NOCCMZvj",
    "21zpEs5A3MWtK9LeFEkOcsc5Szc",
    "1y6913gTrXSlzcTlSEGpwBMe5Ay",
    "23HFz4o1X79Xh3lcBEJumnolmnt",
  ],

  oneSignalAppId: "1cdb2b50-0786-415f-b454-a3ffe1eab5b4",
  testCarrier: ["21zpEs5A3MWtK9LeFEkOcsc5Szc"],
  BConnectAccess: [
    "1y4CwKYhlU7I5FluMq2NOCCMZvj",
    "23HFz4o1X79Xh3lcBEJumnolmnt",
    "1y62eyclUWKj6HSREEfZbHXjvRc",
    "29b6OwULJ0ukir4uFF7TTLm4Tof",
    "21zpEs5A3MWtK9LeFEkOcsc5Szc",
    "1y2cYywr5iGFdHH8uqTVIa96ayS"
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
