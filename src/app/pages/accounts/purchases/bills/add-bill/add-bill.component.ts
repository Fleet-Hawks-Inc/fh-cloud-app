import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ListService, AccountService, ApiService } from "src/app/services";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { v4 as uuidv4 } from "uuid";
import Constants from "src/app/pages/fleet/constants";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-add-bill",
  templateUrl: "./add-bill.component.html",
  styleUrls: ["./add-bill.component.css"],
})
export class AddBillComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
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
        accountID: null,
        description: "",
        rowID: "",
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
    dueDate: moment().format("YYYY-MM-DD"),
    paymentTerm: null,
    purchaseID: null,
    creditIds: [],
    creditData: [],
    exempt: false,
    stateID: null,
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
  vendorCredits = [];
  accounts = [];
  editDisabled = false;
  stateTaxes = [];
  productDisabled = false;
  uploadedDocs = [];

  constructor(
    private listService: ListService,
    private accountService: AccountService,
    private httpClient: HttpClient,
    private toaster: ToastrService,
    private location: Location,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    this.billID = this.route.snapshot.params["billID"];
    $(".modal").on("hidden.bs.modal", (e) => {
      localStorage.setItem("isOpen", "false");
    });
    this.listService.fetchVendors();
    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;
    this.fetchQuantityTypes();
    this.fetchAccounts();
    this.fetchStateTaxes();
    if (this.billID) {
      this.editDisabled = true;
      await this.fetchDetails();
      await this.fetchAllPurchaseOrders();
    }
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
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
    if (this.orderData.vendorID) {
      const result: any = await this.accountService
        .getData(
          `purchase-orders/vendor/${this.orderData.vendorID}?currency=${this.orderData.currency}`
        )
        .toPromise();
      this.purchaseOrders = result;
    }
  }

  async fetchAllPurchaseOrders() {
    const result: any = await this.accountService
      .getData(`purchase-orders/vendor/all/${this.orderData.vendorID}`)
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
      accountID: null,
      description: "",
      rowID: uuidv4(),
    };
    const lastAdded = this.orderData.detail[this.orderData.detail.length - 1];
    if (
      lastAdded.comm !== "" &&
      lastAdded.qty !== "" &&
      lastAdded.qtyTyp !== null &&
      lastAdded.rate !== "" &&
      lastAdded.rateTyp !== null &&
      lastAdded.amount !== 0 &&
      lastAdded.accountID !== null
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
      Number(this.orderData.total.subTotal) -
      Number(this.orderData.total.vendorCredit) +
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
    this.orderData.total.dedTotal = result[0].total.dedTotal;
    this.orderData.total.detailTotal = result[0].total.detailTotal;
    this.orderData.total.feeTotal = result[0].total.feeTotal;
    this.orderData.total.finalTotal = result[0].total.finalTotal;
    this.orderData.total.subTotal = result[0].total.subTotal;
    this.orderData.total.taxes = result[0].total.taxes;
    this.orderData.refNo = result[0].refNo;
    this.orderData.currency = result[0].currency;
    this.orderData.vendorID = result[0].vendorID;
    this.calculateFinalTotal();
  }

  /*
   * Selecting files before uploading
   */
  selectDocuments(event) {
    let files = [...event.target.files];

    for (let i = 0; i < files.length; i++) {
      this.uploadedDocs.push(files[i]);
    }
  }

  addRecord() {
    for (let i = 0; i < this.orderData.detail.length; i++) {
      const element = this.orderData.detail[i];
      if (
        element.comm === "" ||
        element.qty === "" ||
        element.qtyTyp === null ||
        element.rate === "" ||
        element.rateTyp === null ||
        element.amount <= 0 ||
        element.accountID === null
      ) {
        this.toaster.error("Please enter valid bill details");
        return false;
      }
    }

    if (this.orderData.total.subTotal <= 0) {
      this.toaster.error("Amount should be greater than 0");
      return false;
    }

    if (this.orderData.total.finalTotal <= 0) {
      this.toaster.error("Amount should be greater than 0");
      return false;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append("uploadedDocs", this.uploadedDocs[i]);
    }

    this.orderData["uploaded_docs"] = formData;
    console.log("this.orderData", this.orderData);

    //append other fields
    // formData.append('data', JSON.stringify(this.incomeData));

    this.submitDisabled = true;
    // this.accountService.postData("bills", this.orderData).subscribe({

    this.accountService.postData("bills", formData, true).subscribe({
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

  async fetchVendorCredits() {
    if (this.orderData.vendorID) {
      this.dataMessage = Constants.FETCHING_DATA;
      let result: any = await this.accountService
        .getData(
          `vendor-credits/specific/${this.orderData.vendorID}?currency=${this.orderData.currency}`
        )
        .toPromise();
      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      result.map((v) => {
        v.prevPaidAmount = Number(v.totalAmt) - Number(v.balance);
        v.paidStatus = false;
        v.fullPayment = false;
        v.paidAmount = 0;
        v.newStatus = v.status.replace("_", " ");
      });
      this.vendorCredits = result;
    }
  }

  changeVendor() {
    this.orderData.total.vendorCredit = 0;
    this.orderData.total.subTotal = 0;
    this.vendorCredits = [];
    this.purchaseOrders = [];
    this.fetchPurchaseOrders();
    this.fetchVendorCredits();
  }

  assignFullPayment(index, data) {
    if (data.fullPayment) {
      this.vendorCredits[index].paidAmount = data.balance;
      this.vendorCredits[index].paidStatus = true;
    } else {
      this.vendorCredits[index].paidAmount = 0;
      this.vendorCredits[index].paidStatus = false;
    }
    this.selectedCredits();
    this.calculateFinalTotal();
  }

  selectedCredits() {
    this.orderData.creditIds = [];
    this.orderData.creditData = [];
    for (const element of this.vendorCredits) {
      if (element.selected) {
        if (!this.orderData.creditIds.includes(element.creditID)) {
          let obj = {
            creditID: element.creditID,
            status: element.status,
            paidAmount:
              element.status === "not_deducted"
                ? element.paidAmount
                : Number(element.totalAmt) - Number(element.balance),
            totalAmount:
              element.status === "not_deducted"
                ? element.amount
                : element.balance,
            pendingAmount: element.balance,
          };
          this.orderData.creditIds.push(element.creditID);
          this.orderData.creditData.push(obj);
        }
      }
    }
    this.creditCalculation();
    this.calculateFinalTotal();
  }

  creditCalculation() {
    this.orderData.total.vendorCredit = 0;
    for (const element of this.vendorCredits) {
      if (element.selected) {
        this.orderData.total.vendorCredit += Number(element.paidAmount);
        this.orderData.creditData.map((v) => {
          if (element.creditID === v.creditID) {
            v.paidAmount = Number(element.paidAmount);
            v.pendingAmount =
              Number(element.balance) - Number(element.paidAmount);
            if (Number(element.paidAmount) === Number(element.balance)) {
              v.status = "deducted";
            } else if (Number(element.paidAmount) < Number(element.balance)) {
              v.status = "partially_deducted";
            } else {
              v.status = "not_deducted";
            }
          }
        });
      }
    }
  }

  async fetchStateTaxes() {
    let result = await this.apiService.getData("stateTaxes").toPromise();
    this.stateTaxes = result.Items;
  }

  async taxExempt() {
    this.orderData.charges.taxes.map((v) => {
      v.tax = 0;
    });
    this.orderData.stateID = null;
    this.allTax();
    this.taxTotal();
  }

  async selecteProvince(stateID) {
    let taxObj = {
      GST: "",
      HST: "",
      PST: "",
      stateCode: "",
      stateName: "",
      stateTaxID: "",
    };
    this.stateTaxes.map((v) => {
      if (v.stateTaxID === stateID) {
        taxObj = v;
      }
    });

    this.orderData.charges.taxes.map((v) => {
      if (v.name === "GST") {
        v.tax = Number(taxObj.GST);
      } else if (v.name === "HST") {
        v.tax = Number(taxObj.HST);
      } else if (v.name === "PST") {
        v.tax = Number(taxObj.PST);
      }
    });
    this.allTax();
    this.taxTotal();
  }

  async typeChange(type) {
    if (type === "product") {
      this.productDisabled = true;
    } else {
      this.productDisabled = false;
    }
  }
}
