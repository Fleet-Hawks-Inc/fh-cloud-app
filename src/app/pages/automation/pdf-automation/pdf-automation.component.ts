import { Component, OnInit } from '@angular/core';
declare var Tesseract: any;

@Component({
  selector: 'app-pdf-automation',
  templateUrl: './pdf-automation.component.html',
  styleUrls: ['./pdf-automation.component.css']
})
export class PdfAutomationComponent implements OnInit {

  pageTitle = 'Pdf Automation';
  constructor() {


    $( () => {
      const canvas = document.getElementById('src');
      const savebtn = document.getElementById('fire');
      const pdffile = document.getElementById('pdffile');
      const el = document.getElementById('myFile');
      let text;

      const ctx = canvas.getContext('2d');
      const rect = {};
      let drag = false;
      const imageObj = null;
      let renderTask;




      el.onchange = () => {
        // var url = document.getElementById('myFile').value;
        const url = 'demo1.pdf'
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        const pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(function (pdf) {
          console.log('PDF loaded');

          // Fetch the first page
          const pageNumber = 1;
          pdf.getPage(pageNumber).then(function (page) {
            console.log('Page loaded');

            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            // Prepare canvas using PDF page dimensions
            const canvasShadowed = document.getElementById('src');
            const context = canvasShadowed.getContext('2d');
            canvasShadowed.height = viewport.height;
            canvasShadowed.width = viewport.width;

            // Render PDF page into canvas context
            let renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
              console.log('Page rendered');
            });
          });
        },  (reason) => {
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


      async function loadImage(url) {
        return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
      }

      // todo, add parameters and change sourceImage to ImageData (getImageData from other canvas)
      function cropImage(sourceImage, rect) {
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
      function mouseDown(e) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        console.log(rect.startX)

        drag = true;


      }
      function onclick(e) {
        console.log('works')
      }


      function mouseMove(e) {
        if (drag) {



          rect.w = (e.pageX - this.offsetLeft) - rect.startX;
          rect.h = (e.pageY - this.offsetTop) - rect.startY;

          ctx.strokeStyle = 'red';
          // ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);




        }



      }
      async function mouseUp() {

        drag = false;

        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);

        console.log('mouseup working')
        console.log(rect.startX, rect.startY, rect.w, rect.h)


        var canvas = document.getElementById('src');


        const worker = Tesseract.TesseractWorker();
       // const worker = Tesseract;
        const srcContext = document.getElementById('src').getContext('2d');

        // let img = await loadImage('1.jpg');
        // srcContext.drawImage(img, 0, 0);



        const rct = { left: rect.startX, top: rect.startY, width: rect.w, height: rect.h };
        console.log('rct' + rct);
        const cropImgCanvas = cropImage(canvas, rct);//img

        // just renderint to visualize - no need for actual crop

        srcContext.rect(rct.left, rct.top, rct.width, rct.height);
        srcContext.strokeStyle = '#FF0000';
        srcContext.stroke();

        // todo: pass the rect info and promise them all?
        worker.recognize(cropImgCanvas)
          .progress(progress => {
            //console.log('progress:', progress);
          }).then(result => {
          // console.log('result:', result.text);
          // document.getElementById('text').value = result.text;
          // text = result.text
          const sitePersonel = {};
          const objects = []
          sitePersonel.objects = objects;
          console.log(sitePersonel);


          const xmin = rct.left;
          const ymin = rct.top;
          const xmax = rct.width;
          const ymax = rct.height;
          const object = {
            'text': result.text,
            'xmin': xmin,
            'xmax': xmax,
            'ymin': ymin,
            'ymax': ymax
          }
          text = result.text;
          sitePersonel.objects.push(object);
          console.log(sitePersonel);


          console.log(JSON.stringify(sitePersonel));
          document.getElementById('input').value = text;
        });
        document.getElementById('input').value = text;
        $('#exampleModal').modal('show')

      }


      async function init() {
        // var drag = false;
        // var canvas = document.getElementById('src');


        // const worker = new Tesseract.TesseractWorker();
        // var srcContext = document.getElementById('src').getContext('2d');
        // var destContext = document.getElementById('dest').getContext('2d');
        // let img = await loadImage('1.jpg');
        // srcContext.drawImage(img, 0, 0);

        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);
        $('#fire').on('click',  (e) => {

          // Append the text to <p>

          console.log('H1')
          const para = document.createElement('P');
          const h = document.createElement('h3');
          h.innerHTML = document.getElementById('select').value;
          para.innerHTML = text;
          document.getElementById('myDIV').appendChild(h);
          document.getElementById('myDIV').appendChild(para);
        })

      }




      document.body.onload = init;

    });


  }

  ngOnInit() {
  }

}
