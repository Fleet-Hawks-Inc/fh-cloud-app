import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { DashboardUtilityService } from 'src/app/services/dashboard-utility.service';
import * as html2pdf from "html2pdf.js";

@Component({
  selector: 'app-employee-pay',
  templateUrl: './employee-pay.component.html',
  styleUrls: ['./employee-pay.component.css']
})
export class EmployeePayComponent implements OnInit {

  @ViewChild("employerPayPdf", { static: true })
  modalContent: TemplateRef<any>;
  
  searchMsg = 'Please select search parameters to get the records'; 
  filterData = {
    type: null,
    entity: null,
    startDate: null,
    endDate: null,
  };
  searchDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  loaded = false;
  empData = [];
  employees = [];
  initLoad = false;
  dataMessage: string = this.searchMsg;
  drivers:any = [];
  empLastSK = '';
  drvLastSK = '';
  empLastSKdate = '';
  drvLastSKdate = '';
  lastSK = '';
  modelRef: any;
  pdfRecords = [];
  currentUser = '';
  
  constructor(private toastr: ToastrService, private accountService: AccountService, private apiService: ApiService, private dashboardUtilityService: DashboardUtilityService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getCurrentuser();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchRecords()
    }
    this.loaded = false;
  }

  searchResults() {
    if(this.filterData.type || this.filterData.entity || this.filterData.startDate || this.filterData.endDate) {
      if(this.filterData.type && !this.filterData.entity) {
        this.toastr.error("Please select driver/employee");
        return false;
      } else if(!this.filterData.startDate && this.filterData.endDate) {
        this.toastr.error("Please select start date");
        return false;
      } else if(this.filterData.startDate && !this.filterData.endDate) {
        this.toastr.error("Please select end date");
        return false;
      }
      this.empLastSK = '';
      this.drvLastSK = '';
      this.empLastSKdate = '';
      this.drvLastSKdate = '';
      this.lastSK = '';
      this.empData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchRecords();
    }
  }

  fetchRecords() {
    if(this.lastSK != 'end') {
      this.accountService.getData(`employee-payments/get/employer/pay?type=${this.filterData.type}&entity=${this.filterData.entity}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&empLastKey=${this.empLastSK}&empLastDate=${this.empLastSKdate}&drvLastKey=${this.drvLastSK}&drvLastDate=${this.drvLastSKdate}`).subscribe((result: any) => {
        this.empData = this.empData.concat(result);
        this.loaded = true;
        if(this.empData.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        } else {
          this.empData.map((k) => {
            k.payMode = k.payMode.replace("_"," ");
          })
          this.lastSK = '';
          if(this.empData[this.empData.length-1].empsk) {
            this.empLastSK = encodeURIComponent(this.empData[this.empData.length-1].empsk);
            if(this.empData[this.empData.length-1].emptransDate) {
              this.empLastSKdate = encodeURIComponent(this.empData[this.empData.length-1].emptransDate);
            }
          } else {
            this.empLastSK = 'end';
            this.empLastSKdate = 'end';
          }
          if(this.empData[this.empData.length-1].drvsk) {
            this.drvLastSK = encodeURIComponent(this.empData[this.empData.length-1].drvsk);
            if(this.empData[this.empData.length-1].drvtransDate) {
              this.drvLastSKdate = encodeURIComponent(this.empData[this.empData.length-1].drvtransDate);
            }
          } else {
            this.drvLastSK = 'end';
            this.drvLastSKdate = 'end';
          }
          if(!this.empData[this.empData.length-1].empsk && !this.empData[this.empData.length-1].drvsk) {
            this.lastSK = 'end';
          }
        }
      })
    }
    
  }

  fetchEmployees() {
    this.apiService
      .getData(`contacts/get/emp/list`)
      .subscribe((result: any) => {
        this.employees = result;
      });
  }

  async changeType() {
    this.filterData.entity = null;
    if(this.filterData.type == 'employee') {
      if(this.employees.length === 0) {
        this.fetchEmployees();
      }
    } else if(this.filterData.type == 'driver') {
      if(this.drivers.length === 0) {
        this.drivers = await this.dashboardUtilityService.getDrivers();
      }
    }
  }

  resetResults() {
    if(this.filterData.type || this.filterData.entity || this.filterData.startDate || this.filterData.endDate) {
      this.empData = [];
      this.dataMessage = this.searchMsg;
      this.filterData = {
        type: null,
        entity: null,
        startDate: null,
        endDate: null,
      };
      this.empLastSK = '';
      this.drvLastSK = '';
      this.empLastSKdate = '';
      this.drvLastSKdate = '';
      this.lastSK = '';
    }
  }

  showPdf() {
    if(this.empData.length > 0) {
      let entities = [];
      this.pdfRecords = [];
      this.accountService.getData(`employee-payments/get/employer/pay?type=${this.filterData.type}&entity=${this.filterData.entity}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&empLastKey=&empLastDate=&drvLastKey=&drvLastDate=&fetchType=all`).subscribe((result: any) => {
        let empData = result;
        empData.map((k) => {
          k.payMode = k.payMode.replace("_"," ");
        })
      
        for (const iterator of empData) {
          if(!entities.includes(iterator.entityId)) {
            let obj = {
              entityId: iterator.entityId,
              entityName: iterator.empName,
              uniqID: iterator.empID,
              payments: [],
              total: {
                gross: 0,
                ei: 0,
                cpp: 0,
                ded: 0,
                net: 0,
                provTax: 0,
                fedTax: 0,
                cra: 0
              }
            }
            obj.payments.push(iterator)
            entities.push(iterator.entityId);
            this.pdfRecords.push(obj);
          } else {
            this.pdfRecords.map((v) => {
              if(v.entityId === iterator.entityId) {
                v.payments.push(iterator);
              }
            })
          }
        }

        for (let index = 0; index < this.pdfRecords.length; index++) {
          const element = this.pdfRecords[index];
          element.total = {
            gross: 0,
            ei: 0,
            cpp: 0,
            ded: 0,
            net: 0,
            provTax: 0,
            fedTax: 0,
            cra: 0
          }
          for (let index = 0; index < element.payments.length; index++) {
            const pay = element.payments[index];
            
            element.total.gross += Number(pay.subTotal); 
            element.total.ei += Number(pay.taxdata.ei); 
            element.total.cpp += Number(pay.taxdata.cpp); 
            element.total.ded += Number(pay.deductionTotal); 
            element.total.net += Number(pay.finalTotal); 
            element.total.provTax += Number(pay.taxdata.provincialTax); 
            element.total.fedTax += Number(pay.taxdata.federalTax); 
            element.total.cra += Number(pay.cra); 
          }
        }
        let ngbModalOptions: NgbModalOptions = {
          backdrop: "static",
          keyboard: false,
          windowClass: "emplyrpdf-prog__main",
        };
        this.modelRef = this.modalService
          .open(this.modalContent, ngbModalOptions)
          .result.then(
            (result) => { },
            (reason) => { }
          );
      })
    }
  }

  async downloadPDF() {
    let data: any = document.getElementById("emppPdf");

    html2pdf(data, {
      margin: [0.5, 0.3, 0.5, 0.3],
      pagebreak: { mode: "avoid-all", before: 'emppPdf' },
      filename: `employer-pay-statement.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, logging: true, allowTaint: true,
        useCORS: true, dpi: 0, letterRendering: true
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    });
    localStorage.setItem("downloadDisabled", "false");
    this.modelRef.close()
  }

  getCurrentuser = async () => {
    const selectedCarrier = localStorage.getItem('xfhCarrierId');
      const res = await this.apiService.getData(`carriers/get/detail/${selectedCarrier}`).toPromise()
      this.currentUser = `${res.Items[0].firstName} ${res.Items[0].lastName}`;
  };

}
