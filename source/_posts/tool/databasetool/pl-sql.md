---
title: PLSQL
permalink: tool/databasetool/pl-sql/
tags:
  - PL/SQL
  - oracle
categories:
  - tool
  - databasetool
date: 2022-09-01 21:42:31
---

###   win

#### 环境变量

```
ORACLE_HOME=D:\sqlplus\instantclient_19_3

path   %ORACLE_HOME%
```

oci.dll  http://download.oracle.com/otn/nt/instantclient/19300/instantclient-basic-windows.x64-19.3.0.0.0dbru.zip

<!--more-->

#### where 条件搜索带中文  

```
select * from v$nls_parameters where parameter like 'NLS_CH%'; 
或
select * from v$nls_parameters   where  parameter='NLS_CHARACTERSET';
```

![](/pics/pl-sql-4659.png)

环境变量添加  `NLS_LANG = AMERICAN_AMERICA.AL32UTF8`







