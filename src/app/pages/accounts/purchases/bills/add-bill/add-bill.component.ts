import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ListService, AccountService } from "src/app/services";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-add-bill",
  templateUrl: "./add-bill.component.html",
  styleUrls: ["./add-bill.component.css"],
})
export class AddBillComponent implements OnInit {
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
      vendorCredit: 0,
      taxes: 0,
      finalTotal: 0,
    },
    status: "open",
    billType: null,
    dueDate: null,
    paymentTerm: null,
    purchaseID: null,
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
  purchaseOrders = [];
  paymentTerms = [
    {
      value: "15_days",
      name: "15 Days",
    },
    {
      value: "30_days",
      name: "30 Days",
    },
    {
      value: "45_days",
      name: "45 Days",
    },
    {
      value: "due_on_receipt",
      name: "Due on receipt",
    },
    {
      value: "due_end_of_month",
      name: "Due end of the month",
    },
  ];
  billID = "";
  advancePayments = [];

  constructor(
    private listService: ListService,
    private accountService: AccountService,
    private httpClient: HttpClient,
    private toaster: ToastrService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.billID = this.route.snapshot.params["billID"];
    if (this.billID) {
      this.fetchDetails();
    }
    $(".modal").on("hidden.bs.modal", (e) => {
      localStorage.setItem("isOpen", "false");
    });
    this.listService.fetchVendors();
    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;
    this.fetchPurchaseOrders();
    this.fetchQuantityTypes();
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);
    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
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

  async fetchPurchaseOrders() {
    const result: any = await this.accountService
      .getData("purchase-orders/get/all")
      .toPromise();
    this.purchaseOrders = result;
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

  async fetchPurchaseDetails() {
    let result: any = await this.accountService
      .getData(`purchase-orders/details/${this.orderData.purchaseID}`)
      .toPromise();

    this.orderData.detail = result[0].detail;
    this.orderData.charges = result[0].charges;
    this.orderData.total = result[0].total;
    this.orderData.refNo = result[0].refNo;
    this.orderData.currency = result[0].currency;
    this.orderData.vendorID = result[0].vendorID;
  }

  addRecord() {
    this.submitDisabled = true;
    this.accountService.postData("bills", this.orderData).subscribe({
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
        this.toaster.success("Bill added successfully.");
        this.cancel();
      },
    });
  }

  cancel() {
    this.location.back();
  }

  async fetchDetails() {
    let result: any = await this.accountService
      .getData(`bills/details/${this.billID}`)
      .toPromise();
    this.orderData = result[0];
  }

  updateRecord() {
    this.submitDisabled = true;
    this.accountService
      .putData(`bills/update/${this.billID}`, this.orderData)
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
          this.toaster.success("Bill updated successfully.");
          this.cancel();
        },
      });
  }
}
