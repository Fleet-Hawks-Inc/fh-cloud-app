import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-automation',
  templateUrl: './pdf-automation.component.html',
  styleUrls: ['./pdf-automation.component.css']
})
export class PdfAutomationComponent implements OnInit {

  constructor() {


    $( document ).ready(() => {


      var canvas = document.getElementById('src');
      var savebtn = document.getElementById('fire');
      var pdffile = document.getElementById('pdffile');
      var el = document.getElementById('myFile');
      var text;

      var ctx = canvas.getContext('2d');
      var rect = {};
      var drag = false;
      var imageObj = null;
      var renderTask;




      el.onchange = function () {
        // var url = document.getElementById("myFile").value;
        var url = "demo1.pdf"
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        var pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        var loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(function (pdf) {
          console.log('PDF loaded');

          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function (page) {
            console.log('Page loaded');

            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale });

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('src');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
              console.log('Page rendered');
            });
          });
        }, function (reason) {
          // PDF loading error
          console.error(reason);
        });
      }
      // var ocrJson = {
      //     // todo: other parameters. b&w, resizing strategy etc
      //     "version": "1.0.0",
      //     "schema": "My OCR Meta JSON",
      //     "rectangles": [
      //         { "left": 70, "top": 95, "width": 130, "height": 15, "label": "PatientName" },
      //         { "left": 70, "top": 110, "width": 230, "height": 15, "label": "Address" },
      //         { "left": 140, "top": 135, "width": 150, "height": 15, "label": "DOS" },
      //     ],
      // };


      async function loadImage(url) {
        return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
      }

      // todo, add parameters and change sourceImage to ImageData (getImageData from other canvas)
      function cropImage(sourceImage, rect) {
        // parameterize them
        var left = rect.left;
        var top = rect.top;
        var width = rect.width;
        var height = rect.height;

        var cropCanvas = document.createElement('canvas');
        cropCanvas.width = width;
        cropCanvas.height = height;

        var context = cropCanvas.getContext('2d');
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
        console.log("works")
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

        console.log("mouseup working")
        console.log(rect.startX, rect.startY, rect.w, rect.h)


        var canvas = document.getElementById('src');


        const worker = new Tesseract.TesseractWorker();
        var srcContext = document.getElementById('src').getContext('2d');

        // let img = await loadImage('1.jpg');
        // srcContext.drawImage(img, 0, 0);



        var rct = { left: rect.startX, top: rect.startY, width: rect.w, height: rect.h };
        console.log("rct" + rct);
        var cropImgCanvas = cropImage(canvas, rct);//img

        // just renderint to visualize - no need for actual crop

        srcContext.rect(rct.left, rct.top, rct.width, rct.height);
        srcContext.strokeStyle = "#FF0000";
        srcContext.stroke();

        // todo: pass the rect info and promise them all?
        worker.recognize(cropImgCanvas)
          .progress(progress => {
            //console.log('progress:', progress);
          }).then(result => {
          // console.log('result:', result.text);
          // document.getElementById("text").value = result.text;
          // text = result.text
          var sitePersonel = {};
          var objects = []
          sitePersonel.objects = objects;
          console.log(sitePersonel);


          var xmin = rct.left;
          var ymin = rct.top;
          var xmax = rct.width;
          var ymax = rct.height;
          var object = {
            "text": result.text,
            "xmin": xmin,
            "xmax": xmax,
            "ymin": ymin,
            "ymax": ymax
          }
          text = result.text;
          sitePersonel.objects.push(object);
          console.log(sitePersonel);


          console.log(JSON.stringify(sitePersonel));
          document.getElementById("input").value = text;
        });
        document.getElementById("input").value = text;
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
        $('#fire').on('click', function (e) {

          // Append the text to <p>

          console.log("H1")
          const para = document.createElement("P");
          const h = document.createElement("h3");
          h.innerHTML = document.getElementById("select").value;
          para.innerHTML = text;
          document.getElementById("myDIV").appendChild(h);
          document.getElementById("myDIV").appendChild(para);
        })

      }




      document.body.onload = init;

    });


  }

  ngOnInit() {
  }

}
