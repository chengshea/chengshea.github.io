---
title: kibana
date: 2017-01-25 21:34:20
tags:
 - install
 - win
categories:
 - ELK
 - kibana
---

#### debian
```
$>sudo dpkg -i kibana-4.6.1-amd64.deb
$>dpkg -L  kibana 
```
 
#### win
[nssm](#)

#### 创建索引
** logstash.conf **  
 <!--more--> 
```
output {
    elasticsearch {
        hosts => ["127.0.0.1:9200"]
        index => "logstash-nginx-json-%{+YYYY.MM}"
    }
   stdout {codec => rubydebug}
}
```
* 只有日志输入到es，才会触发创建索引