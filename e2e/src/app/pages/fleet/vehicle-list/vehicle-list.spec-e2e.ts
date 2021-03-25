// import { browser, logging } from 'protractor';


// import { LoginPage } from '../../../entry/login/login.po';
// import { MapDashBoardPage } from '../../../entry/map-dashboard/map-dashboard.po';
// import { DeleteDriverList } from './vehicle-list.po';
// ~

// describe('delete driver Tests', () => {
//     let loginPage: LoginPage;
//     let dashBoardPage: MapDashBoardPage;
//     let driverDeletePage: DeleteDriverList;
//     beforeEach(() => {
//         browser.waitForAngularEnabled(false);
//         loginPage = new LoginPage();
//         dashBoardPage = new MapDashBoardPage();
//         driverDeletePage = new DeleteDriverList();
        
//     });
//     it('when visit to Dashboard Page then go to Driver List and the delete the ', () => {
//         loginPage.navigateTo();
//         loginPage.fillCredentials();
//         browser.sleep(4000);
//         dashBoardPage.navigateToDashBoard();
//         driverDeletePage.navToDriverList();
//         driverDeletePage.driverList();

//     });
// });