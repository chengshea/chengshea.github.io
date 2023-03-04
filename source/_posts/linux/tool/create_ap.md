---
title: linux开启wifi
permalink: linux/tool/create_ap/
tags:
  - linux
  - wifi
  - create_ap
  - x
categories:
  - linux
  - tool
date: 2023-02-25 14:36:52
---

## iwlwifi

```
sudo apt-get install firmware-iwlwifi

modprobe  iwlwifi

 

```



```
#ifconfig
$ sudo apt install net-tools  
$ ifconfig
```

>enp109s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
>        inet 192.168.5.141  netmask 255.255.255.0  broadcast 192.168.5.255
>        inet6 fe80::82fa:5bff:fe3e:b84c  prefixlen 64  scopeid 0x20<link>
>        ether 80:fa:5b:3e:b8:4c  txqueuelen 1000  (Ethernet)
>        RX packets 9829  bytes 5164328 (4.9 MiB)
>        RX errors 0  dropped 0  overruns 0  frame 0
>        TX packets 10728  bytes 2469498 (2.3 MiB)
>        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
>
>lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
>        inet 127.0.0.1  netmask 255.0.0.0
>        inet6 ::1  prefixlen 128  scopeid 0x10<host>
>        loop  txqueuelen 1000  (Local Loopback)
>        RX packets 24  bytes 2540 (2.4 KiB)
>        RX errors 0  dropped 0  overruns 0  frame 0
>        TX packets 24  bytes 2540 (2.4 KiB)
>        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
>
>wlp110s0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
>        ether b2:6f:32:64:0a:75  txqueuelen 1000  (Ethernet)
>        RX packets 0  bytes 0 (0.0 B)
>        RX errors 0  dropped 0  overruns 0  frame 0
>        TX packets 0  bytes 0 (0.0 B)
>        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp109s0f1  eth0

wlp110s0   wlan0

```
sed -n '/GRUB_CMDLINE_LINUX=/s/""/"net.ifnames=0 biosdevname=0"/'p  /etc/default/grub
GRUB_CMDLINE_LINUX="net.ifnames=0 biosdevname=0"

sudo sed -i '/GRUB_CMDLINE_LINUX=/s/""/"net.ifnames=0 biosdevname=0"/'  /etc/default/grub
```

grub-mkconfig -o /boot/grub/grub.cfg  ?



## create_ap

https://github.com/oblique/create_ap

```
git clone https://github.com/oblique/create_ap
cd create_ap
make install
```

>install -Dm755 create_ap /usr/bin/create_ap
>install -Dm644 create_ap.conf /etc/create_ap.conf
>[ ! -d /lib/systemd/system ] || install -Dm644 create_ap.service /usr/lib/systemd/system/create_ap.service
>[ ! -e /sbin/openrc-run ] || install -Dm755 create_ap.openrc /etc/init.d/create_ap
>install -Dm644 bash_completion /usr/share/bash-completion/completions/create_ap
>install -Dm644 README.md /usr/share/doc/create_ap/README.md

<!--more-->

```
create_ap$ create_ap --version
0.4.6
```







## hostapd



```
cp   defconfig   .config
```

> CONFIG_LIBNL32=y  #放开此行注释





```
make
make install
```

>install -D hostapd /usr/local/bin//hostapd
>install -D hostapd_cli /usr/local/bin//hostapd_cli



```

$ sudo ln -s /opt/hot-wifi/hostapd-2.10/hostapd/hostapd  /usr/local/bin/hostapd
$ sudo ln -s /opt/hot-wifi/hostapd-2.10/hostapd/hostapd_cli  /usr/local/bin/hostapd_cli

$ sudo mkdir /etc/hostapd
$ sudo ln -s /opt/hot-wifi/hostapd-2.10/hostapd/hostapd.accept /etc/hostapd/hostapd.accept

sudo ln -s /opt/hot-wifi/hostapd-2.10/hostapd/hostapd.deny /etc/hostapd/hostapd.deny
sudo ln -s /opt/hot-wifi/hostapd-2.10/hostapd/hostapd.conf /etc/hostapd/hostapd.conf
```







## 查看 wifi 热点连接情况

```
#查看当前无线网的ID
$ create_ap --list-running
List of running create_ap instances:

1969 wlan0 (ap0)


$ create_ap --list-clients  1969
```



