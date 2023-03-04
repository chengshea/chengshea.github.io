---
title: fstab挂盘
permalink: linux/storage/fstab/
tags:
  - fstab
  - 挂盘
  - xxx
categories:
  - linux
  - storage
  - fstab
date: 2023-02-22 21:20:48
---

## 挂盘

/etc/fstab

```
#cat /etc/fstab
# /boot/efi was on /dev/sda2 during installation
UUID=FF6E-1E1A  /boot/efi       vfat    umask=0077      0       1
# /home was on /dev/sda6 during installation
UUID=abca56cf-7ab5-4c4a-a5ab-f4b2ebdc0c82 /home           ext4    defaults        0       2
```

> **<file system>**
>
> **<dir>**
>
> **<type>**  ext3、ext4、xfs、swap
>
> **<options>**  
>
>    auto - 在启动时或键入了 mount -a 命令时自动挂载
>
>    exec - 允许执行此分区的二进制文件。
>
>    ro - 以只读模式挂载文件系统。
>    rw - 以读写模式挂载文件系统。
>
>    suid - 允许 suid 操作和设定 sgid 位 临时提权操作
>
>    defaults - 使用文件系统的默认挂载参数，例如 ext4 的默认参数为:rw, suid, dev, exec, auto, nouser, async.
>
> **<dump>**  dump 工具通过它决定何时作备份. dump 会检查其内容，允许的数字是 0 和 1 。0 表示忽略， 1 则进行备份
>
> **<pass>**  数值来决定需要检查的文件系统的检查顺序。允许的数字是0, 1, 和2。 根目录应当获得最高的优先权 1, 其它所有需要被检查的设备设置为 2. 0 表示设备不会被 fsck 所检查。

<!--more-->

```
$ sudo mount -a
mount: /etc/fstab: parse error at line 24 -- ignored
```

> **cat -v /etc/fstab**   将显示出任何虚假字符造成任何问题

##





