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

    it('when carrier adds a driver it should  successfully add a driver', () => {

        loginPage.navigateTo();
        loginPage.fillCredentials();
        //dashBoardPage.navigateToDashBoard();
        addDriverPage.navigateToDriverPage();
        //browser.sleep(5000);
        //let text = dashBoardPage.getNavBar();
        //expect(text).toEqual('Driver Dashboard');
        addDriverPage.clickAddDriverBtn();
       // let drive = addDriverPage.getTitleText();
        //expect(drive).toEqual('Add Driver');
        addDriverPage.basicDetailform();
        addDriverPage.credentials();
        addDriverPage.basicDetailform();
        addDriverPage.documentdetailsForm();
        addDriverPage.crossBorder();
        addDriverPage.licenceDetailsForm();
        addDriverPage.payMentForm();
        addDriverPage.hosCompliance();
        addDriverPage.emergencyForm();

        
    });
    it('when carrier is on add driver screen and click cancels, it should redirect to  driver list page', () =>
    { 
    });    
    it('when carrier is on add driver screen and is able to navigate', () =>
    { 
    });    
});

