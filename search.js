/*
The MIT License (MIT)

Copyright (c) 2018 yappynoppy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
  
  function create_results(data, parameter) {
  
    var parser = new DOMParser();
    var out_html = parser.parseFromString(data, "text/html");
    var title = out_html.getElementsByTagName("title")[0].innerHTML;
  
    var body = out_html.getElementsByTagName("body")[0].innerHTML;
    var body_dom = parser.parseFromString(body, "text/html");
  
    var textnodes = [];
    if (body_dom.hasChildNodes()) {
      getAllChildsTexts(listById_dom.childNodes, function (childTextNode) {
        textnodes.push(childTextNode);
      });
    }
  
    var str_count = 0;
    str_count += strCount(parameter, textnodes.join(''));
    str_count += strCount(parameter, title);

    var results = new Object();
    results.strCount = str_count;
    results.title = title;
    results.textnodes = strExtract(parameter, textnodes)
　　　
    return results;
  }
  
  var strCount = function (searchStr, str) {
    if (!searchStr || !str) return 0;
  
    var lowerSearchStr = searchStr.toLowerCase();
    var lowerStr = str.toLowerCase();
    var count = 0,
    pos = lowerStr.indexOf(lowerSearchStr);
  
    while (pos !== -1) {
      count++;
  
      pos = lowerStr.indexOf(lowerSearchStr, pos + 1);
    }
  
    return count;
  };

  var strExtract = function (searchStr, list){
    if (!searchStr || !str) return 0;
  
    var lowerSearchStr = searchStr.toLowerCase();
    var count = 0;

    list.some(function(str){
        pos = str.toLowerCase.indexOf(lowerSearchStr);
        if(pos != -1){
            return true;
        }
        count ++;
    });
  
    return list.slice(count, 5).join('');
  }
  
  var getAllChildsTexts = function (child, createResult) {
    if (!child || !createResult) return '';
  
    var i;
    for (i = 0; i < child.length; i++) {
  
      if (child[i].hasChildNodes()) {
        getAllChildsTexts(child[i].childNodes, createResult);
      } else {
        createResult(child[i].textContent);
      }
    }
  };

module.exports = {
    create_results: create_results
};