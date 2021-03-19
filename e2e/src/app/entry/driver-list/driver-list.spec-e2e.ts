import { browser, logging } from 'protractor';


import { LoginPage } from '../login/login.po';
import { MapDashBoardPage } from '../map-dashboard/map-dashboard.po';
import { DeleteDriverList } from './driver-list.po';
~

describe('delete driver Tests', () => {
    let loginPage: LoginPage;
    let dashBoardPage: MapDashBoardPage;
    let driverDeletePage: DeleteDriverList;
    beforeEach(() => {
        browser.waitForAngularEnabled(true);
        loginPage = new LoginPage();
        dashBoardPage = new MapDashBoardPage();
        driverDeletePage = new DeleteDriverList();
        
    });
    it('when visit to Dashboard Page then go to', () => {
        loginPage.navigateTo();
        loginPage.fillCredentials();
        browser.sleep(4000);
        dashBoardPage.navigateToDashBoard();
        driverDeletePage.navToDriverList();
        driverDeletePage.driverList();

    });
});