'use strict';

const express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var shell = require('shelljs');
var yaml = require('js-yaml')

// Init
const DEBUG = true;
const PORT = 8080;
var BOT, TOKEN;

// Load config and choose the correct bot
// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./credentials.yaml', 'utf8'));
} catch (e) {
  console.log(e);
  process.exit(1);
}

BOT = DEBUG == true ? doc.bots[0] : doc.bots[1];
TOKEN = doc.access_token;

// Build the base request for sending messages
var msg_options = {
  url: 'https://api.groupme.com/v3/bots/post?token=' + TOKEN,
  method: 'POST',
  headers: {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

// Express
const app = express();
app.use(bodyParser.json());

app.post('/groupme', function (req, res) {
  // Log incoming request body from chat post
  console.log('body: ' + JSON.stringify(req.body));

  // String match incoming messages
  var matchStr = 'MACBOT';

  if (req.body['text'].trim().toUpperCase().indexOf(matchStr) !== -1) {
    // Submit photo to groupme photo service and get the image URL back
    var response = shell.exec("curl -s 'https://image.groupme.com/pictures' -X POST -H 'X-Access-Token: 0RBWlSjAzqMbCApZl3hLRGl1CP2UqWRPeSQlseGn' -H 'Content-Type: image/jpeg' --data-binary @./photos/`ls photos | shuf -n 1`").stdout;
    var img_url = JSON.parse(response).payload.url;
    console.log('img_url: ' + img_url);

    msg_options.form = {'bot_id': BOT.bot_id, 'group_id': BOT.group_id, 'picture_url': img_url}

    // respond yes?
    request(msg_options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(JSON.stringify('body: ' + body));
        console.log(JSON.stringify('response: ' + response));
      } else {
        console.log('error: ' + error);
      }
    });

    res.send('Thanks');
  }
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
