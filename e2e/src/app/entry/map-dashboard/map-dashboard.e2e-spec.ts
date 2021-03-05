import { browser, logging } from 'protractor';
import { LoginPage } from '../login/login.po';

import { MapDashBoardPage } from './map-dashboard.po';


describe('Fleet Tests', () => {
    let loginPage: LoginPage;
    let dashBoardPage: MapDashBoardPage;
    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        loginPage = new LoginPage();
        dashBoardPage = new MapDashBoardPage();
    });

    it('when login is successful display dashboard page', () => {
        loginPage.navigateTo();
        loginPage.fillCredentials();
        dashBoardPage.navigateToDashBoard();
        let text = dashBoardPage.getTitleText();
        expect(text).toEqual('Driver Dashboard');
    });
});

