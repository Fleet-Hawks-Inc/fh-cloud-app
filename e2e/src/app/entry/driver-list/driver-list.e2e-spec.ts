import { browser } from 'protractor';
import { LoginPage } from '../login/login.po';
import { MapDashBoardPage } from '../map-dashboard/map-dashboard.po';

import { DriverListPage } from './driver-list.po';



// tslint:disable-next-line:only-arrow-functions
describe('CloudApp: Driver list', function () {

  let loginPage: LoginPage;
  let dashBoardPage: MapDashBoardPage;
  // tslint:disable-next-line:prefer-const
  let driverListPage: DriverListPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    loginPage = new LoginPage();
    dashBoardPage = new MapDashBoardPage();
    driverListPage = new DriverListPage();
  });
  it('Login successfully to dashboard and then display Driver list page', () => {
    loginPage.navigateTo();
    loginPage.fillCredentials();
    browser.sleep(4000);
    dashBoardPage.navigateToDashBoard();
    dashBoardPage.getTitleText();
    browser.sleep(4000);

  });

   it('should display Driver List functionality', () => {
    driverListPage.navigateToDriverListPage();
     browser.sleep((5000));
    driverListPage.searchForm();
      browser.sleep(5000);
    driverListPage.selectType();

   driverListPage.searchReset();
    browser.sleep(4000);
  //   driverListPage.mapView();
  //   driverListPage.listView();
  //   driverListPage.actionPage();
  //   //driverListPage.getLables();

   });



});
