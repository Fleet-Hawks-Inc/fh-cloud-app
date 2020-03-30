import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  title = 'Document List';
  documents;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchDocuments();

  }

  fetchDocuments() {
    this.apiService.getData('documents')
        .subscribe((result: any) => {
          this.documents = result.Items;
        });
  }



  deleteDocument(documentId) {
    this.apiService.deleteData('documents/' + documentId)
        .subscribe((result: any) => {
          this.fetchDocuments();
        })
  }

}
