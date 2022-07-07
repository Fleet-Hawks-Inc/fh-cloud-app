import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import * as html2pdf from "html2pdf.js";
import { Subscription } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { ListService } from "src/app/services/list.service";
import { formatDate } from "@angular/common";
import { AccountService } from "src/app/services/account.service";
import { Auth } from "aws-amplify";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-payment-pdfs",
  templateUrl: "./payment-pdfs.component.html",
  styleUrls: ["./payment-pdfs.component.css"],
})
export class PaymentPdfsComponent implements OnInit {
  constructor(
    private listService: ListService,
    private apiService: ApiService,
    private accountService: AccountService,
    private modalService: NgbModal,
  ) { }
  @ViewChild("driverPaymentDetail", { static: true })
  modalContent: TemplateRef<any>;
  subscription: Subscription;

  pdfDetails = {
    name: "",
    phone: "",
    email: "",
    userID: "",
    address: "",
    payPeriod: "",
    payYear: "",
    paymentNo: "",
  };
  settlements = [];
  // paymentInfo: any;
  paymentSelected = []
  currency: string;
  payPeriod: any;
  paymentData = {
    paymentEnity: "",
    paymentTo: null,
    entityId: null,
    paymentNo: "",
    txnDate: "",
    fromDate: null,
    toDate: null,
    settlementIds: [],
    advancePayIds: [],
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    settledAmount: 0,
    vacPayPer: 0,
    vacPayAmount: 0,
    totalAmount: <any>0,
    taxdata: {
      payPeriod: null,
      stateCode: null,
      federalCode: "claim_code_1",
      provincialCode: null,
      cpp: 0,
      ei: 0,
      federalTax: 0,
      provincialTax: 0,
      emplCPP: 0,
      emplEI: 0,
    },
    taxes: <any>0,
    advance: <any>0,
    finalAmount: <any>0,
    accountID: null,
    settlData: [],
    advData: [],
    transactionLog: [],
    workerBenefit: 0,
    incomeTax: 0,
    eiInsurable: 0,
    gstHstAmt: 0,
    isVendorPayment: false,
  };
  locale = "en-US";
  annualResult = {
    cpp: 0,
    ei: 0,
    emplCPP: 0,
    emplEI: 0,
    federalTax: 0,
    provincialTax: 0,
    regEarning: 0,
    vacationPay: 0,
    workerBenefit: 0,
    incomeTax: 0,
    eiInsurable: 0,
    netPay: 0,
  };

  setlTripIds = [];
  trips = [];
  paymentTrips = [];
  payStatus = "paid";
  addCharges = [];
  dedCharges = [];
  advancePayments = [];
  fuelIds = [];
  fueldata = [];
  fuelAddTotal = 0;
  fuelDedTotal = 0;
  pdfTitle = "";
  currentUser: any = "";
  companyName: any = "";
  companyLogo = "";
  tagLine = "";
  grandTotal = 0;
  modelRef: any;
  subTotal = 0;
  totalSettmnt: any;
  paymentAbr = {
    "ppm": "Pay Per Mile",
    "pp": "Percentage",
    "ppd": "Pay Per Delivery",
    "pph": "Pay Per Hour",
    "pfr": "Pay Flat Rate"
  }
  multiPay = false;

  ngOnInit() {
    this.subscription = this.listService.paymentPdfList.subscribe(
      async (res: any) => {

        if (res.showModal && res.length != 0) {
          res.showModal = false;
          this.paymentData = res.data;

          this.paymentData.workerBenefit = 0;
          this.paymentData.incomeTax =
            Number(this.paymentData.taxdata.federalTax) +
            Number(this.paymentData.taxdata.provincialTax);
          this.paymentData.payMode = this.paymentData.payMode.replace("_", " ");
          this.paymentData.eiInsurable = this.paymentData.totalAmount;

          if (this.paymentData.paymentTo === "driver") {
            this.pdfTitle = "Driver Payment";
          } else if (this.paymentData.paymentTo === "employee") {
            this.pdfTitle = "Employee Payment";
          }
          await this.getCurrentuser();
          this.pdfDetails.paymentNo = this.paymentData.paymentNo;
          if (this.paymentData.paymentTo === "driver") {
            this.fetchDriverDetails();
          } else if (
            this.paymentData.paymentTo === "owner_operator" ||
            this.paymentData.paymentTo === "carrier" ||
            this.paymentData.paymentTo === "employee"
          ) {
            this.fetchCarrierDetails();
          }

          // open payment pdf for preview
          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "paymentPdfSection-prog__main",
          };
          res.showModal = false;
          this.modelRef = this.modalService
            .open(this.modalContent, ngbModalOptions)
            .result.then(
              (result) => { },
              (reason) => { }
            );

          if (this.paymentData.fromDate && this.paymentData.toDate) {
            this.pdfDetails.payYear = formatDate(
              this.paymentData.toDate,
              "yyyy",
              this.locale
            );
            let startDate = formatDate(
              this.paymentData.fromDate,
              "dd-MM-yyyy",
              this.locale
            );
            let endDate = formatDate(
              this.paymentData.toDate,
              "dd-MM-yyyy",
              this.locale
            );
            this.pdfDetails.payPeriod = `${startDate} To ${endDate}`;
            if (
              this.paymentData.paymentTo === "driver" ||
              this.paymentData.paymentTo === "employee"
            ) {
              await this.getUserAnnualTax();
            }
          }

          if (
            this.paymentData.paymentTo === "driver" ||
            this.paymentData.paymentTo === "owner_operator" ||
            this.paymentData.paymentTo === "carrier"
          ) {
            this.paymentData.settlData.map((p) => {
              if (p.status === "partially_paid") {
                this.payStatus = "Partially paid";
              }
            });
            await this.getSettlementData();

            if (
              this.paymentData.paymentTo === "driver" ||
              this.paymentData.paymentTo === "owner_operator"
            ) {
              await this.fetchSelectedFuelExpenses();
            }
          }
          await this.fetchAdvancePayments();

          // await this.generatePaymentPDF();
        }
      }
    );
  }

  async generatePaymentPDF() {
    let data: any;
    let pdfId = "";
    if (
      this.paymentData.paymentTo === "driver" ||
      this.paymentData.paymentTo === "employee"
    ) {
      pdfId = "driver_pay_pdf";
      data = document.getElementById("driver_pay_pdf");
    } else if (
      this.paymentData.paymentTo === "owner_operator" ||
      this.paymentData.paymentTo === "carrier"
    ) {
      pdfId = "ownerOperator_pay_pdf";
      data = document.getElementById("ownerOperator_pay_pdf");
    }

    html2pdf(data, {
      margin: [0.5, 0, 0.5, 0],
      pagebreak: { mode: "avoid-all", before: pdfId },
      filename: `${this.paymentData.paymentTo}-payment-${this.paymentData.paymentNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, logging: true, allowTaint: true,
        useCORS: true, dpi: 192, letterRendering: true
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    localStorage.setItem("downloadDisabled", "false");
    this.modelRef.close()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async getSettlementData() {
    let ids = encodeURIComponent(
      JSON.stringify(this.paymentData.settlementIds)
    );
    let result: any = await this.accountService
      .getData(`settlement/get/selected?entities=${ids}`)
      .toPromise();
    this.settlements = result;
    this.paymentSelected = result[0].paymentSelected
    this.currency = result[0].currency;
    let newDates = []
    let totalAddDed = 0;
    for (let index = 0; index < this.settlements.length; index++) {
      const element = this.settlements[index];

      if (element.paymentSelected) {
        this.multiPay = true;
      }

      // addCharges
      element.addition.map((add) => {
        this.addCharges.push(add);
      });

      element.deduction.map((ded) => {
        this.dedCharges.push(ded);
      });

      element.tripIds.map((k) => {
        if (!this.setlTripIds.includes(k)) {
          this.setlTripIds.push(k);
        }
      });

      element.fuelIds.map((k) => {
        if (!this.fuelIds.includes(k)) {
          this.fuelIds.push(k);
          element.fuelData.map((f) => {
            if (k === f.fuelID) {
              this.fueldata.push(f);
            }
          });
        }
      });

      if (element.prStart != undefined && element.prEnd != undefined) {

        let startDate = formatDate(
          element.prStart,
          "dd-MM-yyyy",
          this.locale
        );
        let endDate = formatDate(
          element.prEnd,
          "dd-MM-yyyy",
          this.locale
        );
        newDates.push(`${startDate} To ${endDate}`);
      }
      else {
        let startDate = formatDate(
          element.fromDate,
          "dd-MM-yyyy",
          this.locale
        );
        let endDate = formatDate(
          element.toDate,
          "dd-MM-yyyy",
          this.locale
        );
        newDates.push(`${startDate} To ${endDate}`);
      }

      totalAddDed += element.additionTotal - element.deductionTotal;


    }
    this.payPeriod = newDates.join(", ");
    await this.fetchTrips();
    this.subTotal += totalAddDed;
  }

  async getUserAnnualTax() {
    let result: any = await this.accountService
      .getData(
        `driver-payments/annual/payment/${this.paymentData.entityId}/${this.pdfDetails.payYear}`
      )
      .toPromise();
    if (result && result.length > 0) {
      this.annualResult = result[0];
      if (this.annualResult.regEarning === undefined) {
        this.annualResult.regEarning = 0;
      }
      if (this.annualResult.vacationPay === undefined) {
        this.annualResult.vacationPay = 0;
      }
      if (this.annualResult.workerBenefit === undefined) {
        this.annualResult.workerBenefit = 0;
      }

      this.annualResult.eiInsurable =
        Number(this.annualResult.regEarning) +
        Number(this.annualResult.vacationPay);

      // eiInsurable
      this.annualResult.incomeTax =
        Number(this.annualResult.federalTax) +
        Number(this.annualResult.provincialTax);
    }
  }

  async fetchTrips() {
    let tripIDs = encodeURIComponent(JSON.stringify(this.setlTripIds));
    this.paymentTrips = [];
    let result: any = await this.apiService
      .getData(`trips/driver/settled?entities=${tripIDs}`)
      .toPromise();
    this.trips = result;

    this.settlements.forEach((element) => {
      element.trpData.map((v) => {
        this.trips.map((trip) => {
          if (v.id === trip.tripID) {
            let obj = {
              tripNo: trip.tripNo,
              date: trip.dateCreated,
              plans: [],
              paymentSelected: v.paymentSelected ? v.paymentSelected[0] : '',
              finalRate: 0
            };
            if (v.plan.length > 0) {
              // if sub trip is settled
              v.plan.map((planId) => {
                trip.tripPlanning.map((plan) => {
                  if (planId === plan.planID) {
                    let planObj = {
                      type: plan.type,
                      location: plan.location,
                      miles: plan.miles,
                      rate: '',
                      driverName: plan.driverName ? plan.driverName : '',
                      codriverName: plan.codriverName ? plan.codriverName : '',
                      vehicleName: plan.vehicleName ? plan.vehicleName : '',
                      assetNames: plan.assetNames ? plan.assetNames.toString() : '',
                      showMiles: `${plan.mileType === 'loaded' ? 'L' : 'E'} - ${plan.miles}`,
                      drivrCodriver: ''
                    };
                    if (plan.driverID && this.paymentData.entityId === plan.driverID) {
                      planObj.drivrCodriver = plan.codriverName ? plan.codriverName : '';
                    }

                    if (plan.coDriverID && this.paymentData.entityId === plan.coDriverID) {
                      planObj.drivrCodriver = plan.driverName ? plan.driverName : '';
                    }

                    if (v.paymentSelected) {
                      if (v.paymentSelected[0].pType == 'pfr') {
                        planObj.rate = ''
                        obj.finalRate = v.paymentSelected[0].flatRate
                      } else if (v.paymentSelected[0].pType == 'ppm') {
                        if (plan.mileType === 'loaded') {
                          if (plan.driverID && plan.coDriverID) {
                            planObj.rate = v.paymentSelected[0].loadedMilesTeam
                          } else {
                            planObj.rate = v.paymentSelected[0].loadedMiles
                          }

                        } else {
                          if (plan.driverID && plan.coDriverID) {
                            planObj.rate = v.paymentSelected[0].emptyMilesTeam
                          } else {
                            if (plan.driverID && plan.coDriverID) {
                              planObj.rate = v.paymentSelected[0].emptyMilesTeam
                            } else {
                              planObj.rate = v.paymentSelected[0].emptyMiles
                            }
                          }
                        }
                        obj.finalRate = v.amount
                      }
                    }
                    obj.plans.push(planObj);
                  }
                });
              });
              this.paymentTrips.push(obj);
            } else {
              // if whole trip is selected
              trip.tripPlanning.map((plan) => {
                let planObj = {
                  type: plan.type,
                  location: plan.location,
                  miles: plan.miles,
                  rate: '',
                  driverName: plan.driverName ? plan.driverName : '',
                  codriverName: plan.codriverName ? plan.codriverName : '',
                  vehicleName: plan.vehicleName ? plan.vehicleName : '',
                  assetNames: plan.assetNames ? plan.assetNames.toString() : '',
                  showMiles: `${plan.mileType === 'loaded' ? 'L' : 'E'} - ${plan.miles}`,
                  drivrCodriver: ''
                };
                if (plan.driverID && this.paymentData.entityId === plan.driverID) {
                  planObj.drivrCodriver = plan.codriverName ? plan.codriverName : '';
                }

                if (plan.coDriverID && this.paymentData.entityId === plan.coDriverID) {
                  planObj.drivrCodriver = plan.driverName ? plan.driverName : '';
                }
                if (v.paymentSelected) {
                  if (v.paymentSelected[0].pType == 'pfr') {
                    planObj.rate = ''
                    obj.finalRate = v.paymentSelected[0].flatRate
                  } else if (v.paymentSelected[0].pType == 'ppm') {
                    if (plan.mileType === 'loaded') {
                      if (plan.driverID && plan.coDriverID) {
                        planObj.rate = v.paymentSelected[0].loadedMilesTeam
                      } else {
                        planObj.rate = v.paymentSelected[0].loadedMiles
                      }

                    } else {
                      if (plan.driverID && plan.coDriverID) {
                        planObj.rate = v.paymentSelected[0].emptyMilesTeam
                      }
                    }
                  }
                  obj.plans.push(planObj);
                };
                this.paymentTrips.push(obj);
              });
            }
          }
        });
      });

    });
    this.grandTotal = 0;
    for (const item of this.paymentTrips) {
      item.totalMiles = 0;
      item.totalRate = 0;
      for (const plan of item.plans) {
        item.totalMiles += parseFloat(plan.miles);
      }
      if (item.paymentSelected) {
        if (item.paymentSelected && item.paymentSelected.pType == 'ppm') {
          this.grandTotal += item.totalMiles;
        }
      } else {
        this.grandTotal += item.totalMiles;
      }

    }
  }

  fetchDriverDetails() {
    this.apiService
      .getData(`drivers/get/details/${this.paymentData.entityId}`)
      .subscribe((result: any) => {
        result = result.Items[0];

        if (result.middleName != undefined && result.middleName != '') {
          this.pdfDetails.name = `${result.firstName} ${result.middleName} ${result.lastName}`;
        } else {
          this.pdfDetails.name = `${result.firstName} ${result.lastName}`;
        }
        this.pdfDetails.email = result.email;
        this.pdfDetails.phone = result.phone;
        this.pdfDetails.userID = result.employeeContractorId;
        if (result.address[0].manual) {
          if (result.address[0].address1 !== "") {
            this.pdfDetails.address = `${result.address[0].address1} ${result.address[0].address2} ${result.address[0].cityName}, ${result.address[0].stateName}, ${result.address[0].countryName}`;
          }
        } else {
          this.pdfDetails.address = result.address[0].userLocation;
        }
      });
  }

  fetchCarrierDetails() {
    this.apiService
      .getData(`contacts/detail/${this.paymentData.entityId}`)
      .subscribe((result: any) => {
        result = result.Items[0];
        if (result.contactSK.includes('EMP#')) {
          this.pdfDetails.name = `${result.firstName} ${result.lastName}`;
        } else {
          this.pdfDetails.name = `${result.cName}`;
        }
        this.pdfDetails.email = result.workEmail;
        this.pdfDetails.userID = result.employeeID;
        if (result.adrs[0].manual) {
          if (result.adrs[0].add1 !== "") {
            this.pdfDetails.address = `${result.adrs[0].add1} ${result.adrs[0].add2} ${result.adrs[0].ctyName}, ${result.adrs[0].sName}, ${result.adrs[0].cName}`;
          }
        } else {
          this.pdfDetails.address = result.adrs[0].userLoc;
        }
      });
  }

  async fetchAdvancePayments() {
    let totalAdv = 0;
    if (this.paymentData.advancePayIds.length > 0) {
      let ids = encodeURIComponent(
        JSON.stringify(this.paymentData.advancePayIds)
      );
      let result: any = await this.accountService
        .getData(`advance/get/selected?entities=${ids}`)
        .toPromise();
      this.advancePayments = result;

      this.paymentData.advData.forEach((elem) => {
        this.advancePayments.map((v) => {
          if (v.paymentID === elem.paymentID) {
            elem.paymentNo = v.paymentNo;
            elem.paidAmount = Number(elem.paidAmount);
            elem.txnDate = v.txnDate;
            elem.ref = v.payModeNo;
            totalAdv += Number(elem.paidAmount);
          }
        });
      });
    }
    this.subTotal = this.paymentData.totalAmount - totalAdv;

  }

  async fetchSelectedFuelExpenses() {
    if (this.fuelIds.length > 0) {
      this.fuelAddTotal = 0;
      this.fuelDedTotal = 0;
      let fuelIDs = encodeURIComponent(JSON.stringify(this.fuelIds));
      let result = await this.apiService
        .getData(`fuelEntries/get/selected/ids?fuel=${fuelIDs}`)
        .toPromise();

      this.fueldata.map((k) => {
        result.map((fuel) => {
          if (k.fuelID === fuel.data.fuelID) {
            k.city = fuel.data.city;
            k.country = fuel.data.country;
            k.vehicle = fuel.data.unitNo;
            k.card = fuel.data.cardNo;
            k.quantity = `${fuel.data.qty} ${fuel.data.uom}`;
            k.fuelDate = fuel.data.date;
          }
        });

        if (k.action === "add") {
          this.fuelAddTotal += Number(k.amount);
        }
        if (k.action === "sub") {
          this.fuelDedTotal += Number(k.amount);
        }
      });
    }
  }

  getCurrentuser = async () => {
    // this.currentUser = (await Auth.currentSession()).getIdToken().payload;
    // const carrierID = this.currentUser.carrierID;
    const carrierID = localStorage.getItem('xfhCarrierId');
    let result: any = await this.apiService
      .getData(`carriers/detail/${carrierID}`)
      .toPromise();
    this.companyName = result.companyName;
    this.companyLogo = result.logo;
    this.tagLine = result.tagLine;
  };
}
