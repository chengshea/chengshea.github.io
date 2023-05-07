---
title: containerd安装
permalink: linux/k8s/containerd/
tags:
  - containerd安装
  - xx
  - xxx
categories:
  - linux
  - k8s
  - containerd
date: 2023-03-01 21:07:57
---



## Installing containerd 

https://github.com/containerd/containerd/releases   

<p id="containerd" hidden/>

```
$ tar -zxvf  ../containerd-1.6.19-linux-amd64.tar.gz
scp ./bin/*  root@k8s01:/usr/local/bin
```

>Warning: Permanently added 'k8s01,192.168.122.11' (ECDSA) to the list of known hosts.
>containerd                                    100%   50MB 172.4MB/s   00:00    
>containerd-shim                               100% 7180KB 167.3MB/s   00:00    
>containerd-shim-runc-v1                       100% 9248KB 161.9MB/s   00:00    
>containerd-shim-runc-v2                       100% 9264KB 169.7MB/s   00:00    
>containerd-stress                             100%   22MB 146.9MB/s   00:00    
>ctr                                           100%   26MB 193.4MB/s   00:00  

<!--more-->

### containerd.service

/usr/local/lib/systemd/system/containerd.service

```
cat  <<EOF >/etc/systemd/system/containerd.service
[Unit]
Description=containerd container runtime
Documentation=https://containerd.io
After=network.target local-fs.target

[Service]
ExecStartPre=-/sbin/modprobe overlay
ExecStart=/usr/local/bin/containerd

Type=notify
Delegate=yes
KillMode=process
Restart=always
RestartSec=5
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNPROC=infinity
LimitCORE=infinity
LimitNOFILE=1048576
# Comment TasksMax if your systemd version does not supports it.
# Only systemd 226 and above support this version.
TasksMax=infinity
OOMScoreAdjust=-999

[Install]
WantedBy=multi-user.target
EOF
```

>- `Delegate`: 这个选项允许 containerd 以及运行时自己管理自己创建容器的 cgroups。如果不设置这个选项，systemd 就会将进程移到自己的 cgroups 中，从而导致 containerd 无法正确获取容器的资源使用情况。
>- `KillMode` 这个选项用来处理 containerd 进程被杀死的方式。默认情况下，systemd 会在进程的 cgroup 中查找并杀死 containerd 的所有子进程。KillMode 字段可以设置的值如下。
>  - `control-group`（默认值）：当前控制组里面的所有子进程，都会被杀掉
>  - `process`：只杀主进程,可以确保升级或重启 containerd 时不杀死现有的容器
>  - `mixed`：主进程将收到 SIGTERM 信号，子进程收到 SIGKILL 信号
>  - `none`：没有进程会被杀掉，只是执行服务的 stop 命令
>
>





### config.toml

/etc/containerd/config.toml

```
containerd config default > ../containerd/config.toml
scp  -r ./containerd  root@k8s01:/etc
```

>Warning: Permanently added 'k8s01,192.168.122.11' (ECDSA) to the list of known hosts.
>config.toml                                   100% 7154     6.8MB/s   00:00 

#### pause

sandbox_image = "k8s.org/k8s/pause:3.6"

#### Systemd

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]

```
 SystemdCgroup = true
```



#### 配置源

[plugins."io.containerd.grpc.v1.cri".registry.mirrors]

          [plugins."io.containerd.grpc.v1.cri".registry.mirrors."k8s.org"]
            endpoint = ["https://k8s.org"]

https://github.com/containerd/containerd/blob/main/docs/cri/config.md

```
cat > hosts.toml <<EOF
server = "https://k8s.org"

[host."https://k8s.org"]
  ca = "/opt/k8s.org/ca.crt"
  client = ["/opt/k8s.org/k8s.org.cert", "/opt/k8s.org/k8s.org.key"]
EOF
```

https://github.com/containerd/containerd/blob/main/docs/hosts.md





#### 启动

```
systemctl daemon-reload && systemctl restart containerd.service
systemctl enable --now containerd
```



#### ctr



```
# ctr ns ls
NAME    LABELS 
default        
k8s.io         
k8s.org        
```



x509 报错

```
# ctr i pull   k8s.org/k8s/pause:3.9    -k
```

>k8s.org/k8s/pause:3.9:                                                            resolved       |++++++++++++++++++++++++++++++++++++++| 
>manifest-sha256:0fc1f3b764be56f7c881a69cbd553ae25a2b5523c6901fbacb8270307c29d0c4: done           |++++++++++++++++++++++++++++++++++++++| 
>layer-sha256:61fec91190a0bab34406027bbec43d562218df6e80d22d4735029756f23c7007:    done           |++++++++++++++++++++++++++++++++++++++| 
>config-sha256:e6f1816883972d4be47bd48879a08919b96afcd344132622e4d444987919323c:   done           |++++++++++++++++++++++++++++++++++++++| 
>elapsed: 1.9 s                                                                    total:   0.0 B (0.0 B/s)                                         
>unpacking linux/amd64 sha256:0fc1f3b764be56f7c881a69cbd553ae25a2b5523c6901fbacb8270307c29d0c4...
>done: 430.599969ms	



```
# ctr i ls 
```

>REF                   TYPE                                                 DIGEST                                                                  SIZE      PLATFORMS   LABELS 
>k8s.org/k8s/pause:3.9 application/vnd.docker.distribution.manifest.v2+json sha256:0fc1f3b764be56f7c881a69cbd553ae25a2b5523c6901fbacb8270307c29d0c4 311.6 KiB linux/amd64 -      



rm

```
# ctr i  rm  registry.aliyuncs.com/google_containers/pause:3.6
registry.aliyuncs.com/google_containers/pause:3.6
```





#### crictl

https://github.com/kubernetes-sigs/cri-tools/releases



```
cat > ./crictl.yaml <<EOF
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 10
debug: false
pull-image-on-create: false
EOF
```



```
tar -zxvf ../crictl-v1.26.0-linux-amd64.tar.gz
scp ./crictl root@k8s01:/usr/local/bin
```

>Warning: Permanently added 'k8s01,192.168.122.11' (ECDSA) to the list of known hosts.
>crictl                                        100%   50MB 172.6MB/s   00:00



## Installing runc

 https://github.com/opencontainers/runc/releases

```
$ scp runc.amd64   root@k8s01:/opt
```

>Warning: Permanently added 'k8s01,192.168.122.11' (ECDSA) to the list of known hosts.
>runc.amd64                                    100% 9210KB 146.6MB/s   00:00 



```
# install -m 755 runc.amd64 /usr/local/sbin/runc
# ll /usr/local/sbin/runc
-rwxr-xr-x. 1 root root 9431456 3月   1 21:33 /usr/local/sbin/runc

```





## Installing CNI plugins



https://github.com/containernetworking/plugins/releases/download/v1.2.0/cni-plugins-linux-amd64-v1.2.0.tgz



```
tar -zxvf  ../cni-plugins-linux-amd64-v1.2.0.tgz  -C ./cni/bin

#/opt/cni/bin
scp -r ./cni  root@k8s01:/opt
```

>Warning: Permanently added 'k8s01,192.168.122.11' (ECDSA) to the list of known hosts.
>ptp                                           100% 4064KB 121.7MB/s   00:00    
>vlan                                          100% 3900KB 175.7MB/s   00:00    
>tuning                                        100% 3357KB 168.7MB/s   00:00    
>macvlan                                       100% 3935KB 165.2MB/s   00:00    
>bandwidth                                     100% 3769KB 171.7MB/s   00:00    
>loopback                                      100% 3274KB 169.4MB/s   00:00    
>bridge                                        100% 4198KB 164.9MB/s   00:00    
>dhcp                                          100% 9929KB 176.3MB/s   00:00    
>portmap                                       100% 3658KB 169.1MB/s   00:00    
>ipvlan                                        100% 3906KB 128.2MB/s   00:00    
>firewall                                      100% 4282KB 127.3MB/s   00:00    
>host-device                                   100% 3780KB 160.8MB/s   00:00    
>dummy                                         100% 3893KB 162.8MB/s   00:00    
>host-local                                    100% 3210KB 160.2MB/s   00:00    
>sbr                                           100% 3467KB 167.2MB/s   00:00    
>static                                        100% 2779KB 161.2MB/s   00:00    
>vrf                                           100% 3502KB 166.9MB/s   00:00   







level=error msg="failed to load cni during init, please check CRI plugin status before setting up network for pods" error="cni config load failed: no network config found in /etc/cni/net.d: cni plugin not initialized: failed to load cni config"
