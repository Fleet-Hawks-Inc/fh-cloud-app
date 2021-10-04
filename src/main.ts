
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    userPoolId: environment.congitoConfig.USER_POOL_ID,
    region: environment.congitoConfig.REGION,
    userPoolWebClientId: environment.congitoConfig.APP_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

if (environment.production) {
  enableProdMode();
}


document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});

