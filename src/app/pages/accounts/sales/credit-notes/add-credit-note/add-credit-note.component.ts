import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService, ApiService, ListService } from "src/app/services";

import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Auth } from "aws-amplify";

@Component({
  selector: "app-add-credit-note",
  templateUrl: "./add-credit-note.component.html",
  styleUrls: ["./add-credit-note.component.css"],
})
export class AddCreditNoteComponent implements OnInit {
  submitDisabled = false;
  total = 0;
  creditData: any = {
    txnDate: moment().format("YYYY-MM-DD"),
    currency: "CAD",
    customerID: null,
    crRef: "",
    salePerson: null,
    crDetails: [
      {
        commodity: "",
        desc: "",
        qty: 0,
        qtyUnit: null,
        rate: 0,
        rateUnit: null,
        amount: 0,
        accountID: null,
      },
    ],
    remarks: "",
    totalAmt: 0,
    transactionLog: [],
  };

  accounts: any = [];
  vendors: any = [];

  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error = "";
  pageTitle = "Add";

  creditID: any;
  units = [];
  customers = [];
  currentUser: any;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private location: Location,
    private accountService: AccountService,
    private apiService: ApiService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.creditID = this.route.snapshot.params[`creditID`];
    if (this.creditID) {
      this.pageTitle = "Edit";
      this.fetchCredit();
    } else {
      this.pageTitle = "Add";
    }

    this.fetchAccounts();
    this.fetchQuantityUnits();
    this.getCurrentUser();
    this.fetchCustomers();
  }

  changeUnit(value: string, i: any) {
    this.creditData.crDetails[i].qtyUnit = value;
    this.creditData.crDetails[i].rateUnit = value;
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/get/list`).subscribe((result: any) => {
      this.customers = result;
    });
  }

  private getValidCustomers(customerList: any[]) {
    let ids = [];
    this.listService.customersList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          customerList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  getCurrentUser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.creditData.salePerson = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  };

  fetchQuantityUnits() {
    this.httpClient
      .get("assets/jsonFiles/quantityTypes.json")
      .subscribe((data: any) => {
        this.units = data;
      });
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }

  refreshVendorData() {
    this.listService.fetchVendors();
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  addDetails() {
    this.creditData.crDetails.push({
      commodity: "",
      desc: "",
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    });
  }

  deleteDetail(d: number) {
    this.total -= this.creditData.crDetails[d].amount;
    this.creditData.crDetails.splice(d, 1);
  }

  async calculateAmount(i: number) {
    let total: any = 0;
    this.creditData.crDetails[i].amount =
      this.creditData.crDetails[i].qty * this.creditData.crDetails[i].rate;
    this.creditData.crDetails.forEach((element) => {
      total += element.amount;
    });
    this.total = total.toFixed(2);
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addNotes() {
    this.submitDisabled = true;
    this.creditData.totalAmt = this.total;
    this.accountService
      .postData(`customer-credits`, this.creditData)
      .subscribe({
        complete: () => {},
        error: (err: any) => {
          this.submitDisabled = false;
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
                // this.submitDisabled = false;
              },
              next: () => {},
            });
        },
        next: (res) => {
          this.submitDisabled = false;
          this.response = res;
          this.toaster.success("Credit note added successfully.");
          // this.cancel();
        },
      });
  }

  fetchCredit() {
    this.accountService
      .getData(`customer-credits/detail/${this.creditID}`)
      .subscribe((res) => {
        this.creditData = res[0];

        this.total = res[0].totalAmt;
      });
  }

  updateNotes() {
    this.submitDisabled = true;
    this.creditData.totalAmt = this.total;
    this.accountService
      .putData(`customer-credits/update/${this.creditID}`, this.creditData)
      .subscribe({
        complete: () => {},
        error: (err: any) => {
          this.submitDisabled = false;
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, "This Field");
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                //this.submitDisabled = false;
                // this.throwErrors();
              },
              error: () => {
                // this.submitDisabled = false;
              },
              next: () => {},
            });
        },
        next: (res) => {
          // this.submitDisabled = false;
          this.response = res;
          this.toaster.success("Credit note updated successfully.");
          this.cancel();
        },
      });
  }
}
