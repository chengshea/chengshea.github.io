---
title: hexo插件
permalink: node/npm/hexo/
tags:
  - hexo
  - search
categories:
  - lang 
  - npm
date: 2022-08-20 13:24:54
---






## 本地搜索

```
npm install --save hexo-generator-search
```

<!--more-->

### hexo

_config.yml

```
search:
  path: search.json
  field: all
  content: true
  limit: 1000
```





### 主题spfk

#### _config.yml

```
search_box: true
```

#### 左侧left-col.ejs

/hexo/themes/spfk/layout/_partial/left-col.ejs

```ejs
<div id="id_search"   onclick = "document.getElementById('local_search').style.display='block'">
 <span class="search-icon">
	<i class="fa fa-search"> </i>
   </span> 搜索
</div>
```

#### 弹出层layout.ejs

/hexo/themes/spfk/layout/layout.ejs

```ejs
<div id="local_search" class="search-popup" >
  <div class="search-header">
	    <i class="fa fa-search"> </i> <input id="local-search-input" class="search-input" placeholder="搜索..." spellcheck="false" type="search"/>
  </div>
  <div id="local-search-result"></div>
</div>
```

####  触发搜索 after-footer.ejs

/hexo/themes/spfk/layout/_partial/after-footer.ejs

##### 引入search.js

```js
<%- js('js/jquery-1.9.1.min') %>
<%- js('js/search') %>

<% if (theme.search_box) { %>
   <script type="text/javascript">
	var inputArea       = document.querySelector("#local-search-input");
	inputArea.onclick   = function(){ getSearchFile(); this.onclick = null }
	inputArea.onkeydown = function(){ if(event.keyCode == 13) return false }
	var getSearchFile = function(){
	      searchFunc("<%= config.root %>" + "search.json", 'local-search-input', 'local-search-result');
	}
          $(document).on('click', function(e) {
		   var si= $(e.target).closest('#id_search').length;
           var d= $(e.target).closest('#local_search').length;
             if(si==1){ 
			document.body.style.overflow='hidden';
		}
             if( si==0 && d==0){
              document.body.style.overflow=''
               $('#local_search').hide();
              }    

       });

  </script>
<% } %>
```

##### search.js

/hexo/themes/spfk/source/js/search.js

```js
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
                         console.log(data.content)//空文章
                      data.content = "no content";
                 }
          var orig_data_content = data.content.trim().replace(/<[^>]+>/g, "");
          var data_content = orig_data_content.toLowerCase();
          var data_url = data.url;
     
          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          // only match artiles with not empty contents
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);

              if (index_title < 0 && index_content < 0) {
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
            if (first_occur >= 0) {
              // cut out 100 characters
              var start = first_occur - 20;
              var end = first_occur + 10;

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
                match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
              });

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
```

##### css

/hexo/themes/spfk/source/css/search.css

```css

.search-popup {
  display: none;
  background: #32503d;
  border-radius: 5px;
  height: 80%;
  left: calc(50% - 350px);
  position: fixed;
  top: 10%;
  width: 700px;
  z-index: 1500;
}

.search-popup .search-header {
  background: #eee;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  padding: 5px;
}
.search-popup input.search-input {
  background: transparent;
  border: 0;
  outline: 0;
  width: 100%;
}


.search-popup ul.search-result-list {
  margin: 0 5px;
  padding: 0;
  width: 100%;
 
}

ul.search-result-list li::marker {
 content: '😩';
}


.search-popup p.search-result {
  border-bottom: 2px dashed #7de485d4;
  padding: 5px 0;
  line-height: 21px;
}
.search-popup a.search-result-title {
  font-weight: bold;
}
.search-popup .search-keyword {
  border-bottom: 1px dashed #ff2a2a;
  color: #ff2a2a;
  font-weight: bold;
}
.search-popup #local-search-result{
  display: flex;
  height: calc(100% - 55px);
  overflow: auto;
  padding: 5px 25px;
}
.search-popup #no-result {
  color: #ccc;
  margin: auto;
}
```



## live2d

### helper

```
npm install --save hexo-helper-live2d
```



_config.yml

```
live2d:
enable: true
scriptFrom: local
model: 
  use: live2d-widget-model-hibiki #模型选择
display: 
  position: right  #模型位置
  width: 150       #模型宽度
  height: 300      #模型高度
mobile: 
  show: false      #是否在手机端显示
```



### js  推荐

放在合适位置 footer.ejs  

```
<script src="https://eqcn.ajz.miesnfu.com/wp-content/plugins/wp-3d-pony/live2dw/lib/L2Dwidget.min.js"></script>
<script>
    L2Dwidget.init({
        "model": {
　　　　　　　//jsonpath控制显示那个小萝莉模型
            jsonPath: "https://unpkg.com/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json",
            "scale": 1
        },
        "display": {
            "position": "right", //看板娘的表现位置
            "width": 150,  //小萝莉的宽度
            "height": 300, //小萝莉的高度
            "hOffset": 0,
            "vOffset": -20
        },
        "mobile": {
            "show": true,
            "scale": 0.5
        },
        "react": {
            "opacityDefault": 0.7,
            "opacityOnHover": 0.2
        }
    });
</script>
```

