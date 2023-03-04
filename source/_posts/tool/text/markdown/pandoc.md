---
title: pandoc文本格式转换
permalink: tool/text/markdown/pandoc/
tags:
  - format
  - md
  - html
categories:
  - markdown
  - pandoc
date: 2022-09-03 19:52:46
---

###  pandoc

pandoc 标记语言转换工具，可实现不同标记语言间的格式转换

在线转换测试 https://pandoc.org/try/

下载 https://github.com/jgm/pandoc/releases/tag/2.19.2

#### linux

##### html 转 md

```shell
 /opt/tools/pandoc-2.19.2/bin/pandoc -i  test.html  --to markdown_github -o test.md
```

别名

<!--more-->

```shell
$ cat  >> ~/.bashrc <<EOF 
######### custom start###########
CMD(){
  url=~/.local/custom/$1
  [ -f "$url" ] && source $url
}

if [ -f "/opt/tools/pandoc-2.19.2/bin/pandoc" ] ; then 
   CMD pandoc.sh
   alias tom='htomd $1 $2'
fi
######### custom end###########
EOF

```

~/.local/custom/pamdoc.sh

```shell
tomd(){
   [ "help" == $1  -o -z "$1"  ] && { echo "eg: tom xx.html xxx.md" && return; }
   echo "pandoc from html to md"
  /opt/tools/pandoc-2.19.2/bin/pandoc -i  $1  --to markdown_github -o $2
}
```



```shell
tom   /xx/xx.html    /xxx/xxxx.md
```





#### 文档

https://www.pandoc.org/demos.html#

