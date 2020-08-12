import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import {environment} from '../environments/environment';
import { v4 as uuidv4 } from 'uuid';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class AwsUploadService {

  validFormats = [
    'image/jpg',
    'image/jpeg',
    'image/png'
  ];
  imageExt = [
    '.jpg',
    '.jpeg',
    '.png'
  ];
  filename = '';
   newArray = [];
  bucket;
  bucketName;



  constructor() {
    this.bucket = new S3(
      {
        accessKeyId: environment.awsBucket.accessKeyId,
        secretAccessKey: environment.awsBucket.secretAccessKey,
        region: environment.awsBucket.region
      }
    );
    this.bucketName = environment.awsBucket.bucketName;
   }
//  getFileName(file){
//   return file.substr(0, file.lastIndexOf('.'));
//  }
  uploadFile(folder, file) {
    const contentType = file.type;
    /*
      * Random Algo For Random Name, Need to Fix it
     */
    let filename = uuidv4(file);

    const ext = this.imageExt[this.imageFormat(file)];
    console.log('file extension' + ext);
  
    filename =  filename + ext;
    this.newArray.push(filename);
    console.log('New Aray in service' + this.newArray);
     // let filename =  file.name;
    const params = {
      Bucket: this.bucketName,
      Key: folder + '/' + filename,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    this.bucket.upload(params, ( err, data) => {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      this.filename = filename;
    });
   // return this.filename;
    return this.newArray;

    //for upload progress
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
              console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          }).send(function (err, data) {
              if (err) {
                  console.log('There was an error uploading your file: ', err);
                  return false;
              }
              console.log('Successfully uploaded file.', data);
              return true;
          });*/
  }

  imageFormat(file) {
    return file && $.inArray(file['type'], this.validFormats);
  }

  // getExtensionIndex(file) {
  //   //file && this.validFormats.includes(file['type']);
  //   return file && $.inArray(file['type'], this.validFormats);
  // }

}
