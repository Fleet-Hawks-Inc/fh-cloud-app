import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-receivers',
  templateUrl: './receivers.component.html',
  styleUrls: ['./receivers.component.css']
})
export class ReceiversComponent implements OnInit {

  title = 'Receiver List';
  receivers;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchReceivers();

  }

  fetchReceivers() {
    this.apiService.getData('receivers')
        .subscribe((result: any) => {
          this.receivers = result.Items;
        });
  }



  deleteReceiver(receiverID) {
    this.apiService.deleteData('receivers/' + receiverID)
        .subscribe((result: any) => {
          this.fetchReceivers();
        })
  }

}
