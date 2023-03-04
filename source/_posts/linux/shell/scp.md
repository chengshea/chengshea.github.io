---
title: scp上传下载
permalink: linux/shell/scp/
tags:
  - scp上传下载
  - xx
  - xxx
categories:
  - linux
  - shell
  - scp
date: 2023-03-01 20:08:59
---

## 

```
scp [可选参数] file_source file_target
```

>- -F ssh_config： 指定一个替代的ssh配置文件，此参数直接传递给ssh。
>- -i identity_file： 从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。
>- -P port：注意是大写的P, port是指定数据传输用到的端口号
>- -q： 不显示传输进度条。
>- -r： 递归复制整个目录。
>- -v：详细方式显示输出。
>
>

<!--more-->



## 上传



```
cs@debian:~/下载/k8s$ ls -l ./kube*
-rwxr-xr-x 1 cs cs  47554560  2月 28 17:10 ./kubeadm
-rwxr-xr-x 1 cs cs  48644096  2月 28 17:10 ./kubectl
-rwxr-xr-x 1 cs cs 122036984  2月 28 17:10 ./kubelet

scp ./kube* root@192.168.122.11:/usr/local/bin/
```

>Warning: Permanently added '192.168.122.11' (ECDSA) to the list of known hosts.
>root@192.168.122.11's password: 
>kubeadm                                       100%   45MB 113.6MB/s   00:00    
>kubectl                                       100%   46MB  87.2MB/s   00:00    
>kubelet                                       100%  116MB 136.2MB/s   00:00    



scp -r ./lib root@121.41.40.138:/data/www/test

scp -i ~/.ssh/aliyun-tcs.pem ./dist.tar.gz root@121.41.40.138:/data/www/test



## 下载



```
scp root@121.41.40.138:/data/www/test/image.json ./photos/
```



```
scp -r root@121.41.40.138:/data/www/test/image ./
```

