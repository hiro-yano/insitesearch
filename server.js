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
  
  var pageList = ['index', 'orders', 'products', 'customers', 'reports', 'integrations'];
  var i;

  var totalCount = 0;
  var list_results = [];

  for (i = 0; i < pageList.length; ++i) {
      var url = './public/src/' + pageList[i] + '.html';

      fs.readFile(url , 'utf-8' , function (err, data) {
        var results = search.create_results(data, req.params.word);
        totalCount += results.strCount;
        results.url = filename;
        
        list_results.push(JSON.stringify(results));
      });
  }

  var json = {
    "totalCount" : totalCount,
    "results" : list_results
  }

  res.json(json);

});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);