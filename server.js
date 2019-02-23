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

app.get("/search/:word", function(req, res) {
  
  var pageList = ['index', 'orders', 'products', 'customers', 'reports', 'integrations'];
  var i;

  var totalCount = 0;
  var list_results = [];

  for (i = 0; i < pageList.length; ++i) {
      var url = './public/' + pageList[i] + '.html';

      data = fs.readFileSync(url).toString();
      var results = search.create_results(data, req.params.word, targetAreaXPath);
      totalCount += results.strCount;
      results.url = url;

      list_results.push(JSON.stringify(results));
  }

  console.log(list_results);

  var json = {
    "totalCount" : totalCount,
    "results" : list_results
  }

  res.json(json);

});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);