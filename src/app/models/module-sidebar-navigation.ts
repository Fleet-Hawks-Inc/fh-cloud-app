export class Nav {
  routerLink: string[];
  class: string;
  icon: string;
  name: string;
}
export const FLEETNAVLIST: Nav[] = [
  {
    routerLink: ['/fleet', 'drivers', 'Drivers-List'] ,
    class : 'nav-link' ,
    icon: 'fas fa-users-cog fa-fw',
    name: 'Drivers'
  },
  {
    routerLink: ['/fleet', 'vehicles', 'Vehicle-List'] ,
    class : 'nav-link' ,
    icon: 'fas fa-truck fa-fw',
    name: 'Vehicles'
  },


];
