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