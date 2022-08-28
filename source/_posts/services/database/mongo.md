---
title: mongodb
permalink: database/mongo/
tags:
  - mongodb
categories:
  - database
date: 2022-07-13 21:16:06
---



# linux 环境

## 下载 

wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian81-3.4.4.tgz

```
tar zxvf mongodb*.tar
mv /opt/mongo*  /opt
cd /opt/mongodb*  && touch  mongodb.conf
```

## 配置文件

```
dbpath=/home/cs/Download/mongodb/data #数据库路径
logpath=/home/cs/Download/mongodb/data/logs/mongodb.log #日志输出文件路径
logappend=true #错误日志采用追加模式，配置这个选项后mongodb的日志会追加到现有的日志文件，而不是从新创建一个新文件
journal=true #启用日志文件，默认启用
quiet=true #这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false
port=27017 #端口号 默认为27017
```

启动

```
cs@debian:/opt/mongodb-3.4.4/bin$ ./mongod  --config  /opt/mongodb-3.4.4/mongodb.conf
```


后台运行

```
mongo  -f   mongo.conf   & 
```


使用 fork 必须加上logpath

```
mongo   --fork  --logpath=log/mongodb.log   

```

多条命令执行时 &&  可以把 fork配置到conf


```
echo   { \
                echo 'dbpath=/data/db'; \
                echo 'port=27017'; \
                echo 'logpath=/data/mongo.log'; \
                echo 'logappend=true'; \
                echo 'fork=true'; \
             } > mongod.conf  
```



## 启动

mongo-start.sh

```
#!/bin/bash
cd /opt/mongodb-3.4.4/bin 
./mongod  --config  /opt/mongodb-3.4.4/mongodb.conf  &
exit
!
```



# win 环境

下载  http://dl.mongodb.org/dl/win32/x86_64
zip 免安装包



启动

```
E:\MongoDB\Server\bin>mongod.exe --config  E:\MongoDB\mongo.conf
```

mongo.conf

```
dbpath=E:\MongoDB\data #数据库路径
logpath=E:\MongoDB\logs\mongodb.log #日志输出文件路径
logappend=true #错误日志采用追加模式，配置这个选项后mongodb的日志会追加到现有的日志文件，而不是从新创建一个新文件
journal=true #启用日志文件，默认启用
quiet=true #这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false
port=27017 #端口号 默认为27017
```

打开 http://127.0.0.1:27017/ 
It looks like you are trying to access MongoDB over HTTP on the native driver port.

## 安装服务

管理员cmd
E:\MongoDB\Server\bin>`mongod --install --serviceName "MongoDB" --config` "E:\MongoDB\mongo.conf"
E:\MongoDB\Server\bin>  `net  start MongoDB`  

## 删除服务

`sc delete MongoDB`





https://www.runoob.com/mongodb/mongodb-connections.html