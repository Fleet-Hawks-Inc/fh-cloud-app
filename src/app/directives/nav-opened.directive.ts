import {AfterViewInit, Directive, HostBinding, HostListener, Input} from '@angular/core';
import {SharedServiceService} from '../services';
import {timer} from 'rxjs';

@Directive({
  selector: '[appNavOpened]'
})
export class NavOpenedDirective implements AfterViewInit {
    @Input() expandedNav: string;
    @HostBinding('class.nav-expanded') isExpanded = false;
    @HostListener('click') toggleExpanded() {
      this.sharedService.activeSubNav.next(this.expandedNav);
      // this.isExpanded = !this.isExpanded;
    }

    constructor(private sharedService: SharedServiceService) {
      timer(100).subscribe((v) => {

        this.sharedService.activeSubNav
          .subscribe((val) => {
            if (val === this.expandedNav) {
              this.isExpanded = !this.isExpanded;
            }
          });

      });
    }
    ngAfterViewInit() {}
}
