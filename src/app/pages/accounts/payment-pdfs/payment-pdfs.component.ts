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
    vacationPay: 0,
    incomeTax: 0
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
    incomeTax: 0
  };
  setlTripIds = [];
  trips = [];
  paymentTrips = [];
  payStatus = 'paid';
  addCharges = [];
  dedCharges = [];
  
  ngOnInit() {
    this.subscription = this.listService.paymentPdfList.subscribe(async (res: any) => {
      console.log('res', res);
      if(res.showModal && res.length != 0) {
        res.showModal = false;
        this.paymentData = res.data;
        this.paymentData.workerBenefit = 0;
        this.paymentData.vacationPay = 0;
        this.paymentData.incomeTax = Number(this.paymentData.taxdata.federalTax) + Number(this.paymentData.taxdata.provincialTax);
        this.paymentData.payMode = this.paymentData.payMode.replace("_"," ");
        
        this.paymentData.settlData.map((p) => {
          if(p.status === 'partially_paid') {
            this.payStatus = 'Partially paid';
          }
        });
        console.log('this.paymentData', this.paymentData);
        this.pdfDetails.paymentNo = this.paymentData.paymentNo;
        if(this.paymentData.paymentTo === 'driver') {
          this.fetchDriverDetails();
        }

        if(this.paymentData.fromDate && this.paymentData.toDate) {
          this.pdfDetails.payYear = formatDate(this.paymentData.toDate, 'yyyy', this.locale);
          let startDate = formatDate(this.paymentData.fromDate, 'dd-MM-yyyy', this.locale);
          let endDate = formatDate(this.paymentData.toDate, 'dd-MM-yyyy', this.locale);
          this.pdfDetails.payPeriod = `${startDate} To ${endDate}`;  
          await this.getUserAnnualTax();
        }
        
        await this.getSettlementData();
        await this.generatePaymentPDF();
      }
    })
  }
  
  async generatePaymentPDF() {
    console.log('in generate fn')
    var data = document.getElementById('driver_pay_pdf');
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
    console.log('this.settlements', this.settlements);

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
    }
    console.log('this.addCharges', this.addCharges);
    console.log('dedCharges', this.dedCharges);
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
    this.annualResult.incomeTax = Number(this.annualResult.federalTax) + Number(this.annualResult.provincialTax);
    console.log('this.annualResult', this.annualResult);
  }

  async fetchTrips() {
    let tripIDs = encodeURIComponent(JSON.stringify(this.setlTripIds));
    let result:any = await this.apiService.getData(`trips/driver/settled?entities=${tripIDs}`).toPromise();
    this.trips = result;
    console.log('this.trips-----', this.trips);

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
      console.log('this.paymentTrips', this.paymentTrips);
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
}
