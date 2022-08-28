---
title: grep常用过滤
permalink: linux/shell/grep/
tags:
  - grep
categories:
  - linux
  - shell
date: 2022-07-31 16:41:22
---



### 前后行 A B C

grep -A 显示匹配指定内容及之后的n行

grep -B 显示匹配指定内容及之前的n行

grep -C  显示匹配指定内容及其前后各n行

```shell
cs@debian:~/oss/hexo$ cat /opt/nginx/logs/k8s-access.log | grep -C 5 "2022:15:43:27"
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:22 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:23 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:24 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:25 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:26 +0800] 502 0
127.0.0.1 - 192.168.56.103:6443, 192.168.56.101:6443, 192.168.56.102:6443 - [31/Jul/2022:15:43:27 +0800] 502 0, 0, 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:28 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:29 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:30 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:30 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:31 +0800] 502 0
```



### 与操作  

多次匹配

```shell
cs@debian:~/oss/hexo$ cat /opt/nginx/logs/k8s-access.log | grep "2022:15:43:2" | grep 502
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:20 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:21 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:21 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:22 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:23 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:24 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:25 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:26 +0800] 502 0
127.0.0.1 - 192.168.56.103:6443, 192.168.56.101:6443, 192.168.56.102:6443 - [31/Jul/2022:15:43:27 +0800] 502 0, 0, 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:28 +0800] 502 0
127.0.0.1 - k8s-apiserver - [31/Jul/2022:15:43:29 +0800] 502 0
```



### 或操作 |

<!--more-->

```shell
cs@debian:~/oss/hexo$ cat /opt/nginx/logs/k8s-access.log | grep "502\|15:43:3\|kube-apiserver"

```

>grep  -E  "502|15:43:3|kube-apiserver"
>
>egrep   "502|15:43:3|kube-apiserver"
>
>awk  "502|15:43:3|kube-apiserver"   file





### 特殊字符 fgrep

搜索文件包含正则表达式元字符串时,例如`$`、`^`、`/`等，`fgrep`很有用

```shell
cs@debian:~/oss/hexo$ egrep "^Hello"  12
cs@debian:~/oss/hexo$ grep "^Hello"  12
cs@debian:~/oss/hexo$ fgrep "^Hello"  12
^Hello\
```

它`不解析正则表达式`、想搜什么就跟什么



### 压缩文件  zgrep

```shell
zgrep  pattern1  ./*   |  grep  pattern2
```

>zegrep  
>
>
>zcat file1.gz file2.gz
