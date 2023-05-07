---
title: harbor容器仓库
permalink: linux/tool/harbor/
tags:
  - harbor
  - containerd
  - crt
categories:
  - linux
  - tool
  - harbor
date: 2023-02-28 21:29:16
---

## 仓库安装

[安装](/linux/k8s/harbor#harbor-install)

<!--more-->

```
<details>
  <summary>折叠代码块</summary>
  <pre><code> 
     System.out.println("虽然可以折叠代码块");
     System.out.println("但是代码无法高亮");
  </code></pre>
</details>

<details>
  <summary>折叠代码块</summary>
  <pre><xmp> 
     System.out.println("不渲染");
     <input />
  </xmp></pre>
</details>
```





## containerd

/etc/containerd/config.toml

<details>
  <summary>config.toml</summary>
  <pre><a>/etc/containerd/config.toml</a><code>
  disabled_plugins = []
imports = []
oom_score = 0
plugin_dir = ""
required_plugins = []
root = "/var/lib/containerd"
state = "/run/containerd"
temp = ""
version = 2
</br>
[cgroup]
  path = ""
</br>
[debug]
  address = ""
  format = ""
  gid = 0
  level = ""
  uid = 0
</br>
[grpc]
  address = "/run/containerd/containerd.sock"
  gid = 0
  max_recv_message_size = 16777216
  max_send_message_size = 16777216
  uid = 0
</br>
[metrics]
  address = ""
  grpc_histogram = false
</br>
[plugins]
</br>
  [plugins."io.containerd.gc.v1.scheduler"]
    deletion_threshold = 0
    mutation_threshold = 100
    pause_threshold = 0.02
    schedule_delay = "0s"
    startup_delay = "100ms"
</br>
  [plugins."io.containerd.grpc.v1.cri"]
    device_ownership_from_security_context = false
    disable_apparmor = false
    disable_cgroup = false
    disable_hugetlb_controller = true
    disable_proc_mount = false
    disable_tcp_service = true
    enable_selinux = false
    enable_tls_streaming = false
    enable_unprivileged_icmp = false
    enable_unprivileged_ports = false
    ignore_image_defined_volumes = false
    max_concurrent_downloads = 3
    max_container_log_line_size = 16384
    netns_mounts_under_state_dir = false
    restrict_oom_score_adj = false
    sandbox_image = "k8s.org/k8s/pause:3.9"
    selinux_category_range = 1024
    stats_collect_period = 10
    stream_idle_timeout = "4h0m0s"
    stream_server_address = "127.0.0.1"
    stream_server_port = "0"
    systemd_cgroup = false
    tolerate_missing_hugetlb_controller = true
    unset_seccomp_profile = ""
</br>
    [plugins."io.containerd.grpc.v1.cri".cni]
      bin_dir = "/opt/cni/bin"
      conf_dir = "/etc/cni/net.d"
      conf_template = ""
      ip_pref = ""
      max_conf_num = 1
</br>
    [plugins."io.containerd.grpc.v1.cri".containerd]
      default_runtime_name = "runc"
      disable_snapshot_annotations = true
      discard_unpacked_layers = false
      ignore_rdt_not_enabled_errors = false
      no_pivot = false
      snapshotter = "overlayfs"
</br>
      [plugins."io.containerd.grpc.v1.cri".containerd.default_runtime]
        base_runtime_spec = ""
        cni_conf_dir = ""
        cni_max_conf_num = 0
        container_annotations = []
        pod_annotations = []
        privileged_without_host_devices = false
        runtime_engine = ""
        runtime_path = ""
        runtime_root = ""
        runtime_type = "io.containerd.runtime.v1.linux"
</br>
        [plugins."io.containerd.grpc.v1.cri".containerd.default_runtime.options]
</br>
      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]
</br>
        [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
          base_runtime_spec = ""
          cni_conf_dir = ""
          cni_max_conf_num = 0
          container_annotations = []
          pod_annotations = []
          privileged_without_host_devices = false
          runtime_engine = ""
          runtime_path = ""
          runtime_root = ""
          runtime_type = "io.containerd.runc.v2"
</br>
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
            BinaryName = ""
            CriuImagePath = ""
            CriuPath = ""
            CriuWorkPath = ""
            IoGid = 0
            IoUid = 0
            NoNewKeyring = false
            NoPivotRoot = false
            Root = ""
            ShimCgroup = ""
            SystemdCgroup = true
</br>
      [plugins."io.containerd.grpc.v1.cri".containerd.untrusted_workload_runtime]
        base_runtime_spec = ""
        cni_conf_dir = ""
        cni_max_conf_num = 0
        container_annotations = []
        pod_annotations = []
        privileged_without_host_devices = false
        runtime_engine = ""
        runtime_path = ""
        runtime_root = ""
        runtime_type = ""
</br>
        [plugins."io.containerd.grpc.v1.cri".containerd.untrusted_workload_runtime.options]
</br>
    [plugins."io.containerd.grpc.v1.cri".image_decryption]
      key_model = "node"
</br>
    [plugins."io.containerd.grpc.v1.cri".registry]
      config_path = ""
</br>
      [plugins."io.containerd.grpc.v1.cri".registry.auths]
</br>
      [plugins."io.containerd.grpc.v1.cri".registry.configs]
         [plugins."io.containerd.grpc.v1.cri".registry.configs."k8s.org".tls]
           insecure_skip_verify = true
           ca_file = "/opt/k8s.org/ca.crt"   # CA 证书
           cert_file = "/opt/k8s.org/k8s.org.cert"    # harbor 证书
           key_file  = "/opt/k8s.org/k8s.org.key"  # harbor 私钥
         [plugins."io.containerd.grpc.v1.cri".registry.configs."k8s.org".auth]
           username = "admin"
           password = "cs123456"
      [plugins."io.containerd.grpc.v1.cri".registry.headers]
</br>
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."k8s.org"]
            endpoint = ["https://k8s.org"]
</br>
  [plugins."io.containerd.internal.v1.opt"]
    path = "/opt/containerd"
</br>
  [plugins."io.containerd.internal.v1.restart"]
    interval = "10s"
</br>
  [plugins."io.containerd.internal.v1.tracing"]
    sampling_ratio = 1.0
    service_name = "containerd"
</br>
  [plugins."io.containerd.metadata.v1.bolt"]
    content_sharing_policy = "shared"
</br>
  [plugins."io.containerd.monitor.v1.cgroups"]
    no_prometheus = false
</br>
  [plugins."io.containerd.runtime.v1.linux"]
    no_shim = false
    runtime = "runc"
    runtime_root = ""
    shim = "containerd-shim"
    shim_debug = false
</br>
  [plugins."io.containerd.runtime.v2.task"]
    platforms = ["linux/amd64"]
    sched_core = false
</br>
  [plugins."io.containerd.service.v1.diff-service"]
    default = ["walking"]
</br>
  [plugins."io.containerd.service.v1.tasks-service"]
    rdt_config_file = ""
</br>
  [plugins."io.containerd.snapshotter.v1.aufs"]
    root_path = ""
</br>
  [plugins."io.containerd.snapshotter.v1.btrfs"]
    root_path = ""
</br>
  [plugins."io.containerd.snapshotter.v1.devmapper"]
    async_remove = false
    base_image_size = ""
    discard_blocks = false
    fs_options = ""
    fs_type = ""
    pool_name = ""
    root_path = ""
</br>
  [plugins."io.containerd.snapshotter.v1.native"]
    root_path = ""
</br>
  [plugins."io.containerd.snapshotter.v1.overlayfs"]
    root_path = ""
    upperdir_label = false
</br>
  [plugins."io.containerd.snapshotter.v1.zfs"]
    root_path = ""
</br>
  [plugins."io.containerd.tracing.processor.v1.otlp"]
    endpoint = ""
    insecure = false
    protocol = ""
</br>
[proxy_plugins]
</br>
[stream_processors]
</br>
  [stream_processors."io.containerd.ocicrypt.decoder.v1.tar"]
    accepts = ["application/vnd.oci.image.layer.v1.tar+encrypted"]
    args = ["--decryption-keys-path", "/etc/containerd/ocicrypt/keys"]
    env = ["OCICRYPT_KEYPROVIDER_CONFIG=/etc/containerd/ocicrypt/ocicrypt_keyprovider.conf"]
    path = "ctd-decoder"
    returns = "application/vnd.oci.image.layer.v1.tar"
</br>
  [stream_processors."io.containerd.ocicrypt.decoder.v1.tar.gzip"]
    accepts = ["application/vnd.oci.image.layer.v1.tar+gzip+encrypted"]
    args = ["--decryption-keys-path", "/etc/containerd/ocicrypt/keys"]
    env = ["OCICRYPT_KEYPROVIDER_CONFIG=/etc/containerd/ocicrypt/ocicrypt_keyprovider.conf"]
    path = "ctd-decoder"
    returns = "application/vnd.oci.image.layer.v1.tar+gzip"
</br>
[timeouts]
  "io.containerd.timeout.bolt.open" = "0s"
  "io.containerd.timeout.shim.cleanup" = "5s"
  "io.containerd.timeout.shim.load" = "5s"
  "io.containerd.timeout.shim.shutdown" = "3s"
  "io.containerd.timeout.task.state" = "2s"
</br>
[ttrpc]
  address = ""
  gid = 0
  uid = 0
  </code></pre>
</details>

替换pause镜像，Cgroup及添加密钥文件

```
sed -n '/sandbox_image/s/= .*/= "k8s.org\/k8s\/pause:3.6"/'p /etc/containerd/config.toml	
#替换 sed -i '/sandbox_image/s/= .*/= "k8s.org\/k8s\/pause:3.9"/' /etc/containerd/config.toml

sed -n '/SystemdCgroup/s/= .*/= true/'p /etc/containerd/config.toml	
```

> sandbox_image = "k8s.org/k8s/pause:3.9"
>
> SystemdCgroup = true



### 密钥配置

```toml
 [plugins."io.containerd.grpc.v1.cri".registry.configs]
         [plugins."io.containerd.grpc.v1.cri".registry.configs."k8s.org".tls]
           insecure_skip_verify = true
           ca_file = "/opt/k8s.org/ca.crt"   # CA 证书
           cert_file = "/opt/k8s.org/k8s.org.cert"    # harbor 证书
           key_file  = "/opt/k8s.org/k8s.org.key"  # harbor 私钥
         [plugins."io.containerd.grpc.v1.cri".registry.configs."k8s.org".auth]
           username = "admin"
           password = "cs123456"
  
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
         [plugins."io.containerd.grpc.v1.cri".registry.mirrors."k8s.org"]
            endpoint = ["https://k8s.org"] 
```

> 配置私库域名k8s.org，及配置证书 
>
> **insecure_skip_verify** 设置true,ctr拉取一样x509,使用-k ` ctr i pull  k8s.org/k8s/pause:3.6  -k`

