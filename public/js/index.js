$(function () {
  searchWord = function(){
    var searchResult,
        searchText = $(this).val(), // 検索ボックスに入力された値
        targetText,
        hitNum;

    // 検索結果を格納するための配列を用意
    searchResult = [];

    // 検索結果エリアの表示を空にする
    $('#search-result__list').empty();
    $('.search-result__hit-num').empty();

    // 検索ボックスに値が入ってる場合
    if (searchText != '') {
      $('.target-area li').each(function() {
        targetText = $(this).text();

        // 検索対象となるリストに入力された文字列が存在するかどうかを判断
        if (targetText.indexOf(searchText) != -1) {
          // 存在する場合はそのリストのテキストを用意した配列に格納
          searchResult.push(targetText);
        }
      });

      // 検索結果をページに出力
      for (var i = 0; i < searchResult.length; i ++) {
        $('<span>').text(searchResult[i]).appendTo('#search-result__list');
      }

      // ヒットの件数をページに出力
      hitNum = '<span>検索結果</span>：' + searchResult.length + '件見つかりました。';
      $('.search-result__hit-num').append(hitNum);
    }
  };

  // searchWordの実行
  $('#search-text').on('input', searchWord);

　//$("#list_dashboard").load("dashboard.html #target-area-list li");
  
  var parameter = getParameter();
  var totalCount = 0;

  var pageList = ['dashboard', 'orders', 'products', 'customers'];
　var i;
  if(parameter != ''){
    for(i = 0; i < pageList.length; ++i){
      load_html_and_insert(pageList[i] + '.html', ["list", "target-area-list"], parameter, 
        function(strCount){
            totalCount += strCount;
            var e = document.getElementById('search-result-count');
            e.textContent =  totalCount + ' results';//  文字列設定
            
        }); 
    }
  }

  if(parameter != ''){
    var e = document.getElementById('search-word');
    e.textContent =  'Word: ' + parameter;//  文字列設定
  }
  
});

/**
 * @brief use Ajax(jQuey) to get external html and extract by id and insert by id.
 *
 * @param html_url url or lelative path or...
 * @param insert_info_arr 2d-array like std::vector<std::array<std::string, 2>>.
 *
 * @return none.
 */
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

        //alert(listById);
        
        var str_count = 0;
        str_count += strCount(parameter,listById);
        str_count += strCount(parameter,title);

        if ( str_count != 0) {

              //var highLitedAhref = '<a href="' + html_url + '">'+ doHighLight(parameter,title) +'</a>';
              
              //elm_highLitedAhref.appendChild(createAText);

              var elm_topdiv = document.createElement('div');
              elm_topdiv.className = 'card';

              var elm_subdiv = document.createElement('div');
              elm_subdiv.className = 'card-body';

              var elm_h5 = document.createElement('h5');
              elm_h5.className = 'card-title';
              
              var elm_highLitedAhref = document.createElement('a');
              elm_highLitedAhref.setAttribute('href', html_url);
              elm_highLitedAhref.innerHTML = doHighLight(parameter,title);

              elm_h5.appendChild(elm_highLitedAhref);

              var elm_p = document.createElement('p');
              elm_p.className = 'card-text';
              elm_p.innerHTML = doHighLight(parameter,listById);

              elm_subdiv.appendChild(elm_p);
              elm_subdiv.appendChild(elm_h5);
              elm_topdiv.appendChild(elm_subdiv);

              $("#" + insert_info_arr[0]).append(elm_topdiv);

              //$("#" + insert_info_arr[0]).append('<div class="card">');
              //$("#" + insert_info_arr[0]).append('<div class="card-body">');
              //$("#" + insert_info_arr[0]).append('<h5 class="card-title">' + highLitedAhref + '</h5>');
              //$("#" + insert_info_arr[0]).append('<p class="card-text">' + doHighLight(parameter,listById) + '</p>');
              //$("#" + insert_info_arr[0]).append('</div>');
              //$("#" + insert_info_arr[0]).append('</div>');

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