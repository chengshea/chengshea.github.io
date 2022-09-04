var searchFunc = function (path, search_id, content_id) {
  // 0x00. environment initialization
  'use strict';
  var $input = document.getElementById(search_id);
  var $resultContent = document.getElementById(content_id);
  $resultContent.innerHTML = "<ul><span class='local-search-empty'>首次搜索，正在载入索引文件，请稍后……<span></ul>";
  $.ajax({
    // 0x01. load xml file
    url: path,
    dataType: "json",
    success: function (datas) {
      $resultContent.innerHTML = "";
      $input.addEventListener('input', function () {
        // 0x03. parse query to keywords list
        var str = '<ul class=\"search-result-list\">';
        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
        $resultContent.innerHTML = "";
        if (this.value.trim().length <= 0) {
          return;
        }
        // 0x04. perform local searching
        datas.forEach(function (data) {
          var isMatch = true;
          var content_index = [];
          if (!data.title || data.title.trim() === '') {
            data.title = "Untitled";
          }
          var orig_data_title = data.title.trim();
          var data_title = orig_data_title.toLowerCase();
           if (!data.content || data.content.trim() === '') {
                    data.content = "no content";
            }
          var orig_data_content = data.content.trim().replace(/<[^>]+>/g, "");
          var data_content = orig_data_content.toLowerCase();
          var data_url = data.url;
          //标签和分类
          var data_tags=data.tags;
            if(data_tags!=""){
              console.log("tags:"+data_tags)
             data_tags= data_tags.toLowerCase();
            }
          var data_categories=data.categories;
            if(data_categories!=""){
              data_categories=data_categories.toLowerCase();
            }

          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          // only match artiles with not empty contents
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);
              
              index_tag = data_tags.indexOf(keyword);
              index_categorie = data_categories.indexOf(keyword);

              if (index_title < 0 && index_content < 0 && index_tag < 0 && index_categorie < 0) {
                isMatch = false;
              } else {
                if (index_content < 0) {
                  index_content = 0;
                }
                if (i == 0) {
                  first_occur = index_content;
                }
                // content_index.push({index_content:index_content, keyword_len:keyword_len});
              }
            });
          } else {
            isMatch = false;
          }
          // 0x05. show search results
          if (isMatch) {
            str += "<li><a href='" + data_url + "' class='search-result-title' target='_blank'>" + orig_data_title + "</a>";
           
            var content = orig_data_content;
             if(content===""){

             }
            if (first_occur >= 0) {
              // cut out 100 characters
              var start = first_occur - 30;
              var end = first_occur + 100;

              if (start < 0) {
                start = 0;
              }

              if (start == 0) {
                end = 100;
              }

              if (end > content.length) {
                end = content.length;
              }

              var match_content = content.substr(start, end);

              // highlight all keywords
              keywords.forEach(function (keyword) {
                var regS = new RegExp(keyword, "gi");
                match_content = match_content.replace(regS, "<em class='search-keyword'>" + keyword + "</em>");
              });
               let index=match_content.indexOf("<em class='search-keyword'>");
               match_content=match_content.substr(index-20,index+50);

              str += "<p class=\"search-result\">" + match_content + "...</p>"
            }
            str += "</li>";
          }
        });
        str += "</ul>";
        if (str.indexOf('<li>') === -1) {
          return $resultContent.innerHTML =  "<ul><span class='local-search-empty'>没有找到内容，请尝试更换检索词。<span></ul>";
        }
        $resultContent.innerHTML =  str;
      });
    }
  });

}

