---
title: 磁盘或Inode使用率高
permalink: linux/shell/usage_high/
tags:
  - usage_high
categories:
  - linux
  - shell
date: 2022-06-23 20:26:14
---



## Inode

**一个文件占用一个inode ，且inode是固定的，小文件过多就可能造成磁盘空间剩余挺多，但是inode耗尽的情况。**

### df -i

查看当前系统inode使用情况



![](/pics/inode-1-2848.png)

一级一级往下，统计inode文件数量。数字大就表示占用inode多

<!--more-->

如果命令在那个目录卡住,表示该目录,文件特多,ctrl+c停止,从该目录开始排查

![](/pics/inode-3-4837.png)



### wc  -l 

```
for i in /home/* ; do echo $i; find $i | wc -l; done
```

![](/pics/inode-2-4723.png)

删除

```
 find  /home/go/test/  -maxdepth 1  -type f   -mtime +0   -exec  rm  -rf  {} \;
```

>+1 内表示 1 * 24 +24小时以外..
>+0 才表示 0 * 24 +24小时以外
>1 表示 1*24 + 24 到 24 之间..
>0 表示 0*24 + 24 到 0 之间..



修改大小

```
#卸载
umount /home/cs/go 
#建立文件系统，指定inode节点数 
mkfs.ext3 /dev/sda6 -N 18276352 
#修改fstab文件 
vim /etc/fstab 
/dev/sda6 /home/cs/go ext3 defaults 1 2 
#重新加载并检查挂载文件 
mount -a 
#查看修改后的inode参数 
dumpe2fs -h /dev/sda6 | grep node

```





多核cpu生成百万文件

```
cd ~/go/test
seq 1000000 | xargs -i  -P 0 dd if=/dev/urandom of={}.txt bs=1024 count=1
```



## disk

### df  -h

排查目录

du -sh * | sort  -nr | head -5



查找大于1G的文件

```console-bash
find /  -type f -size +1G
```



 没有大文件,查看已经删除的文件

```
lsof -n |grep deleted
```

删除的文件有程序在使用,一直没有释放掉,kill掉pid



## cpu

ps -aux | sort -k3nr | head -5



### top  

 shift+p    切到cpu排序高到低

### tid

ps -Lfp pid或者ps -mp pid -o THREAD，tid，time或者top -Hp pid

```
ps -mp $pid -o THREAD，tid，time | sort -nr
```



#线程ID转成16进制用于查询

```
$ printf "%x\n"  $tid
a221
```

### jstack

```
jstack $pid | grep "a221"  -A  30
```

> -A  -B -C(大写)  后面都跟阿拉伯数字 
>-A是显示匹配后和它后面的n行。after 
>-B是显示匹配行和它前面的n行。 before
>-C是匹配行和它前后各n行。 context



```
ps -ef | grep $name
jstack $pid >> ./dump.log
```



### Thread Dump

***\*kill -3 PID命令只能打印那一瞬间java进程的堆栈信息\****，适合在服务器响应慢，cpu、内存快速飙升等异常情况下使用，可以方便地定位到导致异常发生的java类，解决如死锁、连接超时等原因导致的系统异常问题。**该命令不会杀死进程。**

- tomcat  堆栈信息会打印在catalina.out
- nohup启动 堆栈信息会在nohup.out



## mem



### free -m



ps -aux | sort -k4nr | head -5





## 工具

arthas  

下载 https://github.com/alibaba/arthas/releases

文档 https://arthas.aliyun.com/doc/advanced-use.html



jvisualvm

${JDK_HOME}\bin\jvisualvm

https://www.cnblogs.com/mzq123/p/11166640.html