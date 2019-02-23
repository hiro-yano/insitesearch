var express        = require('express');
var fs             = require('fs');
var app            = express();
var search = require('./search.js');

var user = process.env.USER;
var pass = process.env.PASS;

if (user && pass) {
  app.use(express.basicAuth(user, pass));
}

app.use(express.static(__dirname + '/public'));

app.get("/search/:word", function(req, res) {
  
  var totalCount = 0;
  
  var pageList = ['index', 'orders', 'products', 'customers', 'reports', 'integrations'];
  var i;

  for (i = 0; i < pageList.length; ++i) {
      fs.readFile('./public/src/' + pageList[i] + '.html', 'utf-8' , doReard );
  }

  function doReard(err, data) {
    search.create_results(data, req.params.word, );
  }

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write();
  res.end();

});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);