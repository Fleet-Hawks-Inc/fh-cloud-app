import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-inspection',
  templateUrl: './view-inspection.component.html',
  styleUrls: ['./view-inspection.component.css']
})
export class ViewInspectionComponent implements OnInit {
  public inspectionFormID: any;
  public result: any;
  constructor(private apiService:ApiService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.inspectionFormID = this.route.snapshot.params['inspectionID'];
    this.fetchForm();
  }
  fetchForm() {
    this.apiService
      .getData(`inspectionForms/${this.inspectionFormID}`)
      .subscribe((result) => {
        this.result = result.Items[0];
      });
  }

}
