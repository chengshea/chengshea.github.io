---
title: k8s1.26.1编译部署
permalink: linux/k8s/k8s-compile/
tags:
  - k8s1.26.1编译部署
  - xx
  - xxx
categories:
  - linux
  - k8s
  - k8s-compile
date: 2023-02-28 17:05:27
---

k8s去docker,1.24版本移除 Dockershim https://kubernetes.io/zh-cn/blog/2022/02/17/dockershim-faq/

## kubernetes

### 准备

1.26.1  需要>=go1.19 [go env](/lang/go/environment#go_env)

```
mkdir -p $GOPATH/src/k8s.io
cd $GOPATH/src/k8s.io
git clone https://github.com/kubernetes/kubernetes
cd kubernetes
make
```

>#编译指定组件
>
>$ make WHAT=cmd/kubelet
>+++ [0325 21:01:36] Building go targets for linux/amd64
>    k8s.io/kubernetes/cmd/kubelet (non-static)
>
>
>
>$ make kubectl kubeadm kubelet  
>+++ [0325 21:19:43] Building go targets for linux/amd64
>    k8s.io/kubernetes/cmd/kubectl (static)
>
>+++ [0325 21:21:23] Building go targets for linux/amd64
>    k8s.io/kubernetes/cmd/kubeadm (static)
>
>+++ [0325 21:19:45] Building go targets for linux/amd64
>    k8s.io/kubernetes/cmd/kubelet (non-static)

#### network

<!--more-->



```
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 设置所需的 sysctl 参数，参数在重新启动后保持不变
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 应用 sysctl 参数而不重新启动
sudo sysctl --system
```



#### swap/firewalld

```
swapoff -a
sed -n '/swap/s/^/#/'p /etc/fstab
sed -i '/swap/s/^/#/' /etc/fstab
sed  -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config
systemctl stop firewalld.service && systemctl disable firewalld.service 
```







```
str=$(./bin/kubeadm  --image-repository registry.aliyuncs.com/google_containers config images list)
arr=${str//registry.aliyuncs.com\/google_containers/k8s.org\/k8s}

for i in ${arr}; do  docker push $i ;done
```

> for i in $(docker images | grep 'v1.26.1' | awk 'BEGIN{OFS=":"}{print $1,$2}'); do echo docker push $i ;done



### CRI

https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/



#### containerd

[containerd 安装](/linux/k8s/containerd#containerd)





### kubelet





```
cat > /opt/kubernetes/kubelet.env <<EOF
 KUBELET_OPTIONS=" --hostname-override=k8s01  \\
 --pod-infra-container-image=k8s.org/k8s/pause:3.9 \\
 --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf    \\
 --kubeconfig=/etc/kubernetes/kubelet.conf    \\
 --config=/var/lib/kubelet/config.yaml     \\
 --container-runtime-endpoint=unix:///run/containerd/containerd.sock \\
 --runtime-cgroups=/systemd "
EOF
```



```
cat >/usr/lib/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubernetes Kubelet Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=containerd.service
Requires=containerd.service

[Service]
WorkingDirectory=/var/lib/kubelet
EnvironmentFile=/opt/kubernetes/kubelet.env
ExecStart=/usr/local/bin/kubelet  \$KUBELET_OPTIONS
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```



```
systemctl daemon-reload &&  systemctl enable kubelet
```



### 使用自定义的镜像

```
 kubeadm config print init-defaults>kubeadm.yaml 

# images pull  
kubeadm config images pull --config /opt/kubeadm.yaml
```



### 初始化

#### 依赖

![](/pics/conntrack.png)

```
yum install --downloadonly --downloaddir=/tmp/pages  conntrack-tools 
yum install --downloadonly --downloaddir=/tmp/pages socat
```



##### socat

```
# rpm -ivh /tmp/pages/socat-1.7.3.2-2.el7.x86_64.rpm 
warning: /tmp/pages/socat-1.7.3.2-2.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:socat-1.7.3.2-2.el7              ################################# [100%]
```

>特点就是在两个数据流之间建立通道
>
>http://mirror.centos.org/centos/7/os/x86_64/Packages/socat-1.7.3.2-2.el7.x86_64.rpm



##### conntrack

```
# rpm -ivh /tmp/pages/libnetfilter_*.rpm
warning: /tmp/pages/libnetfilter_cthelper-1.0.0-11.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:libnetfilter_queue-1.0.2-2.el7_2 ################################# [ 33%]
   2:libnetfilter_cttimeout-1.0.0-7.el################################# [ 67%]
   3:libnetfilter_cthelper-1.0.0-11.el################################# [100%]
   
# rpm -ivh /tmp/pages/conntrack-tools-1.4.4-7.el7.x86_64.rpm 
warning: /tmp/pages/conntrack-tools-1.4.4-7.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:conntrack-tools-1.4.4-7.el7      ################################# [100%]
```



>跟踪并且记录连接状态　
>
>conntrack-tools　http://mirror.centos.org/centos/7/os/x86_64/Packages/conntrack-tools-1.4.4-7.el7.x86_64.rpm
>
>依赖
>
>http://mirror.centos.org/centos/7/os/x86_64/Packages/libnetfilter_cttimeout-1.0.0-7.el7.x86_64.rpm
>
>http://mirror.centos.org/centos/7/os/x86_64/Packages/libnetfilter_cthelper-1.0.0-11.el7.x86_64.rpm
>
>http://mirror.centos.org/centos/7/os/x86_64/Packages/libnetfilter_queue-1.0.2-2.el7_2.x86_64.rpm



#### init 

自定义初始化

 https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file

https://kubernetes.io/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/

```
#主节点
kubeadm config print init-defaults >init.yaml

kubeadm init --config=/opt/init-kubeadm.yaml
```



<details>
  <summary>init-kubeadm.yaml折叠</summary>
  <pre><a>/opt/init-kubeadm.yaml</a><code>
apiVersion: kubeadm.k8s.io/v1beta3
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: ujogs9.ntea26wujtca8fjb
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: 192.168.122.11
  bindPort: 6443
certificateKey: 228bfe0e01e9456c981455b81abad41a067b9ca31bf9f91a692a778115cb9b7a
nodeRegistration:
  criSocket: unix:///var/run/containerd/containerd.sock
  imagePullPolicy: IfNotPresent
  name: k8s01
  taints: null
---
apiServer:
  extraArgs:
    etcd-servers: https://192.168.122.11:2379,https://192.168.122.12:2379,https://192.168.122.13:2379
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta3
certificatesDir: /etc/kubernetes/pki
clusterName: cs
controllerManager:
  extraArgs:
    "allocate-node-cidrs": "true"
    "cluster-cidr": "121.21.0.0/16"
    "node-cidr-mask-size": "20"
dns: {}
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: k8s.org/k8s
kind: ClusterConfiguration
kubernetesVersion: 1.26.1
controlPlaneEndpoint: k8s.org:6443
networking:
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
  podSubnet: 121.21.0.0/16
scheduler:
  extraArgs:
    log-flush-frequency: 6s
---
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 121.21.0.0
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging:
  flushFrequency: 0
  options:
    json:
      infoBufferSize: "0"
  verbosity: 0
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
bindAddress: 0.0.0.0
bindAddressHardFail: false
clientConnection:
  acceptContentTypes: ""
  burst: 0
  contentType: ""
  kubeconfig: /var/lib/kube-proxy/kubeconfig.conf
  qps: 0
clusterCIDR: "121.21.0.0"
AllocateNodeCIDRs: true
configSyncPeriod: 0s
conntrack:
  maxPerCore: null
  min: null
  tcpCloseWaitTimeout: null
  tcpEstablishedTimeout: null
detectLocal:
  bridgeInterface: ""
  interfaceNamePrefix: ""
detectLocalMode: ""
enableProfiling: false
healthzBindAddress: ""
hostnameOverride: ""
iptables:
  localhostNodePorts: null
  masqueradeAll: false
  masqueradeBit: null
  minSyncPeriod: 0s
  syncPeriod: 0s
ipvs:
  excludeCIDRs: null
  minSyncPeriod: 0s
  scheduler: "rr"
  strictARP: false
  syncPeriod: 30s
  tcpFinTimeout: 0s
  tcpTimeout: 0s
  udpTimeout: 0s
kind: KubeProxyConfiguration
metricsBindAddress: ""
mode: "ipvs"
nodePortAddresses: null
oomScoreAdj: null
portRange: ""
showHiddenMetricsForVersion: ""
winkernel:
  enableDSR: false
  forwardHealthCheckVip: false
  networkName: ""
  rootHnsEndpointName: ""
  sourceVip: ""
  </code></pre>
</details>



<details>
  <summary>初始化详情</summary>
  <pre><a>初始化过程</a><code>
[root@base ~]# kubeadm init --config /opt/kubeadm.yaml 
[init] Using Kubernetes version: v1.26.1
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [base kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.122.6]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [base localhost] and IPs [192.168.122.6 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [base localhost] and IPs [192.168.122.6 127.0.0.1 ::1]
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
[apiclient] All control plane components are healthy after 26.502067 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node base as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node base as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: abcdef.0123456789abcdef
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy
</br>
Your Kubernetes control-plane has initialized successfully!
</br>
To start using your cluster, you need to run the following as a regular user:
</br>
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
</br>
Alternatively, if you are the root user, you can run:
</br>
  export KUBECONFIG=/etc/kubernetes/admin.conf
</br>
You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/
</br>
Then you can join any number of worker nodes by running the following on each as root:
</br>
kubeadm join 192.168.122.6:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:a5b9ef128064a6c279cd2dc0d738ae2b4d4d8d993ccead6f7e2e9b8ec0d2d9d7   </code></pre>
</details>





### 运行 kubectl

https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/



https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/

The connection to the server localhost:8080 was refused - did you specify the right host or port?  需要配置

非root用户

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```



root用户

```
# echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> /etc/profile
# source /etc/profile
# kubectl get node
NAME    STATUS     ROLES           AGE   VERSION
k8s01   NotReady   control-plane   27m   v1.26.1
```



### 密钥

https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/#cmd-token-create

>kubeadm join k8s.org:6443 --token $1 \
>
>--discovery-token-ca-cert-hash sha256:$2  \
>
>--control-plane --certificate-key $3



#### token

```
kubeadm token generate
```

> 
>
> kubeadm token  list  #查看token



#### discovery-token-ca-cert-hash

```
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa \
-pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```





#### certificate-key

```
#--upload-certs  certificateKey
# kubeadm certs certificate-key
228bfe0e01e9456c981455b81abad41a067b9ca31bf9f91a692a778115cb9b7a

##更新
kubeadm init phase upload-certs --upload-certs
```

> W0314 19:18:31.841138    5585 version.go:104] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get "https://dl.k8s.io/release/stable-1.txt": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
> W0314 19:18:31.841320    5585 version.go:105] falling back to the local client version: v1.26.1
> [upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
> [upload-certs] Using certificate key:
> 58c8e04a2e479d3f10274eff43988d626f627e49ecc1ebb3463f8aedf50ccfda
>
> 
>
> sed -n "/certificateKey/s/:.*/: 58c8e04a2e479d3f10274eff43988d626f627e49ecc1ebb3463f8aedf50ccfda/"p /opt/join.yaml



```
kubeadm init phase upload-certs --upload-certs --config=SOME_YAML_FILE
```







### join 

#### command

#####  master

```
kubeadm join k8s.org:6443 --token $1 \
--discovery-token-ca-cert-hash sha256:$2  \
--control-plane --certificate-key $3
```

>kubeadm join k8s.org:6443 --token l860je.2f4ox4tb166kui7l --discovery-token-ca-cert-hash sha256:4533b6361be151af712c014c0b1c2eb52f902f52ff292f63ccc258c58d9e59be  --control-plane --certificate-key 56a92754164260b76bbe525f0e60059b6eea38d2ef07f42231a2c3bebfd18bbf




#####  node

```
#重新生成
kubeadm token create    --print-join-command
```

> kubeadm join k8s.org:6443 --token q3paz2.w5zohvudzrsltrh3 --discovery-token-ca-cert-hash sha256:8f1ac78f64629c049a2e0e8a8e8fa83f29e92e6801ca1a1d27cc3e06ecef9943
> 





https://kubernetes.io/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/#kubeadm-k8s-io-v1beta3-ClusterConfiguration



##### controlPlane

```
#第一个主节点
kubeadm config print init-defaults >init.yaml

#后续控制面板 controlPlane
kubeadm config print join-defaults >join.yaml
kubeadm config print join-defaults --component-configs KubeletConfiguration
```



初始化文件

<details>
  <summary>init-kubeadm.yaml</summary>
  <pre><a>cat  /opt/init-kubeadm.yaml</a><code>
apiVersion: kubeadm.k8s.io/v1beta3
caCertPath: /etc/kubernetes/pki/ca.crt
discovery:
  bootstrapToken:
    apiServerEndpoint: k8s.org:6443
    token: yl0hvd.mv683yn2rljdrigk
    unsafeSkipCAVerification: true
  timeout: 5m0s
  tlsBootstrapToken: yl0hvd.mv683yn2rljdrigk
kind: JoinConfiguration
nodeRegistration:
  criSocket: unix:///var/run/containerd/containerd.sock
  imagePullPolicy: IfNotPresent
  name: k8s01
  taints: null
controlPlane:
  localAPIEndpoint:
    advertiseAddress: 192.168.122.11
    bindPort: 6443
  certificateKey: 66b4704450dd461f02f56c81b9c323363c0e2a077a1a5619aaab7b58eb953be9
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta3
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns: {}
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: k8s.org/k8s
kind: ClusterConfiguration
kubernetesVersion: 1.26.1
networking:
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
controlPlaneEndpoint: k8s.org:6443  #集群
scheduler: {}
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
failSwapOn: false
# clusterDNS:
# - 10.96.0.10
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
ipvs:
  minSyncPeriod: 0s
  scheduler: "rr"
  syncPeriod: 30s
mode: "ipvs"  </code></pre>
</details>



<details>
  <summary>控制面板初始化详情</summary>
  <pre><a>kubeadm join --config /opt/join.yaml</a><code>
W0319 19:08:00.540407   31325 initconfiguration.go:305] error unmarshaling configuration schema.GroupVersionKind{Group:"kubeproxy.config.k8s.io", Version:"v1alpha1", Kind:"KubeProxyConfiguration"}: strict decoding error: unknown field "AllocateNodeCIDRs"
W0319 19:08:00.541712   31325 configset.go:177] error unmarshaling configuration schema.GroupVersionKind{Group:"kubeproxy.config.k8s.io", Version:"v1alpha1", Kind:"KubeProxyConfiguration"}: strict decoding error: unknown field "AllocateNodeCIDRs"
W0319 19:08:00.543375   31325 utils.go:69] The recommended value for "clusterCIDR" in "KubeProxyConfiguration" is: 121.21.0.0/16; the provided value is: 121.21.0.0
W0319 19:08:00.543398   31325 utils.go:69] The recommended value for "clusterDNS" in "KubeletConfiguration" is: [10.96.0.10]; the provided value is: [121.21.0.0]
[init] Using Kubernetes version: v1.26.1
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s.org k8s01 kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.122.11]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [k8s01 localhost] and IPs [192.168.122.11 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [k8s01 localhost] and IPs [192.168.122.11 127.0.0.1 ::1]
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
[apiclient] All control plane components are healthy after 18.528146 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node k8s01 as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node k8s01 as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: ujogs9.ntea26wujtca8fjb
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy
</br>
Your Kubernetes control-plane has initialized successfully!
</br>
To start using your cluster, you need to run the following as a regular user:
</br>
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
</br>
Alternatively, if you are the root user, you can run:
</br>
  export KUBECONFIG=/etc/kubernetes/admin.conf
</br>
You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/
</br>
You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following as root:
</br>
  kubeadm join k8s.org:6443 --token ujogs9.ntea26wujtca8fjb \
	--discovery-token-ca-cert-hash sha256:a51e48270ff979d72adbedc004ba7aad363623120ed9e24e9a6409e2ba5fde37 \
	--control-plane --certificate-key 228bfe0e01e9456c981455b81abad41a067b9ca31bf9f91a692a778115cb9b7a
</br>
Then you can join any number of worker nodes by running the following on each as root:
</br>
kubeadm join k8s.org:6443 --token ujogs9.ntea26wujtca8fjb \
	--discovery-token-ca-cert-hash sha256:a51e48270ff979d72adbedc004ba7aad363623120ed9e24e9a6409e2ba5fde37 
  </code></pre>
</details>

直接在其他控制面板执行报错

> error execution phase control-plane-prepare/download-certs: error downloading certs: error downloading the secret: secrets "kubeadm-certs" is forbidden: User "system:bootstrap:ujogs9" cannot get resource "secrets" in API group "" in the namespace "kube-system"

执行命令生成certificatekey,用新生成的替换原有值在其他控制面板执行加入

```
kubeadm init phase upload-certs --upload-certs
```

>W0319 19:11:21.959770   32656 version.go:104] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get "https://dl.k8s.io/release/stable-1.txt": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
>W0319 19:11:21.960020   32656 version.go:105] falling back to the local client version: v1.26.1
>[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
>[upload-certs] Using certificate key:
>0240fc6ba87ada32042b73469103b5577df42603289429ea38f0c5789fc6f9c7



<details>
  <summary>join 控制模板初始化详情</summary>
  <pre><a>kubeadm join k8s.org:6443 --token ujogs9.ntea26wujtca8fjb \
   --discovery-token-ca-cert-hash sha256:a51e48270ff979d72adbedc004ba7aad363623120ed9e24e9a6409e2ba5fde37 \
  --control-plane --certificate-key 228bfe0e01e9456c981455b81abad41a067b9ca31bf9f91a692a778115cb9b7a
[preflight] Running pre-flight checks
</a><code>
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
W0319 19:10:37.146702   22564 utils.go:69] The recommended value for "clusterCIDR" in "KubeProxyConfiguration" is: 121.21.0.0/16; the provided value is: 121.21.0.0
W0319 19:10:37.146747   22564 utils.go:69] The recommended value for "clusterDNS" in "KubeletConfiguration" is: [10.96.0.10]; the provided value is: [121.21.0.0]
[preflight] Running pre-flight checks before initializing the new control plane instance
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[download-certs] Downloading the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
error execution phase control-plane-prepare/download-certs: error downloading certs: error downloading the secret: secrets "kubeadm-certs" is forbidden: User "system:bootstrap:ujogs9" cannot get resource "secrets" in API group "" in the namespace "kube-system"
To see the stack trace of this error execute with --v=5 or higher
[root@k8s03 ~]# kubeadm join k8s.org:6443 --token ujogs9.ntea26wujtca8fjb --discovery-token-ca-cert-hash sha256:a51e48270ff979d72adbedc004ba7aad363623120ed9e24e9a6409e2ba5fde37 --control-plane --certificate-key 0240fc6ba87ada32042b73469103b5577df42603289429ea38f0c5789fc6f9c7
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
W0319 19:11:33.434784   22613 utils.go:69] The recommended value for "clusterCIDR" in "KubeProxyConfiguration" is: 121.21.0.0/16; the provided value is: 121.21.0.0
W0319 19:11:33.434827   22613 utils.go:69] The recommended value for "clusterDNS" in "KubeletConfiguration" is: [10.96.0.10]; the provided value is: [121.21.0.0]
[preflight] Running pre-flight checks before initializing the new control plane instance
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[download-certs] Downloading the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[download-certs] Saving the certificates to the folder: "/etc/kubernetes/pki"
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [k8s03 localhost] and IPs [192.168.122.13 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [k8s03 localhost] and IPs [192.168.122.13 127.0.0.1 ::1]
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s.org k8s03 kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.122.13]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[certs] Using the existing "sa" key
[kubeconfig] Generating kubeconfig files
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[check-etcd] Checking that the etcd cluster is healthy
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...
[etcd] Announced new etcd member joining to the existing etcd cluster
[etcd] Creating static Pod manifest for "etcd"
[etcd] Waiting for the new etcd member to join the cluster. This can take up to 40s
The 'update-status' phase is deprecated and will be removed in a future release. Currently it performs no operation
[mark-control-plane] Marking the node k8s03 as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node k8s03 as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
</br>
This node has joined the cluster and a new control plane instance was created:
</br>
* Certificate signing request was sent to apiserver and approval was received.
* The Kubelet was informed of the new secure connection details.
* Control plane label and taint were applied to the new node.
* The Kubernetes control plane instances scaled up.
* A new etcd member was added to the local/stacked etcd cluster.
</br>
To start administering your cluster from this node, you need to run the following as a regular user:
</br>
	mkdir -p $HOME/.kube
	sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
	sudo chown $(id -u):$(id -g) $HOME/.kube/config
</br>
Run 'kubectl get nodes' to see this node join the cluster.
  </code></pre>
</details>


#### yaml 

截止v1.26都是beta版本

https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/

![](/pics/config-beta.png)



##### controlPlane

```
#后续控制面板 controlPlane
kubeadm config print join-defaults >join.yaml
kubeadm config print join-defaults --component-configs KubeletConfiguration
```



配置中需要有controlPlane

待补充




##### worker

<details>
  <summary>join-worker.yaml</summary>
  <pre><a>join-worker</a><code>
apiVersion: kubeadm.k8s.io/v1beta3
caCertPath: /etc/kubernetes/pki/ca.crt
discovery:
  bootstrapToken:
    apiServerEndpoint: kube-apiserver:6443
    token: abcdef.0123456789abcdef
    unsafeSkipCAVerification: true
  timeout: 5m0s
  tlsBootstrapToken: abcdef.0123456789abcdef
kind: JoinConfiguration
nodeRegistration:
  criSocket: unix:///var/run/containerd/containerd.sock
  imagePullPolicy: IfNotPresent
  name: debian
  taints: null
  </code></pre>
</details>






### 运行 kubectl

https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/



https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/

The connection to the server localhost:8080 was refused - did you specify the right host or port?  需要配置

非root用户

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```



root用户

```
# echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> /etc/profile
# source /etc/profile
# kubectl get node
NAME    STATUS     ROLES           AGE   VERSION
k8s01   NotReady   control-plane   27m   v1.26.1
```





### etcd





>find /tmp/  -name ca.key -type f 
>/tmp/pki/etcd/ca.key
>/tmp/pki/ca.key



### flannel



ContainerCreating





### edit



```
kubectl edit cm kube-proxy -n kube-system

#删除pod
kubectl get pod  -n  kube-system | grep kube-proxy | awk '{system("kubectl delete pod "$1" -n kube-system")}'
```







### 删除pod



```
 kubectl delete pod xxx  -n kube-system --grace-period=0 --force
```



[Terminating状态](https://support.huaweicloud.com/cce_faq/cce_faq_00277.html)








### 卸载清理

```bash
kubeadm reset -f
rm -rf /var/lib/etcd /var/lib/kubelet /var/lib/dockershim /var/run/kubernetes /var/lib/cni /etc/kubernetes
```







### 证书过期

```

$ cd /etc/kubernetes/pki/
$ mv {apiserver.crt,apiserver-etcd-client.key,apiserver-kubelet-client.crt,front-proxy-ca.crt,front-proxy-client.crt,front-proxy-client.key,front-proxy-ca.key,apiserver-kubelet-client.key,apiserver.key,apiserver-etcd-client.crt} ~/
$ kubeadm init phase certs all
$ cd /etc/kubernetes/
$ mv {admin.conf,controller-manager.conf,kubelet.conf,scheduler.conf} ~/
$ kubeadm init phase kubeconfig all
$ reboot
$ cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
```





```
kubeadm    join  k8s.org:6443   --config /opt/join.yaml

systemctl  status  kubelet


```



```


```

>Failed to get system container stats" err="failed to get cgroup stats for \"/systemd\": failed to get container info for \"/systemd\": unknown container \"/systemd\"" containerName="/systemd"
>
>https://github.com/kubernetes/kubernetes/issues/56850
>https://github.com/kubermatic/machine-controller/pull/476
>https://github.com/kubernetes/kubernetes/issues/56850#issuecomment-406241077









```
kube-dns查看token
#查看所有账号
kubectl -n kube-system get sa

取得secrets
kubectl -n kube-system get sa kube-dns -o yaml 取得secrets
#secrets值为kube-dns-token-rst6j

取得token
kubectl get secrets kube-dns-token-rst6j -n kube-system -o yaml

取得token值
kubectl get secret kube-dns-token-rst6j -n kube-system -o jsonpath={".data.token"}

tokne转码
kubectl get secret kube-dns-token-rst6j -n kube-system -o jsonpath={".data.token"}| base64 -d

```



[使用 kubeadm 进行证书管理](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)





```
kubectl get secrets  -n kube-system
NAME                     TYPE                            DATA   AGE
bootstrap-token-uxzaiw   bootstrap.kubernetes.io/token   6      28m

[root@k8s01 ~]# kubectl describe  secrets  -n kube-system
Name:         bootstrap-token-uxzaiw
Namespace:    kube-system
Labels:       <none>
Annotations:  <none>

Type:  bootstrap.kubernetes.io/token

Data
====
auth-extra-groups:               47 bytes
expiration:                      20 bytes
token-id:                        6 bytes
token-secret:                    16 bytes
usage-bootstrap-authentication:  4 bytes
usage-bootstrap-signing:         4 bytes

```

>
>
>[download-certs] Downloading the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
>error execution phase control-plane-prepare/download-certs: error downloading certs: error downloading the secret: secrets "kubeadm-certs" is forbidden: User "system:bootstrap:uxzaiw" cannot get resource "secrets" in API group "" in the namespace "kube-system"
>To see the stack trace of this error execute with --v=5 or higher





```
for i in $(sudo virsh list --name);do sudo virsh shutdown $i;done
```

