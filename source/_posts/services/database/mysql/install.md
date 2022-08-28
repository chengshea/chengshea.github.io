---
title: mysql安装
permalink: services/database/mysql/install/
tags:
  - mysql
  - install
categories:
  - services
  - database
date: 2022-07-17 15:07:55
---





## linux

下载  https://downloads.mysql.com/archives/community/

**Compressed TAR Archive, Minimal Install** **不包含调试和测试工具**

```
xz -d mysql-8.0.28-linux-glibc2.17-x86_64-minimal.tar.xz
tar -xvf mysql-8.0.28-linux-glibc2.17-x86_64-minimal.tar
```



用户组

```
# cs 换成mysql 或 ${USER}
sudo groupadd mysql
sudo useradd mysql -r -M -s /sbin/nologin
sudo chown mysql:cs -R  /opt/mysql/*


cs@debian:~/data/software$ cat /etc/group | grep mysql
mysql:x:512:cs
cs@debian:~/data/software$ cat /etc/passwd | grep mysql
mysql:x:512:512::/home/mysql:/sbin/nologin
```



初始化数据库

```
$ sudo /opt/mysql/bin/mysqld  --initialize --user=mysql --console
----2022-01-30T00:14:24.872326+08:00 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: bDB,fVSmt2/U
```



```
 url=/opt/mysql
 sed -n "/^basedir=/s#=#==$url#"p ./mysql.server
 sed -n "/^datadir=/s#=#=$url/data#"p ./mysql.server
 sed -n "s#conf=.*#conf=$url/my.cnf#"p ./mysql.server
```



开机启动

```
sudo cp /opt/mysql/support-files/mysql.server  /etc/init.d/mysql
设置为开机自动运行
sudo update-rc.d mysql defaults
设置为取消开机自动运行
sudo update-rc.d -f mysql remove
```

密码

```
##### 临时密码登录,执行语句提示 You must reset your password using ALTER USER statement before executing this statement.
--- alter user user() identified by "123456";  ##密码字符串双引号

---低于版本8---SET PASSWORD FOR root@localhost = '123456';
---版本8以上---ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456'; 

##用户密码过期时间250天
ALTER USER ‘cs’@‘localhost' PASSWORD EXPIRE INTERVAL 250 DAY;
###禁用过期     --恢复默认策略 PASSWORD EXPIRE DEFAULT----
ALTER USER 'cs'@'localhost' PASSWORD EXPIRE NEVER;

###密码过期的策略
show variables like 'default_password_lifetime';
---设置密码永不过期，需要把default_password_lifetime修改为 0
---set global default_password_lifetime = 0;

 CREATE USER 'cs'@'localhost' IDENTIFIED BY '123456';


###修改执行生效语句
flush privileges;
```



## win

[下载地址：http://dev.mysql.com/downloads/mysql/](http://dev.mysql.com/downloads/mysql/) 

管理员权限运行cmd

```
E:\MySQL\MySQL Server 5.7\bin>mysqld install MySQL --defaults-file="E:\MySQL\MySQL Server 5.7\my.ini"
```

install/Remove of the Service Denied!  



```
bin>mysqld --initialize --user=mysql --console
```

启动服务

```
net start MySQL
```

删除  

```
sc delete MySQL
```

