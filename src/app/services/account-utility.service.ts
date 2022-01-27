import { Injectable } from "@angular/core";
import { AccountService } from "./account.service";

@Injectable({
  providedIn: "root",
})
export class AccountUtilityService {
  constructor(private accountService: AccountService) {}

  predefinedAccounts: any = {};

  public getPreDefinedAccounts = async (): Promise<any[]> => {
    var size = Object.keys(this.predefinedAccounts).length;
    if (size === 0) {
      const result = await this.accountService
        .getData("chartAc/get/all/list")
        .toPromise();
      this.predefinedAccounts = result;
    }
    return this.predefinedAccounts;
  };
}
