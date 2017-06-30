'use strict';

const express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var shell = require('shelljs');

const DEBUG = false;
var bot_id, group_id;

if (DEBUG) {
  bot_id = '66782dd3a2d5645feca4718af8';
  group_id = '32060693';
} else {
  bot_id = '4b84658985fbdc082076840e85';
  group_id = '13897405';
}

// request
var msg_options = {
    url: 'https://api.groupme.com/v3/bots/post?token=0RBWlSjAzqMbCApZl3hLRGl1CP2UqWRPeSQlseGn',
    method: 'POST',
    headers: {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
};
//

// Constants
const PORT = 8080;

// App
const app = express();
app.use(bodyParser.json());

app.get('/test', function (req, res) {
  res.send('Hello world\n');
  console.log('test');
});

app.post('/groupme', function (req, res) {
  console.log(JSON.stringify(req.body));
  console.log(req.body['text']);
  res.send('thanks');

  var matchStr = 'MACBOT';

  if (req.body['text'].trim().toUpperCase().indexOf(matchStr) !== -1) {
    var response = shell.exec("curl -s 'https://image.groupme.com/pictures' -X POST -H 'X-Access-Token: 0RBWlSjAzqMbCApZl3hLRGl1CP2UqWRPeSQlseGn' -H 'Content-Type: image/jpeg' --data-binary @./photos/`ls photos | shuf -n 1`").stdout;
    var img_url = JSON.parse(response).payload.url;
    console.log(img_url);

    msg_options.form = {'bot_id': bot_id, 'group_id': group_id, 'picture_url': img_url}

    // respond yes?
    request(msg_options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(JSON.stringify(body));
        console.log(JSON.stringify(response));
      } else {
        console.log(error);
      }
    });
    
  }
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
