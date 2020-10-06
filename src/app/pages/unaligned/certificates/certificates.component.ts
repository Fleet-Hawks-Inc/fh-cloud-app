import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {

  title = 'Certificates List';
  certificates;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchCertificates();

  }

  fetchCertificates() {
    this.apiService.getData('certificates')
        .subscribe((result: any) => {
          this.certificates = result.Items;
        });
  }



  deleteCertificate(certificateID) {
    this.apiService.deleteData('certificates/' + certificateID)
        .subscribe((result: any) => {
          this.fetchCertificates();
        })
  }

}
