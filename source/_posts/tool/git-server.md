---
title: git server 搭建
date: 2017-10-10 19:36:33
tags: git
categories: tools
---
## 准备
*    ssh
*    git 


## gitosis
### 添加用户
仓库服务器执行
```
useradd git
mkdir -p /home/git
chown -R git:git /home/git
```

密钥
```
cp  ~/.ssh/id_rsa.pub   /tmp/git.pub
```
 <!--more--> 
### 安装

```
git clone git://github.com/res0nat0r/gitosis.git
cd gitosis
python setup.py install
```

初始化
```
su  git
gitosis-init < ~/.ssh/id_rsa.pub
```

### 管理
拉取
```
$git clone git@192.168.16.232:repositories/gitosis-admin.git
$ tree -L 2 gitosis-admin
gitosis-admin
├── gitosis.conf
└── keydir
    └── git@ubuntu.pub
```
配置密钥
```
cp ~/.ssh/id_rsa.pub  gitosis-admin/keydir/cs.pub
```
添加权限 **gitosis.conf**
```
[group dev]  
members = cs #这里的cs对上面公匙cs.pub文件名cs  
writable = test #项目名test
```

### <span id="pull">测试拉取</span>

```
mkdir  test && cd test
echo "测试test仓库">rep
git init
git add .
git  commit -am "add test"
git remote add origin git@192.168.16.232:test.git
git  push origin master
```
> 提示要密码 <br />
设置密码（root用户操作）
```
passwd gits
2次 123456
```
或
```
su gits
echo "你的密钥">>~/.ssh/authorized_keys
```


## gitolite
### 添加用户
仓库服务器执行
```
useradd gits
mkdir -p /home/gits
chown -R gits:gits  /home/gits
```

初始化
```
$ cp  ~/.ssh/id_rsa.pub   /tmp/git.pub
$ su gits
$ git clone https://github.com/sitaramc/gitolite
$ gitolite/install -to $HOME/bin
$ ~/bin/gitolite setup -pk /tmp/git.pub
```

**密码**

见gitosis测试[拉取](#pull)的操作


### 管理
本地拉取
```shell
git clone gits@192.168.16.232:repositories/gitolite-admin
```
> 正克隆到 'gitolite-admin'...  <br />
gits@192.168.16.232's password:  <br />
remote: Counting objects: 6, done. <br />
remote: Compressing objects: 100% (4/4), done. <br />
remote: Total 6 (delta 0), reused 0 (delta 0)
接收对象中: 100% (6/6), 完成. <br />
检查连接... 完成。 <br />

查看目录
```
$ tree -L 2  gitolite-admin
gitolite-admin
├── conf
│   └── gitolite.conf
└── keydir
    └── git.pub
```
cp密钥，配置权限
```
$ cat  gitolite-admin/conf/gitolite.conf 
repo gitolite-admin
    RW+     =   git

repo testing
    RW+     =   @all
```
> RW+  所有权限  <br />
doc: https://github.com/sitaramc/gitolite#access-rule-examples <br />


最后
```
git add .
git commit -am "add new user xx"
git push origin master
```
>更多高级配置在/home/gits/.gitolite.rc


## gogs
官网 https://try.gogs.io/

带**UI**的服务，部署方便，轻量级

gitlab太占内存了，云服务器跑成本高呀
```
# Pull image from Docker Hub.
$ docker pull gogs/gogs

# Create local directory for volume.
$ mkdir -p /var/gogs

# Use `docker run` for the first time.
$ docker run --name=gogs -p 10022:22 -p 10080:3000 -v /var/gogs:/data gogs/gogs

# Use `docker start` if you have stopped it.
$ docker start gogs
```
>doc https://github.com/gogits/gogs/tree/master/docker#usage
