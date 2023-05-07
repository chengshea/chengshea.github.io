---
title: 科学上网
date: 2017-10-27 12:36:33
tags:
  - online
  - private-cs
categories:
  - other
---

### 准备
  有时候因工作需要，查询资料，下载，就需要科学上网

  **linux 环境下**
  * pip 
  * shadowsocks


### 安装
pip
```
wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
```
shadowsocks
```
$sudo pip install shadowsocks 
```
 <!--more--> 
### 配置
####  服务端
ss.json
```json
{
    "server":"server_ip",
    "server_port":8888,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"mypassword",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```
多号
```json
{
    "server": "server_ip",
    "local_address": "127.0.0.1",
    "local_port": 1080,
    "port_password": {
        "8881": "aaaa81",  
        "8882": "aaaa82",
        "8883": "aaaa83",
        "8884": "aaa84"
    },
    "timeout": 300,
    "method": "aes-256-cfb",
    "fast_open": false
}
```



| Name          | Explanation                                                  |
| ------------- | ------------------------------------------------------------ |
| server        | the address your server listens                              |
| server_port   | server port                                                  |
| local_address | the address your local listens                               |
| local_port    | local port                                                   |
| password      | password used for encryption                                 |
| timeout       | in seconds                                                   |
| method        | default: "aes-256-cfb", see [Encryption](https://github.com/shadowsocks/shadowsocks/wiki/Encryption) |
| fast_open     | use [TCP_FASTOPEN](https://github.com/shadowsocks/shadowsocks/wiki/TCP-Fast-Open), true / false |
| workers       | number of workers, available on Unix/Linux                   |

fast_open

```
echo 3 > /proc/sys/net/ipv4/tcp_fastopen
```

>0 关闭
>
>1  客户端使用fastopen  ，默认
>
>2  服务端使用fastopen
>
>3  无论客户端，服务端都使用 TFO功能

**ssserver --help**

` -d start/stop/restart`
```
ssserver  -c  /xx/ss.json  -d start
```

#### 客户端
ss.json
```
$cat  /xx/ss.json
{
    "server": "server_ip",
    "server_port": 443,
    "password": "mypassword",
    "method": "aes-256-cfb",
    "remarks": ""
}
```

**sslocal --help**
```
sslocal -c  /xx/ss.json
```



#### aes-256-gcm

shadowsocks2.8.2版本，不支持aes-256-gcm

```
pip install https://github.com/shadowsocks/shadowsocks/archive/master.zip -U
```





### 运行原理

![proxy](http://ojtd6k176.bkt.clouddn.com/proxy-12.56.png)
* 首先通过SS Local和VPS进行通信，通过Socks5协议进行通信 <br/>
* SS Local连接到VPS， 并对Socks5中传输的数据进行对称加密传输，传输的数据格式是SS的协议
* SS Server收到请求后，对数据解密，按照SS协议来解析数据。
* SS Server根据协议内容转发请求。
* SS Server获取请求结果后回传给SS Local
* SS Local获取结果回传给应用程序
下面2者必须同时满足

1.代理服务器本地可以访问到;

2.代理服务器可以访问目标网站。

### 启动
小脚本，再次吐槽qt客户端，太重了
```
#!/bin/bash

var=''
cd /opt/Shadowsocks
name=`whoami`

if [ ! -d '/home/$name/ss' ];then
   mkdir ~/ss
fi
 
function state(){
  var=$(ps -ef | grep sslocal | grep -v grep | awk '{print $2}')
}

state

if test -z $var ;then
  sslocal -c  $PWD/ss.json >>~/ss/log 2>&1 &
else
  echo "kill ---$var"
  kill -9 $var
  state
  if test -z $var ;then rm -r ~/ss ;fi
fi  
```

