var express        = require('express');
var app            = express();

var user = process.env.USER;
var pass = process.env.PASS;

if (user && pass) {
  app.use(express.basicAuth(user, pass));
}

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);