import { Component, OnInit } from '@angular/core';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css']
})
export class AddIssueComponent implements OnInit {
  issueData = {
    uploadedPhotos: {},
    uploadedDocs: {}
  };
  date: NgbDateStruct;
  // date: {year: number, month: number};
  constructor(private calendar: NgbCalendar) { }

  ngOnInit() {
  }

  // selectToday() {
  //   this.model = this.calendar.getToday();
  // }
  addIssue(){
    console.log('Add issue', this.issueData)
  }

}
