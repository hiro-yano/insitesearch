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
        //var listById_dom = out_html.getElementById(insert_info_arr[1])[0];
        alert("dom name:" + listById_dom.childNodes[0].textContent);

        var listById = '';
        if (!listById_dom.hasChildNodes()) {
          getAllChildsTexts(listById_dom.childNodes, function(childTextContent){
            listById = listById + childTextContent;
          });
        }
        
        alert("dom:" + listById_dom + ":" + listById);

        var str_count = 0;
        str_count += strCount(parameter,listById);
        str_count += strCount(parameter,title);
        

        if ( str_count != 0) {

              var ahref = '<a href="' + html_url + '">'+ title +'</a><br>';

              $("#" + insert_info_arr[0]).append(ahref);
              $("#" + insert_info_arr[0]).append(listById_innerHTML);

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
 
    var count = 0, pos = str.indexOf(searchStr);
    
    while (pos !== -1) {
        count++;
        pos = str.indexOf(searchStr, pos + 1);
    }
 
    return count;
};

var getAllChildsTexts = function(child,createResult){
    if(!child || !createResult) return '';

    var i;
    for(i = 0; i< child.length; i++){
      createResult(child[i].textContent);
      alert(child[i].textContent);

      if (child[i].hasChildNodes()) {
        getAllChildsTexts(child[i].childNodes,createResult);
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