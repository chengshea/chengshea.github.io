---
title: go语法规则
permalink: lang/go
tags:
  - 规则
  - 语法
categories:
  - lang
  - go
date: 2022-06-03 17:51:33
---



###  声明赋值

**:=**  临时,局部变量

###  方法首字母

类似java,不等同(private 只能当前类访问)

**public** 大写 跨包调用

**private**小写 包内调用

<!--more-->

```go
##f2.go
package t1

import (
	"fmt"
)

var gloal string = " 全局"
//...可变参函数
func Tfun2(a ...string) (string, string) {
	temp := " 局部"
	nf(a)
	return a[0] + gloal, a[1] + temp
}

func nf(a []string) {
    //for i := range a 
    //for _, v := range a 
	for i, v := range a {
		if a[i] == "dd" {
			fmt.Println(a, v)
		}
	}
}
##f1.go
package t1

import (
	"fmt"
)

func Tfun1() {
	a, b := Tfun2("a is", "b is", "dd")
	fmt.Println(a, b)
}

##main.go
package main

import (
	"fmt"
	t1 "go_learn/test"
)

func main() {
	mf()
}

func mf() {
	fmt.Println("main调用包test fun1")
	t1.Tfun1() //两个返回值
}
```



