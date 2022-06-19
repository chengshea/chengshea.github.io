---
title: find查找搜索
permalink: linux/shell/find
tags:
  - find
categories:
  - linux
  - shell
date: 2022-06-12 21:55:12
---



查找

> find [OPTIONS] [查找起始路径] [查找条件] [处理动作]

[OPTIONS]  忽略



#### 路径

  相对    `./`

  绝对   `/`

#### 条件

<!--more-->

名称

**name**    `find  /  -name   mysql`

**iname**   `find  /  -iname  cmake`   *忽略大小写*

**regex**  `find / -regex  /docker*`  正则模糊查询

大小

**size**   `find  / -size  +20M` 

 *+* 大于    *-*小于    *K*  *M*  *G*

`   20M`       (20-1,20]

`-  20M`    [0,20-1]

`+ 20M`    (20,+∞]

时间

**atime**  文件最后访问  

*  [#, #-1) ：最后访问时间在#天前（大于等于#天前，小于#-1天前）

  等价于最后访问时间与当前的时间差 大于 (#-1)*24小时，小于等于 #*24小时


*  (#, 0] ：最后访问时间在#天以内，不包括24小时前的那一刻。

等价于最后访问时间与当前的时间差小于 #*24小时

*  (oo, #-1] ：最后访问时间在#-1天以前的。包括#-1天前

等价于最后访问时间与当前的时间差大于等于 #*24小时

```
#查找最近10天内被访问过的所有文件
[root@centos7 ~]# find . -type f -atime -10
 
#查找超过10天内被访问过的所有文件
[root@centos7 ~]# find . -type f -atime +10
 
#查找访问时间超过20分钟的所有文件
[root@centos7 ~]# find . -type f -amin +20
 
#找出比mingongge修改时间更长的所有文件
[root@centos7 ~]# find . -type f -newer mingongge
```

**mtime**  文件最后修改

**ctime**  文件最后改变



```

sudo find /boot/burg/themes/  -name '[^Metro]*' | xargs rm -rf

```

-path  排除路径

-type  类型  d 目录  f文件     

-o  or 

-a and

-prune 配备到path路径，则跳过该目录

```

sudo find  /  -path "/home/cs/lua-5.3.4"  -prune -o -type f    -name  lua*

```