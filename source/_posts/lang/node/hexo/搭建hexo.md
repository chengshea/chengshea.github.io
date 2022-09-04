---
title: 搭建hexo
date: 2017-01-13 00:46:10
tags: 
 - hexo
categories: 
  - npm
  - hexo
---





### 准备工具

node https://nodejs.org/zh-cn/download/
git
hexo

### node 安装

#### linux

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

#### win10

‪C:/Users/Shea/.npmrc

```
prefix=K:\node\last\node_global
cache=K:\node\last\node_cache
registry=https://registry.npm.taobao.org/
```

##### 环境变量

###### 用户变量path

K:\node\last

K:\node\last\node_global

###### 系统变量

NODE_PATH=K:\node\last\node_global\node_modules

#### 检查版本

```powershell
PS K:\chengshea.github.io> node -v
v16.17.0
PS K:\chengshea.github.io> npm -v
8.15.0
```

Error: EPERM: operation not permitted
> node目录 右键----属性----安全--选择当前用户（编辑）--权限 -- 完全控制




hexo : 无法加载文件 K:\node\last\node_global\hexo.ps1，因为在此系统上禁止运行脚本

> 设置->隐私和安全性->开发者选项->**PowerShell** 勾选 应用



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



### themes

部分主题是18,19年,node版本太高,**版本不一致**

会导致hexo server 正常,但hexo generate 生成的public目录文件**全为为0kb**

版本降级,或升级到一定版本,如

```json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  "hexo": {
    "version": "6.2.0"
  },
  "dependencies": {
    "hexo": "^6.2.0",
    "hexo-deployer-git": "^3.0.0",
    "hexo-generator-archive": "^1.0.0",
    "hexo-generator-baidu-sitemap": "^0.1.9",
    "hexo-generator-category": "^1.0.0",
    "hexo-generator-index": "^2.0.0",
    "hexo-generator-search": "^2.4.3",
    "hexo-generator-tag": "^1.0.0",
    "hexo-renderer-ejs": "^1.0.0",
    "hexo-renderer-marked": "^5.0.0",
    "hexo-renderer-stylus": "^2.1.0",
    "hexo-server": "^3.0.0",
    "highlight.js": "^11.6.0"
  }
}
```



会导致 跳转链接变成下载文件

```
#添加
sed -i "/^permalink/s/$/\//"  `grep 'permalink:'  -rl --include=\*.md  ./source/_posts/`
#删除
sed -n "/^permalink/s/\/$//"p  `grep 'permalink:'  -rl --include=\*.md  ./source/_posts/`
```

> permalink: xx/xxx/xxx/

等一系列问题,**注意版本**



node版本问题https://nodejs.org/zh-cn/download/releases/

https://www.npmjs.com/package/hexo-cli

```
npm ls --depth 0

hexo g --debug
```
