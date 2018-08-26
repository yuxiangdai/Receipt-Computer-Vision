require('dotenv').config()

const admin = require('./firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.APP_PORT || 8080;
const host = process.env.APP_HOST || '127.0.0.1';

const router = require('./routes');
app.use('/', router);

app.get('/test', function(req, res){
  const vision = require('@google-cloud/vision');

  const client = new vision.ImageAnnotatorClient();
  const fileName = process.env.PWD + '/longos1.jpg';
  
  client
    .textDetection(fileName)
    .then(results => {
      const detections = results[0].textAnnotations;
      const PageBound = detections[0].boundingPoly;
      let setArray = [];

      for(let i = 1; i < detections.length; i++){
        const text = detections[i];
        //console.log("OUTRESULTS:" + resultString);
        // console.log(text);

        const verticies = text.boundingPoly.vertices;
        const description = text.description;

        //top line deltas
        const topDeltaY = verticies[0].y - verticies[1].y;
        const topDeltaX = verticies[0].x - verticies[1].x;
        const topSlope = topDeltaY/topDeltaX;
        const topDisplacement = verticies[0].y - verticies[0].x * topSlope;
        //bottom line deltas
        const bottomDeltaY = verticies[3].y - verticies[2].y;
        const bottomDeltaX = verticies[3].x - verticies[2].x;
        const bottomSlope = bottomDeltaY/bottomDeltaX;
        const bottomDisplacement = verticies[3].y - verticies[3].x * bottomSlope;
        //average Coordinate
        const averageY = (verticies[0].y + verticies[1].y + verticies[2].y + verticies[3].y)/4;
        const averageX = (verticies[0].x + verticies[1].x + verticies[2].x + verticies[3].x)/4;

        setArray.push([{
          description,
          topSlope,
          topDisplacement,
          bottomSlope,
          bottomDisplacement, 
          averageY,
          averageX
        }])
        console.log(description, topSlope, topDeltaX, topDeltaY, "______", verticies);
      }
      for(let i = 0; i < setArray.length; i++){
        if(setArray[i] != null){
          for(let k = i + 1; k < setArray.length; k++){
            if(setArray[k]!= null && checkoutForCross(setArray[i][0], setArray[k][0])){
              setArray[i].push(setArray[k][0]);
              delete setArray[k];
            }
          }
        }
      }
      let resultsArray = [];
      for(let i = 0; i < setArray.length; i++){
        if(setArray[i] != null){
          resultsArray.push(setArray[i]);
        }
      }

      let stringArray = [];
      for(let i = 0; i < resultsArray.length; i++){
        let line = resultsArray[i];
        //console.log("B____________", line);
        line.sort(function(a,b){return a.averageX - b.averageX})
        //console.log("after__________", line);
        let resultline = "";
        let smallest = 0;
        for(let k = 0; k <line.length; k++){
          resultline += ` ${line[k].description}`;
        }
        stringArray.push(resultline);
        console.log(resultline);
      }

      const Bannedlist = ["discount", "save", "/kg", "/$"];
      let subtotalcheck = true;
      let outputResult = [];
      for(let i = 0; i < stringArray.length; i++){
        const line = stringArray[i].toLocaleLowerCase();
        if (checkContain("$", line) && subtotalcheck == true) {
          if (checkContain("sub", line) && checkContain("total", line)){
            subtotalcheck = false;
          }
          else{
            let linecheck = true;
            for(let k = 0; k <Bannedlist.length; k++){
              if (checkContain(Bannedlist[k], line)){
                linecheck = false;
              }
            }
            if(linecheck){
              let linesplit = stringArray[i].split("$");
              console.log(stringArray[i]);
              if (linesplit.length == 2 && linesplit[0].length > 2) {
                outputResult.push({product: linesplit[0], price: linesplit[1].replace(/[^0-9.]+/g, '')});
              }
            }
          }
           
        }
      }
      res.send({ zheng: outputResult });
      console.log(outputResult);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
    
});

app.listen(port, host);


console.log(`Server listening at ${host}:${port}`);