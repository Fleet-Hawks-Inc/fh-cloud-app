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
    status: "unpaid",
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
  paymentTerms = [];

  constructor(private listService: ListService) {}

  ngOnInit() {
    $(".modal").on("hidden.bs.modal", (e) => {
      localStorage.setItem("isOpen", "false");
    });

    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;
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
}
