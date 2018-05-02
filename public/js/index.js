$(function () {

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
  
});


var load_html_and_insert = function (html_url, insert_info_arr, parameter, countResultsFn){

    $.ajax(html_url, {
        timeout : 1000,
        datatype: 'html'
    }).then(function(data){

        var parser = new DOMParser();
        var out_html = parser.parseFromString(data, "text/html");
        var title = out_html.getElementsByTagName("title")[0].innerHTML;

        var listById_innerHTML = $(out_html).find("#" + insert_info_arr[1])[0].innerHTML;
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
              elm_highLitedAhref.setAttribute('href', html_url + "?" + parameter);
              elm_highLitedAhref.innerHTML = doHighLight(parameter,title);

              elm_h5.appendChild(elm_highLitedAhref);

              var elm_p = document.createElement('p');
              elm_p.className = 'card-text';
              elm_p.innerHTML = doHighLight(parameter,listById);

              elm_subdiv.appendChild(elm_h5);
              elm_subdiv.appendChild(elm_p);
              elm_topdiv.appendChild(elm_subdiv);

              $("#" + insert_info_arr[0]).append(elm_topdiv);

        }
        countResultsFn(str_count);

    }, function(jqXHR, textStatus) {
        
        var txt = "<p>textStatus:"+ textStatus + "</p>" +
                "<p>status:"+ jqXHR.status + "</p>" +
                "<p>responseText : </p><div>" + jqXHR.responseText +
                "</div>";
        $("#" + insert_info_arr[0]).append(txt);
        
    });

};


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