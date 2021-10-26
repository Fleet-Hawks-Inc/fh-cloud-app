import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService, AccountService, ListService } from "../../../../../services";
import { HttpClient } from '@angular/common/http';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-sales-order',
  templateUrl: './add-sales-order.component.html',
  styleUrls: ['./add-sales-order.component.css']
})
export class AddSalesOrderComponent implements OnInit {
  pageTitle = 'Add';
  stateTaxes = [];
  submitDisabled = false;

  salesData: any = {
    txnDate: moment().format('YYYY-MM-DD'),
    currency: 'CAD',
    sRef: '',
    cusInfo: {
      customerID: '',
      addressID: ''
    },
    shipDate: '',
    salePerson: '',
    sOrderDetails: [{
      commodity: '',
      desc: '',
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    }],
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
      taxes: 0,
      finalTotal: 0,
    },
    taxExempt: true,
    stateTaxID: null,
    remarks: '',
  }

  customers = [];
  units = [];
  accounts = [];
  customerSelected: any = [];
  notOfficeAddress: boolean = false;

  currentUser: any = "";
  response: any = '';
  errors = {};

  saleID: string;

  constructor(public apiService: ApiService, private route: ActivatedRoute, public httpClient: HttpClient, private accountService: AccountService, private toaster: ToastrService, private location: Location, public listService: ListService) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.pageTitle = 'Edit';
      this.fetchSaleOrder();
    } else {
      this.pageTitle = 'Add';
    }
    this.fetchStateTaxes();
    this.fetchQuantityUnits();
    this.fetchAccounts();
    this.listService.fetchCustomers();
    this.getCurrentuser();

    let customerList = new Array<any>();
    this.getValidCustomers(customerList);
    this.customers = customerList;
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

  openModal(unit: string) {
    this.listService.triggerModal(unit);

    localStorage.setItem("isOpen", "true");
    this.listService.changeButton(false);
  }

  fetchCustomer() {
    if (this.salesData.customerID != null) {
      let id = this.salesData.customerID;
      this.selectedCustomer(id);
    }
    this.listService.fetchCustomers();
  }


  selectedCustomer(customerID: any) {
    this.apiService
      .getData(`contacts/detail/${customerID}`)
      .subscribe((result: any) => {
        if (result.Items.length > 0) {
          this.customerSelected = result.Items;
          for (let i = 0; i < this.customerSelected[0].adrs.length; i++) {
            const element = this.customerSelected[0].adrs[i];
            element["isChecked"] = false;
          }
          this.customerSelected[0].adrs[0].isChecked = true;
          this.salesData.cusInfo.addressID = this.customerSelected[0].adrs[0].addressID;

          if (this.customerSelected[0].adrs.length > 0) {
            this.salesData.cusInfo.addressID = this.customerSelected[0].adrs[0].addressID;
          }

          let addressLength = this.customerSelected[0].adrs.length;
          let getType = this.customerSelected[0].adrs[0].add1;
          let getC_Code = this.customerSelected[0].adrs[0].cCode;

          if (
            addressLength === 1 &&
            (getType == "" || getType == null) &&
            (getC_Code == "" || getC_Code == null)
          ) {
            this.notOfficeAddress = true;
          } else {
            this.notOfficeAddress = false;
          }

        }
      });
  }

  getAddressID(value: boolean, i: number, id: string) {
    if (value === true) {
      this.salesData.cusInfo.addressID.cusAddressID = id;
      for (
        let index = 0;
        index < this.customerSelected[0].adrs.length;
        index++
      ) {
        const element = this.customerSelected[0].adrs[index];
        element.isChecked = false;
      }
      this.customerSelected[0].adrs[i].isChecked = true;
    }
  }

  changeUnit(value: string, i: any) {
    this.salesData.sOrderDetails[i].qtyUnit = value;
    this.salesData.sOrderDetails[i].rateUnit = value;
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }

  fetchQuantityUnits() {
    this.httpClient
      .get("assets/jsonFiles/quantityTypes.json")
      .subscribe((data: any) => {
        this.units = data;
      });
  }

  addDetails() {
    this.salesData.sOrderDetails.push({
      commodity: '',
      desc: '',
      qty: 0,
      qtyUnit: null,
      rate: 0,
      rateUnit: null,
      amount: 0,
      accountID: null,
    });
  }

  deleteDetail(d: number) {
    // this.total -= this.salesData.sOrderDetails[d].amount;
    this.salesData.sOrderDetails.splice(d, 1);
  }

  addAccessorialArr(type) {
    let obj = {
      name: "",
      amount: 0,
    };
    if (type === "fee") {
      const lastAdded =
        this.salesData.charges.accFee[this.salesData.charges.accFee.length - 1];
      if (lastAdded.name !== "" && lastAdded.amount !== 0) {
        this.salesData.charges.accFee.push(obj);
      }
    } else if (type === "ded") {
      const lastAdded =
        this.salesData.charges.accDed[this.salesData.charges.accDed.length - 1];
      if (lastAdded.name !== "" && lastAdded.amount !== 0) {
        this.salesData.charges.accDed.push(obj);
      }
    }
  }

  dedAccessorialArr(type, index) {
    if (type === "fee") {
      this.salesData.charges.accFee.splice(index, 1);
      this.accessorialFeeTotal();
    } else if (type === "ded") {
      this.salesData.charges.accDed.splice(index, 1);
      this.accessorialDedTotal();
      this.calculateFinalTotal();
    }

  }

  accessorialFeeTotal() {
    this.salesData.total.feeTotal = 0;
    this.salesData.charges.accFee.forEach((element) => {
      this.salesData.total.feeTotal += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  accessorialDedTotal() {
    this.salesData.total.dedTotal = 0;
    this.salesData.charges.accDed.forEach((element) => {
      this.salesData.total.dedTotal += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  calculateFinalTotal() {
    this.salesData.total.subTotal =
      Number(this.salesData.total.detailTotal) +
      Number(this.salesData.total.feeTotal) -
      Number(this.salesData.total.dedTotal);

    this.allTax();
    this.salesData.total.finalTotal =
      Number(this.salesData.total.subTotal) +
      Number(this.salesData.total.taxes);
  }

  taxcalculation(index) {
    this.salesData.charges.taxes[index].amount =
      (this.salesData.charges.taxes[index].tax *
        this.salesData.total.subTotal) /
      100;

    this.taxTotal();
  }

  allTax() {
    let countTax = 0;
    this.salesData.charges.taxes.forEach((element) => {
      element.amount = (element.tax * this.salesData.total.subTotal) / 100;
      countTax += element.amount;
    });
    this.salesData.total.taxes = countTax
  }

  taxTotal() {
    this.salesData.total.taxes = 0;
    this.salesData.charges.taxes.forEach((element) => {
      this.salesData.total.taxes += Number(element.amount);
    });
    this.calculateFinalTotal();
  }

  async fetchStateTaxes() {
    let result = await this.apiService.getData("stateTaxes").toPromise();
    this.stateTaxes = result.Items;
  }

  taxExempt(value: boolean) {
    if (value === true) {
      this.salesData.total.finalTotal = this.salesData.total.subTotal;
    }
    this.calculateFinalTotal();
  }

  getCurrentuser = async () => {
    this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.salesData.salePerson = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  };

  async stateSelectChange() {
    let selected: any = this.stateTaxes.find(
      (o) => o.stateTaxID == this.salesData.stateTaxID
    );

    this.salesData.charges.taxes = [];

    this.salesData.charges.taxes = [
      {
        name: "GST",
        tax: selected.GST ? selected.GST : 0,
      },
      {
        name: "HST",
        tax: selected.HST ? selected.HST : 0,
      },
      {
        name: "PST",
        tax: selected.PST ? selected.PST : 0,
      },
    ];
    this.calculateFinalTotal();

    // this.tax =
    //   (parseInt(selected.GST) ? selected.GST : 0) +
    //   (parseInt(selected.HST) ? selected.HST : 0) +
    //   (parseInt(selected.PST) ? selected.PST : 0);
  }


  async calculateAmount(i: number) {
    let total: any = 0;
    this.salesData.sOrderDetails[i].amount = this.salesData.sOrderDetails[i].qty * this.salesData.sOrderDetails[i].rate;
    this.salesData.sOrderDetails.forEach(element => {
      total += element.amount;
    });
    this.salesData.total.detailTotal = parseFloat(total);
    this.calculateFinalTotal();
  }

  addSale() {
    this.accountService.postData(`sales-orders`, this.salesData).subscribe({
      complete: () => { },
      error: (err: any) => {
        this.submitDisabled = false;
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
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
            next: () => {
            },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Order added successfully.');
        this.cancel();
      },
    });
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  fetchSaleOrder() {
    this.accountService.getData(`sales-orders/detail/${this.saleID}`).subscribe(res => {
      this.salesData = res[0];
    });
  }

  updateSale() {
    this.submitDisabled = true;

    this.accountService.putData(`sales-orders/update/${this.saleID}`, this.salesData).subscribe({
      complete: () => { },
      error: (err: any) => {
        this.submitDisabled = false;
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
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
            next: () => {
            },
          });
      },
      next: (res) => {
        // this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Order updated successfully.');
        this.cancel();
      },
    });
  }

}
