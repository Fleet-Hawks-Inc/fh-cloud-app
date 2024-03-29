# Fleet Manager Application

| Environment | Deployment Status                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development | [![Build Status](https://jenkins.fleethawks.com/buildStatus/icon?job=fh-cloud-app%2Fdevelop)](https://jenkins.fleethawks.com/job/fh-cloud-app/job/develop/)       |
| Pre-Prod    | [![Build Status](https://jenkins.fleethawks.com/buildStatus/icon?job=fh-cloud-app%2Fmaster)](https://jenkins.fleethawks.com/job/fh-cloud-app/job/master/)         |
| Prod        | [![Build Status](https://jenkins.fleethawks.com/buildStatus/icon?job=fh-cloud-app%2Fproduction)](https://jenkins.fleethawks.com/job/fh-cloud-app/job/production/) |

[![Known Vulnerabilities](https://snyk.io/package/npm/snyk/badge.svg)](https://snyk.io/package/npm/snyk)


# FleethawksDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.23.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## S3 Bucket configurations

Set CORS policy on bucket
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <ExposeHeader>x-amz-server-side-encryption</ExposeHeader>
    <ExposeHeader>x-amz-request-id</ExposeHeader>
    <ExposeHeader>x-amz-id-2</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

Set IAM policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:GetObjectAcl",
                "s3:PutObjectVersionAcl",
                "s3:GetObjectVersionAcl",
                "s3:PutBucketAcl",
                "s3:GetBucketAcl",
                "s3:PutObjectAcl"
            ],
            "Resource": "*"
        }
    ]
}

```

## Debug App

Make sure you install Debugger for Chrome extension via VS code extensions menu.

Go to Debug menu and click play button  or press F5


### Heap Memory issue while `ng build`

If you encounter heap memory issue whilg ng build please set following environment variables before executing `ng build`

Eg: Windows

```
command-prompt>set NODE_OPTIONS="--max-old-space-size=8192"
command-pompt>ng build
```

Eg: Linux/MAc
```
terminal> export NODE_OPTIONS="--max-old-space-size=8192"
terminal> ng build
```

### Running `cypress` tests

Use following command to run cypress tests

``` 
npm run cypress
```
This will start local dashboard app and cypress tests. Make sure you have service url which is `BaseUrl` pointing to "https://fleetservice.ap-south-1.fleethawks.com/api/v1/" in environment.ts


## Enable Cache of the pages

To enable cache of the page please update routing with following: 

```
reuseRoute: true
```

Example: To cache listing page of driver 
Open driver.module.ts
find routing configuration for list routes and update following code.

```
  { path: 'list', component: DriverListComponent, data: { title: 'Drivers List', reuseRoute: true } },
```

Please follow these step to refresh caching 

1. Updated RouteManagementService as following: 

![image](readme-assets/SCR-20220223-o4v.png)

2. Once `RouteManagementService` is updated with relevant code changes in edit and delete module. We need to update Side bar component so when clicked on specific link reloads the data. 

3. Open multi-sidebar.component.ts and add following method under `CommonSideBarComponent` class

```
 generateDriverSessionID() {
    return this.routeManagement.driverUpdateSessionID;
  }
```
> Note : Here the example is of Driver so update the method accordingly. 

4. Open relevant sidebar component html and update the link with created method.

Here we will continue the same example of driver list. So we will open fleet-sidebar.component.html and update the list driver link with method we created in step no 3.
```html
<li routerLinkActive="nav-active">
        <a class="nav-link" [routerLink]="['/fleet', 'drivers', 'list', generateDriverSessionID()]">
            <!-- <i class="fas fa-users-cog fa-fw" aria-hidden="true"></i> -->

            <!-- <i class="fas fa-users"></i> -->
            <i class="icon-icon-driver"></i>

            <span>Drivers</span>
        </a>
    </li>

```
5. Make sure to update routing configuration since we are passing sessionId to list url. 

Example: 
```ts

```