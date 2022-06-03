---
title: live
date: 2017-02-09 00:08:06
tags:
 - redis
 - 监控工具
 - install
categories:
 - nosql
 - redis
---
Redis live
 Redis Live是一个用来监控redis实例,分析查询语句并且有web界面的监控工具,使用python编写
#### Install Dependencies
* **tornado** pip install tornado
* **redis.py** pip install redis
* **python-dateutil** pip install python-dateutil
 if you're running Python < 2.7:
*  ** argparse** pip install argparse
官方说明： http://www.nkrode.com/article/real-time-dashboard-for-redis
 <!--more--> 
#### pip
下载地址:  https://pypi.python.org/pypi/pip#downloads
pip 依赖 setuptools
Finished processing dependencies for setuptools==32.3.1

```bash
$tar -zxvf  pip-9.0.1.tar.gz
$python setup.py build 
$sudo python setup.py install
Finished processing dependencies for pip==9.0.1
```



Finished processing dependencies for python-dateutil==2.6.0


Finished processing dependencies for redis==2.10.5

```
$sudo apt-get install build-essential python-dev
```
Dpkg: Warning: ** ldconfig ** could not be found in the PATH environment variable or no executable privileges
Tip: The root PATH environment variable should normally contain ** / usr / local / sbin, / usr / sbin, and / sbin **
```bash
$locate ldconfig   #sbin目录存在 ldconfig
$sudo mousepad ~/.bashrc
export PATH=/usr/loca/sbin:/usr/sbin:/sbin:$PATH
$source ~/.bashrc
```

Finished processing dependencies for tornado==4.5.dev1

列出安装的packages
```
$ sudo pip freeze
```

####  redislive
```
git clone https://github.com/kumarnitin/RedisLive.git
```
配置文件**redis-live.conf**【redis-live.conf.example】
```
{
	"RedisServers":
	[ 
		{
  			"server": "154.17.59.99",
  			"port" : 6379
		},
		
		{
  			"server": "localhost",
  			"port" : 6380,
  			"password" : "some-password"
		}		
	],

	"DataStoreType" : "redis",

	"RedisStatsServer":
	{
		"server" : "ec2-184-72-166-144.compute-1.amazonaws.com",
		"port" : 6385
	},
	
	"SqliteStatsStore" :
	{
		"path":  "to your sql lite file"
	}
}
```
启动服务
```
./redis-monitor.py --duration=30     //启动监控，duration是心跳时间
./redis-live.py                    //启动web服务，默认监听8888端口
```
**env: ...py 权限不够**
给予执行权
```
chmod +x  redis-monitor.py
chmod +x  redis-live.py 
```
打开 http://localhost:8888/index.html