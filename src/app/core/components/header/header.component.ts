import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedServiceService} from '../../../services/shared-service.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() navClicked = new EventEmitter<any>();
  navSelected = '';
  constructor(private sharedService: SharedServiceService) {
    this.sharedService.activeParentNav.subscribe((val) => {
      this.navSelected = val;
    });
  }

  ngOnInit() {
  }

  onNavSelected(nav: string) {
    this.navClicked.emit(nav);
    this.sharedService.activeParentNav.next(nav);
  }

}
