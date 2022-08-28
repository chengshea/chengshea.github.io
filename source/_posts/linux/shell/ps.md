---
title: ps
tags:
  - shell
categories:
  - linux
  - shell
date: 2022-06-03 16:56:09
---

ps (process status) 命令用于显示当前进程的状态，类似于 windows 的任务管理器



### 查找指定进程

```
$ ps -ef | grep  key
cs        4565  4533  0 21:14 pts/2    00:00:00 /opt/ELK/elasticsearch-7.17.1/modules/x-pack-ml/platform/linux-x86_64/bin/controller
```

> key 运行进程的关键字 (如:ps -ef | grep  tomcat)
>
> UID 启动进程的用户名
>
> PID  进程pid
>
> PPID 
>
> C 
>
> STIME 开始启动时间 
>
> TTY  终端号
>
> TIME  运行时间
>
> CMD   启动进程的命令

<!--more-->

### 查找进程使用情况

```
ps -aux | grep Typora
USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
cs  7458  1.2  0.8 4913400 139224 ?      Sl   15:11   0:08 /usr/share/typora/Typora /home/cs/go/ps.md

```

- USER: 行程拥有者
- PID: pid
- %CPU: 占用的 CPU 使用率
- %MEM: 占用的记忆体使用率
- VSZ: 占用的虚拟记忆体大小
- RSS: 占用的记忆体大小
- TTY: 终端的次要装置号码 (minor device number of tty)
- STAT: 该行程的状态:
  - D: 无法中断的休眠状态 (通常 IO 的进程)
  - R: 正在执行中
  - S: 静止状态
  - T: 暂停执行
  - Z: 不存在但暂时无法消除
  - W: 没有足够的记忆体分页可分配
  - <: 高优先序的行程
  - N: 低优先序的行程
  - L: 有记忆体分页分配并锁在记忆体内 (实时系统或捱A I/O)
- START: 行程开始时间
- TIME: 执行的时间
- COMMAND:所执行的指令



#### 内存

```
$ ps -aux | sort -k4nr | head -3
USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
cs   2119  4.8  1.6 1183553740 265420 ?   Sl   14:02   4:06 /opt/google/chrome/chrome -- ...
cs   1660  5.1  1.5 34393500 254380 ?     SLl  13:59   4:30 /opt/google/chrome/chrome --...
cs   1753  1.0  1.4 1179343396 242272 ?   Sl   13:59   0:57 /opt/google/chrome/chrome --...
```

>a all所有
>
>u userid,该进程用户id
>
>x 所有程序,不已终端区分
>
>sort 排序
>
>k 代表从第几列开始
>
>4n 4列(%MEM)开始
>
>r 反向(reverse) ,默认从小到大
>
>head  头几列(-3 ,显示前3列)



#### cpu

```
$ ps -aux | sort -k3nr | head -3
```

