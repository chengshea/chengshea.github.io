---
title: 强弱类型语言
permalink: lang/sawtl/
tags:
  - 强弱类型
categories:
  - lang
date: 2022-07-14 22:01:23
---



## 弱类型语言

是一种弱类型定义的语言,某一个变量被定义类型,该变量可以根据环境变化自动进行转换,不需要经过显性强制转换 代表js,php,lua



js

![](/pics/was-1.png)

+操作是将A的类型转化为了字符串，然后进行拼接

-操作是将B的类型转化为了数字，然后进行减法



lua

```
> a=5 
> b="5"
> print(b+a)
10.0
> print(b-a)
0.0
> print(a==b)
false

```

<!--more-->

![](/pics/saw-2.png)



## 强类型语言

java

```
public class Main{
    public static void main(String []args) {
    int a=5;
    String b="5";
       System.out.println(a+b);//55
       // System.out.println(a-b);//编译不通过,错误：二元运算符“-”的操作数类型错误
    }
} 
```



go

```
package main
var a = 5
var b string = "5"


func main(){
    println(a+b) //无效操作：a + b（不匹配的类型 int 和 string）
    println(a-b) //无效操作：a - b（不匹配的类型 int 和 string）
}
```

