---
title: 安装elasticsearch
date: 2017-01-25 19:56:10
tags:  
 - search
 - install
 - win
categories: 
 - ELK
 - elasticsearch
---
## elasticsearch 目录结构

|type | description | location |
|-------|---------------------|-------|
|home | Home of elasticsearch installation |	/usr/share/elasticsearch 
| bin	| Binary scripts including elasticsearch to start a node |	/usr/share/elasticsearch/bin
|conf	| Configuration files elasticsearch.yml and logging.yml	|/etc/elasticsearch
|conf |Environment variables including heap size,file descriptors	|/etc/default/elasticsearch
|data	| The location of the data files	|/var/lib/elasticsearch/
|logs	| Log files location	|/var/log/elasticsearch
|plugins	| Plugin files location	|/usr/share/elasticsearch/plugins

下载地址

####  window7
bin目录执行安装
```
F:\ELK\elasticsearch-2.4.1\bin>service install
Installing service      :  "elasticsearch-service-x64"
Using JAVA_HOME (64-bit):  "F:\java\jdk8"
The service 'elasticsearch-service-x64' has been installed.
```
安装成功，如果启动失败（进logs目录，查看错误信息）
 <!--more--> 
```
[error] [ 6376] Failed creating java %JAVA_HOME%\jre\bin\server\jvm.dll
 [error] [ 6376] 系统找不到指定的路径。
 ```
 直接利用管理服务
 ```
 #运行 service manager 会弹出服务管理界面 修改jvm指定路径
F:\ELK\elasticsearch-2.4.1\bin>service manager
```

#### debian8
```
sudo dpkg -i  elasticsearch-2.4.2.deb
bin$> ./elasticsearch   #启动提示没有权限
```
需要授权执行命令** chmod +x bin/elasticsearch  ** 
再次执行** ./elasticsearch -d **即可后台启动 
使用** ps aux|grep elasticsearch **可以查看是否启动

**设置开机启动**
创建脚本 start.sh
```
#!bin/bash
export JAVA_HOME=/usr/bin/java
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
 #切换到cs用户（带环境变量）
su -cs<<!
cd /opt/elasticsearch/bin
./elasticsearch &
exit
!
```
修改启动文件 mousepad /etc/init.d/elasticsearch
```
#!bin/bash
### BEGIN INIT INFO
# Provides:          elasticsearch
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-De.ion: starts the elasticsearch  server
# De.ion:       starts elasticsearch using start-stop-daemon
### END INIT INFO
sh /opt/elasticsearch/start.sh
```
