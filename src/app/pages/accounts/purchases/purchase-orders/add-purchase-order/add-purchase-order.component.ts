import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

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
          type: null,
        },
        {
          name: "PST",
          tax: 0,
          type: null,
        },
        {
          name: "HST",
          tax: 0,
          type: null,
        },
      ],
      discount: {
        type: null,
        val: "",
      },
    },
    total: {
      feeTotal: 0,
      dedTotal: 0,
      subTotal: 0,
      discount: 0,
      taxes: 0,
      finalTotal: 0,
    },
  };
  quantityTypes = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.fetchPayPeriods();
  }

  fetchPayPeriods() {
    this.httpClient
      .get("assets/jsonFiles/quantityTypes.json")
      .subscribe((data: any) => {
        this.quantityTypes = data;
      });
  }
}
