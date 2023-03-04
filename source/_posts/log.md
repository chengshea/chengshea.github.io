---
title: 记录
permalink: log/
tags:
  - k8s
  - log
  - xxx
categories:
  - k8s
  - log
date: 2023-02-12 19:29:40
---

## md

便捷命令

```
  alias hurl='hhelp' #eg: url 
  alias post='hpost $1 $2' #eg: post url title
  alias hs='hexo server'
```



 推送

```
$ cd ~/oss/hexo
$ git checkout src  && git branch 
M	_config.yml
M	db.json
已经位于 'src'
您的分支与上游分支 'origin/src' 一致。
  master
* src

git push origin src:src
```



<!--more-->



## k8s

### 仓库harbor

路径 /opt/ansible/bak/harbor.sh

密码  admin cs123456

```
#启动
$ sudo bash  /opt/ansible/bak/harbor.sh  s
#停止
$sudo bash  /opt/ansible/bak/harbor.sh
```



访问 https://k8s.org/harbor/sign-in?redirect_url=%2Fharbor%2Fprojects

直接hosts配置的域名



### kubeadm部署v1.21.11

前言,直接启动k8s-k8s





### 二进制部署





获取 /opt/ansible/bak/token.sh

```
#!/bin/sh

var=$1
#kubectl get secrets -n kubernetes-dashboard | grep admin
temp=$(kubectl get secrets -n kubernetes-dashboard | grep admin | cut -d ' ' -f 1)
cret=${var:-$temp}
[ -n $cret ] || { echo "请创建admin-user-token" && exit 1;}
kubectl describe  secrets $cret -n kubernetes-dashboard  | grep token: | awk '{print $2}'

#kubectl describe  secrets $cret -n kube-system  | grep token: | awk '{print $2}'
```



### kubectl

https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/

```
#最新版本
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

#指定版本
curl -LO https://dl.k8s.io/release/v1.26.0/bin/linux/amd64/kubectl
```





### kubernetes

https://github.com/kubernetes/kubernetes/archive/refs/tags/v1.26.1.tar.gz

```
git clone https://github.com/kubernetes/kubernetes
cd kubernetes
make quick-release
```

> 安装docker和rsync





## vm



/opt/ansible/bak/vm.sh





systemctl set-default graphical.target由命令行模式更改为图形界面模式

systemctl set-default multi-user.target由图形界面模式更改为命令行模式



chmod u+w /etc/sudoers

username  ALL=(ALL)    ALL  #5分钟之后密码过期

cs ALL=(ALL:ALL) NOPASSWD:ALL



chmod 440 /etc/sudoers



