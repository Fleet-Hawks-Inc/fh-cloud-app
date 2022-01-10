import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService, ListService } from "src/app/services";

import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-add-vendor-credit-note",
  templateUrl: "./add-vendor-credit-note.component.html",
  styleUrls: ["./add-vendor-credit-note.component.css"],
})
export class AddVendorCreditNoteComponent implements OnInit {
  submitDisabled = false;
  total = 0;
  creditData: any = {
    txnDate: moment().format("YYYY-MM-DD"),
    currency: "CAD",
    crRef: "",
    purOrder: null,
    vendorID: null,
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
  purchaseOrders = [];
  filesError = '';

  docs = [];
  oldDocs = [];
  removedDocs = [];
  files: any;
  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private location: Location,
    private accountService: AccountService,
    private httpClient: HttpClient
  ) { }

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

    this.listService.fetchVendors();
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

  refreshVendorData() {
    this.listService.fetchVendors();
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

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

  changeUnit(value: string, i: any) {
    this.creditData.crDetails[i].qtyUnit = value;
    this.creditData.crDetails[i].rateUnit = value;
  }
  addDetails() {
    const lastInd = this.creditData.crDetails.length - 1;
    if (
      this.creditData.crDetails[lastInd].commodity !== "" &&
      this.creditData.crDetails[lastInd].qty > 0 &&
      this.creditData.crDetails[lastInd].qtyUnit != null &&
      this.creditData.crDetails[lastInd].rateUnit != null &&
      this.creditData.crDetails[lastInd].rate > 0 &&
      this.creditData.crDetails[lastInd].accountID != null
    ) {
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
  }

  deleteDetail(d: number) {
    this.total -= this.creditData.crDetails[d].amount;
    this.creditData.crDetails.splice(d, 1);
  }

  async calculateAmount(i: number) {
    let total: any = 0;
    let amount =
      this.creditData.crDetails[i].qty * this.creditData.crDetails[i].rate;
    this.creditData.crDetails[i].amount = parseFloat(amount.toFixed(2));
    this.creditData.crDetails.forEach((element) => {
      total += element.amount;
    });
    this.total = total;
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addNotes() {


    for (let i = 0; i < this.creditData.crDetails.length; i++) {
      const element = this.creditData.crDetails[i];
      if (
        element.commodity === "" ||
        element.qty <= 0 ||
        element.qtyUnit === null ||
        element.rateUnit == null ||
        element.rate <= 0 ||
        element.accountID === null
      ) {
        this.toaster.error("Please enter valid credit details");
        return false;
      }
    }

    this.submitDisabled = true;
    this.creditData.totalAmt = this.total;

    // create form data instance
    const formData = new FormData();

    //append docs if any
    for (let j = 0; j < this.docs.length; j++) {
      formData.append("docs", this.docs[j]);
    }

    //append other fields
    formData.append("data", JSON.stringify(this.creditData));

    this.accountService.postData(`vendor-credits`, formData, true).subscribe({
      complete: () => { },
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
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success("Credit note added successfully.");
        this.cancel();
      },
    });
  }

  fetchCredit() {
    this.accountService
      .getData(`vendor-credits/detail/${this.creditID}`)
      .subscribe((res) => {
        let result = res[0];
        this.creditData.purOrder = result.purOrder;
        this.creditData.currency = result.currency;
        this.creditData.crRef = result.crRef;
        this.creditData.txnDate = result.txnDate;
        this.creditData.vCrNo = result.vCrNo;
        this.creditData.vendorID = result.vendorID;
        this.creditData.crDetails = result.crDetails;
        this.creditData.remarks = result.remarks;
        this.creditData.docs = result.docs;
        this.total = result.totalAmt;

        if (result.docs && result.docs.length > 0) {
          result.docs.forEach((x: any) => {
            let obj: any = {};
            if (
              x.storedName.split(".")[1] === "jpg" ||
              x.storedName.split(".")[1] === "png" ||
              x.storedName.split(".")[1] === "jpeg"
            ) {
              obj = {
                imgPath: `${x.urlPath}`,
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            }
            this.oldDocs.push(obj);
          });
        }
        this.fetchPurchaseOrders();
      });
  }

  updateNotes() {
    this.submitDisabled = true;
    this.creditData.totalAmt = this.total;
    this.creditData.removedDocs = this.removedDocs;
    // create form data instance
    const formData = new FormData();

    //append docs if any
    for (let j = 0; j < this.docs.length; j++) {
      formData.append("docs", this.docs[j]);
    }

    //append other fields
    formData.append("data", JSON.stringify(this.creditData));

    this.accountService
      .putData(`vendor-credits/update/${this.creditID}`, formData, true)
      .subscribe({
        complete: () => { },
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
              next: () => { },
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

  async fetchPurchaseOrders() {
    this.purchaseOrders = [];
    if (this.creditData.vendorID) {
      let result: any = await this.accountService
        .getData(`purchase-orders/vendor/all/${this.creditData.vendorID}`)
        .toPromise();
      this.purchaseOrders = result;
    }
  }

  uploadDocs(documents) {
    this.filesError = '';
    this.docs = [];
    let files = [...documents];
    let filesSize = 0;
    if (files.length > 5) {
      this.toaster.error("Files count limit exceeded");
      this.filesError = "Files should not be more than 5";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      filesSize += files[i].size / 1024 / 1024;
      if (filesSize > 10) {
        this.toaster.error("Files size limit exceeded");
        this.filesError = 'Files size limit exceeded. Files size should be less than 10mb';
        return;
      } else {
        let name = files[i].name.split(".");
        let ext = name[name.length - 1].toLowerCase();
        if (
          ext == "doc" ||
          ext == "docx" ||
          ext == "pdf" ||
          ext == "jpg" ||
          ext == "jpeg" ||
          ext == "png"
        ) {
          this.docs.push(files[i]);
        } else {
          this.filesError =
            "Only .doc, .docx, .pdf, .jpg, .jpeg and png files allowed.";
        }
      }
    }
  }

  deleteDocument(name: string, index: number) {
    this.oldDocs.filter(elem => {
      if (elem.displayName === name) {
        let obj = {
          storedName: elem.name,
          displayName: elem.displayName,
        }
        this.removedDocs.push(obj);;
      }
    })

    this.oldDocs.splice(index, 1);
  }
}
