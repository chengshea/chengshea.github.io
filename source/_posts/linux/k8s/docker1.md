---
title: 常用语法
permalink: linux/k8s/docker1/
tags:
  - docker
categories:
  - linux
  - k8s
date: 2022-07-11 21:50:49
---





```
 sudo  service docker status

 sudo service docker stop

 sudo service docker start
```



#### 搜索

```
docker search Python

```

#### 拉取

```
docker pull python:2.7

```



#### 查询

镜像  `image`

```
docker images

```



 容器 `container`

```
docker ps  #run container

docker ps -a  #all container

```

##### 日志

```
docker logs -f  <container or id>

```

##### 容器信息

```
docker inspect  <id>

#查看指定信息
docker inspect  <id>  --format '{{.Args}}'

docker inspect --format='{{.NetworkSettings.IPAddress}}' $CONTAINER_ID

```

<!--more-->

#### 运行

创建镜像  当前路径 **.** 英文点表示

```
docker build -t  <镜像名> <Dockerfile路径>

```

修改名字,版本

```
docker tag <IMAGE ID>  <名称:版本号>

```

容器安装程序

```
docker run python:3.5.3 pip -V

#指定源更新
docker run python:3.5.3 pip -i https://mirrors.aliyun.com/pypi/simple/ numpy

docker run <镜像名> apt-get install -y <程序>  

```

`-y` 交互



```
# tomcat 后台运行  p local port:container port     4452镜像id前4位

 docker run -d -p 8080:8080 4452

```

 保存容器

```
docker commit  <id> <镜像名:版本号>

```



##### 进入容器

```
# /bin/bash
docker run -i -t  python:3.5.3  /bin/bash

```

##### 共享目录

```
docker run -it -v <宿主机绝对路径目录>:<容器目录>  <镜像id>    /bin/bash

```

`-e` 环境变量

```
docker run  -e "MYSQL_ROOT_PASSWORD=19930221" -it 797e57bb4fea

```

#### 停止

```
docker stop <CONTAINER ID>

```

#### 删除

要先停止运行容器stop id

```
docker rmi <tag>:<no>

```

所有镜像

```
docker rmi $(docker images  -q)

```



所有容器

```
docker rm $(docker ps -a -q)

```

#### 迁移

备份

```
docker save <镜像名>  -o  ~/save.tar  

```

还原

```
docker load  -i  ~/docker/save.tar

```



**Ctrl + P + Q** 退出容器





#### 性能限制



容器使用状态

```
docker stats  containerId  
```

k,b,m,g内存

doc https://docs.docker.com/engine/reference/run/#runtime-constraints-on-resources



nginx代理



```
tinkle-style-dev:
  restart: always
  ports:
    - '18082:8080/tcp'
  environment:
    - TZ=Asia/Shanghai
    - TERM=xterm
  memswap_limit: 0
  labels:
    aliyun.scale: '1'
  shm_size: 0
  image: >-
    registry-internal.cn-shenzhen.aliyuncs.com/tinkle/docker-registry:centos7-lite-1.0
  memswap_reservation: 0
  volumes:
    - >-
      /mnt/acs_mnt/nas/21ac64b65d/baopinghui/style-service:/app/0.0.1-SNAPSHOT/style-service/:rw
    - '/home/data/tmpfile/style-service:/tmp:rw'
    - /mnt/acs_mnt/nas/21ac64b65d/baopinghui/style-service/tinkle-style.conf:/etc/supervisor.conf.d/tinkle-style.conf:rw
  kernel_memory: 0
  mem_limit: 0
```



/tinkle-style-dev/docker-compose.yml  不指明`container_name`容器名

`docker-compose up -d` 默认 tinkle-style-dev_tinkle-style-dev_1

```
upstream backend {
    server tinkle-core-dev_tinkle-core-dev_1:8080;
}
upstream style{
    server tinkle-style-dev_tinkle-style-dev_1:8080;
}
upstream ocr{
    server tinkle-ocr-dev_tinkle-ocr-dev_1:8080;
}
 log_format  main1  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"'
                       '$upstream_addr $upstream_response_time $request_time ';
server {
	listen       80;
	server_name  api.baopinghui.com;
	charset utf-8;
	access_log  logs/host.access.log  main1;
      
      
	location / {
		#root   html;
		#index  index.html index.htm;
		if ( $request_uri ~* /fastNeuralStyleController ) {
  			proxy_pass http://style;
		 }
		if ( $request_uri ~* /(style)/(.*) ){
			proxy_pass http://style/$2;
		}
		proxy_pass http://backend/;
		proxy_set_header   Host    $host;
		proxy_set_header   Cookie $http_cookie; 
		proxy_set_header   X-Real-IP        $remote_addr;
		proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
		add_header From localhost;
		proxy_cookie_path / /; 
	}
}
```



#### GPU

[nvidia驱动安装](/tool/gpu#gpu)




#### 错误

No `command` specified

```
docker run -it   xidx  /bin/bash  -c "ls"
```



OCI runtime create failed: container_linux.go:344: starting container process caused "exec: \"/bin/bash\": stat `/bin/bash: no such file or directory`": unknown.  

```
docker run -it   xidx  sh
```



