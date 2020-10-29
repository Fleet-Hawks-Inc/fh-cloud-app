import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-ifta-report-history',
  templateUrl: './ifta-report-history.component.html',
  styleUrls: ['./ifta-report-history.component.css']
})
export class IftaReportHistoryComponent implements OnInit {

  constructor( private location: Location) { }

  ngOnInit() {
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
