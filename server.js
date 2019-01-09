
var express        = require('express');
/*var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');*/
var app            = express();

/*var user = process.env.USER;
var pass = process.env.PASS;

app.set('port', process.env.PORT || 3000);

if (user && pass) {
  app.use(express.basicAuth(user, pass));
}*/

app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
/*app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser.urlencoded({ extended: false }))    // parse application/x-www-form-urlencoded
app.use(bodyParser.json())    // parse application/json
app.use(methodOverride());                  // simulate DELETE and PUT*/

app.listen(8080);   
console.log('Magic happens on port 8080');          // shoutout to the user