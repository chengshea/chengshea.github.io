---
title: 草稿
permalink: draft/
tags:
  - 草稿
categories:
  - draft
date: 2022-08-21 18:48:03
---





```
hexo new draft <title> 
```

> 发布到 source/_drafts/<title>.md



```
hexo publish url  <title> 
```

> 正式发布



```
hexo s --draft 
```





```
scp -r  ./themes   root@36.138.204.26:/opt/hexo/   #L2Dwidget;
```



```
	    L2Dwidget.init({
		"model": {
	　　　　　　　//jsonpath控制显示那个小萝莉模型，haru01/haru01  haru02/haru02  hibiki/hibiki  hijiki/hijiki
		    //jsonPath: "https://xxxxx/assets/hijiki.model.json",
		     jsonPath: "<%- config.root %>models/haru01/haru01.model.json",
		    "scale": 1
		},
		"display": {
		    "position": "right", //看板娘的表现位置
		    "width": 150,  //小萝莉的宽度
		    "height": 330, //小萝莉的高度
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
```
