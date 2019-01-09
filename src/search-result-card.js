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
  var totalCount = 0;

  var pageList = ['index', 'orders', 'products', 'customers', 'reports', 'integrations'];
　var i;
  if(parameter != ''){
    for(i = 0; i < pageList.length; ++i){

      load_html_and_insert(pageList[i] + '.html', ["list", "target-area-list"], parameter, 
        function(strCount){
            totalCount += strCount;
            var e = document.getElementById('search-result-count');
            e.textContent =  totalCount + ' results';
            
        });
    }
  }

  if(parameter != ''){
    var e = document.getElementById('search-word');
    e.textContent =  'Word: ' + parameter; 
  }
})

var load_html_and_insert = function (html_url, insert_info_arr, parameter, countResultsFn){

    //IE8+
    var request = new XMLHttpRequest();
    request.open('GET', html_url , true);

    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          var resp = this.responseText;

          laod_html_and_insert_success(resp, html_url, insert_info_arr, parameter, countResultsFn);

        } else {
          // Error :(

          var result_list = document.getElementById(insert_info_arr[0]);

          var elem_p_statusText = document.createElement("p");
          var elem_txt_statusText = document.createTextNode("textStatus:"+ this.statusText);

          elem_p_statusText.appendChild(elem_txt_statusText);

          var elem_p_status = elem_p_statusText.cloneNode(false);
          var elem_txt_status = document.createTextNode("status:"+ this.status);
          elem_p_status.appendChild(elem_txt_status);

          var elem_p_responseText = elem_p_statusText.cloneNode(false);
          var elem_txt_responseText_detail = document.createTextNode("responseText : ");
          elem_p_responseText.appendChild(elem_txt_responseText_detail);

          var elem_div = document.createElement("div");
          var elem_txt_responseText = document.createTextNode(this.responseText);
          elem_div.appendChild(elem_txt_responseText);

          result_list.appendChild(elem_p_statusText);
          result_list.appendChild(elem_p_status);
          result_list.appendChild(elem_p_responseText);
          result_list.appendChild(elem_div);


        }
      }
    };

    request.send();
    request = null;

};

function laod_html_and_insert_success(resp, html_url, insert_info_arr, parameter, countResultsFn){
  
  var parser = new DOMParser();
  var out_html = parser.parseFromString(resp, "text/html");
  var title = out_html.getElementsByTagName("title")[0].innerHTML;

  var listById_innerHTML = out_html.getElementById(insert_info_arr[1]).innerHTML;
  var listById_dom = parser.parseFromString(listById_innerHTML, "text/html");

  var listById = '';
  if (listById_dom.hasChildNodes()) {
          getAllChildsTexts(listById_dom.childNodes, function(childTextContent){
          listById = listById + childTextContent;
        });
  }
        
  var str_count = 0;
  str_count += strCount(parameter,listById);
  str_count += strCount(parameter,title);

  if ( str_count != 0) {

    var elm_topdiv = document.createElement('div');
    elm_topdiv.className = 'card';
    elm_topdiv.id = 'card-hight';

    var elm_subdiv = elm_topdiv.cloneNode(false);
    elm_subdiv.className = 'card-body';

    var elm_h5 = document.createElement('h5');
    elm_h5.className = 'card-title';

    var elm_highLitedAhref = document.createElement('a');
    elm_highLitedAhref.setAttribute('href', html_url + "?" + encodeURIComponent(parameter));
    elm_highLitedAhref.innerHTML = doHighLight(parameter,title);

    elm_h5.appendChild(elm_highLitedAhref);

    var elm_p = document.createElement('p');
    elm_p.className = 'card-text';
    elm_p.innerHTML = doHighLight(parameter,listById);

    elm_subdiv.appendChild(elm_h5);
    elm_subdiv.appendChild(elm_p);
    elm_topdiv.appendChild(elm_subdiv);

    var result_list = document.getElementById(insert_info_arr[0]);
    result_list.appendChild(elm_topdiv);

  }
  countResultsFn(str_count);

}

var strCount = function(searchStr, str) {
    if (!searchStr || !str) return 0;
 
    var lowerSearchStr = searchStr.toLowerCase();
    var lowerStr = str.toLowerCase();
    var count = 0, pos = lowerStr.indexOf(lowerSearchStr);
    
    while (pos !== -1) {
        count++;

        pos = lowerStr.indexOf(lowerSearchStr, pos + 1);    
    }
 
    return count;
};

var doHighLight = function(searchStr, str) {
    if (!searchStr || !str) return 0;
 
    var lowerSearchStr = searchStr.toLowerCase();
    var lowerStr = str.toLowerCase();
    var pos = lowerStr.indexOf(lowerSearchStr);
    var highLitedStr = str;
    let spanHead = '<span class="highlight">';
    let spanTail = '</span>';
    let spanLen = spanHead.length + spanTail.length;
    let searchStrLen = searchStr.length;
    
    while (pos !== -1) {

        highLitedStr = [highLitedStr.slice(0, pos), spanHead , 
                        highLitedStr.slice(pos, pos + searchStrLen), 
                        spanTail,highLitedStr.slice(pos + searchStrLen) ].join('');

        pos = highLitedStr.toLowerCase().indexOf(lowerSearchStr, pos + spanLen + 1);    
    }
 
    return highLitedStr;
};

var getAllChildsTexts = function(child,createResult){
    if(!child || !createResult) return '';

    var i;
    for(i = 0; i< child.length; i++){

      if (child[i].hasChildNodes()) {
        getAllChildsTexts(child[i].childNodes,createResult);
      }else{
        createResult(child[i].textContent);
      }
    }
}


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