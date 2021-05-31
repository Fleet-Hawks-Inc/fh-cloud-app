import { Component, OnInit  } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ModalService} from '../services/modal.service';
@Component({
  selector: 'app-unsaved-changes',
  templateUrl: './unsaved-changes.component.html',
  styleUrls: ['./unsaved-changes.component.css']
})
export class UnsavedChangesComponent implements OnInit {
  public onClose: Subject<boolean>;
  constructor(public activeModal: NgbActiveModal,
              private readonly router: Router,
              private modalService: ModalService) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  close() {
    this.activeModal.close();
  }

  no() {
    this.activeModal.dismiss();
  }
  yes() {
   // this.activeModal.close();
  //  this.activeModal.dismiss();
    this.modalService.triggerRedirect.next(true);
    // this.router.navigate([this.modalService.urlToRedirect.getValue()]);
   // this.modalService.urlToRedirect$.subscribe((v) => {
   
   //   this.activeModal.dismiss();
   //   if (v !== '') {
   //     this.router.navigate([v]);
   //   }
   // });
  }
}
