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

const target_area = "target-area-list";

window.addEventListener('DOMContentLoaded', function () {
  var parameter = getParameter();
  var totalCount = 0;

  if (parameter != '') {
    load_html_and_insert(parameter);
  }
});

var load_html_and_insert = function (parameter) {

  //IE8+
  var request = new XMLHttpRequest();
  var html_url = '/search/' + parameter;

  request.open('GET', html_url, true);

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var resp = this.responseText;

        laod_html_and_insert_success(resp, parameter);
      } else {
        // Error :(

        var result_list = document.getElementById(target_area);

        var elem_p_statusText = document.createElement("p");
        var elem_txt_statusText = document.createTextNode("textStatus:" + this.statusText);

        elem_p_statusText.appendChild(elem_txt_statusText);

        var elem_p_status = elem_p_statusText.cloneNode(false);
        var elem_txt_status = document.createTextNode("status:" + this.status);
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

function laod_html_and_insert_success(resp, parameter) {

  var data = JSON.parse(resp);
  var totalCount = data[0].totalCount;

  var e = document.getElementById('search-result-count');
  e.textContent = totalCount + ' results';

  var e = document.getElementById('search-word');
  e.textContent = 'Word: ' + parameter;

  if (totalCount != 0) {

    data[0].results.forEach(function (obj) {
      var elm_topdiv = document.createElement('div');
      elm_topdiv.className = 'card';
      elm_topdiv.id = 'card-hight';

      var elm_subdiv = elm_topdiv.cloneNode(false);
      elm_subdiv.className = 'card-body';

      var elm_h5 = document.createElement('h5');
      elm_h5.className = 'card-title';

      var elm_highLitedAhref = document.createElement('a');
      elm_highLitedAhref.setAttribute('href', obj.url + "?" + encodeURIComponent(parameter));
      elm_highLitedAhref.innerHTML = doHighLight(parameter, obj.title);

      elm_h5.appendChild(elm_highLitedAhref);

      var elm_p = document.createElement('p');
      elm_p.className = 'card-text';
      elm_p.innerHTML = doHighLight(parameter, obj.textnodes);

      elm_subdiv.appendChild(elm_h5);
      elm_subdiv.appendChild(elm_p);
      elm_topdiv.appendChild(elm_subdiv);

      var result_list = document.getElementById(target_area);
      result_list.appendChild(elm_topdiv);
    });
  }
}

var doHighLight = function (searchStr, str) {
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

    highLitedStr = [highLitedStr.slice(0, pos), spanHead, highLitedStr.slice(pos, pos + searchStrLen), spanTail, highLitedStr.slice(pos + searchStrLen)].join('');

    pos = highLitedStr.toLowerCase().indexOf(lowerSearchStr, pos + spanLen + 1);
  }

  return highLitedStr;
};

function enter(code) {
  if (13 === code) {
    var para = '?' + encodeURIComponent(document.getElementById('search-text').value);
    window.location.href = 'searchresult.html' + para;
  }
}

function getParameter() {
  var urlParam = location.search.substring(1);

  if (urlParam) {
    return decodeURIComponent(urlParam).trim();
  } else {
    return '';
  }
}