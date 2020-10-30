import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.css'],
})
export class InspectionDetailComponent implements OnInit {
  inspectionID = '';
  tripType = '';


  carrierName: '';
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.inspectionID = this.route.snapshot.params['inspectionID'];

    this.fetchDailyInspection();
  }

  fetchDailyInspection() {
    this.apiService
      .getData(`dailyInspections/${this.inspectionID}`)
      .subscribe((result) => {
        result = result.Items[0];
        this.tripType = result.tripType;
        this.fetchCarrier(result.carrierID);
        console.log(result);
      });
  }

  fetchCarrier(carrierID){
    this.apiService.getData(`carriers/${carrierID}`).subscribe((result) => {
      result = result.Items[0];
      this.carrierName = result.businessDetail.carrierName;
    });
  }
}
