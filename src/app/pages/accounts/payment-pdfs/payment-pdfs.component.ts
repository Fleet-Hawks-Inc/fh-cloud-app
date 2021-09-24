import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ListService } from 'src/app/services/list.service';
import { formatDate } from "@angular/common";
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-payment-pdfs',
  templateUrl: './payment-pdfs.component.html',
  styleUrls: ['./payment-pdfs.component.css']
})
export class PaymentPdfsComponent implements OnInit {

  constructor(private listService: ListService, private apiService: ApiService, private accountService: AccountService) { }
  subscription: Subscription;

  pdfDetails = {
    name: '',
    phone: '',
    email: '',
    userID: '',
    address: '',
    payPeriod: '',
    payYear: '',
    paymentNo: ''
  };
  settlements = [];

  paymentData = {
    paymentEnity: '',
    paymentTo: null,
    entityId: null,
    paymentNo: '',
    txnDate: '',
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
      federalCode: 'claim_code_1',
      provincialCode: null,
      cpp: 0,
      ei: 0,
      federalTax: 0,
      provincialTax: 0,
      emplCPP: 0,
      emplEI: 0
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
  };
  locale = 'en-US';
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
  payStatus = 'paid';
  addCharges = [];
  dedCharges = [];
  advancePayments = [];
  fuelIds = [];
  fueldata = [];
  fuelAddTotal = 0;
  fuelDedTotal = 0;
  pdfTitle = '';
  
  ngOnInit() {
    this.subscription = this.listService.paymentPdfList.subscribe(async (res: any) => {
      if(res.showModal && res.length != 0) {
        res.showModal = false;
        this.paymentData = res.data;
        this.paymentData.workerBenefit = 0;
        this.paymentData.incomeTax = Number(this.paymentData.taxdata.federalTax) + Number(this.paymentData.taxdata.provincialTax);
        this.paymentData.payMode = this.paymentData.payMode.replace("_"," ");
        this.paymentData.eiInsurable = this.paymentData.totalAmount;

        if(this.paymentData.paymentTo === 'driver') {
          this.pdfTitle = 'Driver Payment Advance';
        } else if (this.paymentData.paymentTo === 'employee') {
          this.pdfTitle = 'Employee Payment';
        }
        
        this.pdfDetails.paymentNo = this.paymentData.paymentNo;
        if(this.paymentData.paymentTo === 'driver') {
          this.fetchDriverDetails();
        } else if (this.paymentData.paymentTo === 'owner_operator' || this.paymentData.paymentTo === 'carrier' || this.paymentData.paymentTo === 'employee') {
          this.fetchCarrierDetails();
        }

        if(this.paymentData.fromDate && this.paymentData.toDate) {
          this.pdfDetails.payYear = formatDate(this.paymentData.toDate, 'yyyy', this.locale);
          let startDate = formatDate(this.paymentData.fromDate, 'dd-MM-yyyy', this.locale);
          let endDate = formatDate(this.paymentData.toDate, 'dd-MM-yyyy', this.locale);
          this.pdfDetails.payPeriod = `${startDate} To ${endDate}`;  
          if(this.paymentData.paymentTo === 'driver' || this.paymentData.paymentTo === 'employee') {
            await this.getUserAnnualTax();
          }
        }

        if(this.paymentData.paymentTo === 'driver' || this.paymentData.paymentTo === 'owner_operator' || this.paymentData.paymentTo === 'carrier') {
          this.paymentData.settlData.map((p) => {
            if(p.status === 'partially_paid') {
              this.payStatus = 'Partially paid';
            }
          });
          await this.getSettlementData();
          
          if(this.paymentData.paymentTo === 'driver' || this.paymentData.paymentTo === 'owner_operator') {
            await this.fetchSelectedFuelExpenses();
          }
        }
        await this.fetchAdvancePayments();
        await this.generatePaymentPDF();
      }
    })
  }
  
  async generatePaymentPDF() {
    let data:any;
    if(this.paymentData.paymentTo === 'driver' || this.paymentData.paymentTo === 'employee') {
      data = document.getElementById('driver_pay_pdf');
    } else if (this.paymentData.paymentTo === 'owner_operator' || this.paymentData.paymentTo === 'carrier') {
      data = document.getElementById('ownerOperator_pay_pdf');
    }
    
    html2pdf(data, {
      margin:       0,
      filename:     `${this.paymentData.paymentTo}-payment-${this.paymentData.paymentNo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
    localStorage.setItem('downloadDisabled', 'false');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async getSettlementData() {
    let ids = encodeURIComponent(JSON.stringify(this.paymentData.settlementIds));
    let result:any = await this.accountService.getData(`settlement/get/selected?entities=${ids}`).toPromise();
    this.settlements = result;
    for (let index = 0; index < this.settlements.length; index++) {
      const element = this.settlements[index];

      // addCharges
      element.addition.map((add) => {
        this.addCharges.push(add);
      })

      element.deduction.map((ded) => {
        this.dedCharges.push(ded);
      })
      
      element.tripIds.map((k) => {
        if(!this.setlTripIds.includes(k)) {
          this.setlTripIds.push(k);
        }
      });

      element.fuelIds.map((k) => {
        if(!this.fuelIds.includes(k)) {
          this.fuelIds.push(k);
          element.fuelData.map((f) => {
            if(k === f.fuelID) {
              this.fueldata.push(f);
            }
          })
        }
      });
    }
    await this.fetchTrips();
  }

  async getUserAnnualTax() {
    let result:any = await this.accountService.getData(`driver-payments/annual/payment/${this.paymentData.entityId}/${this.pdfDetails.payYear}`).toPromise();
    this.annualResult = result[0];
    if(this.annualResult.regEarning === undefined) {
      this.annualResult.regEarning = 0;
    }
    if(this.annualResult.vacationPay === undefined) {
      this.annualResult.vacationPay = 0;
    }
    if(this.annualResult.workerBenefit === undefined) {
      this.annualResult.workerBenefit = 0;
    }

    this.annualResult.eiInsurable = Number(this.annualResult.regEarning) + Number(this.annualResult.vacationPay);

    // eiInsurable
    this.annualResult.incomeTax = Number(this.annualResult.federalTax) + Number(this.annualResult.provincialTax);
  }

  async fetchTrips() {
    let tripIDs = encodeURIComponent(JSON.stringify(this.setlTripIds));
    this.paymentTrips = [];
    let result:any = await this.apiService.getData(`trips/driver/settled?entities=${tripIDs}`).toPromise();
    this.trips = result;

    this.settlements.forEach(element => {
      element.trpData.map((v) => {
        this.trips.map((trip) => {
          if(v.id === trip.tripID) {
            let obj = {
              tripNo: trip.tripNo,
              date: trip.dateCreated,
              plans: [],
            }
            if(v.plan.length > 0) {
              // if sub trip is settled
              v.plan.map((planId) => {
                trip.tripPlanning.map((plan) => {
                  if(planId === plan.planID) {
                    let planObj = {
                      type: plan.type,
                      location: plan.location,
                      miles: plan.miles
                    }
                    obj.plans.push(planObj);
                  }
                })
              })
              this.paymentTrips.push(obj);
            } else {
              // if whole trip is selected
              trip.tripPlanning.map((plan) => {
                let planObj = {
                  type: plan.type,
                  location: plan.location,
                  miles: plan.miles
                }
                obj.plans.push(planObj);
              })
              this.paymentTrips.push(obj);
            }
          }
        })
      })
    });
  }

  fetchDriverDetails() {
    this.apiService.getData(`drivers/get/details/${this.paymentData.entityId}`).subscribe((result: any) => {
      result = result.Items[0];
      this.pdfDetails.name = `${result.firstName} ${result.lastName}`;
      this.pdfDetails.email = result.email;
      this.pdfDetails.phone = result.phone;
      this.pdfDetails.userID = result.employeeContractorId;
      if(result.address[0].manual) {
        if(result.address[0].address1 !== '') {
          this.pdfDetails.address = `${result.address[0].address1} ${result.address[0].address2} ${result.address[0].cityName}, ${result.address[0].stateName}, ${result.address[0].countryName}`;
        }
      } else {
        this.pdfDetails.address = result.address[0].userLocation;
      }
    });
  }

  fetchCarrierDetails() {
    this.apiService.getData(`contacts/detail/${this.paymentData.entityId}`).subscribe((result: any) => {
      result = result.Items[0];
      this.pdfDetails.name = result.cName;
      this.pdfDetails.email = result.workEmail;
      if(result.adrs[0].manual) {
        if(result.adrs[0].add1 !== '') {
          this.pdfDetails.address = `${result.adrs[0].add1} ${result.adrs[0].add2} ${result.adrs[0].ctyName}, ${result.adrs[0].sName}, ${result.adrs[0].cName}`;
        }
      } else {
        this.pdfDetails.address = result.adrs[0].userLoc;
      }
    });
  }

  async fetchAdvancePayments() {
    if(this.paymentData.advancePayIds.length > 0) {
      let ids = encodeURIComponent(JSON.stringify(this.paymentData.advancePayIds));
      let result:any = await this.accountService.getData(`advance/get/selected?entities=${ids}`).toPromise();
      this.advancePayments = result;
      this.paymentData.advData.forEach((elem) => {
        this.advancePayments.map((v) => {
          if(v.paymentID === elem.paymentID) {
            elem.paymentNo = v.paymentNo;
            elem.paidAmount = Number(elem.paidAmount);
            elem.txnDate = v.txnDate;
            elem.ref = v.payModeNo
          }
        });
      })
    }
  }
  
  async fetchSelectedFuelExpenses() {
    if(this.fuelIds.length > 0) {
      this.fuelAddTotal = 0;
      this.fuelDedTotal = 0;
      let fuelIDs = encodeURIComponent(JSON.stringify(this.fuelIds));
      let result = await this.apiService.getData(`fuelEntries/get/selected/ids?fuel=${fuelIDs}`).toPromise();
      this.fueldata.map((k) => {
        result.map((fuel) => {
          k.city = fuel.cityName;
          k.country = fuel.locationCountry;
          k.vehicle = fuel.unitNumber;
          k.card = fuel.fuelCardNumber;
          k.quantity = `${fuel.quantity} ${fuel.unitOfMeasure}`;
          k.fuelDate = fuel.fuelDate;
        })

        if(k.action === 'add') {
          this.fuelAddTotal += Number(k.amount);
        }
        if(k.action === 'sub') {
          this.fuelDedTotal += Number(k.amount);
        }
      })
    }
  }
}
