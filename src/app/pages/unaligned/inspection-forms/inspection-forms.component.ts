import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-inspection-forms',
  templateUrl: './inspection-forms.component.html',
  styleUrls: ['./inspection-forms.component.css']
})
export class InspectionFormsComponent implements OnInit {

  title = 'Inspection Forms List';
  inspectionForms;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchinspectionForms();

  }

  fetchinspectionForms() {
    this.apiService.getData('inspectionForms')
        .subscribe((result: any) => {
          this.inspectionForms = result.Items;
        });
  }



  deleteInspectionForm(inspectionFormID) {
    this.apiService.deleteData('inspectionForms/' + inspectionFormID)
        .subscribe((result: any) => {
          this.fetchinspectionForms();
        })
  }

}
