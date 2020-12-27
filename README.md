
![build passing](https://codebuild.us-east-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiMzA1aWQzMXlGTWM1dTQrRUlRYWNKY1FQZkh4SmI3dit2Nk11UmJ5OVNZOHN6dzJyZEgwRmpDbTRUaEdsT2dXSWtiaC94V3JuWVZ0V25SMUhxY2JHcGE4PSIsIml2UGFyYW1ldGVyU3BlYyI6Im4zTnNHSnRjSmJjT3NRb0oiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)
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


