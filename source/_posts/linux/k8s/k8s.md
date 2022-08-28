---
title: kubernetes部署结构
permalink: linux/k8s/k8s/
tags:
  - kubernetes
categories:
  - linux
  - k8s
date: 2022-07-31 21:59:24
---

## go env

编译二进制

You have a working [Go environment](https://golang.org/doc/install).

```shell
GOPATH=`go env | grep GOPATH | cut -d '"' -f 2 `
mkdir -p $GOPATH/src/k8s.io
cd $GOPATH/src/k8s.io
git clone https://github.com/kubernetes/kubernetes
cd kubernetes
git checkout v1.21.12
make
```



## 前置条件配置

- 一台兼容的 Linux 主机。Kubernetes 项目为基于 Debian 和 Red Hat 的 Linux 发行版以及一些不提供包管理器的发行版提供通用的指令
- 每台机器 `2 GB` 或更多的 RAM （如果少于这个数字将会影响你应用的运行内存）
- `2 CPU` 核或更多
- 集群中的所有机器的网络彼此均能相互连接(公网和内网都可以)
- 节点之中不可以有重复的主机名、MAC 地址或 product_uuid。请参见[这里](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#verify-mac-address)了解更多详细信息。
- 开启机器上的某些端口。请参见[这里](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#check-required-ports) 了解更多详细信息。
- 禁用交换分区。为了保证 kubelet 正常工作，你 **必须** 禁用交换分区

更多见 https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/



## 2种 HA 集群方式

文档 https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/

### 堆叠（Stacked）etcd 

这种拓扑将控制平面和 etcd 成员耦合在同一节点上,设置简单.存在耦合失败的风险

![](/pics/etcd-stacked.png)



<!--more-->

### 外部 etcd 节点

这种拓扑结构解耦了控制平面和 etcd 成员.需要两倍于堆叠 HA 拓扑的主机数量

![](/pics/etcd-external.png)
