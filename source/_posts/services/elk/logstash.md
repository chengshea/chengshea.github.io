---
title: logstash
date: 2017-01-25 21:27:53
tags:
 - log
 - install
 - win
categories:
 - ELK
 - logstash
---

#### debian安装
```
 $>sudo dpkg -i logstash-2.4.1_all.deb
$> dpkg -L  logstash
```
#### win安装
service工具 [nssm](#)
 <!--more--> 
#### 配置
logstash.conf
```
input {
    file {
        path => [ "F:/ELK/nginx-1.10.2/logs/access.log" ]
		type => "nginx_access"
        start_position => "beginning"
        ignore_older => 0
    }
	file {
        path => [ "F:/ELK/nginx-1.10.2/logs/access_json.log" ]
		#codec => "json"
		type => "nginx_json"
        start_position => "beginning"
        ignore_older => 0
    }
}

filter {
 if [type] == "nginx_access" {
    grok {
	    patterns_dir => "F:/ELK/logstash-2.4.1/patterns"        #设置自定义正则路径
        match => { "message" => "%{NGINXACCESS}" }
    }


    date {
      match => [ "log_timestamp","dd/MMM/yyyy:HH:mm:ss Z"]

    }
   
  }
  
  if [type] == "nginx_json" {
        json {
            source => "message"
            #target => "doc"
            remove_field => ["message"]
        }
		if [@fields][ip] != "-" {
			geoip {
					source => "[@fields][ip]"
 					target => "geoip"
					fields => ["city_name", "continent_code", "country_code3", "country_name", "ip", "postal_code", "region_name"]
					database => "F:/ELK/logstash-2.4.1/ip/GeoLiteCity.dat"
					add_field => [ "[geoip][coordinates]", "%{[geoip][longitude]}" ]
					add_field => [ "[geoip][coordinates]", "%{[geoip][latitude]}"  ]
			}
		
			mutate {
					convert => [ "[geoip][coordinates]", "float"]
					
			}
   
		}
 	}
 
}
output {
 if [type] == "nginx_access" {
    elasticsearch {
        hosts => ["127.0.0.1:9200"]
        index => "logstash-nginx-access-%{+YYYY.MM}"
    }
   stdout {codec => rubydebug}
  }
  if [type] == "nginx_json" {
    elasticsearch {
        hosts => ["127.0.0.1:9200"]
        index => "logstash-nginx-json-%{+YYYY.MM}"
    }
   stdout {codec => rubydebug}
  }
 
}
```