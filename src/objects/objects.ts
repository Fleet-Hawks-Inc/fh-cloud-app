export class LoginObjects {
    id: number;
    email: string;
    password: string;

}
export class LoginRequest {
    email : string;
    password : string;
}
//export const BaseUrl ='http://fleet-fleet-a3jrpdonaflh-139163425.ap-south-1.elb.amazonaws.com/api/v1/';
export const BaseUrl = 'http://service-ap-south-1.fleethawks.com/api/v1/';
export const temp = 'search';
export const LoginUrl = 'users/login';
export const ApiKey = '';

export class User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  token?: string;
}

export enum Role {
  User = 'User',
  Admin = 'Admin',
  FleetManager = 'FleetManager'
}
