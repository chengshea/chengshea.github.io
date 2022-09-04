---
title: explain执行计划
permalink: services/database/mysql/explain/
tags:
  - explain执行计划
  - xx
  - xxx
categories:
  - services
  - database
  - mysql
  - explain
date: 2022-09-03 22:41:04
---

## explain



执行计划

```
explain select  .....   from  .... [  where ... ]
```



![img](/pics/1882599998.png)



### id

- [id](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#id)  顺序标识整个查询过程 数值越大先执行，可能为空（union）



### select_type

- [select_type](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#select_type) 查询类型（常见几种）

<!--more-->

 SIMPLE 

​    简单查询，不带条件

  PRIMARY 

​     最外层查询，union(前面查询)

 UNION

​    UNION第二个及后面select语句

 DERIVED

​    嵌套select查询

 UNION RESULT

​    一个UNION查询的结果

 DEPENEDNET UNION

   需要满足UNION条件, 及UNION第二个及后面SELECT语句，同时该语句依赖外部查询

  


```
select  * from user where id in
   (  
           select  * from  user_info  where tel=123 
    union 
          select * from user_info  where  age>12     
);

#  in 操作符 优化为
select  * from user where  exists (
        select * from user_info tel=123 
  union 
       select * from user_info  where age > 12 
  and   user_info.uid=user.id  
); 
```



 SUBQUERY

​    子查询中的第一个SELECT查询   



### table

- [table](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#table)

 不一名是真实表名，num代表id(执行顺序)值 <select_type[id]>

   eg: <derived3>  <union2,3>

   

### type

- [type](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#type)

const

  确定只有一行匹配，通常用在主键或唯一索引上进行比较时

system const 

   表仅有一行满足条件

eq_ref

  innodb 与 syisam 有区别

  被连接使用并且索引是union或primary key

  使用=操作符比较带索引的列

ref

 关联操作只使用了索引的最左前缀，或索引不是union和primary key

 使用=或< = > 操作符带索引列

fulltext

  全文索引 （B树）

ref_or_null  

  与ref类似，额外搜索包含null列

index_merger 

 使用了索引合并优化方法

unique_subquery

 

index_subquery



range

  只检索给定范围的行，使用一个索引来选择行，

  key列显示使用那个索引，key_len包含所使用索引最长关键元素

   使用=、<>、>、>=、<、<=、IS NULL、<=>、BETWEEN或者IN操作符，用常量比较关键列时

index  

  是否使用索引进行排序

ALL 

  全表扫描 



### possible_keys

- [possible_keys](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#possible_keys)

  使用哪个索引查找行



### key

- [key](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#key)

显示实际使用键（索引），没有索引为null

 强制或忽视索引  force index,use index或ignore index



### key_len

- [key_len](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#key_len)

 使用的键长度。如果键是NULL，则长度为NULL ,越短越好（不损失精确度）



### ref

- [ref](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#ref)

 使用那个列或常数 与 key 一起从表中选择行



### rows

- [rows](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#rows)

执行查询时必须检测行数（预估值）



### Extra

- [Extra](http://www.cnblogs.com/magialmoon/archive/2013/11/23/3439042.html#Extra) 常用

 using filesort

   生成有序结果（排序或索引）  【order  by，group by 默认对字段排序（order by **null禁止排序**） 】

 using temporary

  使用了临时表，要避免临时表使用

 not exists

  优化 left join 

 using index

 查询覆盖了索引，mysql直接从索引中过滤不需要记录并发挥命中

using index condition

  索引条件推送（v5.6版），在二级索引上进行like操作

using where 

 表示MySQL服务器将存储引擎返回服务层以后再应用WHERE条件过滤。





