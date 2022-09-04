---
title: Sublime中文
permalink: tool/codetool/sublime01/
tags:
  - 中文
  - zh-cn
  - linux
categories:
  - tool
  - sublime
date: 2022-09-01 20:59:31
---

### 无法输入中文

git<span
style="font-size: 15px;"> </span><a href="https://github.com/lyfeyaj/sublime-text-imfix"
data-_src="https://github.com/lyfeyaj/sublime-text-imfix"
style="font-size: 15px; text-decoration: underline;"><span
style="font-size: 15px;">https://github.com/lyfeyaj/sublime-text-imfix</span></a>

忽略编译（已编译）

<span style="font-size: 15px;">sublime-imfix.c
下面命令编译生成 libsublime-imfix.so</span>

``` prettyprint
gcc -shared -o libsublime-imfix.so sublime_imfix.c  `pkg-config --libs --cflags gtk+-2.0` -fPIC
```

<!--more-->

copy安装目录  

``` prettyprint
sudo mv libsublime-imfix.so /opt/sublime_text/
```

<img src="/pics/450575164.png" data-border="0"
data-_src="/pics/450575164.png" />

  

### 命令行启动输入中文

/usr/bin/subl

``` prettyprint
exec /opt/sublime_text/sublime_text "$@"    
替换为
LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text "$@"
```

  

### 菜单栏打开输入中文

<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">修改文件sublime_text.desktop的内容</span>

<img src="/pics/1133594981.png" data-border="0"/>

<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  将\[Desktop
Entry\]中的字符串</span>  
<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 Exec=/opt/sublime_text/sublime_text %F</span>  
<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 修改为</span>  

``` prettyprint
    Exec=bash -c "LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text %F"
```

<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 将\[Desktop Action Window\]中的字符串</span>  
<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 Exec=/opt/sublime_text/sublime_text -n</span>  
<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 修改为</span>  

``` prettyprint
    Exec=bash -c "LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text -n"
```

<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 将\[Desktop Action Document\]中的字符串</span>  
<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 Exec=/opt/sublime_text/sublime_text --command new_file</span>  
<span
style="color: rgb(61, 70, 77); font-family: 'Pingfang SC', STHeiti, 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', SimSun, sans-serif; font-size: 16px; background-color: rgb(248, 248, 248);">  
 修改为</span>  

``` prettyprint
   Exec=bash -c "LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text --command new_file"
```

  

中文界面

<span
style="font-size: 15px;"> <a href="https://packagecontrol.io/installation#Simple"
data-_src="https://packagecontrol.io/installation#Simple">https://packagecontrol.io/installation#Simple</a>
</span>

<span style="font-size: 15px;">下载 <span
style="color: rgb(111, 146, 186); text-decoration: none; font-family: Consolas, 'Driod Sans Mono', monospace; font-size: 15px; white-space: normal;"><span
style=""><a href="https://packagecontrol.io/Package%20Control.sublime-package"
style="color: rgb(111, 146, 186); text-decoration: none; font-family: Consolas, &#39;Driod Sans Mono&#39;, monospace; font-size: 15px; white-space: normal;">Package
Control.sublime-package</a> </span></span><a href="https://packagecontrol.io/Package%20Control.sublime-package"
data-_src="https://packagecontrol.io/Package%20Control.sublime-package">https://packagecontrol.io/Package%20Control.sublime-package</a>
</span>

<span
style="color: rgb(85, 85, 85); font-family: Helvetica, Arial, Verdana, sans-serif; font-size: 15px;"> 点击 </span><span
class="menu"
style="border-top-left-radius: 2px; border-top-right-radius: 2px; border-bottom-right-radius: 2px; border-bottom-left-radius: 2px; background-color: rgb(243, 243, 243); padding: 1px 4px; text-shadow: rgb(255, 255, 255) 0px 1px 0px; color: rgb(85, 85, 85); font-family: Helvetica, Arial, Verdana, sans-serif; font-size: 15px;">Preferences *\>* Browse
Packages</span>

进入目录软件

1.  Download <a href="https://packagecontrol.io/Package%20Control.sublime-package"
    style="color: rgb(111, 146, 186); text-decoration: none;">Package
    Control.sublime-package</a> and copy it into the Installed
    Packages/ directory

2.  重启生效  

3.  <span
    style="color: rgb(51, 51, 51); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify;">点击Preferences/Package
    Control，然后输入Package Control：<span
    style="color: rgb(255, 0, 0); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify;">Install Package</span></span>

4.  <span
    style="color: rgb(51, 51, 51); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify;"><span
    style="color: rgb(255, 0, 0); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify;"><span
    style="color: rgb(51, 51, 51); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify; white-space: normal;">然后在弹出的命令界面，输入Chinese，选择ChineseLocalization</span></span></span>

5.  <span
    style="color: rgb(51, 51, 51); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify;"><span
    style="color: rgb(255, 0, 0); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify;"><span
    style="color: rgb(51, 51, 51); font-family: 'Microsoft Yahei', 微软雅黑, arial, 宋体, sans-serif; font-size: 16px; text-align: justify; white-space: normal;">安装成功</span></span></span>  

  



