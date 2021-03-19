import { browser, logging } from 'protractor';
import { AddAssetPage } from './assets/add-assets.po';

describe('add Asset Tests', () => {
    
    let addAssetPage: AddAssetPage;
    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        addAssetPage = new AddAssetPage();

    });
    it('add Asset Basic Detail Form page Successfully',()=>{
         addAssetPage.basicDetailsAsset();
    });
    it('add Asset Detail successfully',()=>{
        addAssetPage.assetDetails();
    });
    it('add Asset Addditional Details',()=>{
       addAssetPage.additionalDetails();
    });
});
