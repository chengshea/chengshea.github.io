---
title: iptable防火墙
permalink: linux/shell/iptable/
tags:
  - iptable
categories:
  - linux
  - shell
date: 2022-07-31 17:17:26
---









### 数据流向

![](/pics/iptable-01.png)



-  当一个数据包进入网卡时，它首先进入PREROUTING链，内核根据数据包目的IP判断是否需要转送出去。 
- 如果数据包就是**`进入本机`**的，它就会到达INPUT链。数据包到了**`INPUT链`**后，任何进程都会收到它。本机上运行的程序可以发送数据包，这些数据包会经过OUTPUT链，然后到达POSTROUTING链输出。 
- 如果数据包是要**`转发出去`**的，且内核允许转发，数据包就会如图所示向右移动，经过**`FORWARD链`**，然后到达POSTROUTING链输出。
  

![](/pics/iptable-01-1.png)



```shell
#临时生效
echo 1 > /proc/sys/net/ipv4/ip_forward
#永久生效
cs@debian:~/oss/hexo$ cat /etc/sysctl.conf | grep net.ipv4.ip_
net.ipv4.ip_forward=1
```

<!--more-->

![](/pics/iptable-01-2.png)





### 命令规则

![](/pics/iptable-02.png)

- 所有表名必须小写

  filter/nat/mangle

- 所有链名必须大写
   INPUT/OUTPUT/FORWARD/PREROUTING/POSTROUTING

| 名称        | 功能                                                         | 作用的表                                                     |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| PREROUTING  | 主机外报文进入位置                                           | mangle, nat（目标地址转换，，通常指响应报文）                |
| INPUT       | 报文进入本机用户空间位置                                     | filter, mangle                                               |
| OUTPUT      | 报文从本机用户空间出去的位置                                 | filter, mangle, nat                                          |
| FOWARD      | 报文经过路由并且发觉不是本机决定转发但还不知道从哪个网卡出去 | filter, mangle（中转）                                       |
| POSTROUTING | 报文经过路由被转发出去                                       | 许mangle，nat（源地址转换，把原始地址转换为转发主机出口网卡地址） |

 

- 所有匹配必须小写
   -s/-d/-m <module_name>/-p

- 所有动作必须大写
   ACCEPT/DROP/SNAT/DNAT/MASQUERADE



