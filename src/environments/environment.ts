// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BaseUrl: 'http://localhost:3000/api/v1/',
  temp: 'search',
  LoginUrl: 'users/login',
  ApiKey: '',
  congitoConfig: {
    USER_POOL_ID: 'us-east-2_YNgmnLURY',
    REGION: 'us-east-2',
    APP_CLIENT_ID: '77ihpijtlrk6kt7e2ufma285il'
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
