import {AfterViewInit, Directive, HostBinding, HostListener, Input} from '@angular/core';
import {SharedServiceService} from '../shared-service.service';
import {timer} from 'rxjs';

@Directive({
  selector: '[appNavOpened]'
})
export class NavOpenedDirective implements AfterViewInit{
    @Input() expandedNav: string;
    @HostBinding('class.nav-expanded') isExpanded = false;
    @HostListener('click') toggleExpanded() {
      this.sharedService.activeSubNav.next(this.expandedNav);
      //this.isExpanded = !this.isExpanded;
      //console.log(this.expandedNav);
    }

    constructor(private sharedService: SharedServiceService) {
      timer(100).subscribe((v) => {

        this.sharedService.activeSubNav
          .subscribe((val) => {
            console.log(val + ' ' + this.expandedNav );
            if (val === this.expandedNav) {
              this.isExpanded = !this.isExpanded;
            }
          })

      })
    }

    ngAfterViewInit() {}

}
