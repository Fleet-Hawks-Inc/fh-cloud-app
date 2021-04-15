import { LoginPage } from "e2e/src/app/entry/onboard/login/login.po";
import { MapDashBoardPage } from "e2e/src/map-dashboard/map-dashboard.po";
import { browser } from "protractor";
import { protractor } from "protractor/built/ptor";
import { AssetPage } from "./assest-list.po";




describe('AssetPage',function (){


    let loginPage = LoginPage;
    let dashboardPage = MapDashBoardPage;
    let assetPage: AssetPage;

    
    });

it('when login is successfull and redirect to map dashboard page',function(){

    LoginPage.navigateTo();
    LoginPage.fillCredentials();
    MapDashBoardPage.navigateToDashBoard();

    it ('assets listing view page is succesffully open ', function (){
        AssetPage.navigatetoAssetPage();
    }


});

