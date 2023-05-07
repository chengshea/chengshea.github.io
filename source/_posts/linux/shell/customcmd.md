---
title: 自定义cmd命令
permalink: linux/shell/customcmd/
tags:
  - cmd
  - bashrc
  - custom
categories:
  - linux
  - shell
date: 2023-03-05 19:42:45
---

typora没有details快捷的插入标签功能，对xml这种折叠不行，其他文本还可以

![](/pics/details-gif.gif)

## 脚本

/home/cs/.local/custom/details.sh

```
xdetails_helpdoc(){
    cat <<EOF
Description:
   处理文档，方便粘贴到typora,实现折叠效果
Usage:
   xdetails  file
eg:
  xdetails  /home/cs/data/kvm/default.xml
--------------------------------------------------
<details>
  <summary>折叠代码块</summary>
  <pre><a>xxxx</a><xmp>
<network>
  <input type='tablet' bus='usb'>
    <address type='usb' bus='0' port='1'/>
  </input>
</network>
  </xmp></pre>
</details>
------------------------------------------------------
EOF
}



xdetails_space(){
	cat >$2<<EOF
<details>
  <summary>折叠代码块</summary>
  <pre><a>xxxx</a><code>
EOF
  
  sed  "s/^$/<\/br>/" $1 >>$2

	cat >>$2<<EOF
  </code></pre>
</details>
EOF

echo "对${1##*.}文本使用</br>替换标签。。。" 

}



xdetails_xml(){

	cat >$2<<EOF
<details>
  <summary>折叠代码块</summary>
  <pre><a>xxxx</a><xmp>
EOF

  sed  "/^$/d" $1 >>$2

	cat >>$2<<EOF
  </xmp></pre>
</details>
EOF

echo "对xml文本使用xmp标签处理。。。"

}


details(){
  target="/tmp/${1##*/}.new"
 if [ -f "$1" ] 
 then
      [  "xml" = "${1##*.}" ] || { echo "开始对：${1##*/} 处理。。。" && xdetails_space $1 $target ;}
      [  "xml" != "${1##*.}" ] || { echo "开始对：${1##*/} 处理。。。"  && xdetails_xml $1 $target;}
      cat $target | xsel -i -b  && echo "已复制到剪贴板中" 
      echo  "新文件路径：$target"
 else
       xdetails_helpdoc
  fi
}
```

把定义脚本统一放到custom目录

<!--more-->

## 引入



```
cs@debian:~/oss/hexo$ cat ~/.bashrc  |grep  -A 25 custom
######### custom start###########
CMD(){
  url=~/.local/custom/$1
  [ -f "$url" ] && source $url
}

if [ -n "$(command -v xsel)" ] ; then
  CMD details.sh
  alias xdetails='details $@'
fi

######### custom end###########
```



## 使用

刷新，开始使用

```
cs@debian:~/oss/hexo$ source ~/.bashrc 
cs@debian:~/oss/hexo$ xdetails 
Description:
   处理文档，方便粘贴到typora,实现折叠效果
Usage:
   xdetails  file
eg:
  xdetails  /home/cs/data/kvm/default.xml
--------------------------------------------------
<details>
  <summary>折叠代码块</summary>
  <pre><a>xxxx</a><xmp>
<network>
  <input type='tablet' bus='usb'>
    <address type='usb' bus='0' port='1'/>
  </input>
</network>
  </xmp></pre>
</details>
------------------------------------------------------
cs@debian:~/oss/hexo$ xdetails /home/cs/data/kvm/default.xml
开始对：default.xml 处理。。。
对xml文本使用xmp标签处理。。。
已复制到剪贴板中
新文件路径：/tmp/default.xml.new
```







<details>
  <summary>折叠xml</summary>
  <pre><a>折叠xml文本typora不显示，网页会正常</a><xmp>
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



<details>
  <summary>折叠普通文本</summary>
  <pre><a>peek一个生成gif软件</a><code>
cs@debian:~/下载$ sudo dpkg -i /home/cs/下载/peek_1.5.1-1_amd64.deb
[sudo] cs 的密码：
正在选中未选择的软件包 peek。
(正在读取数据库 ... 系统当前共安装有 112082 个文件和目录。)
准备解压 .../下载/peek_1.5.1-1_amd64.deb  ...
正在解压 peek (1.5.1-1) ...
......
正在设置 libcdio-cdda2:amd64 (10.2+2.0.0-1+b2) ...
正在设置 libcdio-paranoia2:amd64 (10.2+2.0.0-1+b2) ...
正在设置 libavdevice58:amd64 (7:4.3.5-0+deb11u1) ...
正在设置 ffmpeg (7:4.3.5-0+deb11u1) ...
正在设置 peek (1.5.1-1) ...
正在处理用于 libc-bin (2.31-13+deb11u5) 的触发器 ...
正在处理用于 man-db (2.9.4-2) 的触发器 ...
  </code></pre>
</details>
