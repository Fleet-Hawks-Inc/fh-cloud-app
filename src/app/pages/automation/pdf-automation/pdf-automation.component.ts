import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { functions } from 'lodash';
import { createWorker } from 'tesseract.js';
import { PdfAutomationService } from './pdf-automation.service';

declare var Tesseract: any;
declare var $: any;

@Component({
  selector: 'app-pdf-automation',
  templateUrl: './pdf-automation.component.html',
  styleUrls: ['./pdf-automation.component.css']
})
export class PdfAutomationComponent implements OnInit {

  public modalBody = '';
  $rect: any = {};
  $text: any = {};
  $ctx: any = {};
  $srcContext: any = {};
  $canvas: any = {};
  $sitePersonel: any = {};
  $cursorVT: any = {};
  $cursorHL: any = {};
  $val: any = [];
  $head: any = [];
  $annotateinfo: any = {};

  $rectn: any = [];
  $res: any = [];
  $pdfjson: any = {};
  $xmin;
  $xmax;
  $ymin;
  $ymax;
  $data: any = {};
  i = 0;
  $rct: any = [];
  postData = {
    "u1": "1000",
    "u2": "1100"
  };

  $obj = {
    "documentId": "RANDOM VALUE", //Random value generated
    "typeofDocument": "Order", // This will be static 
    "nameofDocument": "LighSpeed",
    "carrierId": "carrierId",


    "createDate": "",
    "createdTime": "",
    "rct": [

    ]

  };

  $jsonfile: any = {};





  url = 'http://localhost:3000/api/v1/pdfautomation';


  pageTitle = 'Pdf Annotation';
  @ViewChild('pdfcanvas', { static: true })
  pdfcanvas: ElementRef<HTMLCanvasElement>;



  drag = false;

  private selectOpt;
  selectfile(value){
    console.log(value);
  }
  constructor(private service: PdfAutomationService, private http: HttpClient) {


    console.log("pdfservice called");
    


    $(() => {
      // const canvas = document.getElementById('src');

      const canvas = this.pdfcanvas.nativeElement;
      this.$canvas = canvas;
      const savebtn = document.getElementById('fire');
      const pdffile = document.getElementById('pdffile');
      const el = document.getElementById('myFile');
      const uf = document.getElementById('uploadedfile');

      let text;
      this.$text = text;

      const ctx = canvas.getContext('2d');
      this.$ctx = ctx;
      const rect = {};
      this.$rect = rect;
      let drag = false;
      const imageObj = null;
      let renderTask;
      const delay = ms => new Promise(res => setTimeout(res, ms));

      const srcContext = canvas.getContext('2d');
      this.$srcContext = srcContext;
      this.$cursorVT = document.querySelector('.vt')
      this.$cursorHL = document.querySelector('.hl')


      el.onchange = () => {
        // var url = document.getElementById('myFile').value;
        const a = '/assets/demo1.pdf'

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        const pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        const loadingTask = pdfjsLib.getDocument(a);


        loadingTask.promise.then((pdf) => {
          console.log('PDF loaded');

          // Fetch the first page
          const pageNumber = 1;
          pdf.getPage(pageNumber).then(function (page) {
            console.log('Page loaded');

            const scale = 2;
            const viewport = page.getViewport({ scale: scale });

            // Prepare canvas using PDF page dimensions
            // const canvasShadowed = document.getElementById('src');
            // const canvasShadowed = this.canva.nativeElement;
            const canvasShadowed = canvas;
            const context = canvasShadowed.getContext('2d');

            canvasShadowed.height = viewport.height;
            canvasShadowed.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport
            };
            renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
              console.log('Page rendered');
            });
          });
        }, (reason) => {
          // PDF loading error
          console.error(reason);
        });
      }
      // var ocrJson = {
      //     // todo: other parameters. b&w, resizing strategy etc
      //     'version': '1.0.0',
      //     'schema': 'My OCR Meta JSON',
      //     'rectangles': [
      //         { 'left': 70, 'top': 95, 'width': 130, 'height': 15, 'label': 'PatientName' },
      //         { 'left': 70, 'top': 110, 'width': 230, 'height': 15, 'label': 'Address' },
      //         { 'left': 140, 'top': 135, 'width': 150, 'height': 15, 'label': 'DOS' },
      //     ],
      // };


      uf.onchange = () => {

        const a = '/assets/demo1.pdf'

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        const pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        const loadingTask = pdfjsLib.getDocument(a);


        loadingTask.promise.then((pdf) => {
          console.log('PDF loaded');


          const pageNumber = 1;
          pdf.getPage(pageNumber).then(function (page) {
            console.log('Page loaded');

            const scale = 2;
            const viewport = page.getViewport({ scale: scale });


            const canvasShadowed = canvas;
            const context = canvasShadowed.getContext('2d');

            canvasShadowed.height = viewport.height;
            canvasShadowed.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport
            };
            renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
              console.log('Page rendered');
            });
          });
        }, (reason) => {
          // PDF loading error
          console.error(reason);
        });


        (async () => {
          await delay(2000);

          this.http.get(this.url + "/d0e7af30-5a20-11eb-be8e-796d5a0f8b51").subscribe((data: any) => {
            console.log(this.$jsonfile)

            console.log(data.Items[0].rct[0][1]);
            console.log(data.Items[0].rct[0][2]);
            console.log(data.Items[0].rct[0][3]);
            console.log(data.Items[0].rct[0][4]);
            const rectangles = [];
            for (let i = 0; i < data.Items[0].rct.length; i++) {
              let a = {
                left: data.Items[0].rct[i][1],
                top: data.Items[0].rct[i][2],
                width: data.Items[0].rct[i][3],
                height: data.Items[0].rct[i][4],
              }
              rectangles.push(a)
            }
            console.log(rectangles);


            // const rectangles = [
            //   {
            //     left:data.Items[0].rct[0][1],
            //     top: data.Items[0].rct[0][2],
            //     width:data.Items[0].rct[0][3],
            //     height: data.Items[0].rct[0][4],
            //   },
            //   {
            //     left: 462,
            //     top: 29,
            //     width: 299,
            //     height: 80,
            //   },
            // ];



            const worker = new Tesseract.TesseractWorker();


            for (let i = 0; i < rectangles.length; i++) {
              const cropImgCanvas = this.cropImage(this.$canvas, rectangles[i]);//img
              if (cropImgCanvas) {
                console.log("crop successful");
              }
              else {
                console.log("crop not successful");
              }

              // just renderint to visualize - no need for actual crop

              this.$srcContext.rect(rectangles[i].left, rectangles[i].top, rectangles[i].width, rectangles[i].height);
              this.$srcContext.strokeStyle = '#FF0000';
              this.$srcContext.stroke();




              worker.recognize(cropImgCanvas)
                .progress(progress => {
                  //console.log('progress:', progress);
                }).then(result => {
                  console.log('result:', result.text);

                  const para = document.createElement('P');
                  const h = document.createElement('h3');
                  // h.innerHTML = document.getElementById('select').value;
                  h.innerHTML = data.Items[0].rct[i][0];
                  para.innerHTML = result.text;


                  this.$val.push(result.text);
                  this.$head.push(data.Items[0].rct[i][0]);
                  this.$pdfjson[data.Items[0].rct[i][0]] = result.text;

                  JSON.stringify(this.$pdfjson);
                  console.log(this.$pdfjson);


                  document.getElementById('myDIV').appendChild(h);
                  document.getElementById('myDIV').appendChild(para);



                });







            }
          });
        })();

      }







      async function init() {
        // var drag = false;
        // var canvas = document.getElementById('src');


        // const worker = new Tesseract.TesseractWorker();
        // var srcContext = document.getElementById('src').getContext('2d');
        // var destContext = document.getElementById('dest').getContext('2d');
        // let img = await loadImage('1.jpg');
        // srcContext.drawImage(img, 0, 0);


      }




      document.body.onload = init;

    });











  }


  cropImage(sourceImage, rect) {
    if (!sourceImage) {
      console.log("no image loaded")
    }
    else {
      console.log("image loaded")
    }
    this.$rect = rect;
    // parameterize them
    const left = rect.left;
    const top = rect.top;
    const width = rect.width;
    const height = rect.height;

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = width;
    cropCanvas.height = height;

    const context = cropCanvas.getContext('2d');
    context.drawImage(sourceImage, left, top, width, height, 0, 0, width, height);
    return cropCanvas;
  }

  mymousedown(e) {



    console.log("mousedownworks" + this.$canvas.offsetLeft);
    this.$rect.startX = e.pageX - this.$canvas.offsetLeft - 255;
    this.$rect.startY = e.pageY - this.$canvas.offsetTop - 110;


    this.drag = true;


  }

  mymouseup(e) {
    console.log("mouseupworks");

    this.drag = false;


    this.$ctx.strokeRect(this.$rect.startX, this.$rect.startY, this.$rect.w, this.$rect.h);


    console.log(this.$rect.startX, this.$rect.startY, this.$rect.w, this.$rect.h)


    //var canvas = document.getElementById('src');



    const worker = new Tesseract.TesseractWorker();
    // const worker = Tesseract;
    // const srcContext = document.getElementById('src').getContext('2d');


    // let img = await loadImage('1.jpg');
    // srcContext.drawImage(img, 0, 0);



    const rct = { left: this.$rect.startX, top: this.$rect.startY, width: this.$rect.w, height: this.$rect.h };
    console.log('rct' + rct);
    const cropImgCanvas = this.cropImage(this.$canvas, rct);//img
    if (cropImgCanvas) {
      console.log("crop successful");
    }
    else {
      console.log("crop not successful");
    }

    // just renderint to visualize - no need for actual crop

    this.$srcContext.rect(rct.left, rct.top, rct.width, rct.height);
    this.$srcContext.strokeStyle = '#FF0000';
    this.$srcContext.stroke();

    // todo: pass the rect info and promise them all?
    worker.recognize(cropImgCanvas)
      .progress(progress => {
        //console.log('progress:', progress);
      }).then(result => {
        console.log('result:', result.text);
        // document.getElementById('text').value = result.text;
        // text = result.text

        const objects = [{
          "typeofDocument": "Order", // This will be static 
          "nameOfDocument": "LightSpeed", // Docment Name
          "carrierId": "carrierId"
        }]
        this.$sitePersonel.objects = objects;
        console.log(this.$sitePersonel);


        this.$xmin = rct.left;
        this.$ymin = rct.top;
        this.$xmax = rct.width;
        this.$ymax = rct.height;

        let i = 0;
        var object = {

          annotateInfo: [// CarrierId
            result.text,
            this.$xmin,

            this.$ymin,
            this.$xmax,
            this.$ymax
          ]
        }



        i = i + 1;
        this.$text = result.text;
        this.$sitePersonel.objects.push(object);
        console.log(this.$sitePersonel);



        // document.getElementById('input').value = text;
        this.modalBody = this.$text;
        console.log(JSON.stringify(this.$sitePersonel));
        const value = JSON.stringify(this.$sitePersonel);


        document.getElementById('json').innerHTML = value;
      });

    this.modalBody = this.$text;
    // document.getElementById('input').value = text;
    $('#exampleModal').modal('show')


  }

  mybutton() {
    console.log('H1')
    let rct = "rct" + this.i;


    var newData = [
      this.selectOpt,
      this.$xmin,
      this.$ymin,
      this.$xmax,

      this.$ymax];



    this.$obj.rct.push(newData);

    console.log(this.$obj);


    this.$jsonfile = {
      "documentId": "RANDOM VALUE", //Random value generated
      "typeofDocument": "Order", // This will be static 
      "nameofDocument": "LighSpeed",
      "carrierId": "carrierId",
      "value": this.selectOpt,

      "createDate": "",
      "createdTime": "",



    };


    // let rct = "rct" + this.i;

    // this.$rectn.push(rct);
    // this.$res.push(this.$xmin,
    //   this.$xmax,
    //   this.$ymin,
    //   this.$ymax)


    // this.$annotateinfo[rct] =1;
    // // this.$xmin,
    // // this.$xmax,
    // // this.$ymin,
    // // this.$ymax;

    // console.log(this.$annotateinfo + "this.$annotateinfo ")

    // this.i++;

    JSON.stringify(this.$jsonfile);
    console.log(this.$jsonfile);











    const para = document.createElement('P');
    const h = document.createElement('h3');
    // h.innerHTML = document.getElementById('select').value;
    h.innerHTML = this.selectOpt;
    para.innerHTML = this.$text;

    this.$val.push(this.$text);
    this.$head.push(this.selectOpt);
    this.$pdfjson[this.selectOpt] = this.$text;

    JSON.stringify(this.$pdfjson);
    console.log(this.$pdfjson);




    document.getElementById('myDIV').appendChild(h);
    document.getElementById('myDIV').appendChild(para);
  }

  myclick(e) {
    this.http.post(this.url, this.$obj).subscribe((data) => {
      console.log(this.$obj)
      console.log("done");
    });
    // this.http.get(this.url + "/fgfd").subscribe((data : any) => {
    //   console.log(this.$jsonfile)
    //   console.log(data.Items[0].documentId);
    // });

    console.log("this.$val" + JSON.stringify(this.$pdfjson));
    this.service.missionAnnouncedSource.next(this.$pdfjson);


  }

  mymouseout(e) {

  }


  mymousemove(e) {
    this.$cursorVT.setAttribute('style', `left: ${e.clientX}px;`);
    this.$cursorHL.setAttribute('style', `top: ${e.clientY}px;`);
    if (this.drag) {


      this.$rect.w = (e.pageX - this.$canvas.offsetLeft) - this.$rect.startX - 260;
      this.$rect.h = (e.pageY - this.$canvas.offsetTop) - this.$rect.startY - 115;
      this.$ctx.strokeStyle = 'red';

      //  this.$ctx.strokeRect( this.$rect.startX,  this.$rect.startY,  this.$rect.w,  this.$rect.h);
      // this.$ctx.fillStyle = "green";
      // this.$ctx.globalAlpha = 0.01;  // [0, 1]
      // this.$ctx.fillRect(this.$rect.startX, this.$rect.startY, this.$rect.w, this.$rect.h);


    }

    console.log("mousemove works");


  }



  ngOnInit() {
  }

}
