---
title: mysql配置文件
permalink: services/database/mysql/my/
tags:
  - mysql
categories:
  - services
  - database
date: 2022-07-17 15:14:20
---



## linux

### my.cnf

```
[mysqld]
#server-id                      = 224
user = mysql
port                           = 3305
mysqlx_port                    = 33060
mysqlx_socket                  = /tmp/mysqlx.sock
datadir                        = /opt/mysql/data
socket                         = /tmp/mysql.sock
pid-file                       = /tmp/mysqld.pid
auto_increment_offset          = 2
auto_increment_increment       = 2 
log-error                      = /opt/mysql/log/error.log
slow-query-log                 = 1
slow-query-log-file            = /opt/mysql/log/slow.log
long_query_time                = 0.2
log-bin                        = bin.log
relay-log                      = relay.log
binlog_format                 =ROW
relay_log_recovery            = 1
character-set-client-handshake = FALSE
character-set-server           = utf8mb4
collation-server               = utf8mb4_unicode_ci
init_connect                   ='SET NAMES utf8mb4'
innodb_buffer_pool_size        = 1G
join_buffer_size               = 128M
sort_buffer_size               = 2M
read_rnd_buffer_size           = 2M
log_timestamps                 = SYSTEM
lower_case_table_names         = 1
default-authentication-plugin  =mysql_native_password
```





## win

### my.ini

```
[client]
port=3306

[mysql]
default-character-set=utf8mb4


[mysqld]
port=3306
#password=123456
#character-set-client-handshake=FALSE  
character-set-server=utf8mb4 
#collation-server = utf8mb4_general_ci  
init_connect='SET NAMES utf8mb4'


basedir="D:/360Downloads/mysql-5.7.20-winx64"
#Path to the database root
datadir="D:/360Downloads/mysql-5.7.20-winx64/data"

log-error="D:/360Downloads/mysql-5.7.20-winx64/log/mysqld_err.log"
#log-bin="D:/360Downloads/mysql-5.7.20-winx64/log/mysqld_bin.bin"

default-storage-engine=INNODB
#从 5.6开始，timestamp 的默认行为已经是 deprecated 了
explicit_defaults_for_timestamp=true

sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION" 

```



## 主从

doc https://dev.mysql.com/doc/refman/8.0/en/replication-howto-masterstatus.html

新帐号

>CREATE USER 'repl'@'192.168.16.232' IDENTIFIED BY '123456';



 只复制

> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'192.168.16.232';





### 主 

配置mysql.cnf 

```
[mysqld]
server-id=1
```

```

show master status;
```

>  File: mysql-bin.000001
>  Position: 765



### 从

配置mysql.cnf

```
[mysqld]
server-id=2
```

备份

```
mysql -uroot -h 主 -p  database >back.sql;

#登陆从库
source back.sql;

```



```

stop slave;

reset slave;

reset master;

```

关键 

把 show master status\G `File`和`Position`对号入座

```

     CHANGE MASTER TO  

     MASTER_HOST='master_host_name',

     MASTER_USER='主用户名',

     MASTER_PASSWORD='主密码',

     MASTER_LOG_FILE='主status File',

     MASTER_LOG_POS=主status Position;

```

开启从库

```
start slave;
```

检查状态

```

show slave status\G

```

>Slave_IO_Running: Yes
>
>Slave_SQL_Running: Yes
