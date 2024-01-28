var searchFunc = function (path, search_id, content_id,baseurl) {
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
          var data_url = data.url.replace('/',"");
         //console.log(baseurl+data_url)
          //标签和分类
          var data_tags=data.tags.toString();
            if(data_tags!=""){
             data_tags= data_tags.toLowerCase();
             
            }
          var data_categories=data.categories.toString();
            if(data_categories!=""){
              data_categories=data_categories.toLowerCase();
            }

          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;

          var index_tag = -1;
          var index_categorie = -1;
          var status = 0;
          // only match artiles with not empty contents
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              keyword=keyword.toLowerCase();
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);
              
              index_tag = data_tags.indexOf(keyword);
              index_categorie = data_categories.indexOf(keyword);
  //console.log(index_tag + " sddd:"+index_categorie)
              if (index_title < 0 && index_content < 0 ) {
                 if(index_tag < 0 && index_categorie < 0){
                     isMatch = false;
                 }else{
                     if(index_tag >-1) { status = 3 ;}
                     if(index_categorie>-1) { status =4 ;} 
                 }
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
            var match_content = "";
             if(content != "" ){

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

                          match_content = content.substr(start, end);
                     }
            
          
                     
                     /*  // highlight all keywords
                       keywords.forEach(function (keyword) {
                          var regS = new RegExp(keyword, "gi");
                           match_content = match_content.replace(regS, "<em class='search-keyword'>" + keyword + "</em>");
                       });
                     */

                        var regS = new RegExp(keywords, "i");
                        match_content = match_content.replace(regS, "<em class='search-keyword'>" + keywords + "</em>");
                         //匹配标签，分类
                         if(match_content=="" && status > -1){
                            if( status == 3){
                               match_content = data.tags.toString().replace(regS, "tags: <em class='search-keyword'>" + keywords + "</em>");
                             }else{
                                 match_content = data.categories.toString().replace(regS, "categories: <em class='search-keyword'>" + keywords + "</em>");
                             }
                          }

                  //截取长度，只展示第一次匹配的内容
                 if(match_content.length>210){
                        var containerIndex = match_content.indexOf("<em class='search-keyword'>");
                        var startIndex = Math.max(0, containerIndex - 60);
                        var endIndex = Math.min(match_content.length, containerIndex + 99 + keywords.length);
                        match_content = match_content.substring(startIndex, endIndex);
                  }


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

