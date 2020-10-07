import {Component, OnInit, Inject, AfterContentChecked, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute, Params, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, AfterContentChecked  {
  title = 'fleethawks-dashboard';
  loading = false;
  constructor(private router: Router,
              @Inject(DOCUMENT) private document: Document,
              private changeDetector: ChangeDetectorRef) {
    // left sidebar collapsed on overview - fleet page
    const rootHtml = document.getElementsByTagName( 'html' )[0];
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/Map-Dashboard') {
          rootHtml.classList.add('fixed');
          rootHtml.classList.add('sidebar-light');
          rootHtml.classList.add('sidebar-left-collapsed');
        } else {
          rootHtml.classList.add('fixed');
          rootHtml.classList.remove('sidebar-left-collapsed');
        }
      }


      /**
       * Loading Indicator
       */
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
      /**
       *
       */

  });
  }

  ngOnInit() {
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
