import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-edit-certificate',
  templateUrl: './edit-certificate.component.html',
  styleUrls: ['./edit-certificate.component.css']
})
export class EditCertificateComponent implements OnInit {
  title = 'Edit Certificate';

  /********** Form Fields ***********/

  rootCA = '';
  certificate = '';
  privateKey = '';
  publicKey = '';
  certificateType = '';
  currentStatus = '';
  /******************/

  certificateID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.certificateID = this.route.snapshot.params['certificateID'];

    this.apiService.getData('certificates/' + this.certificateID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.rootCA = result.rootCA;
          this.certificate = result.certificate;
          this.privateKey = result.privateKey;
          this.publicKey = result.publicKey;
          this.certificateType = result.certificateType;
          this.currentStatus = result.currentStatus;



        });

  }




  updateCertificate() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'certificateID': this.certificateID,
      'rootCA': this.rootCA,
      'certificate': this.certificate,
      'privateKey': this.privateKey,
      'publicKey': this.publicKey,
      'certificateType': this.certificateType,
      'currentStatus': this.currentStatus

    };

    this.apiService.putData('certificates', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Certificate Updated successfully';

      }
    });
  }
}
