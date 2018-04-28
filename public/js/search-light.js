$(function () {

  var parameter = getParameter();

  if(parameter != ''){
      load_html_and_insert(["target-area-list", "target-area-list"], parameter); 
  }
  
});

var load_html_and_insert = function (insert_info_arr, parameter){

        var listById_innerHTML = $(document).find("#" + insert_info_arr[1])[0].innerHTML;
        var parser = new DOMParser();
        var listById_dom = parser.parseFromString(listById_innerHTML, "text/html");

        //var resultListById_dom = document.createElement(listById_dom.tagName);
        //highLightAllChildsTexts(listById_dom,parameter);
        var node = listById_dom;
        //node.nodeValue = doHighLight(parameter, node.nodeValue);

        while (node) {
          alert("result:" + node);
          node.nodeValue = node.nodeValue.replace(node.nodeValue,doHighLight(parameter, node.nodeValue));
          node = node.nextNode();
        }
        alert("result:" + node);

        //$("#" + insert_info_arr[0]).empty().append(listById_dom);
        $("#" + insert_info_arr[0]).empty().append(node);

};


function highLightAllChildsTexts(dom,parameter){
    if(!dom || !parameter) return;

    //var textNodeHilighted;

    if(dom.innerHTML!=''){
      //dom.nodeValue = document.createTextNode(doHighLight(parameter, dom.nodeValue));
      //dom.nodeValue = doHighLight(parameter, dom.nodeValue);
      //alert("nodevalue:" + dom.nodeValue);
      dom.nodeValue = doHighLight(parameter, dom.innerHTML);
      alert("nodevalue:" + dom.innerHTML);
      //appendChildFn(textNodeHilighted);
    }
    
    if(dom.hasChildNodes()){
      
      var i;
      //var childElement;

      for(i = 0; i< dom.childNodes.length; i++){
        //alert("child[" + i + "]:" + dom.childNodes[i].nodeValue);
        //childElement = document.createElement(dom.childNodes[i].tagName);
        //appendChildFn(childElement);

        highLightAllChildsTexts(dom.childNodes[i],parameter);
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