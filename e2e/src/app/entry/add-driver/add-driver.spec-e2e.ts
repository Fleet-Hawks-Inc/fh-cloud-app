import { browser, logging } from 'protractor';
import { LoginPage } from '../login/login.po';
import { MapDashBoardPage } from '../map-dashboard/map-dashboard.po';
import { AddDriverPage } from './add-driver.po';
describe('add driver Tests', () => {
    let loginPage: LoginPage;
    let dashBoardPage: MapDashBoardPage;
    let addDriverPage: AddDriverPage;
    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        loginPage = new LoginPage();
        dashBoardPage = new MapDashBoardPage();
        addDriverPage = new AddDriverPage();

    });

    it('when login is successful display dashboard page and then display driver form', () => {
        loginPage.navigateTo();
        loginPage.fillCredentials();
        dashBoardPage.navigateToDashBoard();
        browser.sleep(5000);
        addDriverPage.navigateToDriverList();
        //addDriverPage.gotoDriverBtn();
        addDriverPage.basicDetailform();
        addDriverPage.credentials();
        addDriverPage.addressDetailForm();
        addDriverPage.documentdetailsForm();
        addDriverPage.crossBorder();
        addDriverPage.licenceDetailsForm();
        addDriverPage.payMentForm();
        addDriverPage.hosCompliance();
        addDriverPage.emergencyForm();
    });
   

});