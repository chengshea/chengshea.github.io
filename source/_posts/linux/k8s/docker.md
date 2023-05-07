---
title: docker
date: 2017-02-21 12:08:32
tags:
 - install
 - docker-engine
 - docker compose
categories:
 - linux
 - debian
 - docker
---
#### 安装 engine
卸载旧版
`sudo apt-get purge docker.io*`

编辑 ` /etc/apt/sources.list.d/docker.list`
```
echo 'deb https://apt.dockerproject.org/repo debian-jessie main'> /etc/apt/sources.list.d/docker.list
```
安装依赖：` apt-transport-https`

```
sudo apt-get install docker-engine
docker version
...permission问题
```
创建组
```
 cat /etc/group | grep ^docker  #不存在
 sudo groupadd docker  #存在忽略，创建组
sudo gpasswd -a ${USER} docker   #添加当前用户到组
sudo restart  #重启生效
```
 <!--more--> 
#### 安装 compose
官方文档 https://docs.docker.com/compose/install/#alternative-install-options

##### 方法一
curl 安装
```
sudo apt-get install curl
```
/usr/local/bin 需要权限
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.11.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
..... 
curl: (56) SSL read: error:00000000:lib(0):func(0):reason(0), errno 104
网络中断n次，推荐离线
```
[离线下载](https://dl.bintray.com/docker-compose/master/)
```
sudo mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

##### 方法二
pip安装`pip install docker-compose`
**强烈建议您使用 virtualenv，因为许多操作系统有python系统包与docker-compose依赖关系冲突**


####  国内源
`docker search  xxxx` 
**error response from daemon: Get https://index.docker.io**
被 GFW强了
Docker配置文件`/etc/default/docker`
```
sudo mousepad /etc/default/docker

#添加 阿里源
DOCKER_OPTS="--registry-mirror=http://mirrors.aliyun.com"
```
加速地址
```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://自己专属.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```
#### docker-compose.yml
常用配置 {% post_link  linux/k8s/docker  '安装 compose' %}

#### 卸载
```
#docker-engine
sudo apt-get remove docker-engine

# docker-compose 
#curl
$ rm /usr/local/bin/docker-compose
# pip
$ pip uninstall docker-compose
```



docker.service

```
cat >/usr/lib/systemd/system/docker.service <<EOF
[Unit]
Description=Docker Application Container Engine
Documentation=http://docs.docker.com
After=network.target docker.socket
[Service]
Type=notify
EnvironmentFile=$BASE/flanneld/subnet.env
WorkingDirectory=/usr/local/bin
ExecStart=/usr/bin/dockerd \
                \$DOCKER_NETWORK_OPTIONS \
                -H unix:///var/run/docker.sock 
ExecReload=/bin/kill -s HUP $MAINPID
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
TimeoutStartSec=0
# set delegate yes so that systemd does not reset the cgroups of docker containers
Delegate=yes
# kill only the docker process, not all processes in the cgroup
KillMode=process
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF
```

