var express        = require('express');
var fs             = require('fs');
var app            = express();

var search = require('./search.js');

var user = process.env.USER;
var pass = process.env.PASS;

const targetAreaXPath = '//*[@id="target-area-list"]';

if (user && pass) {
  app.use(express.basicAuth(user, pass));
}

app.use(express.static(__dirname + '/public'));

app.get("/search", function(req, res) {
  console.log("*********");
  console.log(req.query.q);
  console.log("*********");
  
  var pageList = ['index', 'orders', 'products', 'customers', 'reports', 'integrations'];
  var i;

  var totalCount = 0;
  var list_results = [];

  for (i = 0; i < pageList.length; ++i) {
      var url = './public/' + pageList[i] + '.html';
      
      data = fs.readFileSync(url).toString();
      
      var results = search.create_results(data, req.query.q, targetAreaXPath);
      totalCount += results.strCount;

      var public_url = pageList[i] + '.html';
      results.url = public_url;

      list_results.push(results);
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