import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ListService, AccountService, ApiService } from "src/app/services";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { v4 as uuidv4 } from "uuid";
declare var $: any;

@Component({
  selector: "app-add-purchase-order",
  templateUrl: "./add-purchase-order.component.html",
  styleUrls: ["./add-purchase-order.component.css"],
})
export class AddPurchaseOrderComponent implements OnInit {
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  pageTitle = "Add";

  orderData = {
    txnDate: null,
    refNo: "",
    currency: "CAD",
    poType: "product",
    vendorID: null,
    detail: [
      {
        comm: "",
        qty: "",
        qtyTyp: null,
        rate: "",
        rateTyp: null,
        amount: 0,
        rowID: uuidv4(),
        status: "pending",
      },
    ],
    charges: {
      remarks: "",
      cName: "Adjustments",
      cType: "add",
      cAmount: 0,
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
      subTotal: 0,
      taxes: 0,
      finalTotal: 0,
    },
    status: "draft",
    billStatus: "",
    stateID: null,
    stateName: "",
    exempt: false,
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
  stateTaxes = [];
  cloneID: any;

  constructor(
    private httpClient: HttpClient,
    private listService: ListService,
    private accountService: AccountService,
    private toaster: ToastrService,
    private location: Location,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.purchaseID = this.route.snapshot.params["purchaseID"];
    if (this.purchaseID) {
      this.pageTitle = "Edit";
      this.fetchDetails();
    }
    this.route.queryParams.subscribe((params) => {
      this.cloneID = params.cloneID;
      if (this.cloneID != undefined && this.cloneID != "") {
        this.pageTitle = "Clone";
        this.purchaseID = this.cloneID;
        this.fetchDetails();
      }
    });

    this.listService.fetchVendors();
    this.fetchQuantityTypes();
    this.fetchStateTaxes();
    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;
    $(".modal").on("hidden.bs.modal", (e) => {
      localStorage.setItem("isOpen", "false");
    });
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
      rowID: uuidv4(),
      status: "pending",
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

  checkEmailStat(type) {
    if (this.cloneID) {
      delete this.orderData['orderNo'];
      delete this.orderData['purchaseID'];
      delete this.orderData['paymentLinked'];
    }
    if (type === "yes") {
      this.orderData["sendEmail"] = true;
    } else {
      this.orderData["sendEmail"] = false;
    }
    this.addRecord();
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
        element.amount <= 0
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

    this.submitDisabled = true;
    this.accountService.postData("purchase-orders", this.orderData).subscribe({
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

  setQuanType(event: any, index: number) {
    this.orderData.detail[index].qtyTyp = event.target.value;
    this.orderData.detail[index].rateTyp = event.target.value;
  }

  calculateFinalTotal() {
    this.orderData.total.subTotal =
      Number(this.orderData.total.detailTotal) +
      Number(this.orderData.total.feeTotal);

    this.allTax();
    this.orderData.total.finalTotal =
      Number(this.orderData.total.subTotal) +
      Number(this.orderData.total.taxes);
  }

  accessorialFeeTotal() {
    if (this.orderData.charges.cType === "add") {
      this.orderData.total.feeTotal = Number(this.orderData.charges.cAmount);
    } else if (this.orderData.charges.cType === "ded") {
      this.orderData.total.feeTotal = -Number(this.orderData.charges.cAmount);
    }
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
    for (let i = 0; i < this.orderData.detail.length; i++) {
      const element = this.orderData.detail[i];
      if (
        element.comm === "" ||
        element.qty === "" ||
        element.qtyTyp === null ||
        element.rate === "" ||
        element.rateTyp === null ||
        element.amount <= 0
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
    this.orderData["sendEmail"] = false;
    this.submitDisabled = true;
    this.accountService
      .putData(`purchase-orders/update/${this.purchaseID}`, this.orderData)
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
          this.toaster.success("Purchase order updated successfully.");
          this.cancel();
        },
      });
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
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
    this.orderData.stateName = null;
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
        this.orderData.stateName = v.stateName;
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

  cloneOrder() {
    delete this.orderData['orderNo'];
    delete this.orderData['purchaseID'];
    delete this.orderData['paymentLinked'];
    this.orderData["sendEmail"] = false;
    this.addRecord();
  }
}
