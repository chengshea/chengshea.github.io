---
title: 用户组命令
permalink: linux/shell/user-group/
tags:
  - gpasswd
  - user
  - group
categories:
  - linux
  - shell
date: 2023-02-26 18:29:47
---

## user

adduser 与 useradd 指令为同一指令

```
[root@localhost ~]# useradd user1
[root@localhost ~]# useradd user2
```

- -c<备注> 　加上备注文字。备注文字会保存在passwd的备注栏位中。
- -d<登入目录> 　指定用户登入时的起始目录。
- -D 　变更预设值．
- -e<有效期限> 　指定帐号的有效期限。
- -f<缓冲天数> 　指定在密码过期后多少天即关闭该帐号。
- -g<群组> 　指定用户所属的群组。
- -G<群组> 　指定用户所属的附加群组。
- -m 　制定用户的登入目录。
- -M 　不要自动建立用户的登入目录。
- -n 　取消建立以用户名称为名的群组．
- -r 　建立系统帐号。
- -s<shell>　 　指定用户登入后所使用的shell。
- -u<uid> 　指定用户ID。



```
#添加一个不能登录的用户
useradd -d /usr/local/apache -g apache -s /bin/false apache
```



```
# -r 删除用户登入目录以及目录中所有文件。
userdel -r name 
```





## group

- /etc/group 组账户信息。
- /etc/gshadow 安全组账户信息。
- /etc/login.defs Shadow密码套件配置。



```
[root@localhost ~]# groupadd group1

groupdel group_name
```







## gpasswd



```
gpasswd [-a user][-d user][-A user,...][-M user,...][-r][-R] groupname
```

- -a：添加用户到组；
- -d：从组删除用户；
- -A：指定管理员；
- -M：指定组成员和-A的用途差不多；
- -r：删除密码；
- -R：限制用户登入组，只有组中的成员才可以用newgrp加入该组。

<!--more-->

```
[root@localhost ~]# gpasswd -a user1 group1
正在将用户“user1”加入到“group1”组中

[root@localhost ~]# gpasswd -a user2 group1

[root@localhost ~]# cat /etc/group
group1:x：1011:user1,user2 

```

> usermod -G group_name user_name 这个命令可以添加一个用户到指定的组，但是以前添加的组就会清空掉。



```
#从原组中用户，删除其中一个用户。
[root@localhost ~]# grep group1 /etc/group
group1:x：1011:user3,user1,user2
[root@localhost ~]# gpasswd -d user1 group1
正在将用户“user1”从“group1”组中删除
[root@localhost ~]# grep group1 /etc/group
group1:x：1011:user3,user2
```



##





