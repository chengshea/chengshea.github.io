---
title: docker-compose
date: 2017-02-27 12:08:32
tags:
 - install
 - docker-engine
 - docker compose
categories:
 - linux
 - debian
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
示例
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


 