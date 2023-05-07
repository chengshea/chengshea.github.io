---
title: nfs介绍
permalink: linux/tool/nfs/
tags:
  - nfs
  - rpc
  - storage
categories:
  - linux
  - tool
  - nfs
date: 2023-03-26 18:28:57
---

### NFS

https://nfs.sourceforge.net/

```
#debian
sudo apt-get install nfs-common   nfs-kernel-server  -y

#centos
sudo yum install nfs-utils   rpcbind   -y
```

>#下载安装包
>
>sudo apt-get install  nfs-common   nfs-kernel-server  -y  --download-only 
>
>sudo yum install nfs-utils rpcbind   -y --downloadonly --downloaddir /opt/nfs

![nfs](/pics/nfs-src.png)

1. 首先服务器端启动RPC服务，并开启111端口；启动NFS服务，并向RPC注册端口信息
2. 客户端启动RPC（portmap服务），向服务端的RPC(portmap)服务请求服务端的NFS端口（由程序在NFS客户端发起存取文件的请求，客户端本地的RPC(rpcbind)服务会通过网络向NFS服务端的RPC的111端口发出文件存取功能的请求。）
3. 服务端的RPC(portmap)服务反馈NFS端口信息给客户端。
4. 客户端通过获取的NFS端口来建立和服务端的NFS连接并进行数据的传输。（客户端获取正确的端口，并与NFS daemon联机存取数据。）
5. 存取数据成功后，返回前端访问程序，完成一次存取操作。

<!--more-->



### 安装

```
sudo rpm -ivh  /opt/nfs/*.rpm --force --nodeps 

#debian
sudo dpkg -i   /opt/nfs/*.deb
```



#### 服务端

设置共享目录

```
#开启
systemctl enable nfs
systemctl restart nfs
systemctl status nfs


mkdir -p /opt/data/k8s/redis/{pv{1..6},srcipt}

cat  <<EOF |  tee -a  /etc/exports
/opt/data/k8s/redis/pv1  192.168.122.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv2  192.168.122.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv3  192.168.122.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv4  192.168.122.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv5  192.168.122.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv6  192.168.122.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/srcipt  192.168.122.0/24(rw,sync,no_root_squash)
EOF

#加载
exportfs -arv

#查看本机NFS共享目录
showmount -e
```



<details>
  <summary>exports配置</summary>
  <pre><a>/etc/exports</a><code>
# /etc/exports: the access control list for filesystems which may be exported
#		to NFS clients.  See exports(5).
#
# Example for NFSv2 and NFSv3:
# /srv/homes       hostname1(rw,sync,no_subtree_check) hostname2(ro,sync,no_subtree_check)
#
# Example for NFSv4:
# /srv/nfs4        gss/krb5i(rw,sync,fsid=0,crossmnt,no_subtree_check)
# /srv/nfs4/homes  gss/krb5i(rw,sync,no_subtree_check)
#
#/opt/data     ip地址为客户端的地址或网段(rw,sync,no_root_squash,insecure)
/opt/data/k8s/redis/pv1  192.168.56.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv2  192.168.56.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv3  192.168.56.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv4  192.168.56.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv5  192.168.56.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/pv6  192.168.56.0/24(rw,sync,no_root_squash)
/opt/data/k8s/redis/srcipt  192.168.56.0/24(rw,sync,no_root_squash)
  </code></pre>
</details>



#### 客户端



```
#服务端ip,查看服务端里面可以挂载的目录
showmount -e 192.168.122.6

#挂载
mount -t nfs 192.168.122.6:/opt/data/k8s/redis/srcipt   /opt/srcipt


```

[开机自启挂载fstab](/linux/storage/fstab)

```
echo "192.168.122.6:/data /opt    nfs  default 0 0" >>/etc/fstab
```







```
$ showmount -e 192.168.122.8
```

>clnt_create: RPC: Port mapper failure - Unable to receive: errno 113 (No route to host)

服务端防火墙

```
systemctl status firewalld
```

>[root@test opt]# firewall-cmd --add-service=nfs
>success
>[root@test opt]# firewall-cmd --add-service=rpc-bind
>success
>[root@test opt]# firewall-cmd --add-service=mountd
>success

