---
title: dpkg
date: 2017-02-21 00:09:58
tags:
 - install
 - dpkg
categories:
 - linux 
 - debian
 - tools
---
#### 安装出错
```
apt-get install xxx
....
Could not exec dpkg!
E: Sub-process /usr/bin/dpkg returned an error code (100)
```
#### 查看dpkg
```
 ls -l /usr/bi/dpkg #什么没有呀！！！
 find /-name "*dpkg*"
 .....
 /usr/local/dpkg-dev
```
  <!--more--> 
 那执行
```
 apt-get install dpkg  
 ....
 显示已安装 **使用方法一**
```

 搜索 **dpkg debian download **
 [download](https://packages.debian.org/jessie/dpkg)


###### 方法一
```
 ar x  ~/文档/dpkg_1.17.27_amd64.deb data.tar.gz
 
 mkdir /tmp/dpkg
 cp data.tar.gz /tmp/dpkg
 cd /tmp/dpkg
 
 tar xfvz data.tar.gz ./usr/bin/dpkg
 
sudo cp ./usr/bin/dpkg /usr/bin/
sudo apt-get update
```
#####  方法二

`./configure`
configure: error: libbz2 library or header not found
See `config.log' for more details
安装 **libbz2**
https://packages.debian.org/jessie/libbz2-1.0

configure: error: liblzma library or header not found
See `config.log' for more details
安装 **liblzma**
https://packages.debian.org/jessie/liblzma5

configure: error: no curses library found
安装 ** curses  **
https://packages.debian.org/jessie/libncurses5-dev

