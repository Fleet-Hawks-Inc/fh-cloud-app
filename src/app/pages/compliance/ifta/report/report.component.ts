import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import {ApiService} from 'src/app/services/api.service'
import Constants from '../../../fleet/constants';



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  public allQuarters:any;
  
  public dataMessage=''
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
      
      if(Object.keys(result).length == 0){

        this.dataMessage=Constants.NO_RECORDS_FOUND;
      }
      else{
        this.allQuarters=result;
      }
      
    });
  }

}
