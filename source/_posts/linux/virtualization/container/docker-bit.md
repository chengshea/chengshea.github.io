---
title: docker二进制安装
permalink: linux/virtualization/container/docker-bit/
tags:
  - docker
  - virtualization
  - binary
categories:
  - linux
  - container
  - docker-bit
date: 2023-02-22 21:38:25
---

## 下载

docker二进制包获取地址：https://download.docker.com/linux/static/stable/x86_64/

```
$ tar -zxvf docker*.tgz
$ cp docker/* /usr/bin
```



## json

daemon.json

```
cat >> /etc/docker/daemon.json <<EOF
{
    "data-root": "/home/cs/data/docker",
   "registry-mirrors" : [
    "http://hub-mirror.c.163.com"
  ],
"insecure-registries":[
  "https://k8s.org"
  ],
  "debug" : true,
  "experimental" : true
}
EOF
```



<!--more-->



## service



```
cat >>/usr/lib/systemd/system/docker.service <<EOF
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target firewalld.service
Wants=network-online.target

[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s

[Install]
WantedBy=multi-user.target
EOF
```



## 开始

```
systemctl daemon-reload
systemctl enable --now docker

cat /etc/group | grep ^docker  #不存在
sudo groupadd docker  #存在忽略，创建组
sudo gpasswd -a ${USER} docker   #添加当前用户到组
sudo restart  #重启生效
```





## compose



https://ghproxy.com/

```
$ curl -L https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-linux-x86_64
$ docker compose version
Docker Compose version v2.15.1

```

> 当前用户 docker-compose` and copy it to `$HOME/.docker/cli-plugins
>
> 所有用户 /usr/local/lib/docker/cli-plugins/docker-compose
>
> 原有的“docker-compose 命令不再使用



## 私库

[harbor安装](/linux/tool/harbor)

sudo bash /opt/ansible/bak/harbor.sh 



````
$ sudo mkdir -p /etc/docker/certs.d/k8s.org
$ sudo cp /opt/kubernetes/harbor/k8s.org/{k8s.org*,ca.crt} /etc/docker/certs.d/k8s.org
$ ls -l /etc/docker/certs.d/k8s.org
总用量 12
-rw-r--r-- 1 root root 1968  2月 28 21:22 ca.crt
-rw-r--r-- 1 root root 2004  2月 28 21:22 k8s.org.cert
-rw------- 1 root root 3243  2月 28 21:22 k8s.org.key
$ sudo systemctl status docker
````

