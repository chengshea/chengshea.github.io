---
title: 初识jvm
permalink: lang/gc
tags:
  - jvm
categories:
  - lang
  - gc
date: 2022-06-11 16:19:56
---

## 调优参数

选项 Xms,Xmx,newSize,MaxSize ,PermSize, MaxPermSize

Xms(young和old区使用大小)

Xmx(young和old区最大承受大小)

newSize(young区使用大小)

MaxSize(young区最大承受大小)

PermSize(持久区使用大小)

MaxPermSize(持久区最大使用大小)

<!--more-->

suivivorRatio(设置Eden和survivor比例  默认是8:1)

-Xms：表示java虚拟机堆区内存初始内存分配的大小，通常为操作系统可用内存的1/64大小即可，但仍需按照实际情况进行分配。
-Xmx：表示java虚拟机堆区内存可被分配的最大上限，通常为操作系统可用内存的1/4大小。

-XX:newSize：表示新生代初始内存的大小，应该小于-Xms的值；
-XX:MaxnewSize：表示新生代可被分配的内存的最大上限；当然这个值应该小于-Xmx的值；

-XX:PermSize：表示非堆区初始内存分配大小（方法区）
-XX:MaxPermSize：表示对非堆区分配的内存的最大上限（方法区）。



## 工作流程

![](/pics/jvm-work-4037.png)

1、编译阶段：首先.java经过javac编译成.class文件

2、加载阶段：然后.class文件经过类的加载器加载到JVM内存。(装载、连接、初始化)

-  先把class的信息读到内存来
-  会对class的信息进行验证、为类变量分配内存空间并对其赋默认值
-  执行初始化静态块内容，并且为静态变量进行真正的赋值操作

3、解释阶段：class字节码经过字节码解释器解释成系统可识别的指令码。

4、执行阶段：系统再向硬件设备发送指令码执行操作。





## 数据区域

![](/pics/jvm-area-4346.png)

 Matespace(元空间)在本地内存区域

> -XX:MetaspaceSize，初始空间大小
>
> -XX:MaxMetaspaceSize，最大空间，默认是没有限制的



## 垃圾回收区域

![](/pics/gc-area-4008.png)

### Yong Generation

负责新接收的对象

默认区域划分8:1

#### Eden   80%

Eden区域触发第一次GC

#### Survivor 

##### From 10%

上一次MinorGC存活者,等待下次扫描

##### To 10%

一次MinorGC过程后的存活者

MinorGC过程

1. eden,survivorFrom复制到survivorTo,年龄加1
2. 清空(eden,survivorFrom) 
3. survivorTo 与survivorFrom互换

GC过程中to区满后(或者达到年龄标准,无法储存的某个对象)就移到old区

### Old Generation

存放yong多次GC后仍存活的对象

old空间不足时会触发MajorGC(Full GC)

MajorGC过程

- 先扫描全部,标记存活对象,清除没有标记的对象

### Permanent Generation

静态文件(java类,方法,元数据)



## 垃圾回收算法

![](/pics/gc-yg-3223.png)



https://zhuanlan.zhihu.com/p/343746128







![](/pics/new-area-3239.png)

