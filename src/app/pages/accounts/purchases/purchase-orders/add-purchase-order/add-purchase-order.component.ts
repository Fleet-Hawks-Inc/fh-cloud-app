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
        qty: 0,
        qtyTyp: null,
        rate: 0,
        rateTyp: null,
        amount: 0,
        rowID: uuidv4(),
        status: "pending",
      },
    ],

    total: {
      finalTotal: 0,
    },
    remarks: "",
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
  cloneID: any;

  files: any;
  docs = [];
  oldDocs = [];
  removedDocs = [];
  filesError = '';

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
      qty: 0,
      qtyTyp: null,
      rate: 0,
      rateTyp: null,
      amount: 0,
      rowID: uuidv4(),
      status: "pending",
    };
    const lastAdded: any = this.orderData.detail[this.orderData.detail.length - 1];
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
        element.qty === 0 ||
        element.qtyTyp === null ||
        element.rate === 0 ||
        element.rateTyp === null ||
        element.amount <= 0
      ) {
        this.toaster.error("Please enter valid bill details");
        return false;
      }
    }

    if (this.orderData.total.finalTotal <= 0) {
      this.toaster.error("Amount should be greater than 0");
      return false;
    }
    this.submitDisabled = true;

    // create form data instance
    const formData = new FormData();

    //append docs if any
    for (let j = 0; j < this.docs.length; j++) {
      formData.append("docs", this.docs[j]);
    }

    //append other fields
    formData.append("data", JSON.stringify(this.orderData));

    this.accountService.postData("purchase-orders", formData, true).subscribe({
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



  calcDetailAmount(i: number) {
    let total: any = 0;
    let amount: any = (this.orderData.detail[i].qty ? this.orderData.detail[i].qty : 0) * (this.orderData.detail[i].rate ? this.orderData.detail[i].rate : 0);
    this.orderData.detail[i].amount = parseFloat(amount.toFixed(2));
    this.orderData.detail.forEach((element) => {
      total += element.amount;
    });
    this.orderData.total.finalTotal = parseFloat(total);

  }

  setQuanType(event: any, index: number) {
    this.orderData.detail[index].qtyTyp = event.target.value;
    this.orderData.detail[index].rateTyp = event.target.value;
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

  async fetchDetails() {
    let res: any = await this.accountService
      .getData(`purchase-orders/details/${this.purchaseID}`)
      .toPromise();
    this.orderData = res[0];
    if (res[0].docs.length > 0) {
      res[0].docs.forEach((x: any) => {
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
  }

  updateRecord() {
    for (let i = 0; i < this.orderData.detail.length; i++) {
      const element = this.orderData.detail[i];
      if (
        element.comm === "" ||
        element.qty === 0 ||
        element.qtyTyp === null ||
        element.rate === 0 ||
        element.rateTyp === null ||
        element.amount <= 0
      ) {
        this.toaster.error("Please enter valid bill details");
        return false;
      }
    }

    if (this.orderData.total.finalTotal <= 0) {
      this.toaster.error("Amount should be greater than 0");
      return false;
    }
    this.orderData["sendEmail"] = false;
    this.orderData['removedDocs'] = this.removedDocs;
    this.submitDisabled = true;
    // create form data instance
    const formData = new FormData();

    //append docs if any
    for (let j = 0; j < this.docs.length; j++) {
      formData.append("docs", this.docs[j]);
    }

    //append other fields
    formData.append("data", JSON.stringify(this.orderData));
    this.accountService
      .putData(`purchase-orders/update/${this.purchaseID}`, formData, true)
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


  cloneOrder(type) {
    if (type === "yes") {
      this.orderData["sendEmail"] = true;
    } else {
      this.orderData["sendEmail"] = false;
    }
    delete this.orderData['orderNo'];
    delete this.orderData['purchaseID'];
    delete this.orderData['paymentLinked'];
    this.addRecord();
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
      this.filesError = '';
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
}
