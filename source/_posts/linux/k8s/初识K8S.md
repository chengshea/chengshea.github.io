---
title: 初识K8S
date: 2018-09-07 12:36:29
tags:
  - k8s
  - docker
categories:
  - linux
  - docker
---

### Master服务

#### 安装kubernetes

[官网下载kubernetes](https://kubernetes.io/docs/setup/release/notes/)

```
tar -xvf kubernetes.tar.gz  -C /opt/
```

下载 Client Binaries，Server Binaries

```
uname -s -m  #获取版本官网下载或执行下面命令下载
bash /opt/kubernetes/cluster/get-kube-binaries.sh
```

 <!--more--> 

> Kubernetes release: v1.11.0
>
> Server: linux/amd64 (to override, set KUBERNETES_SERVER_ARCH)
>
> Client: linux/amd64 (autodetected)
>
> Will download **kubernetes-server-linux-amd64.tar.gz** from https://dl.k8s.io/v1.11.0
>
> Will download and extract **kubernetes-client-linux-amd64.tar.gz** from https://dl.k8s.io/v1.11.0
>
> Is this ok? [Y]/n

kubernetes-server

```
tar -tf   kubernetes-server-linux-amd64.tar.gz  #查看文件
tar -xvf   kubernetes-server-linux-amd64.tar.gz  -C /opt/kubernetes/   --strip-components 1
```



kubernetes-client

```
tar -tf   kubernetes-client-linux-amd64.tar.gz
tar -xvf   kubernetes-client-linux-amd64.tar.gz  -C /opt/kubernetes/   --strip-components 1
```



执行文件(配置文件可以直接路径)

```
sudo ln -s /opt/kubernetes/server/bin/kube-apiserver  /usr/bin/
sudo ln -s /opt/kubernetes/server/bin/kube-controller-manager  /usr/bin/
sudo ln -s /opt/kubernetes/server/bin/kube-scheduler  /usr/bin/
```



#### 准备依赖服务 etcd

[etcd releases下载](https://github.com/etcd-io/etcd/releases) 如果s3.amazonaws.com下不动。。。

被墙了 被墙了 被墙了

go 编译

```
#mkdir -p $GOPATH/src/go.etcd.io/ 
#cd $GOPATH/src/go.etcd.io/
#git https://github.com/etcd-io/etcd.git
cs@debian:~/gopath/etcd$ ./bulid
```



> can’t load package: package go.etcd.io/etcd: cannot find package “go.etcd.io/etcd” in any of:
>
> /opt/go/src/go.etcd.io/etcd (from $GOROOT)
>
> /home/cs/gopath/src/go.etcd.io/etcd (from $GOPATH)

```
$GOPATH/bin/etcd   #运行
$ ETCDCTL_API=3 ./bin/etcdctl put foo bar
OK
```

##### 创建用户

```
sudo groupadd  -g 995 etcd
sudo useradd -s /sbin/nologin -M -c "etcd user" -u 995 etcd -g  etcd
sduo mkdir -p /etc/etcd 
sudo mkdir -p /var/lib/etcd 
sudo chown -R etcd.etcd /var/lib/etcd
```

##### etcd.service

```
[Unit] 
Description=Etcd Server 
After=network.target 
After=network-online.target 
Wants=network-online.target 
 
[Service] 
Type=notify 
WorkingDirectory=/var/lib/etcd/ 
EnvironmentFile=-/etc/etcd/etcd.conf 
User=etcd 
# set GOMAXPROCS to number of processors 
ExecStart=/bin/bash -c "GOMAXPROCS=$(nproc) /usr/bin/etcd --name=\"${ETCD_NAME}\" --data-dir=\"${ETCD_DATA_DIR}\" --listen-client-urls=\"${ETCD_LISTEN_CLIENT_URLS}\"" 
Restart=on-failure 
LimitNOFILE=65536 
 
[Install] 
WantedBy=multi-user.target
```

> sudo systemctl start etcd.service
>
> 该命令启动不了 /bin/bash -c “GOMAXPROCS=$(nproc) /usr/bin/etcd –name=\”${ETCD_NAME}\” –data-dir=\”${ETCD_DATA_DIR}\” –listen-client-urls=\”${ETCD_LISTEN_CLIENT_URLS}\””
>
> sudo systemctl status etcd.service
>
> **bash[9841]: run the stateless etcd v3 gRPC L7 reverse proxy
>
> debian systemd[1]: etcd.service: main process exited, code=exited, status=2/INVALIDARGUMENT
>
> debian systemd[1]: Failed to start Etcd Server.
> **

设置etcd
ExecStart=/opt/etcd-v3.3.9/etcd

##### 启动etcd服务

```
temp="etcd.service"
sudo cp $temp /lib/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable $temp
sudo systemctl start $temp
sudo systemctl status $temp
```

> ● etcd.service - Etcd Server
>
> Loaded: loaded (/lib/systemd/system/etcd.service; enabled)
>
> Active: active (running) since 六 2018-09-08 14:53:26 CST; 5min ago
> Main PID: 804 (etcd)
>
> CGroup: /system.slice/etcd.service
>
> └─804 /opt/etcd-v3.3.9/etcd

```
./etcdctl cluster-health
```

> member 8e9e05c52164694d is healthy: got healthy result from [http://localhost:2379](http://localhost:2379/)
>
> cluster is healthy

#### kube-apiserver

##### 创建用户

```
sudo groupadd -g 996 kube
sudo useradd -s /sbin/nologin -M -c "kube user" -u 996 kube -g kube
sudo mkdir -p /etc/kubernetes
sudo mkdir -p /usr/libexec/kubernetes
sudo chown -R kube.kube /usr/libexec/kubernetes
sudo chown -R kube.kube /var/run/kubernetes
```

##### kube-apiserver.service

```
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/kubernetes
#Dependent service
After=etcd.service

[Service]
EnvironmentFile=-/etc/kubernetes/apiserver
ExecStart=/opt/kubernetes/server/bin/kube-apiserver $KUBE_API_ARGS
Restart=on-failure
Type=notify
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

> 1.error creating self-signed certificates: mkdir /var/run/kubernetes: permission denied
>
> 2.error: –[etcd](https://chengshea.github.io/linux/debian/docker/install-kubernetes/#etcd)-servers must be specified

配置

```
sudo cat>/etc/kubernetes/apiserver<<EOF
KUBE_API_ARGS="--etcd-servers=http://localhost:2379 --insecure-bind-address=0.0.0.0 --insecure-port=8080 --service-cluster-ip-range=169.169.0.0/16 --service-node-port-range=1-65535 --admission-control=NamespaceLifecycle,LimitRanger,SecurityContextDeny,ResourceQuota --logtostderr=false --log-dir=/var/log/kubernetes --v=2"
EOF
```



> –etcd-servers：就是etcd的地址。
>
> –insecure-bind-address：apiserver绑定主机的非安全IP地址，设置0.0.0.0表示绑定所有IP地址。
>
> –insecure-port：apiserver绑定主机的非安全端口，默认为8080。
>
> –service-cluster-ip-range：Kubernetes集群中Service的虚拟IP地址段范围，以CIDR格式表示，该IP范围不能与物理机真实IP段有重合。
>
> -service-node-port-range：Kubernetes集群中Service可映射的物理机端口范围，默认为30000~32767.
>
> –admission-control： Kubernetes集群的准入控制设置，各控制模块以插件形式依次生效。
>
> –logtostderr：设置为false表示将日志写入文件，不写入stderr。
>
> –log-dir： 日志目录。
>
> –v：日志级别。
>
> [更多参数查看官方文档](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/)

##### 启动

```
temp="kube-apiserver.service"
sudo cp $temp /lib/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable $temp
sudo systemctl start $temp
sudo systemctl status $temp
```

> ● kube-apiserver.service - Kubernetes API Server
>
> Loaded: loaded (/lib/systemd/system/kube-apiserver.service; disabled)
>
> Active: active (running) since 六 2018-09-08 15:42:02 CST; 2s ago
> Docs: https://github.com/GoogleCloudPlatform/kubernetes
>
> Main PID: 3560 (kube-apiserver)
>
> CGroup: /system.slice/kube-apiserver.service
>
> └─3560 /opt/kubernetes/server/bin/kube-apiserver –etcd-servers=[http://localhost:2379](http://localhost:2379/) …….

#### kube-controller-manager

##### kube-controller-manager.service

```
[Unit]
Description=Kubernetes Scheduler Plugin
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=kube-apiserver.service
Requires=kube-apiserver.service

[Service]
EnvironmentFile=-/etc/kubernetes/controller-manager
User=kube
ExecStart=/opt/kubernetes/server/bin/kube-controller-manager $KUBE_CONTROLLER_MANAGER_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

配置

```
sudo touch /etc/kubernetes/controller-manager && sudo  chmod 757 /etc/kubernetes/controller-manager
cat>/etc/kubernetes/controller-manager<<EOF
KUBE_CONTROLLER_MANAGER_ARGS="--master=http://192.168.56.101:8080 --logtostderr=false --log-dir=/var/log/kubernetes --v=2" 
EOF
```



##### 启动

```
temp="kube-controller-manager.service"
sudo cp $temp /lib/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable $temp
sudo systemctl start $temp
sudo systemctl status $temp
```

> ● kube-controller-manager.service - Kubernetes Scheduler Plugin
>
> Loaded: loaded (/lib/systemd/system/kube-controller-manager.service; disabled)
>
> Active: active (running) since 六 2018-09-08 16:54:32 CST; 2s ago
>
> Docs: https://github.com/GoogleCloudPlatform/kubernetes
>
> Main PID: 5980 (kube-controller)
>
> CGroup: /system.slice/kube-controller-manager.service
>
> └─5980 /opt/kubernetes/server/bin/kube-controller-manager –master=[http://localhost:8080](http://localhost:8080/) ……

#### kube-scheduler

##### kube-scheduler.service

```
[Unit]
Description=Kubernetes Scheduler Manager
Documentation=https://github.com/kubernetes
After=kube-apiserver.service
Requires=kube-apiserver.service

[Service]
EnvironmentFile=/etc/kubernetes/scheduler
ExecStart=/opt/kubernetes/server/bin/kube-scheduler $KUBE_SCHEDULER_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

配置

```
sudo touch /etc/kubernetes/scheduler && sudo  chmod 757 /etc/kubernetes/scheduler
cat>/etc/kubernetes/scheduler<<EOF
KUBE_SCHEDULER_ARGS="--master=http://localhost:8080 --logtostderr=false --log-dir=/var/log/kubernetes --v=2"
EOF
```



##### 启动

```
temp="kube-scheduler.service"
sudo cp $temp /lib/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable $temp
sudo systemctl start $temp
sudo systemctl status $temp
```

> ● kube-scheduler.service - Kubernetes Scheduler Manager
>
> Loaded: loaded (/lib/systemd/system/kube-scheduler.service; disabled)
>
> Active: active (running) since 六 2018-09-08 17:02:09 CST; 7s ago
>
> Docs: https://github.com/kubernetes
> Main PID: 6340 (kube-scheduler)
>
> CGroup: /system.slice/kube-scheduler.service
>
> └─6340 /opt/kubernetes/server/bin/kube-scheduler –master=[http://localhost:8080](http://localhost:8080/) ……

### Node节点服务

#### kubelet

##### kubelet.service

```
[Unit]
Description=Kubernetes Kubelet Server
Documentation=https://github.com/kubernetes
After=docker.service
Requires=docker.service

[Service]
WorkingDirectory=-/var/lib/kubelet
EnvironmentFile=-/etc/kubernetes/kubelet
ExecStart=/opt/kubernetes/server/bin/kubelet $KUBELET_ARGS  
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

> kubelet.service holdoff time over, scheduling restart

配置

```
sudo mkdir -p /var/lib/kubelet
sudo touch /etc/kubernetes/kubelet && sudo  chmod 757 /etc/kubernetes/kubelet
cat>/etc/kubernetes/kubelet<<EOF
KUBELET_ARGS="--kubeconfig=/etc/kubernetes/kubeconfig --hostname-override=127.0.0.1 --logtostderr=false --log-dir=/var/log/kubernetes --v=2"
EOF
```



> [–kubeconfig代替了–api-servers](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
>
> 
> –[require-kubeconfig 1.7版开始默认true ](https://github.com/kubernetes/kubernetes/issues/36745)
>
> Kubernetes 1.8开始要求关闭系统的Swap

##### 启动

```
temp="kubelet.service"
sudo cp $temp /lib/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable $temp
sudo systemctl start $temp
sudo systemctl status $temp
```

> ● kubelet.service - Kubernetes Kubelet Server
>
> Loaded: loaded (/lib/systemd/system/kubelet.service; disabled)
>
> Active: active (running) since 二 2018-09-11 18:34:48 CST; 29ms ago
>
> Docs: https://github.com/kubernetes
> Main PID: 9018 (kubelet)
>
> CGroup: /system.slice/kubelet.service
>
> └─9018 /opt/kubernetes/server/bin/kubelet –kubeconfig=/etc/kubernetes/kubeconfig –hostname-override=127.0.0.1 –logtostderr=false –log-dir=/var/log/kubernetes –v=2 –cgroup-driver=systemd

#### kube-proxy

##### kube-proxy.service

```
[Unit]
Description=Kubernetes Kube-Proxt Server
Documentation=https://github.com/kubernetes
After=network.target
Requires=network.target

[Service]
EnvironmentFile=-/etc/kubernetes/proxy
ExecStart=/opt/kubernetes/server/bin/kube-proxy $KUBE_PROXY_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

配置

```
sudo touch /etc/kubernetes/proxy && sudo  chmod 757 /etc/kubernetes/proxy
cat>/etc/kubernetes/proxy<<EOF
KUBE_PROXY_ARGS="--master=http://localhost:8080  --logtostderr=false --log-dir=/var/log/kubernetes --v=2"
EOF
```



##### 启动

```
temp="kube-proxy.service"
sudo cp $temp /lib/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable $temp
sudo systemctl start $temp
sudo systemctl status $temp
./kubectl get cs
./kubectl get node
```