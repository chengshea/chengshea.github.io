---
title: os信息备份
permalink: linux/debian/os/
tags:
  - 信息备份
  - bak
  - xxx
categories:
  - linux
  - debian
  - os
date: 2023-02-21 20:17:03
---



## 图形界面

xface

```
#查看当前启动模式
systemctl get-default

#由命令行模式更改为图形界面模式
systemctl set-default graphical.target

#由图形界面模式更改为命令行模式
systemctl set-default multi-user.target
```



命令行界面—>图形界面

执行startx命令

图形界面—>命令行界面

Ctrl+Alt+F2



## 引导

双系统

```
cs@debian:~$ sudo tree /boot/efi/EFI -L 2
/boot/efi/EFI
├── Boot
│   └── bootx64.efi
├── debian
│   ├── BOOTX64.CSV
│   ├── fbx64.efi
│   ├── grub.cfg
│   ├── grubx64.efi
│   ├── mmx64.efi
│   └── shimx64.efi
└── Microsoft
    └── Boot

4 directories, 7 files

```



```
cs@debian:~$ sudo update-grub
Generating grub configuration file ...
Found background image: /usr/share/images/desktop-base/desktop-grub.png
Found linux image: /boot/vmlinuz-5.10.0-21-amd64
Found initrd image: /boot/initrd.img-5.10.0-21-amd64
Warning: os-prober will be executed to detect other bootable partitions.
Its output will be used to detect bootable binaries on them and create new boot entries.
Found Windows Boot Manager on /dev/sda2@/EFI/Microsoft/Boot/bootmgfw.efi
Adding boot menu entry for UEFI Firmware Settings ...
done
```

https://www.cnblogs.com/coding-my-life/p/12817690.html

<!--more-->



##





