import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import {NgbModal,} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../services/modal.service';
export interface CanComponentDeactivate {
  canLeave: () => boolean;
}
@Injectable()
export class unsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private modalService: NgbModal,
              private modalServiceOwn: ModalService) {}

  canDeactivate(component: CanComponentDeactivate) {
    // return component.canLeave ? component.canLeave() : true;
    //  return !this.modelServiceOwn.triggerRedirect;
    if (component.canLeave) {
      if (this.modalServiceOwn.triggerRedirect.getValue()) {
        this.modalService.dismissAll();
      }
      component.canLeave();
      return this.modalServiceOwn.triggerRedirect.getValue();
    }
    return true;
  }
}
