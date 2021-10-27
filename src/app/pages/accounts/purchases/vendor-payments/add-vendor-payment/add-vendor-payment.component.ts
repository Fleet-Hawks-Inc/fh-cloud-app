import { Component, OnInit } from "@angular/core";
import Constants from "src/app/pages/fleet/constants";
import * as moment from "moment";

@Component({
  selector: "app-add-vendor-payment",
  templateUrl: "./add-vendor-payment.component.html",
  styleUrls: ["./add-vendor-payment.component.css"],
})
export class AddVendorPaymentComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  paymentData = {
    txnDate: moment().format("YYYY-MM-DD"),
    vendorID: null,
    refNo: "",
    currency: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    orderIds: [],
    orderData: [],
    advIds: [],
    advdata: [],
    total: {
      subTotal: 0,
      advTotal: 0,
      orderTotal: 0,
      finalTotal: 0,
    },
  };
  constructor() {}

  ngOnInit() {}
}
