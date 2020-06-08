import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mileage',
  templateUrl: './mileage.component.html',
  styleUrls: ['./mileage.component.css']
})
export class MileageComponent implements OnInit {

  displayDiv = 'summaryDiv';
  constructor() { }

  ngOnInit() {
  }

  switchAction(displayDiv: string) {
    console.log(displayDiv);
    this.displayDiv = displayDiv;
  }

}
