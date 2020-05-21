import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: 'app-create-load',
  templateUrl: './create-load.component.html',
  styleUrls: ['./create-load.component.css']
})
export class CreateLoadComponent implements OnInit {
  title = "Create Load";
  activeTab = "general";
  constructor() { }

  ngOnInit() {
  }

  general() {
    this.activeTab = "general";
    $("#general").show();
    $("#pickUp, #drop").hide();
  }

  pickUp() {
    this.activeTab = "pickUp";
    $("#pickUp").show();
    $("#general, #drop").hide();

  }

  drop() {
    this.activeTab = "drop";
    $("#drop").show();
    $("#general, #pickUp").hide();
  }

}
