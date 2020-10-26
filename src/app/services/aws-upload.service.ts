import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import {environment} from '../../environments/environment';
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


  uploadFile(folder, fileName, fileData) {
    const contentType = fileData.type;
    console.log('contentType', contentType);
    /*
      * Random Algo For Random Name, Need to Fix it
     */
    /*
    let filename = Math.random().toString(36).substring(7);
    const ext = this.imageExt[this.imageFormat(file)];
    let filename =  file + ext;
    */
    const params = {
      Bucket: this.bucketName,
      Key: folder + '/' + fileName,
      Body: fileData,
      ACL: 'private',
      ContentType: contentType
    };
    this.bucket.upload(params, ( err, data) => {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      // this.filename = file;
     // return filename;
    });
    // return this.filename;

    // for upload progress
    /* bucket.upload(params).on('httpUploadProgress', function (evt) {
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

  getFiles = async (carriedID, filename) => {
    const s3 = new S3({
      accessKeyId: environment.awsBucket.accessKeyId,
      secretAccessKey: environment.awsBucket.secretAccessKey,
      region: environment.awsBucket.region

    });
    const params = {
        Bucket: this.bucketName, // your bucket name,
        Key: `${carriedID}/${filename}` // path to the object you're looking for
    };
    const data = await s3.getObject(params).promise();
    if (data) {
      // console.log('Successfully get files.', data);
      const image = `data:${data.ContentType};base64,${this.encode(data.Body)}`;
      return image;
    } else {
      console.log('Failed to retrieve an object: ');
    }
  }

  encode(data) {
    const str = data.reduce((a , b) => {
      return a + String.fromCharCode(b);
    }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  // getExtensionIndex(file) {
  //   //file && this.validFormats.includes(file['type']);
  //   return file && $.inArray(file['type'], this.validFormats);
  // }

}
