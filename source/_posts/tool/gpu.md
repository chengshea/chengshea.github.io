---
title: GPU CUDA安装
permalink: tool/gpu/
tags:
  - GPU CUDA
  - CUDA
  - install
categories:
  - tool
  - gpu
date: 2023-04-01 13:53:24
---

### GPU

https://developer.nvidia.com/cuda-gpus

<p id="gpu" hidden />

#### 版本

下载 https://www.nvidia.cn/geforce/drivers/

![](/pics/nvidia-select.png)

```
$  uname -srm
Linux 5.10.0-21-amd64 x86_64

# dpkg-query -s linux-headers-$(uname -r)
```

> Driver Version 要是 51x

![](/pics/nvidia-download.png)



```
$ lspci | grep -i vga
01:00.0 VGA compatible controller: NVIDIA Corporation GP106M [GeForce GTX 1060 Mobile] (rev a1)
```

>Nvidia 卡信息的末尾是 rev a1，表示已经开启。
>
>末尾是 rev ff，表示独显已经关闭

支持列表 https://developer.nvidia.com/cuda-gpus





#### X server

```
#切换到文本界面
init3 

#切换到图形界面
init 5
```

>Using: nvidia-installer ncurses v6 user interface
>-> Detected 8 CPUs online; setting concurrency level to 8.
>-> The file '/tmp/.X0-lock' exists and appears to contain the process ID '773' of a running X server.
>ERROR: You appear to be running an X server; please exit X before installing.  For further details, please see the section INSTALLING THE NVIDIA DRIVER in the README available on the Linux driver download page at www.nvidia.com.
>ERROR: Installation has failed.  Please see the file '/var/log/nvidia-installer.log' for details.  You may find suggestions on fixing installation problems in the README available on the Linux driver download page at www.nvidia.com.



#### driver

```
cat <<EOF | sudo tee /usr/lib/modprobe.d/dist-blacklist.conf
blacklist nouveau
options nouveau modeset=0
EOF


sudo update-initramfs -u


lsmod | grep nouveau
```

>ERROR: The Nouveau kernel driver is currently in use by your system.  This driver is incompatible with the NVIDIA driver, and must be disabled before proceeding.  Please consult the NVIDIA driver README and your Linux distribution's documentation for details on how to correctly disable the Nouveau kernel driver.



#### kernel-source  



```
#根据/var/log/nvidia-installer.log 报错情况安装缺失包
sudo apt install  dkms
```

>--kernel-source-path   问题 安装linux-headers





```
#关闭图形界面后执行
sh  NVIDIA-Linux-x86_64-515.105.01.run


```





#### 驱动版本

```
cat /proc/driver/nvidia/version
```

![](/pics/nvidia-version.png)



#### 显卡编号

```
ls -l /dev/nvidia*
```

![](/pics/nvidia-1.png)

多块

![2](/pics/nvidia-2.png)





```
sudo nvidia-smi
```

![](/pics/nvidia.png)



温度

```
sudo nvidia-smi -q -d TEMPERATURE
```

10s 一次

```
watch -n 10 nvidia-smi
```



#### 卸载 

```
 sh  NVIDIA*.run  --uninstall  
```





<!--more-->



### CUDA

https://developer.nvidia.com/cuda-toolkit-archive

![](/pics/cuda-download.png)

```
sudo sh /home/cs/oss/hexo/cuda_11.7.1_515.65.01_linux.run

#accept/decline/quit:accept
#Install NVIDIA Accelerated Graphics Driver no不选择安装
```

> ===========
>
> = Summary =
>
> ===========
>
> Driver:   Not Selected
> Toolkit:  Installed in /usr/local/cuda-11.7/
>
> Please make sure that
>  -   PATH includes /usr/local/cuda-11.7/bin
>  -   LD_LIBRARY_PATH includes /usr/local/cuda-11.7/lib64, or, add /usr/local/cuda-11.7/lib64 to /etc/ld.so.conf and run ldconfig as root
>
> To uninstall the CUDA Toolkit, run cuda-uninstaller in /usr/local/cuda-11.7/bin
> ***WARNING: Incomplete installation! This installation did not install the CUDA Driver. A driver of version at least 515.00 is required for CUDA 11.7 functionality to work.
> To install the driver using this installer, run the following command, replacing <CudaInstaller> with the name of this run file:
>    sudo <CudaInstaller>.run --silent --driver
>
> Logfile is /var/log/cuda-installer.log
>
> 



```
$ /usr/local/cuda-11.7/bin/nvcc -V
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2022 NVIDIA Corporation
Built on Wed_Jun__8_16:49:14_PDT_2022
Cuda compilation tools, release 11.7, V11.7.99
Build cuda_11.7.r11.7/compiler.31442593_0
```





```
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/cuda/lib64"`
export CUDA_HOME=/usr/local/cuda`
```

> Check failed: s.ok() could not find cudnnCreate in cudnn DSO xxxxx undefined symbol: cudnnCreate





### CUDNN

下载地址：https://developer.nvidia.com/cudnn



```
tar -zxvf cudnn-8.0-linux-*.tgz
sudo cp cuda/include/cudnn.h /usr/local/cuda/include/
sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64/
sudo chmod a+r /usr/local/cuda/include/cudnn.h
sudo chmod a+r /usr/local/cuda/lib64/libcudnn*

```

>a+r所有人加上可执行权限，包括所有者，所属组，和其他人
>o+x 只是给其他人加上可执行权限
