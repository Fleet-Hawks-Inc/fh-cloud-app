import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { timer } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-ifta-return-details',
  templateUrl: './ifta-return-details.component.html',
  styleUrls: ['./ifta-return-details.component.css']
})
export class IftaReturnDetailsComponent implements OnInit {
  stateList = [];
  totalGallons  = 0;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchStateData();
  }
  fetchStateData() {
    this.apiService.getData('fuelEntries/group/bystate').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => { },
      next: (result: any) => {
        this.stateList = result;
        for(let i=0; i < this.stateList.length; i++){
           this.totalGallons = +(this.totalGallons + this.stateList[i].fuelGal);
        }
      },
    });
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}
