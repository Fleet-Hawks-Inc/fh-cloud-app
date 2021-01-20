import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-fixed-right-sidebar',
  templateUrl: './fixed-right-sidebar.component.html',
  styleUrls: ['./fixed-right-sidebar.component.css']
})
export class FixedRightSidebarComponent implements OnInit {
  showAddressBook = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    
  }

  showContactsModal(){
    
  }

}
