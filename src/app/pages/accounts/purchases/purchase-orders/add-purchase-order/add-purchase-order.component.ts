import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ListService } from "src/app/services";

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
    orderNo: "",
    txnDate: null,
    refNo: "",
    currency: "CAD",
    vendorID: null,
    dtail: [
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
      feeTotal: 0,
      dedTotal: 0,
      subTotal: 0,
      taxes: 0,
      finalTotal: 0,
    },
  };
  quantityTypes = [];
  vendors = [];

  constructor(
    private httpClient: HttpClient,
    private listService: ListService
  ) {}

  ngOnInit() {
    this.listService.fetchVendors();
    this.fetchPayPeriods();

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

  fetchPayPeriods() {
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

    this.orderData.dtail.push(obj);
  }

  delDetail(index) {
    if (this.orderData.dtail.length > 1) {
      this.orderData.dtail.splice(index, 1);
    }
  }

  addAccessorialArr(type) {
    let obj = {
      name: "",
      amount: 0,
    };
    if (type === "fee") {
      this.orderData.charges.accFee.push(obj);
    } else if (type === "ded") {
      this.orderData.charges.accDed.push(obj);
    }
  }

  dedAccessorialArr(type, index) {
    if (type === "fee") {
      this.orderData.charges.accFee.splice(index, 1);
    } else if (type === "ded") {
      this.orderData.charges.accDed.splice(index, 1);
    }
  }

  addRecord() {
    console.log("orderData-=-===-=-", this.orderData);
  }
}
