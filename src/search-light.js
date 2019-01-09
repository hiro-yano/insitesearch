/*
The MIT License (MIT)

Copyright (c) 2018 Hiromasa Yano

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

window.addEventListener('DOMContentLoaded', function() {
  var parameter = getParameter();

  if(parameter != ''){
      load_html_and_insert("target-area-list", parameter); 
  }
})

var load_html_and_insert = function (insert_info, parameter){

        var listById_dom = document.getElementById(insert_info);
        if(listById_dom != null){
          listById_dom = highLightAllChildsTexts(listById_dom,parameter);
        }
};


var highLightAllChildsTexts = function(dom,parameter){
    if(!dom || !parameter) return dom;

    if(dom.nodeType==3 && dom.nodeValue!=''){
      //this element is a textnode

      return doHighLightDOM(parameter, dom.nodeValue);
      
    }else{
      //this element is not a textnode and has child nodes
      if(dom.hasChildNodes()){
      
        var i;
        var child;
        for(i = 0; i< dom.childNodes.length; i++){

          child = highLightAllChildsTexts(dom.childNodes.item(i),parameter);
          dom.replaceChild(child, dom.childNodes.item(i));

        }
      }
      //this element is not a textnode and (has or don't have child nodes)
      return dom;
    } 
    
}

var doHighLightDOM = function(searchStr, str) {

    var elem_topspan = document.createElement('span');

    if (!searchStr || !str) return elem_topspan;
 
    var lowerSearchStr = searchStr.toLowerCase();
    var pos = -1;
    pos = str.toLowerCase().indexOf(lowerSearchStr);

    let searchStrLen = searchStr.length;

    var rest_of_string = str;

    var tmp_elem_span_highlight = document.createElement('span');
    tmp_elem_span_highlight.className = "highlight";


    if (pos == -1){
      return elem_topspan.appendChild(document.createTextNode(str));
    }
    
    while (pos !== -1) {
        elem_topspan.appendChild(document.createTextNode(rest_of_string.slice(0, pos)));

        var elem_span_highlight = tmp_elem_span_highlight.cloneNode(false);
        elem_span_highlight.appendChild(document.createTextNode(rest_of_string.slice(pos, pos + searchStrLen)));
        elem_topspan.appendChild(elem_span_highlight);

        rest_of_string = rest_of_string.slice(pos + searchStrLen);

        pos = rest_of_string.toLowerCase().indexOf(lowerSearchStr);    
    }

    elem_topspan.appendChild(document.createTextNode(rest_of_string));
 
    return elem_topspan;
};


function enter(code)
{
  if(13 === code)
  {
    var para = '?' + encodeURIComponent(document.getElementById('search-text').value);
    window.location.href = 'searchresult.html' + para;
  }
}


function getParameter(){
  var urlParam = location.search.substring(1);

  if(urlParam) {
    return decodeURIComponent(urlParam).trim();
  }else{
    return '';
  }
 
}