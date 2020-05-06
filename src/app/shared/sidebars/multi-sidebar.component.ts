import {Component, OnInit} from '@angular/core';
import {SharedServiceService} from '../../shared-service.service';
import {Router} from '@angular/router';
declare var $: any;
declare var jQuery: any;


export class CommonSideBarComponent implements OnInit {
  //constructor(private router: Router) {}
  ngOnInit() {
    $( document ).ready(() => {
      // window.theme = {};
      // Bootstrap Toggle
      (function($) {

        'use strict';

        var $window = $( window );

        var toggleClass = function( $el ) {
          if ( !!$el.data('toggleClassBinded') ) {
            return false;
          }

          var $target,
            className,
            eventName;

          $target = $( $el.attr('data-target') );
          className = $el.attr('data-toggle-class');
          eventName = $el.attr('data-fire-event');


          $el.on('click.toggleClass', function(e) {
            e.preventDefault();
            $target.toggleClass( className );

            var hasClass = $target.hasClass( className );

            if ( !!eventName ) {
              $window.trigger( eventName, {
                added: hasClass,
                removed: !hasClass
              });
            }
          });

          $el.data('toggleClassBinded', true);

          return true;
        };

        $(function() {
          $('[data-toggle-class][data-target]').each(function() {
            toggleClass( $(this) );
          });
        });

      }).apply(this, [jQuery]);

      // Navigation
      (function($) {

        'use strict';

        var $items = $( '.nav-main li.nav-parent' );

        function expand( $li ) {
          $li.children( 'ul.nav-children' ).slideDown( 'fast', function() {
            $li.addClass( 'nav-expanded' );
            $(this).css( 'display', '' );
            ensureVisible( $li );
          });
        }

        function collapse( $li ) {
          $li.children('ul.nav-children' ).slideUp( 'fast', function() {
            $(this).css( 'display', '' );
            $li.removeClass( 'nav-expanded' );
          });
        }

        function ensureVisible( $li ) {
          var scroller = $li.offsetParent();
          if ( !scroller.get(0) ) {
            return false;
          }

          var top = $li.position().top;
          if ( top < 0 ) {
            scroller.animate({
              scrollTop: scroller.scrollTop() + top
            }, 'fast');
          }
        }

        function buildSidebarNav( anchor, prev, next, ev ) {
          if ( anchor.prop('href') ) {
            var arrowWidth = parseInt(window.getComputedStyle(anchor.get(0), ':after').width, 10) || 0;
            if (ev.offsetX > anchor.get(0).offsetWidth - arrowWidth) {
              ev.preventDefault();
            }
          }

          if ( prev.get( 0 ) !== next.get( 0 ) ) {
            collapse( prev );
            expand( next );
          } else {
            collapse( prev );
          }
        }

        $items.find('> a').on('click', function( ev ) {

          var $html   = $('html'),
            $window = $(window),
            $anchor = $( this ),
            $prev   = $anchor.closest('ul.nav').find('> li.nav-expanded' ),
            $next   = $anchor.closest('li'),
            $ev     = ev;

          if( $anchor.attr('href') == '#' ) {
            ev.preventDefault();
          }

          if( !$html.hasClass('sidebar-left-big-icons') ) {
            buildSidebarNav( $anchor, $prev, $next, $ev );
          } else if( $html.hasClass('sidebar-left-big-icons') && $window.width() < 768 ) {
            buildSidebarNav( $anchor, $prev, $next, $ev );
          }

        });

        // Chrome Fix
        $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
        if( $.browser.chrome && !$.browser.mobile ) {
          var flag = true;
          $('.sidebar-left .nav-main li a').on('click', function(){
            flag = false;
            setTimeout(function(){
              flag = true;
            }, 200);
          });

          $('.nano').on('mouseenter', function(e){
            $(this).addClass('hovered');
          });

          $('.nano').on('mouseleave', function(e){
            if( flag ) {
              $(this).removeClass('hovered');
            }
          });
        }

        $('.nav-main a').filter(':not([href])').attr('href', '#');

      }).apply(this, [jQuery]);


      // Tab Navigation
      (function($) {

        'use strict';

        if( $('html.has-tab-navigation').get(0) ) {

          var $window 	 	  = $( window ),
            $toggleMenuButton = $('.toggle-menu'),
            $navActive   	  = $('.tab-navigation nav > ul .nav-active'),
            $tabNav      	  = $('.tab-navigation'),
            $tabItem 	 	  = $('.tab-navigation nav > ul > li a'),
            $contentBody 	  = $('.content-body');

          $tabItem.on('click', function(e){
            if( $(this).parent().hasClass('dropdown') || $(this).parent().hasClass('dropdown-submenu') ) {
              if( $window.width() < 992 ) {
                if( $(this).parent().hasClass('nav-expanded') ) {
                  $(this).closest('li').find( '> ul' ).slideUp( 'fast', function() {
                    $(this).css( 'display', '' );
                    $(this).closest('li').removeClass( 'nav-expanded' );
                  });
                } else {
                  if( $(this).parent().hasClass('dropdown') ) {
                    $tabItem.parent().removeClass('nav-expanded');
                  }

                  $(this).parent().addClass('expanding');

                  $(this).closest('li').find( '> ul' ).slideDown( 'fast', function() {
                    $tabItem.parent().removeClass('expanding');
                    $(this).closest('li').addClass( 'nav-expanded' );
                    $(this).css( 'display', '' );

                    if( ($(this).position().top + $(this).height()) < $window.scrollTop() ) {
                      $('html,body').animate({ scrollTop: $(this).offset().top - 100 }, 300);
                    }
                  });
                }
              } else {
                if( !$(this).parent().hasClass('dropdown') ) {
                  e.preventDefault();
                  return false;
                }

                if( $(this).parent().hasClass('nav-expanded') ) {
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

          $window.on('scroll', function(){
            if( $window.width() < 992 ) {
              var tabNavOffset = ( $tabNav.position().top + $tabNav.height() ) + 100,
                windowOffset = $window.scrollTop();

              if( windowOffset > tabNavOffset ) {
                $tabNav.removeClass('show');
              }
            }
          });

          $toggleMenuButton.on('click', function(){
            if( !$tabNav.hasClass('show') ) {
              $('html,body').animate({ scrollTop: $tabNav.offset().top - 50 }, 300);
            }
          });

        }

      }).apply(this, [jQuery]);


    });
  }
  // Logout() {
  //   console.log("clicked");
  //   localStorage.removeItem('LoggedIn');
  //   localStorage.removeItem('jwt');
  //   this.router.navigate(['/Login']);
  // }
}


@Component({
  selector: 'fleet-sidebar',
  templateUrl: './fleet-sidebar.component.html'
})
export class FleetSidebarComponent extends CommonSideBarComponent {
  constructor(private router: Router) {
    super();
  }
  //super(router: Router) { }
  Logout() {
    localStorage.removeItem('LoggedIn');
    localStorage.removeItem('jwt');
    this.router.navigate(['/Login']);
  }
}

@Component({
  selector: 'alert-sidebar',
  templateUrl: './alert-sidebar.component.html'
})
export class AlertSidebarComponent extends CommonSideBarComponent { }

@Component({
  selector: 'setting-sidebar',
  templateUrl: './setting-sidebar.component.html'
})
export class SettingSidebarComponent extends CommonSideBarComponent { }

@Component({
  selector: 'dispatch-sidebar',
  templateUrl: './dispatch-sidebar.component.html'
})
export class DispatchSidebarComponent extends CommonSideBarComponent { }


export const MultiSidebarComponents =
  [ FleetSidebarComponent, AlertSidebarComponent, SettingSidebarComponent, DispatchSidebarComponent ];
