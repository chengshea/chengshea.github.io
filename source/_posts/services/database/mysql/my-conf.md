---
title: mysql参数配置
permalink: services/database/mysql/my-conf/
tags:
  - mysql
  - config
  - xxx
categories:
  - services
  - database
  - mysql
date: 2022-09-03 21:41:01
---

## 

### 慢查询日志

```
#查看开启状态 单位秒
show variables like 'slow_query_log';
#查询日志
show variables like '%log%';
```



- `long_query_time`是查询执行时间的阈值，超过该阈值将被记录下来。记录花费时间超过阈值的所有查询，无论它们是否使用索引。

- `log_queries_not_using_indexes`告诉MySQL另外记录所有不使用索引来限制扫描行数的查询。无论执行时间如何，都会记录此条件。

  https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html

<!--more-->

```
#0禁用 1启用
slow-query-log=1
#相对路径为 datadir 目录下
slow_query_log_file="cs-slow.log"
#缺省10秒
long_query_time=2
```





### emoji表情

```
#字符存储编码
SHOW VARIABLES LIKE 'character_set_%';
#字符连接编码
SHOW VARIABLES LIKE 'collation_%';
```



```shell
mysql>  SHOW VARIABLES LIKE 'character_set_%';
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8mb4                    |
| character_set_connection | utf8mb4                    |
| character_set_database   | utf8                       |
| character_set_filesystem | binary                     |
| character_set_results    | utf8mb4                    |
| character_set_server     | utf8mb4                    |
| character_set_system     | utf8                       |
| character_sets_dir       | /opt/mysql/share/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.01 sec)

mysql> SHOW VARIABLES LIKE 'collation_%';
+----------------------+--------------------+
| Variable_name        | Value              |
+----------------------+--------------------+
| collation_connection | utf8mb4_unicode_ci |
| collation_database   | utf8_bin           |
| collation_server     | utf8mb4_unicode_ci |
+----------------------+--------------------+
3 rows in set (0.00 sec)

```



```
[client]  
default-character-set = utf8mb4
 
[mysql]  
default-character-set = utf8mb4  
 
[mysqld]  
character-set-client-handshake = FALSE  
character-set-server=utf8mb4 
collation-server = utf8mb4_general_ci  
init_connect='SET NAMES utf8mb4'
```

> <property name="connectionInitSqls" value="set names utf8mb4;" />



ERROR Lost connection to MySQL server during query

```
max_allowed_packet=100M
```

> 默认64M
>
> 如果您使用大 [`BLOB`](https://dev.mysql.com/doc/refman/8.0/en/blob.html)列或长字符串，则必须增加此值。它应该与 [`BLOB`](https://dev.mysql.com/doc/refman/8.0/en/blob.html)您要使用的最大一样大。协议限制为 [`max_allowed_packet`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_max_allowed_packet)1GB。该值应为 1024 的倍数；非倍数向下舍入到最接近的倍数。



### console grc

#### install

1. Install grc (for debian systems: `apt-get install grc`)
2. Copy both config files into your home directory: [.grcat](https://github.com/nitso/colour-mysql-console/blob/master/.grcat) and [.my.cnf](https://github.com/nitso/colour-mysql-console/blob/master/.my.cnf)
3. Run mysql client `mysql -u <user> -p -h <hostname>`

#### 配置 ~/.grcat

```
#default word color
#regexp=[\w.,\:\-_/]+
regexp=.+
colours=green
-
#table borders
regexp=[+\-]+[+\-]|[|]
colours=red
-
#data in ( ) and ' '
regexp=\([\w\d,']+\)
colours=white
-
#numeric
regexp=\s[\d\.]+\s*($|(?=\|))
colours=yellow
-
#date
regexp=\d{4}-\d{2}-\d{2}
colours=cyan
-
#time
regexp=\d{2}:\d{2}:\d{2}
colours=cyan
-
#IP
regexp=(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?
colours=cyan
-
#schema
regexp=`\w+`
colours=yellow
-
#email
regexp=[\w\.\-_]+@[\w\.\-_]+
colours=magenta
-
#row delimeter when using \G key
regexp=[*]+.+[*]+
count=stop
colours=white
-
#column names when using \G key
regexp=^\s*\w+:
colours=white
```



#### my.cnf

```
[mysql]
pager  = grcat  ~/.grcat
```

