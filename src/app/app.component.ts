import {
  Component,
  OnInit,
  Inject,
  AfterContentChecked,
  ChangeDetectorRef,
} from "@angular/core";
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  ActivatedRoute,
} from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { delay, filter } from "rxjs/operators";
import { HttpLoadingService, SharedServiceService } from "./services";
import { Title } from "@angular/platform-browser";
declare var $: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterContentChecked {
  public pageTitle: string;
  loading = false;
  token: boolean = false;
  currentURL = "";
  constructor(
    private router: Router,
    private sharedService: SharedServiceService,
    @Inject(DOCUMENT) private document: Document,
    private changeDetector: ChangeDetectorRef,
    private httpLoadingService: HttpLoadingService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    // left sidebar collapsed on overview - fleet page
    const rootHtml = document.getElementsByTagName("html")[0];

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentURL = event.url;
        let currentModule = this.currentURL.split("/")[1];
        localStorage.setItem("active-header", currentModule);
        rootHtml.classList.add("fixed");
        rootHtml.classList.add("sidebar-light");
        rootHtml.classList.add("sidebar-left-collapsed");
        if (event.url === "/Map-Dashboard") {
          localStorage.setItem("active-header", "fleet");
        }
        // else {
        //   rootHtml.classList.add('fixed');
        //   rootHtml.classList.remove('sidebar-left-collapsed');
        // }
        this.sharedService.activeParentNav.next(currentModule);

        if (
          localStorage.getItem("LoggedIn") != undefined &&
          localStorage.getItem("LoggedIn") &&
          localStorage.getItem("LoggedIn") != null
        ) {
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
    });
  }

  ngOnInit() {
    this.setTitle();
    this.listenToLoading();

    window.addEventListener(
      "storage",
      (event) => {
        if (event.storageArea == localStorage) {
          let token = localStorage.getItem("accessToken");
          if (token == undefined) {
            //Navigate to login
            this.router.navigate(["/Login"]);
          } else if (this.router.url == "/Login") {
            this.router.navigate(["/Map-Dashboard"]);
          }
        }
      },
      false
    );

    $(document).mouseup(function (e) {
      var container = $(".show-search__result .map-search__results");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $("div").removeClass("show-search__result");
      }
    });
  }

  getToken() {
    if (localStorage.getItem("signOut") === "false") {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Interceptor Loading Bar
   **/
  listenToLoading(): void {
    this.httpLoadingService.loadingSub.pipe(delay(0)).subscribe((loading) => {
      this.loading = loading;
    });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  setTitle() {
    console.log(this.route.snapshot.data['title']);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {

        var rt = this.getChild(this.route)

        rt.data.subscribe(data => {
          console.log(data);
          this.titleService.setTitle(data.title)
        })
      })
    this.titleService.setTitle(this.route.snapshot.data['title']);
  }
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }
}
