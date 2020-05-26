export const environment = {
  production: true,
  BaseUrl: 'https://fleetservice.us-east-2.fleethawks.com/api/v1/',
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
    accessKeyId: 'AKIARUNMEEHU3E2DK3S7',
    secretAccessKey: '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',
    region: 'ap-south-1'
  }
};
