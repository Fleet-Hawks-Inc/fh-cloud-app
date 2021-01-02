import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Subject } from 'rxjs';
import { UnsavedChangesComponent } from '../unsaved-changes/unsaved-changes.component';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
export interface CanComponentDeactivate {
  canLeave: () => boolean;
}

@Injectable()
export class unsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  
  constructor(private modalService: NgbModal) {}

  canDeactivate(component: CanComponentDeactivate){
    // return component.canLeave ? component.canLeave() : true;
    
    if (component.canLeave) {
     
      return component.canLeave();
    } 
    return true;
  }
}