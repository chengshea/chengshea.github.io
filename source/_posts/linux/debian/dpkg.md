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
### dpkg



```
apt-get install xxx
....
Could not exec dpkg!
E: Sub-process /usr/bin/dpkg returned an error code (100)
```


```
 ls -l /usr/bin/dpkg #什么没有呀！！！
 find /usr -type f -name dpkg
 .....
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


##### 方法一
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



#### 参数

##### -i|--install



##### -r|--remove 



L|--listfiles   <软件包名> ...  列出属于指定软件包的文件。



##### -l | --list 

 [<表达式> ...]        简明地列出软件包的状态。

```shell
cs@debian:~/test$ sudo dpkg -l | grep api
ii  apipost6                             6.1.5                             amd64        
ii  libbrlapi0.6:amd64                   5.4-7+deb9u1                      amd64        braille display access via BRLTTY - shared library
ii  libglapi-mesa:amd64                  13.0.6-1+b2                       amd64        free implementation of the GL API -- shared library
```





### 解压deb

 

```
ar x   fileName.deb
```



```
xz -d  data.tar.xz
```



```
tar -zxvf   data.tar.gz
tar -xvf   data.tar
```

