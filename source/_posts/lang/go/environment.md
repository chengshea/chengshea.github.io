---
title: go环境配置
permalink: lang/go/environment/
tags:
  - go
  - environment
  - xxx
categories:
  - lang
  - go
  - environment
date: 2023-02-28 16:03:46
---



https://github.com/golang/go

## 编译

GOPATH之下主要包含三个目录: 

bin  编译后可的执行文件的存放路径

pkg  编译包时，生成的.a文件的存放路径

src 源码路径



升级或编译源码，需要旧的二进制版本来编译 

<p id="go_env" hidden/>

```
export GOROOT=/opt/go/1.18.1
export PATH=$PATH:$GOROOT/bin
export GOROOT_BOOTSTRAP=/opt/go/1.18.1

git clone https://github.com/golang/go.git
cd go
git checkout go1.20.1
cd ./src
./make.bash

```

> Set $GOROOT_BOOTSTRAP to a working Go tree >= Go 1.17.13

<!--more-->



##





