---
title: mysql函数
permalink: services/database/mysql/function/
tags:
  - 函数
  - function
  - xxx
categories:
  - services
  - database
  - mysql
date: 2022-09-03 22:23:54
---



## 函数



### case  .... when

```sql
select 
count(case age when 10 then age else null end) as age_num,
count(case name when '张五' then name end) as name_num 
from test_list;
```

#### 多条件统计

```
SELECT year,
 SUM(CASE WHEN type=1 THEN value ELSE 0 END) as type1,
 SUM(CASE WHEN type=2 THEN value ELSE 0 END) as type2,
 SUM(CASE WHEN type=3 THEN value ELSE 0 END) as type3,
 FROM table_test GROUP BY year
```

#### 统计状态（sum累加）

```
sum(case when type=1 then 1 else 0 end)  t1
sum(case when type=2 then 1 else 0 end)  t2
```



<!--more-->



## 存储过程

### 存储过程体

\* 局部变量

声明局部变量，用来存储临时结果

```
DECLARE` `var_name[,…] type [``DEFAULT` `value]
Var_name:指定局部变量的名称
Type:用于声明局部变量的数据类型
default``子句:用于为局部变量指定一个默认值。若没有指定，默认为``null``.
```

 begin  ......    end  

\* set

局部变量赋值

 可以是任意类型数据，包括sql 查询返回值

\* select ... into  语句

把返回列的值直接存储(into)到局部变量中   **结果集只能是一条数据**

\* 异常处理

### 示例

多个参数彼此间用逗号分隔。输入参数、输出参数和输入/输出参数，分别用in/out/inout标识。参数的取名不要与数  据表的列名相同。

```
DROP PROCEDURE IF EXISTS `test`; -- 存在删除

  DELIMITER //
  CREATE PROCEDURE test(IN `p_id` BIGINT,OUT `v_error` VARCHAR(1000))  comment "输入，输出参数"
  BEGIN
  -- 声明变量
  DECLARE v_status INT;-- 状态
  -- 查询
  select [数据库字段] into [声明变量] from  表  where 条件 ;
  -- 判断声明变量 逻辑处理  
  SET v_status =(SELECT  DISTINCT is_flag  FROM tm_meal_standard_set_info WHERE ORG_ID =p_id AND is_flag=1 ); 
  IF(v_status IS NULL) THEN 
  SET v_status =(SELECT DISTINCT is_flag  FROM tm_meal_standard_set_info WHERE ORG_ID =p_id AND is_flag=0 );
            IF(v_status < 1) THEN SET v_error = '失效';
            -- ELSE SET v_error='没有0';
              END IF;
        -- else SET v_error='有1';
          END IF;
  END //
  DELIMITER; 

SELECT  is_flag  FROM tm_meal_standard_set_info WHERE ORG_ID =10001268  AND  is_flag=0 AND 
 NOT EXISTS (
     SELECT  *  FROM tm_meal_standard_set_info WHERE ORG_ID =10001268  AND is_flag=1
 );


调用
赋值 set @p_id;
运行 call test(@p_id,@smg);
查询结果 select @smg;
```



