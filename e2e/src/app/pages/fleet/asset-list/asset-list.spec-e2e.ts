
import { LoginPage } from '../../../entry/login/login.po';
import { MapDashBoardPage } from '../../../entry/map-dashboard/map-dashboard.po';
import { browser, logging } from 'protractor';
import { AssetListPage } from './asset-list.po';


~

describe('delete driver Tests', () => {
    let loginPage: LoginPage;
    let dashBoardPage: MapDashBoardPage;
    let assetListPage: AssetListPage;
    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        loginPage = new LoginPage();
        dashBoardPage = new MapDashBoardPage();
        assetListPage =new AssetListPage();
        
    });
    it('when visit to Dashboard Page then go to Asset List and Then delete unwanted asset from the asset list', () => {
        loginPage.navigateTo();
        loginPage.fillCredentials();
        browser.sleep(4000);
        dashBoardPage.navigateToDashBoard();
        assetListPage.navToAssetList();
        assetListPage.assetList();
    });
});