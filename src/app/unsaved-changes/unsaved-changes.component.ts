import { Component, Injectable, Input, OnInit, TemplateRef, ViewChild  } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalRef, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-unsaved-changes',
  templateUrl: './unsaved-changes.component.html',
  styleUrls: ['./unsaved-changes.component.css']
})
export class UnsavedChangesComponent implements OnInit {
  public onClose: Subject<boolean>;
  
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  close() {
    this.activeModal.close()
  }

  no() {
    this.activeModal.dismiss()
  }
  yes(){
    this.activeModal.close(true)
  }
}
