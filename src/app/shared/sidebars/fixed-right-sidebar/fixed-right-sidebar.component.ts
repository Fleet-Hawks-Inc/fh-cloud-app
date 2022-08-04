import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
@Component({
    selector: 'app-fixed-right-sidebar',
    templateUrl: './fixed-right-sidebar.component.html',
    styleUrls: ['./fixed-right-sidebar.component.css'],
})
export class FixedRightSidebarComponent {
    showAddressBook = false;
    environment = environment.isFeatureEnabled;
}
