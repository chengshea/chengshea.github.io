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
## dpkg



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


#### 方法一
```
 ar x  ~/文档/dpkg_1.17.27_amd64.deb data.tar.gz
 
 mkdir /tmp/dpkg
 cp data.tar.gz /tmp/dpkg
 cd /tmp/dpkg
 
 tar xfvz data.tar.gz ./usr/bin/dpkg
 
sudo cp ./usr/bin/dpkg /usr/bin/
sudo apt-get update
```
####  方法二

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



### 参数

#### -i | --install

```
sudo dpkg -i xxxxx_amd64.deb
```

> 修复包+依赖关系
>
> sudo apt-get install -f





#### -l | --list 

 [<表达式> ...]        简明地列出软件包的状态。

```shell
cs@debian:~$ dpkg -l | grep microsoft
hi  microsoft-edge-stable                103.0.1264.62-1                   amd64        The web browser from Microsoft

```



####  -L | --listfiles  

 <软件包名> ...  列出属于指定软件包的文件。

```
cs@debian:~$ dpkg -L  microsoft-edge-stable 
/.
/etc
/etc/cron.daily
/opt
/opt/microsoft
/opt/microsoft/msedge
/opt/microsoft/msedge/MEIPreload
....
```



####  -r|--remove 

```
cs@debian:~$ sudo dpkg -r  microsoft-edge-stable 
[sudo] cs 的密码：
(正在读取数据库 ... 系统当前共安装有 149708 个文件和目录。)
正在卸载 microsoft-edge-stable (103.0.1264.62-1) ...
正在处理用于 man-db (2.7.6.1-2) 的触发器 ...
正在处理用于 desktop-file-utils (0.23-1) 的触发器 ...
正在处理用于 mime-support (3.60) 的触发器 ...
```

> 连同配置文件一起删除(-P|--purge)
>
> dpkg -r --purge microsoft-edge-stable





查看处于rc状态的软件包 (清除所有已删除包的残余配置文件)

dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P





## apt-get

apt不向下兼容apt-get



### install

apt-get install  xxx



### search

搜索包含有xxx的软件包的名字 apt-cache search xxx



### remove

只删除软件包  apt-get remove xxx

删除相应的配置文件  apt-get remove  --purge xxx

依赖的软件包卸载掉 apt-get autoremove xxx 







## 解压deb

 

```
ar -vx   fileName.deb


dpkg -x typora_1.5.5-1_amd64.deb ./
```

https://commandnotfound.cn/linux/1/106/ar-%E5%91%BD%E4%BB%A4

```
xz -d  data.tar.xz
```



```
tar -zxvf   data.tar.gz
tar -xvf   data.tar
```

