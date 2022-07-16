import { Component, Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
import { environment } from "../../../environments/environment";
declare var $: any;
declare var jQuery: any;


@Directive()
export class CommonSideBarComponent implements OnInit {
  //constructor(private router: Router) {}
  companyID: string;


  constructor(private routeManagement: RouteManagementServiceService) { }
  environment = environment.isFeatureEnabled;

  isFleetEnabled = environment.isFleetEnabled;
  isDispatchEnabled = environment.isDispatchEnabled;
  isComplianceEnabled = environment.isComplianceEnabled;
  isManageEnabled = environment.isManageEnabled;
  isSafetyEnabled = environment.isSafetyEnabled;
  isAccountsEnabled = environment.isAccountsEnabled;
  isReportsEnabled = environment.isReportsEnabled;

  ngOnInit() {
    this.initRoles();
    
    $(document).ready(() => {
      // window.theme = {};
      // Bootstrap Toggle
      (function ($) {
        'use strict';

        var $window = $(window);

        var toggleClass = function ($el) {
          if (!!$el.data('toggleClassBinded')) {
            return false;
          }

          var $target, className, eventName;

          $target = $($el.attr('data-target'));
          className = $el.attr('data-toggle-class');
          eventName = $el.attr('data-fire-event');

          $el.on('click.toggleClass', function (e) {
            e.preventDefault();
            $target.toggleClass(className);

            var hasClass = $target.hasClass(className);

            if (!!eventName) {
              $window.trigger(eventName, {
                added: hasClass,
                removed: !hasClass,
              });
            }
          });

          $el.data('toggleClassBinded', true);

          return true;
        };

        $(function () {
          $('[data-toggle-class][data-target]').each(function () {
            toggleClass($(this));
          });
        });
      }.apply(this, [jQuery]));

      // Navigation
      (function ($) {
        'use strict';

        var $items = $('.nav-main li.nav-parent');

        function expand($li) {
          $li.children('ul.nav-children').slideDown('fast', function () {
            $li.addClass('nav-expanded');
            $(this).css('display', '');
            ensureVisible($li);
          });
        }

        function collapse($li) {
          $li.children('ul.nav-children').slideUp('fast', function () {
            $(this).css('display', '');
            $li.removeClass('nav-expanded');
          });
        }

        function ensureVisible($li) {
          var scroller = $li.offsetParent();
          if (!scroller.get(0)) {
            return false;
          }

          var top = $li.position().top;
          if (top < 0) {
            scroller.animate(
              {
                scrollTop: scroller.scrollTop() + top,
              },
              'fast'
            );
          }
        }

        function buildSidebarNav(anchor, prev, next, ev) {
          if (anchor.prop('href')) {
            var arrowWidth =
              parseInt(
                window.getComputedStyle(anchor.get(0), ':after').width,
                10
              ) || 0;
            if (ev.offsetX > anchor.get(0).offsetWidth - arrowWidth) {
              ev.preventDefault();
            }
          }

          if (prev.get(0) !== next.get(0)) {
            collapse(prev);
            expand(next);
          } else {
            collapse(prev);
          }
        }

        $items.find('> a').on('click', function (ev) {
          var $html = $('html'),
            $window = $(window),
            $anchor = $(this),
            $prev = $anchor.closest('ul.nav').find('> li.nav-expanded'),
            $next = $anchor.closest('li'),
            $ev = ev;

          if ($anchor.attr('href') == '#') {
            ev.preventDefault();
          }

          if (!$html.hasClass('sidebar-left-big-icons')) {
            buildSidebarNav($anchor, $prev, $next, $ev);
          } else if (
            $html.hasClass('sidebar-left-big-icons') &&
            $window.width() < 768
          ) {
            buildSidebarNav($anchor, $prev, $next, $ev);
          }
        });

        // Chrome Fix
        $.browser.chrome = /chrom(e|ium)/.test(
          navigator.userAgent.toLowerCase()
        );
        if ($.browser.chrome && !$.browser.mobile) {
          var flag = true;
          $('.sidebar-left .nav-main li a').on('click', function () {
            flag = false;
            setTimeout(function () {
              flag = true;
            }, 200);
          });

          $('.nano').on('mouseenter', function (e) {
            $(this).addClass('hovered');
          });

          $('.nano').on('mouseleave', function (e) {
            if (flag) {
              $(this).removeClass('hovered');
            }
          });
        }

        $('.nav-main a').filter(':not([href])').attr('href', '#');
      }.apply(this, [jQuery]));

      // Tab Navigation
      (function ($) {
        'use strict';

        if ($('html.has-tab-navigation').get(0)) {
          var $window = $(window),
            $toggleMenuButton = $('.toggle-menu'),
            $navActive = $('.tab-navigation nav > ul .nav-active'),
            $tabNav = $('.tab-navigation'),
            $tabItem = $('.tab-navigation nav > ul > li a'),
            $contentBody = $('.content-body');

          $tabItem.on('click', function (e) {
            if (
              $(this).parent().hasClass('dropdown') ||
              $(this).parent().hasClass('dropdown-submenu')
            ) {
              if ($window.width() < 992) {
                if ($(this).parent().hasClass('nav-expanded')) {
                  $(this)
                    .closest('li')
                    .find('> ul')
                    .slideUp('fast', function () {
                      $(this).css('display', '');
                      $(this).closest('li').removeClass('nav-expanded');
                    });
                } else {
                  if ($(this).parent().hasClass('dropdown')) {
                    $tabItem.parent().removeClass('nav-expanded');
                  }

                  $(this).parent().addClass('expanding');

                  $(this)
                    .closest('li')
                    .find('> ul')
                    .slideDown('fast', function () {
                      $tabItem.parent().removeClass('expanding');
                      $(this).closest('li').addClass('nav-expanded');
                      $(this).css('display', '');

                      if (
                        $(this).position().top + $(this).height() <
                        $window.scrollTop()
                      ) {
                        $('html,body').animate(
                          { scrollTop: $(this).offset().top - 100 },
                          300
                        );
                      }
                    });
                }
              } else {
                if (!$(this).parent().hasClass('dropdown')) {
                  e.preventDefault();
                  return false;
                }

                if ($(this).parent().hasClass('nav-expanded')) {
                  $tabItem.parent().removeClass('nav-expanded');
                  $contentBody.removeClass('tab-menu-opened');
                  return;
                }

                $tabItem.parent().removeClass('nav-expanded');
                $contentBody.addClass('tab-menu-opened');
                $(this).parent().addClass('nav-expanded');
              }
            }
          });

          $window.on('scroll', function () {
            if ($window.width() < 992) {
              var tabNavOffset =
                $tabNav.position().top + $tabNav.height() + 100,
                windowOffset = $window.scrollTop();

              if (windowOffset > tabNavOffset) {
                $tabNav.removeClass('show');
              }
            }
          });

          $toggleMenuButton.on('click', function () {
            if (!$tabNav.hasClass('show')) {
              $('html,body').animate(
                { scrollTop: $tabNav.offset().top - 50 },
                300
              );
            }
          });
        }
      }.apply(this, [jQuery]));
    });
  }

   initRoles(){
    this.isFleetEnabled = environment.isFleetEnabled;
    this.isDispatchEnabled = localStorage.getItem("isDispatchEnabled")
      ? JSON.parse(localStorage.getItem("isDispatchEnabled"))
      : environment.isDispatchEnabled;
    this.isComplianceEnabled = localStorage.getItem("isComplianceEnabled")
      ? JSON.parse(localStorage.getItem("isComplianceEnabled"))
      : environment.isComplianceEnabled;
    this.isManageEnabled = localStorage.getItem("isManageEnabled")
      ? JSON.parse(localStorage.getItem("isManageEnabled"))
      : environment.isManageEnabled;
    this.isSafetyEnabled = localStorage.getItem("isSafetyEnabled")
      ? JSON.parse(localStorage.getItem("isSafetyEnabled"))
      : environment.isSafetyEnabled;
    this.isAccountsEnabled = localStorage.getItem("isAccountsEnabled")
      ? JSON.parse(localStorage.getItem("isAccountsEnabled"))
      : environment.isAccountsEnabled;
    environment.isAccountsEnabled;
    this.isReportsEnabled = environment.isReportsEnabled;
  }

  Logout() {

    // localStorage.removeItem('LoggedIn');
    // localStorage.removeItem('jwt');
    //this.router.navigate(['/Login']);
  }

  // Managing Route sessions for performance
  generateOrderSessionID() {
    return this.routeManagement.orderUpdateSessionID;
  }
  generateTripSessionID() {
    return this.routeManagement.tripUpdateSessionID;
  }
  generateDriverSessionID() {
    return this.routeManagement.driverUpdateSessionID;
  }
    generateVehicleSessionID() {
   return this.routeManagement.vehicleUpdateSessionID;
  }
  generateAssetSessionID() {
   return this.routeManagement.assetUpdateSessionID;
  }
  generateFuelSessionID() {
    return this.routeManagement.fuelUpdateSessionID;
  }
  generateMaintainanceSessionID(){
  return this.routeManagement.maintainanceSessionID;
  }
  generateServiceLogSessionID(){
  return this.routeManagement.serviceLogSessionID;
  }
  genrateChartAccountSessionID(){
    return this.routeManagement.chartAccountSessionID;
  }
  generateServiceReminderSessionID(){
  return this.routeManagement.serviceRemindersSessionID;
  }
  generateInventorySessionID(){
  return this.routeManagement.inventorySessionID;
  }
}

@Component({
  selector: 'fleet-sidebar',
  templateUrl: './fleet-sidebar.component.html',
})
export class FleetSidebarComponent extends CommonSideBarComponent {
  constructor(private router: Router, routeManagement: RouteManagementServiceService) {
    super(routeManagement);
  }
  //super(router: Router) { }
  Logout() {
    Auth.signOut();
    this.router.navigate(['/Login']);

    // localStorage.removeItem('LoggedIn');
    // localStorage.removeItem('jwt');
    // localStorage.removeItem('user');
  }
}

@Component({
  selector: 'compliance-sidebar',
  templateUrl: './compliance-sidebar.component.html',
})
export class ComplianceSidebarComponent extends CommonSideBarComponent {
  constructor(private router: Router, routeManagement: RouteManagementServiceService) {
    super(routeManagement);
  }
  //super(router: Router) { }
  // Logout() {
  //   localStorage.removeItem('LoggedIn');
  //   localStorage.removeItem('jwt');
  //   this.router.navigate(['/Login']);
  // }
}

@Component({
  selector: 'alert-sidebar',
  templateUrl: './alert-sidebar.component.html',
})
export class AlertSidebarComponent extends CommonSideBarComponent { }

@Component({
  selector: 'setting-sidebar',
  templateUrl: './setting-sidebar.component.html',
})
export class SettingSidebarComponent extends CommonSideBarComponent { }

@Component({
  selector: 'dispatch-sidebar',
  templateUrl: './dispatch-sidebar.component.html',
})
export class DispatchSidebarComponent extends CommonSideBarComponent {
}

@Component({
  selector: 'accounts-sidebar',
  templateUrl: './accounts-sidebar.component.html',
})
export class AccountsSidebarComponent extends CommonSideBarComponent { }

@Component({
  selector: 'safety-sidebar',
  templateUrl: './safety-sidebar.component.html',
})
export class SafetySidebarComponent extends CommonSideBarComponent { }

@Component({
  selector: 'manage-sidebar',
  templateUrl: './manage-sidebar.component.html',
})
export class ManageSidebarComponent extends CommonSideBarComponent { }

@Component({
  selector: 'report-sidebar',
  templateUrl: './module-report-sidebar.component.html',
})
export class ReportsSidebarComponent extends CommonSideBarComponent { }

export const MultiSidebarComponents = [
  FleetSidebarComponent,
  ComplianceSidebarComponent,
  AlertSidebarComponent,
  SettingSidebarComponent,
  DispatchSidebarComponent,
  AccountsSidebarComponent,
  SafetySidebarComponent,
  ManageSidebarComponent,
  ReportsSidebarComponent,
];
