---
title: tree工具
permalink: linux/shell/tree/
tags:
  - tree
categories:
  - linux
  - shell
date: 2022-07-30 21:55:42
---





### 目录层级 -Ld

-d 目录

-L  level 层级



```
cs@debian:/$ tree -Ld  1
.
├── bin
├── boot
├── dev
├── etc
├── home
├── lib
├── lib64
├── lost+found
├── media
├── mnt
├── opt
├── proc
├── root
├── run
├── sbin
├── snap
├── srv
├── sys
├── tmp
├── usr
└── var
```



### 路径前缀 -f

-f   打印路径的前缀(根据命令指定显示)

```
cs@debian:/opt/apache$ tree -Ldf  1 ./
.
├── ./apache-maven-3.8.6
├── ./kafka-2.1.1
├── ./maven-3.6.0
├── ./tomcat-8.5.38
└── ./zookeeper-3.4.13

5 directories
cs@debian:/opt/apache$ tree -Ldf  1 /opt/apache/
/opt/apache
├── /opt/apache/apache-maven-3.8.6
├── /opt/apache/kafka-2.1.1
├── /opt/apache/maven-3.6.0
├── /opt/apache/tomcat-8.5.38
└── /opt/apache/zookeeper-3.4.13

5 directories
```



<!--more-->



### 过滤 -I



```
cs@debian:~/oss/0s$ tree -L 3  -I "src|target" ./spring-boot/cs-framework/  ./spring-boot/cs-framework/
├── cs-msc
│   ├── lib
│   │   ├── json-jena-1.0.jar
│   │   └── Msc.jar
│   ├── msc
│   │   ├── libmsc32.so
│   │   ├── libmsc64.so
│   │   ├── msc32.dll
│   │   └── msc64.dll
│   ├── pom.xml
│   └── READER.md
├── cs-ocr
│   ├── libs
│   │   └── ocr_sdk-1.3.6.jar
│   └── pom.xml
└── pom.xml

5 directories, 11 files
```



```
cs@debian:~/oss/0s$ tree -L 3  -I *.jar* ./spring-boot/cs-framework/  
./spring-boot/cs-framework/
├── cs-msc
│   ├── lib
│   ├── msc
│   │   ├── libmsc32.so
│   │   ├── libmsc64.so
│   │   ├── msc32.dll
│   │   └── msc64.dll
│   ├── pom.xml
│   ├── READER.md
│   ├── src
│   │   └── main
│   └── target
│       ├── classes
│       ├── generated-sources
│       ├── maven-archiver
│       └── maven-status
├── cs-ocr
│   ├── libs
│   ├── pom.xml
│   ├── src
│   │   └── main
│   └── target
│       ├── classes
│       ├── generated-sources
│       ├── maven-archiver
│       └── maven-status
└── pom.xml

19 directories, 8 files
```





### 匹配 -P

```
cs@debian:~/oss/0s$ tree -L 3 -P *xml -I "src|target" ./spring-boot/cs-framework/  
./spring-boot/cs-framework/
├── cs-msc
│   ├── lib
│   ├── msc
│   └── pom.xml
├── cs-ocr
│   ├── libs
│   └── pom.xml
└── pom.xml

5 directories, 3 files
```



### 大小时间 -ts

-t 时间排序(默认从旧到新,r反序)

-s 大小

```
cs@debian:/opt/apache$ tree -Ldrts  1 /opt/apache/
/opt/apache/
├── [       4096]  apache-maven-3.8.6
├── [       4096]  tomcat-8.5.38
├── [       4096]  maven-3.6.0
├── [       4096]  kafka-2.1.1
└── [       4096]  zookeeper-3.4.13

5 directories
```



### 权限角色 -pus

-p 权限

-u  角色

-g 组

```
cs@debian:/opt/apache$ tree -Ldpu  1 /opt/apache/
/opt/apache/
├── [drwxr-xr-x cs      ]  apache-maven-3.8.6
├── [drwxr-xr-x cs      ]  kafka-2.1.1
├── [drwxr-xr-x cs      ]  maven-3.6.0
├── [drwxr-xr-x cs      ]  tomcat-8.5.38
└── [drwxr-xr-x cs      ]  zookeeper-3.4.13

5 directories

```







### 着色 -C

-n 关闭

-C 打开

```shell
cs@debian:/opt/apache$ tree -LdC  1 /opt/apache/
/opt/apache/
├── [       4096]  apache-maven-3.8.6
├── [       4096]  tomcat-8.5.38
├── [       4096]  maven-3.6.0
├── [       4096]  kafka-2.1.1
└── [       4096]  zookeeper-3.4.13

5 directories

```





### 格式  -j

 -i 不打印虚线

-X xml格式 

-J   json格式

```
cs@debian:/opt/apache$ tree -Ldrtsi  1 /opt/apache/
/opt/apache/
[       4096]  apache-maven-3.8.6
[       4096]  tomcat-8.5.38
[       4096]  maven-3.6.0
[       4096]  kafka-2.1.1
[       4096]  zookeeper-3.4.13

5 directories
cs@debian:/opt/apache$ tree -LdrtsX  1 /opt/apache/
<?xml version="1.0" encoding="UTF-8"?>
<tree>
  <directory name="/opt/apache/">
    <directory name="apache-maven-3.8.6" size="4096">
    </directory>
    <directory name="tomcat-8.5.38" size="4096">
    </directory>
    <directory name="maven-3.6.0" size="4096">
    </directory>
    <directory name="kafka-2.1.1" size="4096">
    </directory>
    <directory name="zookeeper-3.4.13" size="4096">
    </directory>
  </directory>
  <report>
    <directories>5</directories>
  </report>
</tree>
cs@debian:/opt/apache$ tree -LdrtsJ  1 /opt/apache/
[
  {"type":"directory","name":"/opt/apache/","contents":[
    {"type":"directory","name":"apache-maven-3.8.6","size":4096,"contents":[
    ]},
    {"type":"directory","name":"tomcat-8.5.38","size":4096,"contents":[
    ]},
    {"type":"directory","name":"maven-3.6.0","size":4096,"contents":[
    ]},
    {"type":"directory","name":"kafka-2.1.1","size":4096,"contents":[
    ]},
    {"type":"directory","name":"zookeeper-3.4.13","size":4096,"contents":[
    ]}
  ]},
  {"type":"report","directories":5}
]
```



