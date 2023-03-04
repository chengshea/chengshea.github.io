---
title: kvm安装入门
permalink: linux/virtualization/kvm/
tags:
  - kvm安装入门
  - xx
  - xxx
categories:
  - linux
  - virtualization
  - kvm
date: 2023-02-22 22:00:25
---

##  kvm

### 安装

```
sudo apt install  libvirt-clients libvirt-daemon-system bridge-utils virtinst libvirt-daemon libvirt-dev  -y
```



<!--more-->

```
sudo apt install virt-manager -y
```



检查组是否已经存在

sudo getent group | grep libvirt

如果不存在，请将其添加为系统组

sudo groupadd --system libvirt

#sudo adduser $USER libvirt

sudo usermod -a -G libvirt $(whoami)

newgrp libvirt



```
$ sudo cat /etc/libvirt/libvirtd.conf | egrep  "unix_sock_group|unix_sock_rw_perms" 
#unix_sock_group = "libvirt"
#unix_sock_rw_perms = "0770"

sudo sed -i 's/^#\(unix_sock_group\)/\1/' /etc/libvirt/libvirtd.conf
sudo sed -i 's/^#\(unix_sock_rw_perms\)/\1/' /etc/libvirt/libvirtd.conf
```



sudo systemctl restart libvirtd.service

sudo usermod -aG kvm $USER  ?



### 目录

默认存储池默认存储池 /var/lib/libvirt/images

虚拟网络配置文件作为XML文件存储在**/etc/libvirt/qemu/networks**

/etc/libvirt/qemu/networks/default.xml







### 创建系统

```
virt-install \
--virt-type kvm \
--os-type=linux \
--os-variant debian9 \
--name test \
--ram 1024  \
--vcpus=1  \
--disk /home/cs/data/kvm/qcow/debian9.qcow2,size=20,bus=virtio,format=qcow2 \
--cdrom  /home/cs/data/VM/debian-9.8.0-amd64-netinst.iso    \
--network=bridge=br0,model=virtio \
--graphics vnc,listen=0.0.0.0 \
--noautoconsole
--autostart
```

> --connect 默认为qemu:///system, qemu+ssh://192.168.35.10/system
>
> –name 这个参数就是取名字
> –ram 这个参数就是分配内存以MB计数 16834就是16G
> –vcpus 这个就是分配CPU的个数
> –cdrom 这个就是选择镜像位置
> –network=bridge 这个就是选择桥接网卡的接口 ,nat network=default/net-br
> –disk path 这个参数就是为了配置虚拟机的硬盘大小 size=40 就是40G format为qcow2 
>
> --os-variant  查询 osinfo-query os（ apt -y install libosinfo-bin ）
>
> --autostart   自动开启





```
sudo  brctl addbr br0
```

> ERROR    无法在 'br0' 获取接口 MTU: 没有那个设备



```
$ brctl show | grep br0
br0		8000.1270c8fbe175	no		vnet1
```



```
$ sudo virt-install   --virt-type kvm --os-type=linux --os-variant centos7 --name centos7-01 --ram 2048  --vcpus=2  --disk /home/cs/data/kvm/qcow/centos7.qcow2,size=20,bus=virtio,format=qcow2 --cdrom  /home/cs/data/kvm/iso/CentOS-7-x86_64-Minimal-1810.iso    --network=bridge=br0,model=virtio --graphics vnc,listen=0.0.0.0 --noautoconsole

开始安装......
正在分配 'debian9.qcow2'        0% [                 ]    0 B/s | 1.2 MB  --:-- 正在分配 'debian9.qcow2'        0% [                 ] 5.7 MB/s | 9.2 MB  59:31 正在分配 'debian9.qcow2'        0% [                 ] 6.3 MB/s |  18 MB  53:49 正在分配 'debian9.qcow2'        0% [                 ] 6.7 MB/s |  27 MB  51:00 正在分配 'debian9.qcow2'        0% [                 ] 6.9 MB/s |  35 MB  49:24 正在分配 'debian9.qcow2'        0% [                 ] 7.1 MB/s |  42 MB  48:12 正在分配 'debian9.qcow2'                                        |  20 GB  00:05     

域仍在运行。安装可能正在进行中。
可以重新连接到控制台以完成安装过程。
```

> qemu:///system



### 磁盘格式

raw立即分配空间,裸格式，占用空间比较大，不适合远程传输,不支持快照功能，性能较好

qcow2只有需要时才会分配空间,cow(copy on write)占用空间小，适合传输，支持快照，性能比 raw 稍差



```
#创建虚拟磁盘
qemu-img create test.raw  10G
qemu-img create -f qcow2 test.qcow2 10G
 
#查看虚拟磁盘信息
qemu-img info test.raw
 
#调整虚拟磁盘容量大小
qemu-img resize test.raw +5G
 
#磁盘格式转换
qemu-img convert -f raw -O qcow2 test.raw test.qcow2
```



### 快照



```
raw不支持快照

创建快照
virsh snapshot-create-as vm02 vm02.snap02

查看快照
virsh snapshot-list vm02

关闭虚拟机，恢复快照
virsh snapshot-revert vm02 vm02.snap02

删除快照
virsh snapshot-delete --snapshotname vm02.snap02 vm02
```



### 网络

#### brctl

```
brctl [参数] <bridge>
```

| 参数                      | 说明                   | 示例                      |
| ------------------------- | ---------------------- | ------------------------- |
| `addbr <bridge>`          | 创建网桥               | **brctl** addbr br10      |
| `delbr <bridge>`          | 删除网桥               | **brctl** delbr br10      |
| `addif <bridge> <device>` | 将网卡接口接入网桥     | **brctl** addif br10 eth0 |
| `delif <bridge> <device>` | 删除网桥接入的网卡接口 | **brctl** delif br10 eth0 |
| `show <bridge>`           | 查询网桥信息           | **brctl** show br10       |
| `stp <bridge> {on|off}`   | 启用禁用 STP           | **brctl** stp br10 off/on |
| `showstp <bridge>`        | 查看网桥 STP 信息      | **brctl** showstp br10    |
| `setfd <bridge> <time>`   | 设置网桥延迟           | **brctl** setfd br10 10   |
| `showmacs <bridge>`       | 查看 mac 信息          | **brctl** showmacs br10   |



https://www.cnblogs.com/hukey/p/6436211.html





#### 桥接



```
#创建桥接网络
virsh iface-bridge eth0 br0
```

> --network bridge=br0



sudo brctl addif br0 eth0

sudo brctl stp br0 on

brctl show



#### net



```
$ sudo virsh net-list --all
 名称      状态     自动开始   持久
-------------------------------------
 default   不活跃   否         是

$ sudo virsh net-autostart default
网络default标记为自动启动

$ sudo virsh net-start default
网络 default 已开始

$ sudo virsh net-list --all
 名称      状态   自动开始   持久
-----------------------------------
 default   活动   是         是

$ sudo virsh net-destroy default
网络 default 被删除

```

> 网络 'default' 未激活



https://tqdev.com/2020-kvm-network-static-ip-addresses

```
$ sudo virsh net-dumpxml default
```

><network>
><name>default</name>
><uuid>f527b455-06b2-4bd2-87cd-7c4c84ef899d</uuid>
><forward mode='nat'>
><nat>
><port start='1024' end='65535'/>
></nat>
></forward>
><bridge name='virbr0' stp='on' delay='0'/>
><mac address='52:54:00:b5:1f:85'/>
><ip address='192.168.122.1' netmask='255.255.255.0'>
><dhcp>
><range start='192.168.122.2' end='192.168.122.254'/>  #ip-dhcp-range
></dhcp>
></ip>
></network>

宿主机操作default.xml

```
##更新dhcp范围
# virsh net-update default delete ip-dhcp-range "<range start='192.168.122.2' end='192.168.122.254'/>" --live --config
# virsh net-update default add ip-dhcp-range "<range start='192.168.122.100' end='192.168.122.254'/>" --live --config

#获取name
$ sudo virsh list 
 Id   名称         状态
----------------------------
 3    centos7-01   running
 
 #获取mac
$ sudo virsh dumpxml centos7-01  | grep "mac address"
      <mac address='52:54:00:ed:75:fc'/>

#分配ip
sudo virsh net-update default add-last ip-dhcp-host "<host mac='52:54:00:ed:75:fc' name='centos7-01' ip='192.168.122.11'/>" --live --config
sudo virsh net-dumpxml default
```

><network>
><name>default</name>
><uuid>f527b455-06b2-4bd2-87cd-7c4c84ef899d</uuid>
><forward mode='nat'>
><nat>
><port start='1024' end='65535'/>
></nat>
></forward>
><bridge name='virbr0' stp='on' delay='0'/>
><mac address='52:54:00:b5:1f:85'/>
><ip address='192.168.122.1' netmask='255.255.255.0'>
><dhcp>
><range start='192.168.122.2' end='192.168.122.254'/>
><host mac='52:54:00:ed:75:fc' name='centos7-01' ip='192.168.122.11'/>
></dhcp>
></ip>
></network>



在虚机上重新发送DHCP请求

```
sudo dhclient -r && sudo dhclient
dhclient -r &&  dhclient
```

ping

```
$ arp -a | grep 52:54:00:ed:75:fc
? (192.168.122.11) at 52:54:00:ed:75:fc [ether] on virbr0

$ ping 192.168.122.11
PING 192.168.122.11 (192.168.122.11) 56(84) bytes of data.
64 bytes from 192.168.122.11: icmp_seq=1 ttl=64 time=0.279 ms
64 bytes from 192.168.122.11: icmp_seq=2 ttl=64 time=0.311 ms
^C
--- 192.168.122.11 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1022ms
rtt min/avg/max/mdev = 0.279/0.295/0.311/0.016 ms
```



重启自动获取ip

```
[root@centos7-01 ~]# cat /etc/sysconfig/network-scripts/ifcfg-eth0 | grep BOOT
BOOTPROTO=dhcp
ONBOOT=no

[root@centos7-01 ~]# sed -n '/^ONBOOT=/s/no/yes/'p /etc/sysconfig/network-scripts/ifcfg-eth0
ONBOOT=yes
[root@centos7-01 ~]# sed -i '/^ONBOOT=/s/no/yes/' /etc/sysconfig/network-scripts/ifcfg-eth0

[root@centos7-01 ~]# systemctl restart network
```



ssh

```
systemctl status sshd.service
systemctl restart sshd.service


# sed -n "s/^[Port|ListenAddress]/#&/"p /etc/ssh/sshd_config
#Port 22
#ListenAddress 0.0.0.0
#ListenAddress ::
#PermitRootLogin yes
待修正 ？？？？

#取消 sed 's/^#\(bbb\)/\1/' z.txt
```









```
$ sudo virsh net-edit default
```

>Select an editor.  To change later, run 'select-editor'.
>
>    1. /bin/nano        <---- easiest
>    2. /usr/bin/vim.tiny
>
>Choose 1-2 [1]: 2



#### ifcfg-eth0

host /etc/libvirt/qemu/networks/default.xml

>  <ip address='192.168.122.1' netmask='255.255.255.0'>
>     <dhcp>
>       <range start='192.168.122.2' end='192.168.122.254'/>
>       <host mac='52:54:00:ed:75:fc' name='centos7-01' ip='192.168.122.11'/>
>       <host mac='52:54:00:ed:5f:02' name='centos7-01' ip='192.168.122.12'/>
>     </dhcp>
>   </ip>	



vm  /etc/sysconfig/network-scripts/ifcfg-eth0

>TYPE=Ethernet
>PROXY_METHOD=none
>BROWSER_ONLY=no
>BOOTPROTO=dhcp
>DEFROUTE=yes
>IPV4_FAILURE_FATAL=no
>IPV6INIT=yes
>IPV6_AUTOCONF=yes
>IPV6_DEFROUTE=yes
>IPV6_FAILURE_FATAL=no
>IPV6_ADDR_GEN_MODE=stable-privacy
>NAME=eth0
>UUID=5ab88b14-d03b-4469-8dfa-d98872b7c97b
>DEVICE=eth0
>ONBOOT=yes



```
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=eth0
DEVICE=eth0
ONBOOT=yes
IPADDR=192.168.122.1
NETMASK=255.255.255.0
GATEWAY=192.168.122.1
DNS1=192.168.1.1
```

> IPADDR=192.168.122.1  #固定静态ip




### libguestfs

https://libguestfs.org/

该工具包内包含的工具有virt-cat、virt-df、virt-ls、virt-copy-in、virt-copy-out、*virt-edit*....

```
sudo yum install libguestfs-tools      # Fedora/RHEL/CentOS
sudo apt-get install libguestfs-tools  # Debian/Ubuntu
```



#### virt-edit

https://libguestfs.org/virt-edit.1.html

```
cs@debian:~/data/kvm$ sudo virt-edit -d base /etc/sysconfig/network-scripts/ifcfg-eth0 -e "s/dhcp/static/" 
cs@debian:~/data/kvm$ sudo virt-cat base /etc/sysconfig/network-scripts/ifcfg-eth0
```

> TYPE=Ethernet
> PROXY_METHOD=none
> BROWSER_ONLY=no
> BOOTPROTO=static
> DEFROUTE=yes
> IPV4_FAILURE_FATAL=no
> IPV6INIT=yes
> IPV6_AUTOCONF=yes
> IPV6_DEFROUTE=yes
> IPV6_FAILURE_FATAL=no
> IPV6_ADDR_GEN_MODE=stable-privacy
> NAME=eth0
> UUID=65a51a6b-e278-4066-8d60-f7537080cc68
> DEVICE=eth0
> ONBOOT=yes



不支持  "/^BOOTPROTO/s/static/dhcp/"

```
cs@debian:~/data/kvm$ sudo virt-edit -d base /etc/sysconfig/network-scripts/ifcfg-eth0 -e "/^BOOTPROTO/s/static/dhcp/"
syntax error at (eval 1) line 1, at EOF
	...propagated at -e line 1, <STDIN> line 1.
```


### 镜像模板配置

#### hosts

<details>
  <summary>/etc/hosts</summary>
127.0.0.1   localhost k8s01
::1         localhost
192.168.122.11 k8s01
192.168.122.12 k8s02
192.168.122.13 k8s03
192.168.122.14 k8s04
192.168.122.15 k8s05
192.168.122.16 k8s06
</details>


#### ifcfg-eth0

<details>
  <summary>/etc/sysconfig/network-scripts/ifcfg-eth0</summary>
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=eth0
DEVICE=eth0
ONBOOT=yes
NETMASK=255.255.255.0
GATEWAY=192.168.122.1
DNS1=192.168.1.1
</details>


#### 批量创建

基于已有镜像系统

```
/etc/libvirt/qemu
├── base.xml
├── k8s01.xml
├── k8s02.xml
├── k8s03.xml
├── k8s04.xml
├── k8s05.xml
├── k8s06.xml
├── networks
│   ├── autostart
│   │   └── default.xml -> /etc/libvirt/qemu/networks/default.xml
│   └── default.xml
└── test.xml

2 directories, 10 files

```

  virsh defline --validate k8s01.xml



<details>
  <summary>k8s01.xml</summary>
<pre><a>/etc/libvirt/qemu/k8s01.xml</a><xmp>
 <!--
WARNING: THIS IS AN AUTO-GENERATED FILE. CHANGES TO IT ARE LIKELY TO BE
OVERWRITTEN AND LOST. Changes to this xml configuration should be made using:
  virsh edit k8s01
or other application using the libvirt API.
-->
<domain type='kvm'>
  <name>k8s01</name>
  <uuid>f2e97f2f-583d-4ada-a7be-f18f42053374</uuid>
  <title>192.168.1.1</title>
  <metadata>
    <libosinfo:libosinfo xmlns:libosinfo="http://libosinfo.org/xmlns/libvirt/domain/1.0">
      <libosinfo:os id="http://centos.org/centos/7.0"/>
    </libosinfo:libosinfo>
  </metadata>
  <memory unit='KiB'>2097152</memory>
  <currentMemory unit='KiB'>2097152</currentMemory>
  <vcpu placement='static'>2</vcpu>
  <os>
    <type arch='x86_64' machine='pc-q35-5.2'>hvm</type>
    <boot dev='hd'/>
  </os>
  <features>
    <acpi/>
    <apic/>
  </features>
  <cpu mode='host-model' check='partial'/>
  <clock offset='utc'>
    <timer name='rtc' tickpolicy='catchup'/>
    <timer name='pit' tickpolicy='delay'/>
    <timer name='hpet' present='no'/>
  </clock>
  <on_poweroff>destroy</on_poweroff>
  <on_reboot>restart</on_reboot>
  <on_crash>destroy</on_crash>
  <pm>
    <suspend-to-mem enabled='no'/>
    <suspend-to-disk enabled='no'/>
  </pm>
  <devices>
    <emulator>/usr/bin/qemu-system-x86_64</emulator>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='/home/cs/data/kvm/qcow/centos7.qcow2'/>
      <target dev='vda' bus='virtio'/>
      <address type='pci' domain='0x0000' bus='0x04' slot='0x00' function='0x0'/>
    </disk>
    <disk type='file' device='cdrom'>
      <driver name='qemu' type='raw'/>
      <target dev='sda' bus='sata'/>
      <readonly/>
      <address type='drive' controller='0' bus='0' target='0' unit='0'/>
    </disk>
    <controller type='usb' index='0' model='qemu-xhci' ports='15'>
      <address type='pci' domain='0x0000' bus='0x02' slot='0x00' function='0x0'/>
    </controller>
    <controller type='sata' index='0'>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x1f' function='0x2'/>
    </controller>
    <controller type='pci' index='0' model='pcie-root'/>
    <controller type='pci' index='1' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='1' port='0x10'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x0' multifunction='on'/>
    </controller>
    <controller type='pci' index='2' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='2' port='0x11'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x1'/>
    </controller>
    <controller type='pci' index='3' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='3' port='0x12'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x2'/>
    </controller>
    <controller type='pci' index='4' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='4' port='0x13'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x3'/>
    </controller>
    <controller type='pci' index='5' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='5' port='0x14'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x4'/>
    </controller>
    <controller type='pci' index='6' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='6' port='0x15'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x5'/>
    </controller>
    <controller type='pci' index='7' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='7' port='0x16'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x6'/>
    </controller>
    <controller type='virtio-serial' index='0'>
      <address type='pci' domain='0x0000' bus='0x03' slot='0x00' function='0x0'/>
    </controller>
    <interface type='network'>
      <mac address='52:54:00:ed:75:fc'/>
      <source network='default'/>
      <model type='virtio'/>
      <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
    </interface>
    <serial type='pty'>
      <target type='isa-serial' port='0'>
        <model name='isa-serial'/>
      </target>
    </serial>
    <console type='pty'>
      <target type='serial' port='0'/>
    </console>
    <channel type='unix'>
      <target type='virtio' name='org.qemu.guest_agent.0'/>
      <address type='virtio-serial' controller='0' bus='0' port='1'/>
    </channel>
    <input type='tablet' bus='usb'>
      <address type='usb' bus='0' port='1'/>
    </input>
    <input type='mouse' bus='ps2'/>
    <input type='keyboard' bus='ps2'/>
    <graphics type='vnc' port='-1' autoport='yes' listen='0.0.0.0'>
      <listen type='address' address='0.0.0.0'/>
    </graphics>
    <video>
      <model type='vga' vram='16384' heads='1' primary='yes'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x0'/>
    </video>
    <memballoon model='virtio'>
      <address type='pci' domain='0x0000' bus='0x05' slot='0x00' function='0x0'/>
    </memballoon>
    <rng model='virtio'>
      <backend model='random'>/dev/urandom</backend>
      <address type='pci' domain='0x0000' bus='0x06' slot='0x00' function='0x0'/>
    </rng>
  </devices>
</domain>
 </xmp></pre>
</details>



网络 

<details>
  <summary>default.xml</summary>
  <pre><a>/etc/libvirt/qemu/networks/default.xml</a><xmp> 
  <!--
WARNING: THIS IS AN AUTO-GENERATED FILE. CHANGES TO IT ARE LIKELY TO BE
OVERWRITTEN AND LOST. Changes to this xml configuration should be made using:
  virsh net-edit default
or other application using the libvirt API.
-->
<network>
  <name>default</name>
  <uuid>f527b455-06b2-4bd2-87cd-7c4c84ef899d</uuid>
  <forward mode='nat'/>
  <bridge name='virbr0' stp='on' delay='0'/>
  <mac address='52:54:00:b5:1f:85'/>
  <ip address='192.168.122.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.122.2' end='192.168.122.254'/>
      <host mac='52:54:00:ed:75:fc' name='centos7-01' ip='192.168.122.11'/>
    </dhcp>
  </ip>
</network>
</xmp></pre>
</details>

批量

batch.sh

```shell
#!/bin/env bash
start=4
end=6

#基础镜像和配置
baseimg=/home/cs/data/kvm/images/centos-base.qcow2
sqemu=/home/cs/data/kvm/k8s01.xml

#qemu=/etc/libvirt/qemu
qemu=/home/cs/data/kvm/qcow

#网络
net=/etc/libvirt/qemu/networks/default.xml
#名称domain
name=k8s0
#ip起始
bip="192.168.122.1"

copy_xml(){
	cp_xml=$qemu/$name$1.xml
	cp $sqemu $cp_xml
	uuid=$(cat /proc/sys/kernel/random/uuid)
	mac1=`openssl rand -base64 8 |md5sum |cut -c1-2`
	mac2=`openssl rand -base64 8 |md5sum |cut -c1-2`

	sed -n "/<name>/s/>.*</>$name$1</"p $cp_xml
	sed -i "/<name>/s/>.*</>$name$1</" $cp_xml

	sed -n "/<uuid>/s/>.*</>$uuid</"p  $cp_xml
	sed -i "/<uuid>/s/>.*</>$uuid</" $cp_xml

	sed -n "/<title>/s/>.*</>$bip$1</"p  $cp_xml
	sed -i "/<title>/s/>.*</>$bip$1</" $cp_xml

	# mac <mac address='52:54:00:ed:xx:xx'/>
	mac="/<mac/s/address=.*'/address='52:54:00:ed:$mac1:$mac2'/"
	sed -n ${mac}p  $cp_xml
	sed -i ${mac} $cp_xml

	#磁盘名称
	file="/<source/s/file=.*'/file='\/home\/cs\/data\/kvm\/qcow\/$name$i.qcow2'/"
	sed -n ${file}p  $cp_xml
	sed -i  ${file} $cp_xml

	
}

#复制img文件
copy_qcow2(){
	for i in `seq $start $end`
	do
	{
		temp=/home/cs/data/kvm/qcow/$name$i.qcow2
		[ -f "$temp" ] && { echo "file:$temp is exist,exit shell" && exit 0;} 
		echo ">>>start copy...$name$i.qcow2"
		cp $baseimg  $temp
	    wait
		echo "copy qcow2 end"
        
        echo ">>>start copy...xml"
        copy_xml $i
        echo "copy xml end"	

	}
	done

}

#/etc/libvirt/qemu/networks/default.xml
allcote_ip(){
   for i in `seq $start $end`
	do
	{
        echo ">>>start allcote ip..."
        temp=$qemu/$name$i.xml
        mac=$(cat $temp | grep "<mac" | sed  "s/.*\(52.*\)'\/>/\1/")
        sed -n "/$name$i/s/mac=.* n/mac='$mac' n/"p $net
        sed -i "/$name$i/s/mac=.* n/mac='$mac' n/" $net

        virsh define $temp
        [ -n "$(command virt-edit -V)" ] || { echo "tool virt-edit is not exist,please download https://libguestfs.org/" && exit ; }
        ar="IPADDR=192.168.122.1$i"
        virt-edit -d $name$i /etc/sysconfig/network-scripts/ifcfg-eth0 -e "s/.*ADDR=192.*/$ar/"
        wait
        changeip=$(virt-cat $name$i /etc/sysconfig/network-scripts/ifcfg-eth0 | grep IPADDR)
        echo "NAME=$name$i MAC=$mac $changeip"
        echo "end allcote ip\n"
	}
	done
	
}

copy_qcow2

allcote_ip

:<<EOF
qemu-img info base.qcow2 
image: base.qcow2
file format: qcow2
virtual size: 20 GiB (21474836480 bytes)
disk size: 3.72 GiB
cluster_size: 65536
Format specific information:
    compat: 1.1
    compression type: zlib
    lazy refcounts: true
    refcount bits: 16
    corrupt: false
    extended l2: false
    
sudo yum install libguestfs-tools      # Fedora/RHEL/CentOS
sudo apt-get install libguestfs-tools  # Debian/Ubuntu

[ "${USER}" = "root" ] || { echo "user:$USER " && copy_qcow2  ;}
[ "${USER}" = "root" ] && { echo "user:$USER " && allcote_ip ;}

EOF
```






## vagrant

~/.vagrant.d



```
$ sudo ln -sf /opt/vagrant/bin/vagrant  /usr/local/bin/vagrant

```

> $ ls ~/.vagrant.d




metadata.json

```
vagrant box add name metadata.json
cat >metadata.json<<EOF
{
    "name": "名称", 
    "versions": [{
        "version": "版本", 
        "providers": [{
            "name": "虚拟机类型", 
            "url": "file:///home/cs/data/VM/xxx.box"
        }]
    }]
}
EOF
```

>{
>    "name": "centos/7",
>    "versions": [{
>        "version": "7.1.0",
>        "providers": [{
>            "name": "libvirt",
>            "url": "file:///home/cs/data/VM/centos/CentOS-7-x86_64-Vagrant-2004_01.LibVirt.box"
>        }]
>    }]
>}



### add

```
 vagrant box add centos/7 /home/cs/data/VM/centos/metadata.json
 
```

>==> box: Loading metadata for box '/home/cs/data/VM/centos/metadata.json'
>box: URL: file:///home/cs/data/VM/centos/metadata.json
>==> box: Adding box 'centos/7' (v7.1.0) for provider: libvirt
>box: Unpacking necessary files from: file:///home/cs/data/VM/centos/CentOS-7-x86_64-Vagrant-2004_01.LibVirt.box
>==> box: Successfully added box 'centos/7' (v7.1.0) for 'libvirt'!



### list

```
$ vagrant box list
centos/7 (libvirt, 7.1.0)
centos/7 (virtualbox, 7.1.0)

```





### plugin



vagrant plugin expunge --reinstall



#插件列表
vagrant plugin list







命令行界面之 Plugin https://blog.51cto.com/luciferliu/3432079
