import {Component, OnInit, Inject } from '@angular/core';
import {Router, ActivatedRoute, Params,  Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'fleethawks-dashboard';
  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {
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
  });
  }

  ngOnInit() {}


}
