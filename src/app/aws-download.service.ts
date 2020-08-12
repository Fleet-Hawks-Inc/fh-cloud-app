import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AwsDownloadService {
  bucket;
  bucketName;
  urlArray = [];
    // s3 = new AWS.S3();
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
   getFiles(CID,fileName) {
    const params = {Bucket: this.bucketName, Key: CID.__zone_symbol__value + '/' + fileName };
    let url = this.bucket.getSignedUrl('getObject', params);
    // console.log('carrier id in service', fileName);
    // console.log('url of image', url);
    // this.urlArray.push(url);
    return  url;
   }
}
