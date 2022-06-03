---
title: avd
date: 2017-08-12 12:54:48
tags: 
 - android
 - Simulator
categories:
 - linux 
 - install
---

### 创建AVD失败
 
 see log 查看日志
 ```
 WARN - vdmanager.AvdManagerConnection - Failed to create the SD card. 
 WARN - vdmanager.AvdManagerConnection - Failed to create sdcard in the     AVD folder.
 ```
 
#### 目录权限
```
cs@debian:~/repository/Android/sdk$ chmod +x tools/*
cs@debian:~/repository/Android/sdk$ chmod +x platform-tools/*
```

#### 安装
```
sudo apt-get install  lib32z1 lib32ncurses5 #代替ia32-libs  
```
创建提示
>/sdk/emulator/mksdcard: error while loading shared libraries: libgcc_s.so.1: cannot open shared object file: No such file or directory 

```
cs@debian:~$ locate libgcc_s.so.1
/lib/x86_64-linux-gnu/libgcc_s.so.1
```
 可以看到系统x86_64 不支持32
> WARN - vdmanager.AvdManagerConnection - /home/cs/repository/Android/sdk/emulator/mksdcard: error while loading shared libraries: libgcc_s.so.1: cannot open shared object file: No such file or directory 
error while loading shared libraries: libgcc_s.so.1: wrong ELF class: ELFCLASS64 

 <!--more--> 

搜索[libgcc_s.so.1](https://pkgs.org/download/libgcc_s.so.1)

没有找到deb,下载的rpm
```
rpm2cpio  libgcc-4.1.2-55.el5.i386.rpm  | cpio -div
```
解压后
```
sudo ln -s /home/cs/repository/Android/sdk/lib32/libgcc_s.so.1  /lib/
```
创建AVD成功**等待近2分钟后出现**
>Error while waiting for device: Timed out after 300seconds waiting for emulator to come online.

#### 最终解决方法
**SDK tools > SDK Tools** 勾选 **Android Emulator** 

**虚拟化应用** *VirtualBox* *docker* 等，与avd不能同时开启

 **Tools - Android** 勾选取消 *Enable ADB Integration* （对我无用）
 
Graphics选项，**Software**而不是Automatic或Hardware