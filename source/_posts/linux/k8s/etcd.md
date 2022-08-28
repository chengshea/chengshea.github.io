---
title: etcd集群
permalink: linux/k8s/etcd/
tags:
  - etcd
categories:
  - linux
  - k8s
date: 2022-07-19 21:13:51
---
etcd 下载







https://github.com/bitnami/bitnami-docker-etcd





```
$ etcdctl set /atomic.io/network/config '{"Network":"121.21.0.0/16","Backend":{"Type":"vxlan"}}'
```

>{"Network":"121.21.0.0/16","Backend":{"Type":"vxlan"}}



Couldn't fetch network config: client: response is invalid json. The endpoint is probably not valid etcd cluster endpoint. timed out

查阅 flanneld 官网文档，上面标准了 flannel 这个版本不能给 etcd 3 进行通信

```
$ etcdctl put /atomic.io/network/config '{"Network":"121.21.0.0/16","Backend":{"Type":"vxlan"}}'
$ etcdctl del /atomic.io/network/config
```

>API VERSION:3.2
>
>Did you mean this?
>	get
>	put
>	del
>	user



etcd environment文档

https://doczhcn.gitbook.io/etcd/index/index-1/configuration







```shell
cs@debian:~/oss/0s/k8s$ sudo modprobe -v ip_vs
insmod /lib/modules/4.9.0-8-amd64/kernel/net/netfilter/ipvs/ip_vs.ko 
cs@debian:~/oss/0s/k8s$ sudo modprobe -v ip_vs_rr
insmod /lib/modules/4.9.0-8-amd64/kernel/net/netfilter/ipvs/ip_vs_rr.ko 
cs@debian:~/oss/0s/k8s$ sudo modprobe -v ip_vs_wrr
insmod /lib/modules/4.9.0-8-amd64/kernel/net/netfilter/ipvs/ip_vs_wrr.ko 
cs@debian:~/oss/0s/k8s$ sudo modprobe -v ip_vs_sh
insmod /lib/modules/4.9.0-8-amd64/kernel/net/netfilter/ipvs/ip_vs_sh.ko
cs@debian:~/oss/0s/k8s$ sudo modprobe -v ip_vs_nq
insmod /lib/modules/4.9.0-8-amd64/kernel/net/netfilter/ipvs/ip_vs_nq.ko
```



```shell
cs@debian:~/oss/0s/k8s$ sudo ipvsadm -ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn

```



```shell
#两种临时方法
# echo 1 > /proc/sys/net/ipv4/vs/conntrack
# sysctl -w net.ipv4.vs.conntrack=1
```

> 想永久保留配置，可以修改/etc/sysctl.conf文件





```
kubectl create clusterrolebinding test:anonymous --clusterrole=cluster-admin --user=system:anonymous
```

> configmaps is forbidden: User “system:anonymous” cannot list resource “configmaps” in [API](https://so.csdn.net/so/search?q=API&spm=1001.2101.3001.7020) group “” in the namespace “default”



```
[vagrant@k8s master]$ kubectl create clusterrolebinding kubelet-bootstrap --clusterrole=system:node-bootstrapper --user=kubelet-bootstrap
clusterrolebinding.rbac.authorization.k8s.io/kubelet-bootstrap created
```

>error: failed to run Kubelet: cannot create certificate signing request: certificatesigningrequests.certificates.k8s.io is forbidden: User "kubelet-bootstrap" cannot create certificatesigningrequests.certificates.k8s.io at the cluster



proxy

unable to create proxier: can't set sysctl net/ipv4/conf/all/route_localnet to 1: open /proc/sys/net/ipv4/conf/all/route_localnet: read-only file system



```
 sduo  cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- ip_vs_nq
modprobe -- nf_conntrack_ipv4
EOF
```



```yaml
      containers:
      - name: kube-flannel
        image: k8s.org/k8s/flannel:v0.11.0-amd64
        command:
        - /opt/bin/flanneld
        args:
        - --ip-masq
        - --kube-subnet-mgr
        - --iface=eth1
```

> --iface=eth1





```shell
cs@debian:~$ ansible k8s-108 -m copy -a "src=/home/cs/oss/0s/k8s/kube-apiserver/docker-compose.yml dest=/opt/kubernetes/master/docker-compose.yml"   -b --become-method sudo --become-user root
```

ansible k8s-108 -m copy -a "src=/opt/kubernetes/client/k8s-1.21-11/bin/config.yaml dest=/opt/kubernetes  mode=0644"   -b --become-method sudo --become-user root





```
[root@k8s kubernetes]# cat > /etc/sysctl.d/k8s.conf << EOF
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
```





```
 cat>/opt/kubernetes/kubelet.env<<EOF
 KUBELET_OPTIONS=" --hostname-override=192.168.56.108 \
  --pod-infra-container-image=k8s.org/k8s/pause:3.4.1 \
  --bootstrap-kubeconfig=/opt/kubernetes/config/bootstrap.kubeconfig \
  --kubeconfig=/opt/kubernetes/config/kubelet.kubeconfig \
   --config=/opt/kubernetes/config/kubelet-conf.yaml   \
  --register-node=true \
  --cni-bin-dir=/opt/kubernetes/cni/bin --cni-conf-dir=/opt/kubernetes/cni/net.d --network-plugin=cni  \
   --runtime-cgroups=/systemd/system.slice  \
  --logtostderr=true "
EOF
```







```
	cat>/usr/lib/systemd/system/kubelet.service<<EOF
[Unit]
Description=Kubernetes Kubelet Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=docker.service
Requires=docker.service

[Service]
WorkingDirectory=/var/lib/kubelet
EnvironmentFile=/opt/kubernetes/kubelet.env
ExecStart=/opt/kubernetes/bin/kubelet  \$KUBELET_OPTIONS
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```







