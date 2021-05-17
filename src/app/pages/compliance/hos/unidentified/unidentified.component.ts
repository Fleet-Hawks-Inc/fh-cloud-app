import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import * as moment from "moment";
declare var $: any;
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-unidentified',
  templateUrl: './unidentified.component.html',
  styleUrls: ['./unidentified.component.css']
})
export class UnidentifiedComponent implements OnInit {
  logs = [];

  fromDate: any = moment().format("YYYY-MM-DD");
  toDate: any = moment().format("YYYY-MM-DD");

  constructor(
    private apiService: ApiService,
    private parserFormatter: NgbDateParserFormatter,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchUncertifiedLogs();
  }

  fetchUncertifiedLogs(){
    if((this.fromDate && !this.toDate) || (this.toDate && !this.fromDate)) {
      this.toastr.error('Both dates are required');
      return false;
    }

    let toDate = this.toDate;
    if(this.toDate){
      toDate =  moment(this.toDate).add(1, 'days').format("YYYY-MM-DD");
    }

    if(this.fromDate == null) this.fromDate = '';
    if(toDate == null) toDate = '';

    this.apiService.getData(`compliance/unIndentifiedLogs?fromDate=${this.fromDate}&toDate=${toDate}`).subscribe((result) => {
      this.logs = result;
    })
  }

}
