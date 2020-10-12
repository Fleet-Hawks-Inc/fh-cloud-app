import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  serviceData = {
    uploadedDocuments : {},
    uploadedPhotos: {}
  }
  constructor() { }

  ngOnInit() {
  }

  addService(){
    console.log(this.serviceData)
  }

}
