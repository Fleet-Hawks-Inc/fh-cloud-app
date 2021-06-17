import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import {ApiService} from 'src/app/services/api.service'



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  public allQuarters:any;
  public quarters={
    '1':"JAN - MAR",
    '2':"APR - JUN",
    '3':"JUL - SEP",
    '4':"OCT - DEC"
  }
  constructor(private apiService:ApiService) { }

  
  ngOnInit() {
    this.fetchQuarter();
    

  }
  fetchQuarter(){
    this.apiService.getData('ifta/quarters').subscribe(result=>{
      
      this.allQuarters=result;
    });
  }

}
