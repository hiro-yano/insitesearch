$(function () {

  var parameter = getParameter();

  if(parameter != ''){
      load_html_and_insert(["target-area-list", "target-area-list"], parameter); 
  }
  
});

var load_html_and_insert = function (insert_info_arr, parameter){

        //var listById_dom = $(document).find("#" + insert_info_arr[1])[0];
        var listById_dom = document.getElementById(insert_info_arr[1]);
        if(listById_dom != null){
          listById_dom = highLightAllChildsTexts(listById_dom,parameter);

          var elem = document.getElementById(insert_info_arr[0]);
          elem.appendChild(listById_dom);
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