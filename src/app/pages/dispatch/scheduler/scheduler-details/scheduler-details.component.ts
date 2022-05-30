import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-scheduler-details',
  templateUrl: './scheduler-details.component.html',
  styleUrls: ['./scheduler-details.component.css']
})
export class SchedulerDetailsComponent implements OnInit {

  schedulerID=null
  schedule:any
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.schedulerID=this.route.snapshot.params["scheduleID"]
    this.fetchSchedule();
  }
  async fetchSchedule(){
const result=await this.apiService.getData("orders/schedule/"+this.schedulerID).toPromise();
if(result.length>0){
if(result[0].sRange.months!==undefined && result[0].sRange.months.length>0){
  result[0].sRange.newMonths=result[0].sRange.months.join(', ')
 }

 if(result[0].sType.days!==undefined && result[0].sType.days.length>0){
  result[0].sType.newDays=result[0].sType.days.join(', ')
 }
this.schedule=result[0]
  }
}

}
