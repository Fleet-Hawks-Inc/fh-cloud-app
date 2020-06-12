import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-quantums',
  templateUrl: './quantums.component.html',
  styleUrls: ['./quantums.component.css']
})
export class QuantumsComponent implements OnInit {

  title = 'Quantum List';
  quantums;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchQuantums();
  }

  fetchQuantums() {
    this.apiService.getData('devices')
        .subscribe((result: any) => {
          this.quantums = result.Items;
        });
  }

  deleteQuantum(quantumId) {
    this.apiService.deleteData('devices/' + quantumId)
        .subscribe((result: any) => {
          this.fetchQuantums();
        })
  }
}
