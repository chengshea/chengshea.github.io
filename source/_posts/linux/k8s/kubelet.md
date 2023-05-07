---
title: kubelet组件
permalink: linux/k8s/kubelet/
tags:
  - kubelet
categories:
  - linux
  - k8s
date: 2022-08-17 21:27:19
---





#### 二进制

version 1.18

##### kubelet.env

```shell
[vagrant@k8s kubernetes]$ cat > /opt/kubernetes/kubelet/kubelet.env <<EOF
KUBELET_OPTIONS=" --pod-infra-container-image=k8s.org/k8s/pause:3.2   \
--bootstrap-kubeconfig=/opt/kubernetes/config/bootstrap.kubeconfig   \
--kubeconfig=/opt/kubernetes/config/kubelet.kubeconfig   \
--config=/opt/kubernetes/kubelet/kubelet-config.yaml    \
--cni-bin-dir=/opt/kubernetes/cni/bin    \
--cni-conf-dir=/opt/kubernetes/cni/net.d    \
--network-plugin=cni    \
-runtime-cgroups=/systemd/system.slice    \
--log-dir=/var/log/kubernetes/kubelet     \
--logtostderr=false    \
--v=2"
EOF
```

<!--more-->

##### kubelet-config.yaml

```
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.56.102"
port: 10250
healthzBindAddress: "192.168.56.102"
healthzPort: 10248
readOnlyPort: 0
cgroupDriver: "cgroupfs"
clusterDomain: "cluster.local"
clusterDNS: ["121.21.0.0"]
failSwapOn: false
tlsCertFile: "/opt/kubernetes/pem/kubelet.pem"
tlsPrivateKeyFile: "/opt/kubernetes/pem/kubelet-key.pem"
authentication:
    x509:
        clientCAFile: "/opt/kubernetes/pem/ca.pem"
    webhook:
        enabled: true
        cacheTTL: "2m0s"
    anonymous:
        enabled: false
authorization:
    mode: Webhook
    webhook:
        cacheAuthorizedTTL: "5m0s"
        cacheUnauthorizedTTL: "30s"
hairpinMode: "promiscuous-bridge"
serializeImagePulls: false
featureGates:
    RotateKubeletClientCertificate: true
    RotateKubeletServerCertificate: true
```



#### 容器

version 1.22

##### kubelet.env

```shell
[vagrant@k8s kubernetes]$ cat > /opt/kubernetes/kubelet.env <<EOF
 KUBELET_OPTIONS=" --hostname-override=k8s  \
 --pod-infra-container-image=k8s.org/k8s/pause:3.4.1 \
 --kubeconfig=/etc/kubernetes/kubelet.conf    \
 --config=/var/lib/kubelet/config.yaml     \
 --register-node=true        \
 --runtime-cgroups=/systemd/system.slice    \
 --logtostderr=true "
EOF
```

> --network-plugin=cni  **去掉**



##### kubelet.conf

/etc/kubernetes/kubelet.conf

```
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: xxxx..xxxxxxx==
    server: https://192.168.56.108:6443
  name: k8s
contexts:
- context:
    cluster: k8s
    user: system:node:k8s
  name: system:node:k8s@k8s
current-context: system:node:k8s@k8s
kind: Config
preferences: {}
users:
- name: system:node:k8s
  user:
    client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
    client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
```



##### config.yaml

/var/lib/kubelet/config.yaml

```
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
cgroupDriver: cgroupfs
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
failSwapOn: false
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
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
```



#### service

<p id="id-service" hidden/>

##### kubelet.service

```
[vagrant@k8s kubernetes]$ cat >/usr/lib/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubernetes Kubelet Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=docker.service
Requires=docker.service

[Service]
WorkingDirectory=/var/lib/kubelet
EnvironmentFile=/opt/kubernetes/kubelet.env
ExecStart=/opt/kubernetes/bin/kubelet  $KUBELET_OPTIONS
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

kubeadm部署,不用启动,会自动拉起

初始化自动生成

/etc/kubernetes/kubelet.conf

/var/lib/kubelet/config.yaml



开机自启动

```
systemctl enable kubelet
```

