module Constants {

  /**
   * The Cookie name for storing state
   */
  export const VEHICLE = 'vehicle';
  export const DRIVER = 'driver';
  export const REEFER = 'reefer';
  export const OVERDUE = 'OVERDUE';
  export const DUE_SOON = 'DUE SOON';
  export const ALL = 'ALL';
  export const GROUP_VEHICLES = 'vehicles';
  export const GROUP_USERS = 'users';
  export const TASK_SERVICE = 'service';
  export const TASK_CONTACT = 'contact';
  export const TASK_VEHICLE = 'vehicle';
  export const REMINDER_VEHICLE = 'vehicle';
  export const REMINDER_CONTACT = 'contact';
  export const REMINDER_SERVICE = 'service';

  /*   
  * Constants used in listing page
  */
  export const FETCHING_DATA = 'Fetching Data.....';
  export const NO_RECORDS_FOUND = 'No Data Found';

  /*   
* Constants used in loading items in dropdown
*/
  export const LOAD_DATA = 'Loading.....';
  export const NO_LOAD_DATA = 'Please search by typing';
  export const NO_LOAD_FOUND = 'No Data Found';

  export const contactMsg = 'Please upgrade your plan or contact support@fleethawks.com';
  export const RoutingPlanExpired = 'Routing & Dispatch Subscription Error!';
}

export default Constants;
