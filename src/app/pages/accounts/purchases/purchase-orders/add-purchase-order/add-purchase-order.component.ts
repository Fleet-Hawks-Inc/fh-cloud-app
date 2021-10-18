import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ListService, AccountService } from "src/app/services";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { Location } from "@angular/common";
import { element } from "protractor";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-purchase-order",
  templateUrl: "./add-purchase-order.component.html",
  styleUrls: ["./add-purchase-order.component.css"],
})
export class AddPurchaseOrderComponent implements OnInit {
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  orderData = {
    txnDate: null,
    refNo: "",
    currency: "CAD",
    vendorID: null,
    detail: [
      {
        comm: "",
        qty: "",
        qtyTyp: null,
        rate: "",
        rateTyp: null,
        amount: 0,
      },
    ],
    charges: {
      remarks: "",
      accFee: [
        {
          name: "",
          amount: 0,
        },
      ],
      accDed: [
        {
          name: "",
          amount: 0,
        },
      ],
      taxes: [
        {
          name: "GST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
        {
          name: "PST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
        {
          name: "HST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
      ],
    },
    total: {
      detailTotal: 0,
      feeTotal: 0,
      dedTotal: 0,
      subTotal: 0,
      taxes: 0,
      finalTotal: 0,
    },
    status: "draft",
    billStatus: "",
  };
  quantityTypes = [];
  vendors = [];
  submitDisabled = false;
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";
  purchaseID;

  constructor(
    private httpClient: HttpClient,
    private listService: ListService,
    private accountService: AccountService,
    private toaster: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.purchaseID = this.route.snapshot.params["purchaseID"];
    if (this.purchaseID) {
      this.fetchDetails();
    }
    this.listService.fetchVendors();
    this.fetchQuantityTypes();

    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;
  }

  private getValidVendors(vendorList: any[]) {
    let ids = [];
    this.listService.vendorList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          vendorList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  fetchQuantityTypes() {
    this.httpClient
      .get("assets/jsonFiles/quantityTypes.json")
      .subscribe((data: any) => {
        this.quantityTypes = data;
      });
  }

  addDetail() {
    let obj = {
      comm: "",
      qty: "",
      qtyTyp: null,
      rate: "",
      rateTyp: null,
      amount: 0,
    };
    const lastAdded = this.orderData.detail[this.orderData.detail.length - 1];
    if (
      lastAdded.comm !== "" &&
      lastAdded.qty !== "" &&
      lastAdded.qtyTyp !== "" &&
      lastAdded.rate !== "" &&
      lastAdded.rateTyp !== "" &&
      lastAdded.amount !== 0
    ) {
      this.orderData.detail.push(obj);
    }
  }

  delDetail(index) {
    if (this.orderData.detail.length > 1) {
      this.orderData.detail.splice(index, 1);
    }
    this.detailsTotal();
  }

  addAccessorialArr(type) {
    let obj = {
      name: "",
      amount: 0,
    };
    if (type === "fee") {
      const lastAdded =
        this.orderData.charges.accFee[this.orderData.charges.accFee.length - 1];
      if (lastAdded.name !== "" && lastAdded.amount !== 0) {
        this.orderData.charges.accFee.push(obj);
      }
    } else if (type === "ded") {
      const lastAdded =
        this.orderData.charges.accDed[this.orderData.charges.accDed.length - 1];
      if (lastAdded.name !== "" && lastAdded.amount !== 0) {
        this.orderData.charges.accDed.push(obj);
      }
    }
  }

  dedAccessorialArr(type, index) {
    if (type === "fee") {
      this.orderData.charges.accFee.splice(index, 1);
      this.accessorialFeeTotal();
    } else if (type === "ded") {
      this.orderData.charges.accDed.splice(index, 1);
      this.accessorialDedTotal();
    }
  }

  addRecord() {
    this.submitDisabled = true;
    this.accountService.postData("purchase-orders", this.orderData).subscribe({
      complete: () => {},
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
            next: () => {},
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success("Purchase order added successfully.");
        this.cancel();
      },
    });
  }

  cancel() {
    this.location.back();
  }

  detailsTotal() {
    this.orderData.total.detailTotal = 0;
    this.orderData.detail.forEach((element) => {
      this.orderData.total.detailTotal += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  calcDetailAmount(index: number) {
    if (!this.orderData.detail[index].rate) {
      this.orderData.detail[index].rate = "0";
    }
    if (!this.orderData.detail[index].qty) {
      this.orderData.detail[index].qty = "0";
    }
    if (this.orderData.detail[index].qty && this.orderData.detail[index].rate) {
      this.orderData.detail[index].amount =
        Number(this.orderData.detail[index].qty) *
        Number(this.orderData.detail[index].rate);
    }
    this.detailsTotal();
    this.allTax();
  }

  setQuanType(val: string, index: number) {
    this.orderData.detail[index].qtyTyp = val;
    this.orderData.detail[index].rateTyp = val;
  }

  calculateFinalTotal() {
    this.orderData.total.subTotal =
      Number(this.orderData.total.detailTotal) +
      Number(this.orderData.total.feeTotal) -
      Number(this.orderData.total.dedTotal);

    this.allTax();
    this.orderData.total.finalTotal =
      Number(this.orderData.total.subTotal) +
      Number(this.orderData.total.taxes);
  }

  accessorialFeeTotal() {
    this.orderData.total.feeTotal = 0;
    this.orderData.charges.accFee.forEach((element) => {
      this.orderData.total.feeTotal += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  accessorialDedTotal() {
    this.orderData.total.dedTotal = 0;
    this.orderData.charges.accDed.forEach((element) => {
      this.orderData.total.dedTotal += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  taxcalculation(index) {
    this.orderData.charges.taxes[index].amount =
      (this.orderData.charges.taxes[index].tax *
        this.orderData.total.subTotal) /
      100;

    this.taxTotal();
  }

  allTax() {
    this.orderData.charges.taxes.forEach((element) => {
      element.amount = (element.tax * this.orderData.total.subTotal) / 100;
    });
  }

  taxTotal() {
    this.orderData.total.taxes = 0;
    this.orderData.charges.taxes.forEach((element) => {
      this.orderData.total.taxes += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  async fetchDetails() {
    let result: any = await this.accountService
      .getData(`purchase-orders/details/${this.purchaseID}`)
      .toPromise();
    this.orderData = result[0];
  }

  updateRecord() {
    this.submitDisabled = true;
    this.accountService
      .putData(`purchase-orders/update/${this.purchaseID}`, this.orderData)
      .subscribe({
        complete: () => {},
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
              next: () => {},
            });
        },
        next: (res) => {
          this.submitDisabled = false;
          this.response = res;
          this.toaster.success("Purchase order updated successfully.");
          this.cancel();
        },
      });
  }
}
