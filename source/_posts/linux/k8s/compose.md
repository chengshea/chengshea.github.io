---
title: docker-compose
date: 2017-02-27 12:08:32
tags:
 - install
 - docker-engine
 - docker compose
categories:
 - linux
 - k8s
 - docker
---
#### 安装 
git下载地址:https://github.com/docker/compose/releases

推荐pip安装
```
sudo pip install -U docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose -version
```
  <!--more--> 
#### 使用
>build

指定Dockerfile 文件,compose会利用它自动构建
```
build: /path
```
> command

覆盖容器启动后默认命令
```
command:
       - "python" 
       - "neural_style.py" 
       - "--content" 
       - "/neural/input.jpg" 
```
> links

链接其它服务的容器
```
links:
    - redis
```
> ports

暴露端口信息给宿主机,使用(host:container) 必须字符串格式,yaml解析涉及进制
```
ports:
      - "8888:8888"
      - "127.0.0.1:8001:8001"
```

> volumes

挂载路径,宿主机(host:container);上访模式(host:container:ro)
``` 
volumes:
    - ~/tmp:/tmp/dir
    - 
```
> volumes_from

挂载容器或服务
```
volumes_from:
    - jupyter
    - service_name
```
> devices

设配映射列表
```
devices:
    - "/dev/nivida0:/dev/nivida0"
    - "/dev/nivida1:/dev/nivida1"
```
> depends_on

express之间依赖关系,
 * `docker-compose up` 按照依赖顺序启动

```
 depends_on:
     - elasticsearch
```

> labels

向docker容器添加元数据
```
labels:
   - aliyun.gpu=2

```
>其它

docker run 支持
```
cpu_shares: 73
#指定工作目录
working_dir: /code  

entrypoint: /code/entrypoint.sh
user: postgresql
hostname: foo
domainname: foo.com
mem_limit: 1000000000
privileged: true
restart: always
stdin_open: true
tty: true
```

#### 示例



```
version: '2'
services:
  jupyter:
    image: registry.cn-hangzhou.aliyuncs.com/denverdino/tensorflow:1.0.0
    container_name: jupyter
    ports:
      - "8888:8888"
    environment:
      - PASSWORD=tensorflow
    volumes:
      - "/tmp/tensorflow_logs"
      - "./notebooks:/root/notebooks"
    command:
      - "/run_jupyter.sh"
      - "/root/notebooks"
  tensorboard:
    image: registry.cn-hangzhou.aliyuncs.com/denverdino/tensorflow:1.0.0
    container_name: tensorboard
    ports:
      - "6006:6006"
    volumes_from:
      - jupyter
    command:
      - "tensorboard"
      - "--logdir"
      - "/tmp/tensorflow_logs"
      - "--host"
      - "0.0.0.0"
```



logstash

```
logstash:
  image: logstash:2.4.1
  command: /opt/logstash/bin/logstash -f /etc/logstash/conf.d/logstash.conf
  privileged: false
  restart: always
  ports:
  - 21020:21020
  volumes:
  - /mnt/tinkle_data/logstash/logstash.conf:/etc/logstash/conf.d/logstash.conf
```

kibana

```
kibana:
  image: daocloud.io/library/kibana:4.6.1
  privileged: false
  restart: always
  ports:
  - 5601:5601
  volumes:
  - /mnt/tinkle_data/kibana/kibana.yml:/opt/kibana/config/kibana.yml
```

elasticsearch

```
es:
  restart: always
  ports:
    - '9200:9200/tcp'
    - '9300:9300/tcp'
  environment:
    - LANG=C.UTF-8
    - JAVA_HOME=/docker-java-home/jre
    - TZ=Asia/ShangHai
  memswap_limit: 0
  labels:
    aliyun.scale: '1'
  shm_size: 0
  image: 'elasticsearch:2.4.1'
  memswap_reservation: 0
  volumes:
    - '/home/data/es:/usr/share/elasticsearch/data:rw'
    - '/mnt/elasticsearch/plugins:/usr/share/elasticsearch/plugins:rw'
  kernel_memory: 0
  mem_limit: 0
```

redis

```
redis:
  image: redis:3.2.5
  command: 
     -  /etc/redis/6379.conf
  privileged: false
  restart: always
  ports:
  - 6379:6379
  volumes:
  - /mnt/tinkle_data/redis/data:/data/
  - /mnt/tinkle_data/redis/conf/6379.conf:/etc/redis/6379.conf
```



```
mysql:
  image: 'mysql:5.7.17'
  ports:
    - '3306:3306'
  restart: always
  environment:
    - MYSQL_ROOT_PASSWORD=19930221
  labels:
    aliyun.scale: '1'
  volumes:
    - '/home/data/mysql/mysql:/var/lib/mysql'
    - '/home/data/mysql/conf/mysql.cnf:/etc/mysql/conf.d/mysql.cnf'
```



```
#docker-compose services  mysql的服务名
jdbc_url=jdbc:mysql://服务名:3306/databasename
```

