import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-carrier-register",
  templateUrl: "./carrier-register.component.html",
  styleUrls: ["./carrier-register.component.css"],
})
export class CarrierRegisterComponent implements OnInit {
  activeTab = 1;

  constructor() {}

  ngOnInit() {}

  toggleTab(tab) {
    this.activeTab = tab;
  }

  next() {
    if (this.activeTab == 5) return;
    this.activeTab++;
  }

  previous() {
    if (this.activeTab == 1) return;
    this.activeTab--;
  }
}
