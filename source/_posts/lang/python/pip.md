---
title: pip包管理
permalink: lang/python/pip/
tags:
  - pip
categories:
  - lang
  - python
date: 2022-07-16 21:21:44
---



## 安装

```
cs@debian:~/oss/typoraCracker$ sudo apt-get install python3-pip
cs@debian:~/oss/typoraCracker$ pip3 -V
pip 20.3.4 from /usr/local/lib/python3.5/dist-packages/pip (python 3.5)
```



## 升级

```
cs@debian:~/oss/typoraCracker$ sudo pip3 install --upgrade pip
Collecting pip
  Downloading http://mirrors.aliyun.com/pypi/packages/27/79/8a850fe3496446ff0d584327ae44e7500daf6764ca1a382d2d02789accf7/pip-20.3.4-py2.py3-none-any.whl (1.5MB)
    100% |████████████████████████████████| 1.5MB 5.8MB/s 
Installing collected packages: pip
  Found existing installation: pip 9.0.1
    Not uninstalling pip at /usr/lib/python3/dist-packages, outside environment /usr
Successfully installed pip-20.3.4
```



## 国内源

```
$ pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
Writing to ~/.config/pip/pip.conf

```
pip.ini

```
[global]
timeout = 6000
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host = pypi.tuna.tsinghua.edu.cn
```



## 卸载

```
sudo apt-get remove python3-pip
```

