
---
title: 搭建hexo
date: 2017-01-13 00:46:10
tags: 
 - install
 - hexo
categories: 
 - other
---
### 准备工具
node
git
hexo

### node 安装
``` bash
$tar  -zxvf  node.tar.gz
$cd node
$./config  --prefix=/opt/node
$sudo make
$sudo make install
```
添加环境变量
```bash
#set nodejs
export NODE_HOME=/opt/node
export PATH=$NODE_HOME/bin:$PATH
$node -v #显示版本号
$sudo node -v #当用root执行，commond not found
#mousepad  ~/.bashrc
alias sudo='sudo env PATH=$PATH'
```
 <!--more--> 
### git

``` bash
$cd ~/.ssh #查看没有密钥
$ ssh-keygen -t rsa -C "你git的user.email"
```
路径默认 最好输入密码
最后得到两个文件：id_rsa和id_rsa.pub

``` bash
$ cat ~/.ssh/id_rsa.pub #复制到github ssh key 
$ssh git@github.com  
```

### hexo
在指定目录下执行终端
```bash
$sudo npm install hexo-cli -g #安装在当前目录
#忽略warn
$sudo npm install hexo --save
$hexo -v
```
给予文件夹权限
初始化 ，安装组件
```
$hexo init
$npm install
```
### 部署
本地部署
```
$hexo g  #generate 简写
$hexo s #server  默认端口4000
```
push 
```
$hexo d #deploy
```
