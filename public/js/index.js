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

  

　$("#list_dashboard").load("dashboard.html #target-area-list li");
  
  var parameter = getParameter();
  if(parameter != ''){
    var e = document.getElementById('list');
    var elemLi = document.createElement('li');    //  要素を生成
    elemLi.textContent =  parameter               //  文字列設定
    e.appendChild(elemLi);                        //  要素を追加
  }

  
  $.get("dashboard.html", function(html_string)
   {
      var out_html = $.parseHTML(html_string);//parse
      alert(out_html);
      alert(out_html.filter('#target-area-list')[0].innerHTML);
      //$("#list").append($(html_string).find('#target-area-list').text())
      $('#list').append(out_html.filter('#target-area-list')[0].innerHTML);//insert
   },'html');    // this is the change now its working

  
});


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
    return decodeURI(urlParam)
  }else{
    return ''
  }
 
}