import {Component, OnInit, Inject, AfterContentChecked, ChangeDetectorRef} from '@angular/core';
import {Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {delay} from 'rxjs/operators';
import {HttpLoadingService} from './services';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, AfterContentChecked  {
  title = 'fleethawks-dashboard';
  loading = false;
  token: boolean = false;
  currentURL = '';
  constructor(private router: Router,
              @Inject(DOCUMENT) private document: Document,
              private changeDetector: ChangeDetectorRef,
              private httpLoadingService: HttpLoadingService) {
    // left sidebar collapsed on overview - fleet page
    const rootHtml = document.getElementsByTagName( 'html' )[0];
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentURL = event.url;
        if (event.url === '/Map-Dashboard') {
          rootHtml.classList.add('fixed');
          rootHtml.classList.add('sidebar-light');
          rootHtml.classList.add('sidebar-left-collapsed');
        } else {
          rootHtml.classList.add('fixed');
          rootHtml.classList.remove('sidebar-left-collapsed');
        }
       
        if(localStorage.getItem('LoggedIn') != undefined && localStorage.getItem('LoggedIn')) {
          this.token = true;
        } else {
          this.token = false;
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
    this.listenToLoading();
  }

  /**
    * Interceptor Loading Bar
   **/
  listenToLoading(): void {
    this.httpLoadingService.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
  /**
   *
   */


  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

}
