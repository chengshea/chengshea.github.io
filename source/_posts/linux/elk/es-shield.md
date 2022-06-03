---
title: shield
date: 2017-10-20 19:36:33
tags: 
  - auth
  - safe
categories: 
 - ELK
 - elasticsearch
---

### 简介
  **Shield**拦截所有对ElasticSearch的请求，并加上认证与加密，保障ElasticSearch及相关系统的安全性
  
  [<span id='top'>安装 doc</span>]( https://www.elastic.co/guide/en/shield/2.4/installing-shield.html)
 
### 准备

版本2.4.2{% post_link 安装ElasticSearch 安装ElasticSearch %}
 <!--more--> 
**以下操作需要你安装了elasticsearch为前提**



* [license-2.4.2](https://download.elastic.co/elasticsearch/release/org/elasticsearch/plugin/license/2.4.2/license-2.4.2.zip)
* [shield-2.4.2](https://download.elastic.co/elasticsearch/release/org/elasticsearch/plugin/shield/2.4.2/shield-2.4.2.zip)

### 安装
**以es，插件为<span id='custom'>自定义</span>目录为背景**

es自定义目录**/opt/elasticsearch**

安装脚本**plugin**注意下面变量值

* CONF_DIR (elasticsearch.yml目录)
 `CONF_DIR="/opt/elasticsearch/config"`
* ES_ENV_FILE (elasticsearch目录)
 `ES_ENV_FILE="/opt/elasticsearch/config/default/elasticsearch"`

license
```
cs@debian:/opt/elasticsearch$ bin/plugin install file:///home/cs/Download/license-2.4.2.zip
```
>Installed license into /home/cs/Download/es/plugins/license


shield
```
cs@debian:/opt/elasticsearch$ bin/plugin install file:///home/cs/Download/shield-2.4.2.zip
```
 >Installed license into /home/cs/Download/es/plugins/shield
 
安装成功目录（部分）
```
cs@debian:/opt/elasticsearch$ tree -L 3 /opt/elasticsearch
/opt/elasticsearch
├── bin
│   ├── elasticsearch
│   ├── elasticsearch.in.sh
│   ├── elasticsearch-systemd-pre-exec
│   ├── plugin
│   ├── shield
│   │   ├── esusers  添加角色密码脚本
│   │   ├── esusers.bat
│   │   ├── migrate
│   │   ├── migrate.bat
│   │   ├── syskeygen
│   │   └── syskeygen.bat
│   └── watcher
│       ├── croneval
│       └── croneval.bat
├── config
│   ├── default
│   │   └── elasticsearch
│   ├── elasticsearch.yml
│   ├── logging.yml
│   ├── scripts
│   └── shield
│       ├── logging.yml
│       ├── role_mapping.yml
│       ├── roles.yml
│       ├── users
│       └── users_roles
├── lib
```

### 添加新用户

执行脚本**esusers**需要注意参数
* CONF_DIR ( 判断 $CONF_DIR/shield 目录)
   后面密码会写入到配置文件（usersusers_roles）内
* ES_CLASSPATH (shield 生成密码的执行类)
  ```
  java -cp org.elasticsearch.shield.authc.esusers.tool.ESUsersTool
  ```
  
ESUsersTool类在shield插件目录**shield-2.4.2.jar**
  
  **注意** [自定义目录](#custom)即 *plugins* 不再 *ES_HOME* 目录下，执行脚本需要确认**ES_CLASSPATH**位置正确
  
  1.添加变量 ES_PLUGIN
  ```shell
  ES_PLUGIN=`dirname $(sed -n 's/path.plugins://p'  $ES_HOME/config/elasticsearch.yml)`
```
   2.修改
  ```shell
#ES_CLASSPATH="$ES_CLASSPATH:$ES_HOME/plugins/shield/*"
ES_CLASSPATH="$ES_CLASSPATH:$ES_PLUGIN/plugins/shield/*"  
```

<br/>

执行添加命令[文档](#top)
```
cs@debian:/opt/elasticsearch$ ./bin/shield/esusers useradd cs -p cs@121 -r admin
```
>useradd 添加的新用户名 cs <br/>
-p  密码   cs@121    <br/>
-r  角色（role） admin  <br/>

启动
```
cs@debian:/opt/elasticsearch$ ./bin/elasticsearch -d
```
>cs@debian:`$ curl -u cs  "http://localhost:9200/?pretty"  <br/>
Enter host password for user 'cs': <br/>
{ <br/>
  "name" : "Sepulchre",<br/>
  "cluster_name" : "elasticsearch",<br/>
  "cluster_uuid" : "Ey7sWEIPRZGstn2LSKCCTQ",<br/>
  "version" : {<br/>
    "number" : "2.4.2",<br/>
    "build_hash" : "161c65a337d4b422ac0c805f284565cf2014bb84",<br/>
    "build_timestamp" : "2016-11-17T11:51:03Z",<br/>
    "build_snapshot" : false,<br/>
    "lucene_version" : "5.5.2"<br/>
  },<br/>
  "tagline" : "You Know, for Search"<br/>
}


### 总结
注意脚本运行，主要参数（变量）值
