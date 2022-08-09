import { AccountService, ListService } from "../../../../services";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "../../../fleet/constants";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import * as _ from "lodash";
import { Table } from 'primeng/table';

import { NgForm } from "@angular/forms";
declare var $: any;
@Component({
  selector: "app-chart-of-accounts",
  templateUrl: "./chart-of-accounts.component.html",
  styleUrls: ["./chart-of-accounts.component.css"],
})
export class ChartOfAccountsComponent implements OnInit {
  selectedCities: string[] = [];


  @ViewChild("actForm") actForm: NgForm;
  modalTitle = "Add Account";
  dataMessage = Constants.FETCHING_DATA;
  accounts: any = [];
  newAccounts = [];
  parentMessage: "";
  lastItemSK = "";
  filter = {
    actType: null,
    actName: null,
  };
  classData = {
    acClassName: "",
    acClassDesc: "",
  };
  classDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear(), month: 12, day: 31 };
  receivedActID = "";
  fetchedID = null;
  actName = null;
  actClassID = null;
  actType = null;
  mainactType = null;
  actNo: number;
  actDesc: "";
  actDash = false;
  opnBalCAD = 0;
  opnBalTypeCAD = "debit";
  actDate: "";
  closingAmtCAD: number;
  transactionLogCAD = [];
  opnBalUSD = 0;
  opnBalTypeUSD = "debit";
  closingAmtUSD: number;
  transactionLogUSD = [];
  transLogCAD = false;
  transLogUSD = false;
  internalActID = "";
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error = "";
  Success = "";
  acClasses = [];
  submitDisabled = false;
  deactivatePredefined = true;
  addPredefined = false;
  disableSearch = false;
  loaded = false;
  actNoError = false;
  actNameError = false;
  accountsClassObjects = {};
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;
  isChecked = false;
  headCheckbox = false;
  usedAccounts: any = [];
  unusedAccounts: any = [];
  showUnused: boolean = false;
  allAccounts: any = [];

  constructor(
    private accountService: AccountService,
    private toaster: ToastrService,
    private listService: ListService
  ) { }

  ngOnInit() {
    this.checkPredefinedAccounts();
    this.fetchAccounts();
    this.getAcClasses();
    this.fetchAccountClassByIDs();
    this.dataColumns = [
      { width: '25%', field: 'actName', header: 'Account Name', type: "text" },
      { width: '15%', field: 'actNo', header: 'Account Number', type: "text" },
      { width: '15%', field: 'actType', header: 'Account Type', type: "text" },
      { width: '15%', field: 'actClassID', header: 'Account Class', type: "text" },
      { width: '24%', field: 'actDesc', header: 'Description', type: "text" },
    ];
    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }

  preAccounts() {
    this.addPredefined = true;
    const res = this.accountService
      .getData("chartAc/addpredefinedClass")
      .toPromise();
    if (res) {
      setTimeout(() => {
        this.accountService
          .getData("chartAc/predefinedAccounts")
          .subscribe((result) => {
            this.fetchAccounts();
            this.fetchAccountClassByIDs();
            this.getAcClasses();
            this.toaster.success("Predefined  Accounts Created.");
          });
      }, 1500);
    }
  }
  deleteAccount(actID: string) {
    // this.accountService.deleteData(`chartAc/${this.carrierID}/${actID}`).subscribe((res) => {
    //   this.toaster.success('Account Deleted Successfully.');
    //   this.listService.fetchChartAccounts();
    //   });
  }
  showAcModal() {
    this.fetchedID = null;
    this.actName = "";
    this.actType = "";
    this.actNo = null;
    this.actDesc = "";
    this.actDash = false;
    this.internalActID = "";
    this.opnBalCAD = null;
    this.opnBalTypeCAD = "debit";
    this.actDate = "";
    this.closingAmtCAD = null;
    this.transactionLogCAD = [];
    this.transLogCAD = false;
    this.opnBalUSD = null;
    this.opnBalTypeUSD = "debit";
    this.closingAmtUSD = null;
    this.transactionLogUSD = [];
    this.transLogUSD = false;
    this.modalTitle = "Add Account";
    $("#addAccountModal").modal("show");
  }
  onChangeType(value: any, type: string) {
    if (type === "CAD") {
      this.opnBalTypeCAD = value;
    } else {
      this.opnBalTypeUSD = value;
    }
  }
  fetchAccountClassByIDs() {
    this.accountService
      .getData("chartAc/get/accountClass/list/all")
      .subscribe((result: any) => {
        this.accountsClassObjects = result;
      });
  }
  searchAccounts() {
    if (
      this.filter.actType !== "" ||
      this.filter.actType !== null ||
      this.filter.actName !== null ||
      this.filter.actName !== ""
    ) {
      this.disableSearch = true;
      this.accounts = [];
      this.allAccounts = [];
      this.lastItemSK = "";
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAccounts();
    }
  }
  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      actType: null,
      actName: null,
    };
    this.lastItemSK = "";
    this.accounts = [];
    this.allAccounts = [];
    this.fetchAccounts();
  }
  async fetchAccounts(refresh?: boolean) {
    this.unusedAccounts = [];
    this.accounts = this.allAccounts;
    if (refresh === true) {
      this.lastItemSK = "";
      this.accounts = [];
    }
    if (this.lastItemSK !== "end") {
      let name = null;
      let type = null;
      if (this.filter.actType !== null || this.filter.actName !== null) {
        if (this.filter.actType !== null && this.filter.actType !== "") {
          type = this.filter.actType;
        }
        if (this.filter.actName !== null && this.filter.actName !== "") {
          name = this.filter.actName.toLowerCase();
        }
        this.dataMessage = Constants.FETCHING_DATA;
      }
      this.accountService
        .getData(
          `chartAc/paging?actName=${name}&actType=${type}&lastKey=${this.lastItemSK}`
        )
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.disableSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            this.disableSearch = false;
            result.map((v) => {
              v.first = v.actName.substring(0, v.actName.indexOf(" "));
              v.last = v.actName.substring(
                v.actName.indexOf(" ") + 1,
                v.actName.length
              );
              this.accounts.push(v);
            });
            if (this.accounts[this.accounts.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                this.accounts[this.accounts.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }
            const newArray = _.sortBy(this.accounts, ["actNo"]); // sort by account number
            this.accounts = newArray;
            this.allAccounts = newArray;
            this.loaded = true;
            for (let i = 0; i < this.accounts.length; i++) {
              if (this.accounts[i].closingAmtCAD === this.accounts[i].opnBalCAD && this.accounts[i].closingAmtUSD === this.accounts[i].opnBalUSD) {
                this.unusedAccounts.push(this.accounts[i])
              }
            }
          }
        });
    }
    if (this.deactivatePredefined === false) {
      this.dataMessage = "Please add predefined accounts";
    }
  }

  onUnusedAccount() {
    if (this.showUnused === true) {
      this.accounts = this.unusedAccounts;
    }
    else {
      this.accounts = this.allAccounts;
    }
  }

  onScroll() {
    if (this.loaded) {
      this.fetchAccounts();
    }
    this.loaded = false;
  }
  checkPredefinedAccounts() {
    this.accountService
      .getData(`chartAc/get/internalID/list/all`)
      .subscribe((res) => {
        if (res.ACT0 !== undefined && res.ACT251 !== undefined) {
          this.deactivatePredefined = true;
        } else {
          this.deactivatePredefined = false;
          this.dataMessage = "Please add predefined accounts";
        }
      });
  }
  validateAcNumber(actNo) {

    if (actNo !== null && actNo !== "") {
      this.submitDisabled = true;
      this.actNoError = false;
      this.accountService
        .getData(`chartAc/validate/accountNumber/${actNo}`)
        .subscribe((res) => {
          if (res === true) {
            this.actNoError = true;
            this.submitDisabled = true;
          } else {
            this.actNoError = false;
            this.submitDisabled = false;
          }
        });
    }
  }
  validateAcName(actName) {
    if (actName !== null && actName !== "") {
      this.submitDisabled = true;
      this.actNameError = false;
      actName = actName.replace(/\s+/g, " ").trim(); // trim the double or more spaces if in between words
      this.accountService
        .getData(`chartAc/validate/accountName/${actName}`)
        .subscribe((res) => {
          if (res === true) {
            this.actNameError = true;
            this.submitDisabled = true;
          } else {
            this.actNameError = false;
            this.submitDisabled = false;
          }
        });
    }
  }
  addAccount() {
    this.submitDisabled = true;
    const data = {
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actClassID: this.actClassID,
      mainactType: this.mainactType,
      actDesc: this.actDesc,
      actDash: this.actDash,
      opnBalCAD: this.opnBalCAD,
      opnBalTypeCAD: this.opnBalTypeCAD,
      actDate: this.actDate,
      transactionLogCAD: [],
      closingAmtCAD: 0,
      opnBalUSD: this.opnBalUSD,
      opnBalTypeUSD: this.opnBalTypeUSD,
      transactionLogUSD: [],
      closingAmtUSD: 0,
      internalActID: "",
    };
    this.accountService.postData("chartAc", data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.lastItemSK = "";
        this.accounts = [];
        this.fetchAccounts();
        this.toaster.success("Account Added Successfully.");
        $("#addAccountModal").modal("hide");
        this.actForm.reset();
        this.actName = "";
        this.actType = "";
        this.mainactType = "";
        this.actNo = null;
        this.actClassID = "";
        this.actDesc = "";
        this.actDash = false;
        this.opnBalCAD = null;
        this.opnBalTypeCAD = "debit";
        this.actDate = "";
        this.closingAmtCAD = null;
        this.transactionLogCAD = [];
        this.opnBalUSD = null;
        this.opnBalTypeUSD = "debit";
        this.closingAmtUSD = null;
        this.transactionLogUSD = [];
        this.internalActID = "";
        this.transLogCAD = false;
        this.transLogUSD = false;
      },
    });
  }

  editAccount(ID: any) {
    this.fetchedID = ID;
    this.modalTitle = "Edit Account";
    $("#addAccountModal").modal("show");
    if (ID !== "" && ID !== undefined) {
      this.fetchAccount(ID);
    } else {
      this.actName = "";
      this.actType = "";
      this.mainactType = "";
      this.actClassID = "";
      this.actNo = null;
      this.actDesc = "";
      this.actDash = false;
      this.internalActID = "";
      this.opnBalCAD = null;
      this.opnBalTypeCAD = "debit";
      this.actDate = "";
      this.closingAmtCAD = null;
      this.opnBalUSD = null;
      this.opnBalTypeUSD = "debit";
      this.closingAmtUSD = null;
    }
  }
  fetchAccount(ID: any) {
    this.getAcClasses();
    this.fetchedID = ID;
    this.resetFormValues();
    this.accountService
      .getData(`chartAc/account/details/${ID}`)
      .subscribe((res) => {
        this.actName = res.actName;
        this.actType = res.actType;
        this.mainactType = res.mainactType;
        this.actClassID = res.actClassID;
        this.actNo = res.actNo;
        this.actDesc = res.actDesc;
        this.actDash = res.actDash;
        this.internalActID = res.internalActID;
        this.opnBalCAD = res.opnBalCAD;
        this.opnBalTypeCAD = res.opnBalTypeCAD;
        this.actDate = res.actDate;
        this.closingAmtCAD = res.closingAmtCAD;
        this.transactionLogCAD = res.transactionLogCAD;
        this.opnBalUSD = res.opnBalUSD;
        this.opnBalTypeUSD = res.opnBalTypeUSD;
        this.closingAmtUSD = res.closingAmtUSD;
        this.transactionLogUSD = res.transactionLogUSD;
        if (this.transactionLogCAD.length > 0) {
          this.transLogCAD = true;
        }
        if (this.transactionLogUSD.length > 0) {
          this.transLogUSD = true;
        }
      });
  }
  clear(table: Table) {
    table.clear();
  }
  updateAccount(ID: any) {
    this.submitDisabled = true;
    const data = {
      actID: ID,
      actName: this.actName,
      actType: this.actType,
      mainactType: this.mainactType,
      actClassID: this.actClassID,
      actNo: this.actNo,
      actDesc: this.actDesc,
      actDash: this.actDash,
      opnBalCAD: this.opnBalCAD,
      opnBalTypeCAD: this.opnBalTypeCAD,
      actDate: this.actDate,
      transactionLogCAD: this.transactionLogCAD,
      closingAmtCAD: this.closingAmtCAD,
      opnBalUSD: this.opnBalUSD,
      opnBalTypeUSD: this.opnBalTypeUSD,
      transactionLogUSD: this.transactionLogUSD,
      closingAmtUSD: this.closingAmtUSD,
      internalActID: this.internalActID,
    };
    this.accountService.putData(`chartAc/update/${ID}`, data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.lastItemSK = "";
        this.accounts = [];
        this.fetchAccounts();
        this.toaster.success("Account Updated Successfully.");
        $("#addAccountModal").modal("hide");
        this.actName = "";
        this.actType = "";
        this.mainactType = "";
        this.actClassID = "";
        this.actNo = null;
        this.internalActID = "";
        this.actDash = false;
        this.actDesc = "";
        this.opnBalCAD = null;
        this.opnBalTypeCAD = "debit";
        this.actDate = "";
        this.closingAmtCAD = null;
        this.transactionLogCAD = [];
        this.transLogCAD = false;
        this.opnBalUSD = null;
        this.opnBalTypeUSD = "debit";
        this.closingAmtUSD = null;
        this.transactionLogUSD = [];
        this.transLogUSD = false;
      },
    });
  }

  hideModal() {
    $("#addAccountModal").modal("hide");
    this.transLogCAD = false;
    this.transLogUSD = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      actType: null,
      actName: null,
    };
    this.lastItemSK = "";
    this.accounts = [];
    this.fetchAccounts();
  }

  addAcClass() {
    this.classDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.accountService
      .postData("chartAc/acClass/add", this.classData)
      .subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, "This Field");
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.classDisabled = false;
              },
              error: () => {
                this.classDisabled = false;
              },
              next: () => { },
            });
        },
        next: (res) => {
          this.getAcClasses();
          this.classDisabled = false;
          this.response = res;
          $("#addAccountClassModal").modal("hide");
          this.classData = {
            acClassName: "",
            acClassDesc: "",
          };
          this.toaster.success("Account class added successfully.");
        },
      });
  }

  getAcClasses() {
    this.accountService.getData("chartAc/get/acClasses").subscribe((res) => {
      this.acClasses = res;
    });
  }
  refreshClass() {
    this.getAcClasses();
  }

  resetFormValues() {
    this.actName = "";
    this.actType = "";
    this.mainactType = "";
    this.actNo = null;
    this.actClassID = "";
    this.actDesc = "";
    this.actDash = false;
    this.opnBalCAD = null;
    this.opnBalTypeCAD = "debit";
    this.actDate = "";
    this.closingAmtCAD = null;
    this.transactionLogCAD = [];
    this.opnBalUSD = null;
    this.opnBalTypeUSD = "debit";
    this.closingAmtUSD = null;
    this.transactionLogUSD = [];
    this.internalActID = "";
    this.transLogCAD = false;
    this.transLogUSD = false;
  }
}