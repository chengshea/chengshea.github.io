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

1.26.1  需要>=go1.19 [go env](/lang/go/environment#go_env)

```
mkdir -p $GOPATH/src/k8s.io
cd $GOPATH/src/k8s.io
git clone https://github.com/kubernetes/kubernetes
cd kubernetes
make
```



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







```
str=$(./bin/kubeadm  --image-repository registry.aliyuncs.com/google_containers config images list)
arr=${str//registry.aliyuncs.com\/google_containers/k8s.org\/k8s}

for i in ${arr}; do  docker push $i ;done
```

> for i in $(docker images | grep 'v1.26.1' | awk 'BEGIN{OFS=":"}{print $1,$2}'); do echo docker push $i ;done





### kubectl

https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/



```
cat > /opt/kubernetes/kubelet.env <<EOF
 KUBELET_OPTIONS=" --hostname-override=k8s01  \\
 --pod-infra-container-image=k8s.org/k8s/pause:3.9 \\
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
kubeadm  images pull  --config=config.yaml
```



### 初始化

```
kubeadm init --config=/opt/kubeadm-config.yaml
```

<details>
<summary>初始化详情</summary>
<pre><code>    
[init] Using Kubernetes version: v1.26.1
[preflight] Running pre-flight checks
	[WARNING Firewalld]: firewalld is active, please ensure ports [6443 10250] are open or your cluster may not function correctly
	[WARNING Service-Kubelet]: kubelet service is not enabled, please run 'systemctl enable kubelet.service'
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s01 kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.122.11]
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
[apiclient] All control plane components are healthy after 19.003703 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node k8s01 as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node k8s01 as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: abcdef.0123456789abcdef
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy  </br>
Your Kubernetes control-plane has initialized successfully! </br>
To start using your cluster, you need to run the following as a regular user: </br>
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config  </br>
Alternatively, if you are the root user, you can run: </br>
export KUBECONFIG=/etc/kubernetes/admin.conf </br>
You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
https://kubernetes.io/docs/concepts/cluster-administration/addons/ </br>
Then you can join any number of worker nodes by running the following on each as root: </br>
kubeadm join 192.168.122.11:6443 --token abcdef.0123456789abcdef \
	--discovery-token-ca-cert-hash sha256:b2eb1f6a397d38a0d3c62adf0981aca978a9d1d4ad7ed82c7519ed2405dcdcf0 
</code></pre>
</details>


### 运行 kubectl

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








### 卸载清理

```bash
kubeadm reset -f
rm -rf /var/lib/etcd /var/lib/kubelet /var/lib/dockershim /var/run/kubernetes /var/lib/cni /etc/kubernetes
```











