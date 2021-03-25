
import { LoginPage } from "../../../entry/login/login.po";
import { MapDashBoardPage } from "../../../entry/map-dashboard/map-dashboard.po";
import { browser } from "protractor";
import { AddVehiclePage } from "./add-vehicle-new.po";





describe('add Vehicle Tests', () => {
    let loginPage: LoginPage;
    let dashBoardPage: MapDashBoardPage;
    let addVehiclePage: AddVehiclePage; 
    beforeEach(() => {
        browser.waitForAngularEnabled(true); 
        loginPage = new LoginPage();
        dashBoardPage = new MapDashBoardPage();
        addVehiclePage = new AddVehiclePage();

    });
    it('add Asset Basic Detail Form page Successfully',()=>{
        loginPage.navigateTo();
        loginPage.fillCredentials();
        browser.sleep(4000);
        dashBoardPage.navigateToDashBoard();
        browser.sleep(3000);
        addVehiclePage.navigateToVehiclePage();
        browser.sleep(3000);
        addVehiclePage.basicIdentificationDetails();
        addVehiclePage.lifeCycle();
        addVehiclePage.specification();
        addVehiclePage.insuranceForm();
        addVehiclePage.fluidsForm();
        addVehiclePage.wheelsTyres();
        addVehiclePage.engineTransmission();
        addVehiclePage.purchaseForm();
        addVehiclePage.loanForm();
        
    });
  
});
