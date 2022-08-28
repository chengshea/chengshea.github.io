---
title: helm工具
permalink: linux/k8s/helm/
tags:
  - helm
categories:
  - linux
  - k8s
date: 2022-08-18 20:26:54
---



### 安装

下载 https://helm.sh/docs/intro/install/

```
wget  -P /opt/docker  https://get.helm.sh/helm-v3.9.3-linux-amd64.tar.gz
mkdir /opt/docker/helm-v3.9.3
tar -zxvf  helm-v3.9.3-linux-amd64.tar.gz  -C  ./helm-v3.9.3   --strip-components 1
```



### 设置环境变量

```
$ cat >> ~/.bashrc <<EOF
#helm
export PATH=$PATH:/opt/docker/helm-v3.9.3
EOF
$ helm version
version.BuildInfo{Version:"v3.9.3", GitCommit:"414ff28d4029ae8c8b05d62aa06c7fe3dee2bc58", GitTreeState:"clean", GoVersion:"go1.17.13"}

```



### 添加源



```
helm repo add stable http://mirror.azure.cn/kubernetes/charts 
helm repo add aliyun https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts 
helm repo list
```



show

```
helm show chart stable/mysql
```



install

```
 helm install db stable/mysql
WARNING: This chart is deprecated
NAME: db
LAST DEPLOYED: Thu Aug 18 21:33:05 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
MySQL can be accessed via port 3306 on the following DNS name from within your cluster:
db-mysql.default.svc.cluster.local

To get your root password run:

    MYSQL_ROOT_PASSWORD=$(kubectl get secret --namespace default db-mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode; echo)

To connect to your database:

1. Run an Ubuntu pod that you can use as a client:

    kubectl run -i --tty ubuntu --image=ubuntu:16.04 --restart=Never -- bash -il

2. Install the mysql client:

    $ apt-get update && apt-get install mysql-client -y

3. Connect using the mysql cli, then provide your password:
    $ mysql -h db-mysql -p

To connect to your database directly from outside the K8s cluster:
    MYSQL_HOST=127.0.0.1
    MYSQL_PORT=3306

    # Execute the following command to route the connection:
    kubectl port-forward svc/db-mysql 3306

    mysql -h ${MYSQL_HOST} -P${MYSQL_PORT} -u root -p${MYSQL_ROOT_PASSWORD}
```



```
s@debian:~$ kubectl  get pod -A
NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE
default       db-mysql-7f4fdddfd5-2dqql     0/1     Pending   0          67s
```

