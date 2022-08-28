---

title: apt
permalink: linux/debian/apt/
tags:
  - apt
categories:
  - linux
  - debian
date: 2022-07-16 14:26:10
---



## apt-get



升级

```
apt-get update			   // 更新源文件，并不会做任何安装升级操作 
apt-get upgrade		       // 升级所有已安装的包 
```

安装

```
apt-get install packagename		// 安装指定的包
```

查询包

```
apt-cache depends packagename   //该包依赖哪些包
```

列出所有已经安装

```
apt list --installed
```



删除

```
apt-get autoremove packagename --purge  //删除包及其依赖的软件包+配置文件等
```



清理

```
apt-get clean 						// 清理无用的包  
apt-get autoclean 					// 清理无用的包  
apt-get check 						// 检查是否有损坏的依赖
```



## apt-mark 标记

系统中禁用 Chrome 更新

```
cs@debian:~$ sudo apt-mark  hold google-chrome-stable
google-chrome-stable 设置为保留。
```

> auto	标记指定软件包为自动安装
> manual	标记指定软件包为手动安装
> minimize-manual	将 meta 包的所有依赖项标记为自动安装
> hold	标记指定软件包为保留（held back），阻止软件自动更新
> unhold	取消指定软件包的保留（held back）标记，解除阻止自动更新
> showauto	列出所有自动安装的软件包
> showmanual	列出所有手动安装的软件包
> showhold	列出设为保留的软件包



centos

```
echo 'exclude=google-chrome-stable' >> /etc/yum.conf
```

