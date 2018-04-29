$(function () {

  var parameter = getParameter();

  if(parameter != ''){
      load_html_and_insert(["target-area-list", "target-area-list"], parameter); 
  }
  
});

var load_html_and_insert = function (insert_info_arr, parameter){

        var listById_dom = $(document).find("#" + insert_info_arr[1])[0];
        listById_dom = highLightAllChildsTexts(listById_dom,parameter);

        printDom(listById_dom);
        alert("result:" + listById_dom.innerHTML);

        //$("#" + insert_info_arr[0]).append(listById_dom);

        var elem = document.getElementById(insert_info_arr[0]);
        elem.appendChild(listById_dom);
};


var highLightAllChildsTexts = function(dom,parameter){
    if(!dom || !parameter) return dom;

    if(dom.nodeType==3 && dom.nodeValue!=''){

      dom.nodeValue = doHighLight(parameter, dom.nodeValue);
      //dom.innerHTML = doHighLightDOM(parameter, dom.nodeValue).innerHTML;
      alert("nodevalue:" +  dom.innerHTML);

    }

      if(dom.hasChildNodes()){
      
        var i;
        for(i = 0; i< dom.childNodes.length; i++){

          highLightAllChildsTexts(dom.childNodes.item(i),parameter);
        }
      }

      return dom;
    
    
}

function printDom(dom){
    if(!dom) return;

    if(dom.nodeType==1){
      alert("print dom value:" + dom.tagName);
    }

    if(dom.nodeType==3){
      alert("print dom value:" + dom.innerHTML);
    }
    
    if(dom.hasChildNodes()){
      
      var i;

      for(i = 0; i< dom.childNodes.length; i++){
        printDom(dom.childNodes.item(i));
      }
    }

}

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

var doHighLightDOM = function(searchStr, str) {

    var elem_topspan = document.createElement('span');

    if (!searchStr || !str) return elem_topspan;
 
    var lowerSearchStr = searchStr.toLowerCase();
    var pos = str.toLowerCase().indexOf(lowerSearchStr);

    let searchStrLen = searchStr.length;

    var rest_of_string = str;
    
    while (pos !== -1) {
        elem_topspan.appendChild(document.createTextNode(rest_of_string.slice(0, pos)));

        var elem_span_highlight = document.createElement('span');
        elem_span_highlight.className = "highlight"
        elem_span_highlight.appendChild(document.createTextNode(rest_of_string.slice(pos, pos + searchStrLen)));
        elem_topspan.appendChild(elem_span_highlight);

        rest_of_string = rest_of_string.slice(pos + searchStrLen);

        pos = rest_of_string.toLowerCase().indexOf(lowerSearchStr);    
    }
 
    return elem_topspan;
};


function enter(code)
{
  //エンターキー押下なら
  if(13 === code)
  {
    var para = '?' + document.getElementById('search-text').value;
    window.location.href = 'searchresult.html' + para; // 通常の遷移
  }
}


function getParameter(){
  // URLのパラメータを取得
  var urlParam = location.search.substring(1);
 
  // URLにパラメータが存在する場合
  if(urlParam) {
    return decodeURI(urlParam).trim();
  }else{
    return '';
  }
 
}