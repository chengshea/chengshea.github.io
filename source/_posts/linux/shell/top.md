---
title: top排查服务器
permalink: linux/shell/top
tags:
  - shell
categories:
  - linux
  - shell
date: 2022-06-12 21:39:53
---



top

![](/pics/top-4834.png)

>排序默认从大到小,R反向排序
>
>M：根据内存排序
>
>P：根据CPU使用排序
>
>T：根据使用时间排序
>
>\>：向右移动一列排序
>
><:向左移动一列排序
>
>

界面shift+m (根据内存排序)

![](/pics/top-M-5210.png)



### 第一行top

等同命令uptime

```
cs@debian:~/go$ uptime
 22:00:22 up  8:59,  1 user,  load average: 0.13, 0.32, 0.36
```

<!--more-->

>系统当前时间 up 系统到目前为止运行的时间，
>
> 当前系统的登陆用户数量，
>
>load average后面的三个数字分别表示距离现在一分钟，五分钟，十五分钟的负载情况

load average数据是每隔5秒钟检查一次活跃的进程数，然后按特定算法计算出的数值。如果这个数除以逻辑CPU的数量，结果高于5的时候就表明系统在超负荷运转了



### 第二行 Tasks

```
Tasks: 241 total,   1 running, 240 sleeping,   0 stopped,   0 zombie
```

>tasks表示任务（进程），214则表示现在有241个进程，
>
>running  其中处于运行中的有1个，
>
>sleeping  240个在休眠(挂起)，
>
>stopped  停止的进程数为0，
>
>zombie   僵尸的进程数为0个



### 第三行%Cpu

```
%Cpu(s):  3.6 us,  0.6 sy,  0.0 ni, 95.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
```

>us——用户空间(user)占用cpu的百分比
>sy——内核空间(system)占用cpu的百分比
>ni——改变过优先级(niced)的进程占用cpu的百分比
>id——空闲（idolt）CPU百分比
>wa——IO等待(wait)占用cpu的百分比
>hi——IRQ 硬中断(Hardware)占用cpu的百分比
>si——软中断（software）占用cpu的百分比
>st——被hypervisor偷去的时间



### 第四五行 kib内存

```
KiB Mem : 16257204 total, 12933272 free,  1288736 used,  2035196 buff/cache
KiB Swap:  7812092 total,  7812092 free,        0 used. 14425716 avail Mem 
```

>Mem：物理内存总量（16G）
>free: 空闲内存总量(1G)
>used: 使用中的内存总量
>buff/cache: 用作内核缓存的内存量

>Swap： 交换区总量
>free：空闲交换区总量
>used： 使用的交换区总量
>avail Mem：表示可用于进程下一次分配的物理内存数量，这个大小一般比free大一点，因为除了free的空间外，系统还能立即释放出一些空间来





### 第七行 进程信息区

```
 PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND  
```

>PID — 进程id
>USER — 进程所有者
>PR — 进程优先级
>NI — nice值。负值表示高优先级，正值表示低优先级
>VIRT — 进程使用的虚拟内存总量，单位kb。VIRT=SWAP+RES
>RES — 进程使用的、未被换出的物理内存大小，单位kb。RES=CODE+DATA
>SHR — 共享内存大小，单位kb
>S — 进程状态。D=不可中断的睡眠状态 R=运行 S=睡眠 T=跟踪/停止 Z=僵尸进程
>%CPU — 上次更新到现在的CPU时间占用百分比
>%MEM — 进程使用的物理内存百分比
>TIME+ — 进程使用的CPU时间总计，单位1/100秒
>COMMAND — 进程名称（命令名/命令行）



### 其他

```
cs@debian:~/go$ sudo netstat -anp|grep 12347
tcp        0      0 0.0.0.0:4000            0.0.0.0:*               LISTEN      12347/hexo 
```



```
cs@debian:~/go$ lsof -i:4000
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
hexo    12347   cs   21u  IPv4 324187      0t0  TCP *:4000 (LISTEN)
cs@debian:~/go$ ps -ef|grep 12347
cs       12347  1640  0 21:56 pts/2    00:00:03 hexo
cs       13306  1622  0 22:23 pts/0    00:00:00 grep 12347
```



列出所有正在运行的java进程

```
cs@debian:~/go$ jps
13600 Jps
```

>| 参数 | 说明                            |
>| ---- | ------------------------------- |
>| `-l` | 输出主类全名或jar路径           |
>| `-q` | 只输出LVMID                     |
>| `-m` | 输出JVM启动时传递给main()的参数 |
>| `-v` | 输出JVM启动时显示指定的JVM参数  |





```
ps -Lfp pid或者ps -mp pid -o THREAD，tid，time或者top -Hp pid
#线程ID转成16进制用于查询
printf "%x\n" pid
```



```
jstack $pid >> ./dump.log
```

