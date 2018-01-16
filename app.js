var express = require('express');
var cors = require("cors");
var app 	= express();
var bodyParser = require('body-parser');

var port 	= process.env.PORT || 8099;

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: "10mb",extended: true}));
app.use(require('./controllers'));

app.listen(port, function() {
  console.log('Listening on port ' + port);
});