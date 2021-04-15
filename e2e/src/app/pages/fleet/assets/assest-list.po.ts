import { browser } from "protractor";



export class AssetPage {
static navigatetoAssetPage: any;

navigatetoAssetPage(){
    return browser.get('#/fleet/assets/list');
    

}
}