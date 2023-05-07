---
title: ansible playbook
permalink: linux/tool/ansible1/
tags:
  - ansible
  - playbook
  - xx
  - xxx
categories:
  - linux
  - tool
  - ansible1
date: 2023-03-09 20:45:39
---

## Roles

Roles 就是通过分别将变量、文件、任务、模块及处理器放置于单独的目录中，并可以便捷地 include 它们

http://www.ansible.com.cn/docs/playbooks_roles.html#roles

```
└── roles
    └── k8s
        ├── files  用来存放由 copy 模块或 script 模块调用的文件
        ├── library
        ├── tasks 包含一个 main.yml 文件，用于定义此角色的任务列表，此文件可以使用 include 包含其它的位于此目录的 task 文件
        └── vars  包含一个 main.yml 文件，用于定义此角色用到的变量	
 		└──templates	用来存放正则模板，template 模块会自动在此目录中寻找正则模板文件
		 └──handlers	此目录应当包含一个 main.yml 文件，用于定义此角色中触发条件时执行的动作
		 └──defaults	此目录应当包含一个 main.yml 文件，用于为当前角色设定默认变量
	 	└──meta	此目录应当包含一个 main.yml 文件，用于定义此角色的特殊设定及其依赖关系
	.......
```

>根据情况删减目录



目录

>cni /opt/cni/bin
>
>cni config /etc/cni/net.d
>
>containerd /etc/containerd/config.toml
>
>crictl /etc/crictl.yaml

<!--more-->



### copy



```
cs@debian:~$ ansible k8s-img -m copy -a "src=/opt/kubernetes/cni/net.d/10-flannel.conflist dest=/etc/cni/net.d/ mode=0644"
```

>src参数 ：用于指定需要copy的文件或目录。
>
>dest参数 ：用于指定文件将被拷贝到远程主机的哪个目录中，dest为必须参数。
>
>content参数 ：当不使用src指定拷贝的文件时，可以使用content直接指定文件内容，src与content两个参数必有其一，否则会报错。
>
>force参数 : 当远程主机的目标路径中已经存在同名文件，并且与ansible主机中的文件内容不同时，是否强制覆盖，可选值有yes和no，默认值为yes，表示覆盖，如果设置为no，则不会执行覆盖拷贝操作，远程主机中的文件保持不变。
>
>backup参数 : 当远程主机的目标路径中已经存在同名文件，并且与ansible主机中的文件内容不同时，是否对远程主机的文件进行备份，可选值有yes和no，当设置为yes时，会先备份远程主机中的文件，然后再将ansible主机中的文件拷贝到远程主机。
>
>owner参数 : 指定文件拷贝到远程主机后的属主，但是远程主机上必须有对应的用户，否则会报错。
>
>group参数 : 指定文件拷贝到远程主机后的属组，但是远程主机上必须有对应的组，否则会报错。
>
>mode参数 : 指定文件拷贝到远程主机后的权限，如果你想将权限设置为”rw-r--r--“，则可以使用mode=0644表示，如果你想要在user对应的权限位上添加执行权限，则可以使用mode=u+x表示。



