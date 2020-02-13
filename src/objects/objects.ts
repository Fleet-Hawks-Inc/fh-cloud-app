export class LoginObjects {
    id: number;
    email: string;
    password: string;

}
export class LoginRequest {
    email : string;
    password : string;
}
export const BaseUrl ='http://192.168.0.151:3000/api/v1/';
export const temp = 'search';
export const LoginUrl = 'users/login';
export const ApiKey = '';
