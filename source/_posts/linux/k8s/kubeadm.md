---
title: kubeadm容器化安装
permalink: linux/k8s/kubeadm/
tags:
  - kubeadm
categories:
  - linux
  - k8s
date: 2022-08-07 20:18:14
---

### docker

#### daemon.json

```shell
[vagrant@k8s ~]$ sudo vi /etc/docker/daemon.json
[vagrant@k8s ~]$ docker info | grep Driver
Storage Driver: overlay2
Logging Driver: json-file
Cgroup Driver: cgroupfs
[vagrant@k8s ~]$ sudo systemctl restart docker 
[vagrant@k8s ~]$ docker info | grep Driver
Storage Driver: overlay2
Logging Driver: json-file
Cgroup Driver: systemd
[vagrant@k8s ~]$ sudo cat  /etc/docker/daemon.json
{
 "exec-opts": ["native.cgroupdriver=systemd"],
 "insecure-registries":["https://k8s.org"]

}
```

>"exec-opts": ["native.cgroupdriver=systemd"]

 Error response from daemon: OCI runtime create failed: systemd cgroup flag passed, but systemd support for managing cgroups is not available



/etc/sysconfig/modules/ipvs.modules

```
cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- br_netfilter
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF
chmod 755 /etc/sysconfig/modules/ipvs.modules
```



```
 cat  /etc/sysctl.conf
net.ipv4.vs.conntrack=1
net.ipv4.vs.conn_reuse_mode=0
net.ipv4.vs.expire_nodest_conn=1
```





### 准备images list

```
./kubeadm config images list
I0809 21:56:57.334915    4785 version.go:254] remote version is much newer: v1.24.3; falling back to: stable-1.21
k8s.gcr.io/kube-apiserver:v1.21.14
k8s.gcr.io/kube-controller-manager:v1.21.14
k8s.gcr.io/kube-scheduler:v1.21.14
k8s.gcr.io/kube-proxy:v1.21.14
k8s.gcr.io/pause:3.4.1
k8s.gcr.io/etcd:3.4.13-0
k8s.gcr.io/coredns/coredns:v1.8.0
```

<!--more-->



### 依赖conntrack

![](/pics/k8s-not-ipvs-02.png)

```
yum -y install socat conntrack-tools
```



### init配置文件

#### 命令生成默认文件

```
kubeadm config print init-defaults  > config.yaml
```



```
#生成KubeletConfiguration示例文件 
kubeadm config print init-defaults --component-configs KubeletConfiguration

#生成KubeProxyConfiguration示例文件 
kubeadm config print init-defaults --component-configs KubeProxyConfiguration
```



```
ansible k8s-108 -m copy -a "src=/opt/kubernetes/client/k8s-1.21-11/bin/config.yaml dest=/opt/kubernetes  mode=0644"   -b --become-method sudo --become-user root
```





#### config.yaml

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: 192.168.56.108 #ip
  bindPort: 6443
nodeRegistration:
  criSocket: /var/run/dockershim.sock
  name: k8s # hostname “xxx” could not be reached
  taints: null
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta2
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns:
  type: CoreDNS
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: k8s.org/k8s  # 镜像仓库源
kind: ClusterConfiguration
kubernetesVersion: 1.21.12  #版本
networking:
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
scheduler: {}
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
failSwapOn: False
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
ipvs:
  minSyncPeriod: 0s
  scheduler: "rr"
  syncPeriod: 30s
mode: "ipvs"
```



#### kubectl

![](/pics/k8s-get-pend-01.png)

docker: network plugin is not ready: cni config uninitialized

[kubelet.service详解](/linux/k8s/kubelet#id-service)



### 初始化过程

```shell
[vagrant@k8s kubernetes]$ sudo ./bin/kubeadm   init --config config.yaml
W0809 20:30:08.653353    3073 kubelet.go:215] detected "cgroupfs" as the Docker cgroup driver, the provided value "systemd" in "KubeletConfiguration" will be overrided
[init] Using Kubernetes version: v1.21.12
[preflight] Running pre-flight checks
	[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
	[WARNING Service-Kubelet]: kubelet service is not enabled, please run 'systemctl enable kubelet.service'
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.56.108]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [k8s localhost] and IPs [192.168.56.108 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [k8s localhost] and IPs [192.168.56.108 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 12.505234 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.21" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node k8s as control-plane by adding the labels: [node-role.kubernetes.io/master(deprecated) node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node k8s as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: abcdef.0123456789abcdef
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.56.108:6443 --token abcdef.0123456789abcdef \
	--discovery-token-ca-cert-hash sha256:01661c34149742e27fa96db2f1c4a8d4675d2f0b5133f8cd25a45e031eb23653 
```



### 节点配置文件

```
kubeadm config print join-defaults > join-config.yaml
```





```
kubectl create clusterrolebinding kubelet-bootstrap --clusterrole=system:node-bootstrapper --user=kubelet-bootstrap
```

>error: failed to run Kubelet: cannot create certificate signing request: certificatesigningrequests.certificates.k8s.io is forbidden: User "kubelet-bootstrap" cannot create certificatesigningrequests.certificates.k8s.io at the cluster scope
>





### 网络插件podnetwork

https://kubernetes.io/docs/concepts/cluster-administration/addons/



#### flanneld

[查看flanneld.yaml](/linux/k8s/flanneld)

```shell
ansible k8s-108 -m copy -a "src=/home/cs/oss/0s/k8s/kube/kube-flanneld.yml  dest=/opt/kubernetes  mode=0644"   -b --become-method sudo --become-user root
```



```shell
[vagrant@k8s kubernetes]$ kubectl apply -f kube-flanneld.yaml 
Warning: policy/v1beta1 PodSecurityPolicy is deprecated in v1.21+, unavailable in v1.25+
podsecuritypolicy.policy/psp.flannel.unprivileged created
Warning: rbac.authorization.k8s.io/v1beta1 ClusterRole is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 ClusterRole
clusterrole.rbac.authorization.k8s.io/flannel created
Warning: rbac.authorization.k8s.io/v1beta1 ClusterRoleBinding is deprecated in v1.17+, unavailable in v1.22+; use rbac.authorization.k8s.io/v1 ClusterRoleBinding
clusterrolebinding.rbac.authorization.k8s.io/flannel created
serviceaccount/flannel created
configmap/kube-flannel-cfg created
daemonset.apps/kube-flannel-ds-amd64 created
```



#### calico

https://docs.projectcalico.org/getting-started/kubernetes/self-managed-onprem/onpremises

calico.yaml https://docs.projectcalico.org/manifests/calico.yaml



### kubectl权限

#### ~/.kube/config

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```





### 组件状态cs

#### Unhealthy 

![](/pics/k8s-get-cs-01.png)



注释`port=0`行

```shell
[vagrant@k8s kubernetes]$ sudo sed -i '/port=0/s/^/#/'  /etc/kubernetes/manifests/kube-controller-manager.yaml
[vagrant@k8s kubernetes]$ sudo sed -i '/port=0/s/^/#/'  /etc/kubernetes/manifests/kube-scheduler.yaml
```

![](/pics/k8s-get-cs-02.png)



### 加入集群

集群初始化时的添加命令

```
kubeadm join 192.168.56.108:6443 --token abcdef.0123456789abcdef \
	--discovery-token-ca-cert-hash sha256:01661c34149742e27fa96db2f1c4a8d4675d2f0b5133f8cd25a45e031eb23653
```

命令方式获取join参数

```
kubeadm token create --print-join-command
```





重新生成certificate-key,生成用于加入控制平面的secret

```
kubeadm init phase upload-certs --upload-certs
```

> Using certificate key:xxxx



#### 加入控制节点

```
kubeadm join 192.168.56.108:6443 --token abcdef.0123456789abcdef \
	--discovery-token-ca-cert-hash sha256:01661c34149742e27fa96db2f1c4a8d4675d2f0b5133f8cd25a45e031eb23653    --control-plane --certificate-key xxxx
```







### Pending状态

```
kubectl logs kube-flannel-ds-amd64-7wjtn -n kube-system
```

> Error registering network: failed to acquire lease: node "k8s" pod cidr not assigned

![](/pics/k8s-get-node-01.png)

master节点一直notready  和  coredns pod一直pending

安装flannel

![](/pics/k8s-get-node-02.png)



### pod-network-cidr

#### 修改 

--pod-network-cidr

```
1）kubectl -n kube-system edit cm kubeadm-config
2）vim /etc/kubernetes/manifests/kube-scheduler.yaml
```

#### 检查配置

```
kubectl cluster-info dump | grep -m 1 cluster-cidr
```

**kube-proxy的cluster-cidr与kuber-controller-manager的cluster-cidr**





```objectivec
 kubectl scale deployment --replicas=0 dns-autoscaler -n kube-system
deployment.extensions/dns-autoscaler scaled
# kubectl patch deployment coredns -p '{"spec":{"replicas":17}}' -n kube-system
deployment.extensions/coredns patched
# kubectl get pod -n kube-system |grep coredns |wc -l
```



### 重启

```
systemctl status kubelet
sudo systemctl start kubelet
```

> *静态 Pod* 在指定的节点上由 kubelet 守护进程直接管理，不需要 [API 服务器](https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/) 监管,kubelet 监视每个静态 Pod（在它崩溃之后重新启动）
>
> –pod-manifest-path=

#### 常见的 Static Pod

- etcd
- kube-apiserver
- kube-controller-manager
- kube-scheduler



### 卸载

```shell
sudo kubeadm reset -f
sudo rm -rf /var/lib/etcd /var/lib/kubelet /var/lib/dockershim /var/run/kubernetes /var/lib/cni /etc/kubernetes
```





### 多集群

#### 多个配置

一台机器管理多个集群

```shell
cs@debian:~$ ls -l ~/.kube/
总用量 36
drwxr-x--- 3 cs cs 4096 4月  20 14:37 cache
-rw------- 1 cs cs 9852 8月  10 21:58 config
-rw-r--r-- 1 cs cs 5597 8月  10 21:56 config1   #k8s 容器部署
-rw------- 1 cs cs 6201 8月   6 16:57 config2   #kubernetes二进制部署
drwxr-x--- 3 cs cs 4096 8月  10 21:58 http-cache
```

#### 合并配置

```shell
$ KUBECONFIG=/home/cs/.kube/config1:/home/cs/.kube/config2 kubectl config view --flatten >/home/cs/.kube/config
```

![](/pics/k8s-view-cluster.png)



#### 获取集群配置

```shell
cs@debian:~$ kubectl config get-contexts
CURRENT   NAME                   CLUSTER      AUTHINFO           NAMESPACE
          admin@kubernetes       kubernetes   admin              
*         kubernetes-admin@k8s   k8s          kubernetes-admin  
```

##### 容器部署

```
cs@debian:~$ kubectl get cs
NAME                 STATUS    MESSAGE             ERROR
scheduler            Healthy   ok                  
controller-manager   Healthy   ok                  
etcd-0               Healthy   {"health":"true"}   
cs@debian:~$ kubectl get node
NAME   STATUS   ROLES                  AGE     VERSION
k8s    Ready    control-plane,master   4m57s   v1.21.11
```





#### 换集群

use-context

```shell
#当前集群
cs@debian:~$ kubectl config current-context   
kubernetes-admin@k8s

cs@debian:~$ kubectl config use-context admin@kubernetes   
Switched to context "admin@kubernetes".
```

##### 二进制部署

```shell
cs@debian:~$ kubectl get cs
NAME                 STATUS    MESSAGE              ERROR
scheduler            Healthy   ok                   
controller-manager   Healthy   ok                   
etcd-1               Healthy   {"health": "true"}   
etcd-0               Healthy   {"health": "true"}   
etcd-2               Healthy   {"health": "true"}   
cs@debian:~$ kubectl get node
NAME       STATUS     ROLES    AGE    VERSION
master02   Ready      <none>   121d   v1.18.8
master03   Ready      <none>   121d   v1.18.8
node04     Ready      <none>   121d   v1.18.8
node05     NotReady   <none>   121d   v1.18.8
node06     Ready      <none>   121d   v1.18.8
```





![](/pics/k8s-more-cluster.png)

> current-context 显示 current_context
> delete-cluster  删除 kubeconfig 文件中指定的集群
> delete-context  删除 kubeconfig 文件中指定的 context
> get-clusters    显示 kubeconfig 文件中定义的集群
> get-contexts    描述一个或多个 contexts
> rename-context  从 kubeconfig 文件重命名上下文。
> set             设置 kubeconfig 文件中的一个单个值
> set-cluster     设置 kubeconfig 文件中的一个集群条目
> set-context     设置 kubeconfig 文件中的一个 context 条目
> set-credentials 设置 kubeconfig 文件中的一个用户条目
> unset           取消设置 kubeconfig 文件中的一个单个值
> use-context     设置 kubeconfig 文件中的当前上下文
> view            显示合并的 kubeconfig 配置或一个指定的 kubeconfig 文件



