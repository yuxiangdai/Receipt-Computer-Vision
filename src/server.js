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
      console.log('Text:', detections.length);
      let i = 0;
      var string = "";
      for(i = 1; i < detections.length; i++){
        const text = detections[i];
        console.log("OUT:"+ text.description)
        string += text.description
        //console.log("OUTRESULTS:" + resultString);
        // console.log(text);
        console.log(text.boundingPoly);

        const verticies = text.boundingPoly.vertices;
        let Y_average = 0
        for(let j = 0; j < verticies.length; j++) {
          Y_average += verticies[j].y;
        }
        
        console.log(Y_average/4);
      }
      res.send(string);
      console.log(detections[0].boundingPoly);
      // detections.forEach(text => {
      //   console.log(text);
      //   console.log(text.description);
      //   console.log(text.boundingPoly);
      // });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});

app.listen(port, host);


console.log(`Server listening at ${host}:${port}`);