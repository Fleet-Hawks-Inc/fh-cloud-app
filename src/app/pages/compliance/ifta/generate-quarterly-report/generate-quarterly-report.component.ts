import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-generate-quarterly-report',
  templateUrl: './generate-quarterly-report.component.html',
  styleUrls: ['./generate-quarterly-report.component.css']
})
export class GenerateQuarterlyReportComponent implements OnInit {

  constructor( private location: Location) { }

  ngOnInit() {
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}
