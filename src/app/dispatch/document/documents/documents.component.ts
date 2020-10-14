import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  title = 'Document List';
  documents = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchDocuments();

  }

  fetchDocuments() {
    this.apiService.getData('documents')
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log(result);
            this.documents = result.Items;
          },
        });
  }



  deleteDocument(documentID) {
 
                /******** Clear DataTable ************/
                if ($.fn.DataTable.isDataTable('#datatable-default')) {
                  $('#datatable-default').DataTable().clear().destroy();
                  }
                  /******************************/

    this.apiService.deleteData('documents/' + documentID)
        .subscribe((result: any) => {
          this.fetchDocuments();
        })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

}
