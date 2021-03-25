
import { LoginPage } from '../../../../../app/entry/login/login.po';
import { MapDashBoardPage } from '../../../../../app/entry/map-dashboard/map-dashboard.po';
import { browser, logging } from 'protractor';
import { AddAssetPage } from './add-assets.po';



describe('add Asset Tests', () => {
    let loginPage: LoginPage;
    let dashBoardPage: MapDashBoardPage;
    let addAssetPage: AddAssetPage;
    beforeEach(() => {
        browser.waitForAngularEnabled(false); 
        loginPage = new LoginPage();
        dashBoardPage = new MapDashBoardPage();
        addAssetPage = new AddAssetPage();

    });
    it('add Asset Basic Detail Form page Successfully',()=>{
        loginPage.navigateTo();
        loginPage.fillCredentials();
        browser.sleep(4000);
        dashBoardPage.navigateToDashBoard();
        browser.sleep(3000);
        addAssetPage.navigateToAssetPage();
        addAssetPage.basicDetailsAsset();
        
    });
  
});
