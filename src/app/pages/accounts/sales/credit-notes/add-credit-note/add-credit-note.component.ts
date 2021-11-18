import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService, ApiService, ListService } from "src/app/services";

import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Auth } from "aws-amplify";

@Component({
  selector: "app-add-credit-note",
  templateUrl: "./add-credit-note.component.html",
  styleUrls: ["./add-credit-note.component.css"],
})
export class AddCreditNoteComponent implements OnInit {
  assetUrl = this.apiService.AssetUrl;

  submitDisabled = false;
  total = 0;
  creditData: any = {
    txnDate: moment().format("YYYY-MM-DD"),
    currency: "CAD",
    customerID: null,
    crRef: "",
    salePerson: null,
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
  customers = [];
  currentUser: any;

  docs = [];
  oldDocs = [];
  removedDocs = [];
  filesError = '';
  carrierID: any;

  files: any;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private location: Location,
    private accountService: AccountService,
    private apiService: ApiService,
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
    this.getCurrentUser();
    this.listService.fetchCustomers();
    let customerList = new Array<any>();
    this.getValidCustomers(customerList);
    this.customers = customerList;
  }

  changeUnit(value: string, i: any) {
    this.creditData.crDetails[i].qtyUnit = value;
    this.creditData.crDetails[i].rateUnit = value;
  }

  private getValidCustomers(customerList: any[]) {
    let ids = [];
    this.listService.customersList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          customerList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  getCurrentUser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.creditData.salePerson = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  };

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

  refreshVendorData() {
    this.listService.fetchVendors();
  }

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  addDetails() {
    let obj = {
      commodity: "",
      desc: "",
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    };
    const lastAdded: any =
      this.creditData.crDetails[this.creditData.crDetails.length - 1];
    if (
      lastAdded.commodity !== "" &&
      lastAdded.qty !== "" &&
      lastAdded.qtyUnit !== null &&
      lastAdded.rate !== "" &&
      lastAdded.rateUnit !== null &&
      lastAdded.amount !== 0 &&
      lastAdded.accountID !== null
    ) {
      this.creditData.crDetails.push(obj);
    }
  }

  deleteDetail(d: number) {
    this.total -= this.creditData.crDetails[d].amount;
    this.creditData.crDetails.splice(d, 1);
  }

  async calculateAmount(i: number) {
    let total: any = 0;
    this.creditData.crDetails[i].amount =
      this.creditData.crDetails[i].qty * this.creditData.crDetails[i].rate;
    this.creditData.crDetails.forEach((element) => {
      total += element.amount;
    });
    this.total = total.toFixed(2);
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addNotes() {
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

    this.accountService
      .postData(`customer-credits`, formData, true)
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
      .getData(`customer-credits/detail/${this.creditID}`)
      .subscribe((res) => {
        this.creditData = res[0];
        this.carrierID = res[0].pk;
        this.total = res[0].totalAmt;

        if (res[0].docs.length > 0) {
          res[0].docs.forEach((x: any) => {
            let obj: any = {};
            if (
              x.storedName.split(".")[1] === "jpg" ||
              x.storedName.split(".")[1] === "png" ||
              x.storedName.split(".")[1] === "jpeg"
            ) {
              obj = {
                imgPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
                docPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            }
            this.oldDocs.push(obj);
          });
        }
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
      .putData(`customer-credits/update/${this.creditID}`, formData, true)
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

  uploadDocs(documents) {
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
