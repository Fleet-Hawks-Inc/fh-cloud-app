import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-advance-payments-detail",
  templateUrl: "./advance-payments-detail.component.html",
  styleUrls: ["./advance-payments-detail.component.css"],
})
export class AdvancePaymentsDetailComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  paymentData = {
    paymentNo: "",
    paymentTo: null,
    entityID: null,
    amount: "",
    currency: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    txnDate: null,
    referenceNo: "",
    notes: "",
    accountID: null,
    status: "",
  };
  paymentID;
  entityName = "";
  payModeLabel = "";
  accountName = '';
  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    this.fetchPayments();
  }

  fetchPayments() {
    this.accountService
      .getData(`advance/detail/${this.paymentID}`)
      .subscribe((result: any) => {
        this.paymentData = result[0];
        console.log("this.payments", this.paymentData);
        if(this.paymentData.status) {
          this.paymentData.status = this.paymentData.status.replace('_'," ");
        }
        
        this.changePaymentMode(this.paymentData.payMode);
        if (this.paymentData.paymentTo === "driver") {
          this.fetchDriverDetail(this.paymentData.entityID);
        } else {
          this.fetchContact(this.paymentData.entityID);
        }
        this.fetchAcounts(this.paymentData.accountID);
      });
  }

  fetchDriverDetail(driverID) {
    this.apiService.getData(`drivers/${driverID}`).subscribe((result: any) => {
      this.entityName = `${result.Items[0].firstName} ${result.Items[0].lastName} `;
    });
  }

  fetchContact(contactID) {
    this.apiService.getData(`contacts/detail/${contactID}`).subscribe((result: any) => {
        this.entityName = result.Items[0].companyName;
      });
  }

  changePaymentMode(type) {
    let label = "";
    if (type == "cash") {
      label = "Cash";
    } else if (type == "cheque") {
      label = "Cheque";
    } else if (type == "eft") {
      label = "EFT";
    } else if (type == "credit_card") {
      label = "Credit Card";
    } else if (type == "debit_card") {
      label = "Debit Card";
    } else if (type == "demand_draft") {
      label = "Demand Draft";
    }
    this.payModeLabel = label;
  }

  fetchAcounts(accountID) {
    this.accountService.getData(`chartAc/account/${accountID}`).subscribe((result: any) => {
        this.accountName = result.actName;
      });
  }
}
