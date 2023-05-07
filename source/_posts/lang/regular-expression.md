---
title: regular expression
permalink: lang/regular-expression/
tags:
  - regular
  - replace
  - match
categories:
  - lang
  - regular
date: 2023-03-18 15:19:53
---

## 基本规则

| 字符  | 描述                                                         |
| ----- | ------------------------------------------------------------ |
| \|    | 当有多个选项的使用，选项之间用”\|“进行隔离。例如：匹配abc和DEF中的任意一项：abc\|DEF。                             |
| ()    | 匹配括号内容的内容。例如：(abc\|DEF)可以匹配abc或者DEF。                           |
| []    | 匹配括号中的任一字符，例如[abc]，可以匹配字符"a"，或者匹配字符"b"，或者匹配字符"c"。 |
| \*    | 匹配前面的子表达式零次或多次。例如，"ab*"能匹配 "a" 以及 "abb"。* 等价于{0,}。 |
| \+    | 匹配前面的子表达式一次或多次。例如，"ab+"能匹配 "ab" 以及 "abb"，但不能匹配 "a"。+ 等价于 {1,}。 |
| ?     | 匹配前面的子表达式零次或一次。例如，"a(b)?"能匹配 "a"以及"ab"。? 等价于 {0,1}。 |
| {n}   | 是一个非负整数。匹配确定的 n 次。例如，'a{2}' 能匹配 "baac" 中的两个 a， 但是不能匹配bac中的一个a。 |
| {n,}  | 是一个非负整数。至少匹配n 次。例如，'a{2,}' 不能匹配 "bac" 中的一个a，但能匹配 "baaaac" 中的全部a。 |
| {n,m} | 和 n 均为非负整数，其中n <= m。最少匹配 n 次且最多匹配 m 次。例如，"a{1,3}" 将匹配 "baaaaaac"中的前三个a。注意：在逗号和两个数之间不能有空格。 |


|	当有多个选项的使用，选项之间用”|“进行隔离。例如：匹配abc和DEF中的任意一项：abc|DEF。
()	匹配括号内容的内容。例如：(abc|DEF)可以匹配abc或者DEF。
[]	匹配括号中的任一字符，例如[abc]，可以匹配字符"a"，或者匹配字符"b"，或者匹配字符"c"。
\*	匹配前面的子表达式零次或多次。例如，"ab*"能匹配 "a" 以及 "abb"。* 等价于{0,}。
\+	匹配前面的子表达式一次或多次。例如，"ab+"能匹配 "ab" 以及 "abb"，但不能匹配 "a"。+ 等价于 {1,}。
?	匹配前面的子表达式零次或一次。例如，"a(b)?"能匹配 "a"以及"ab"。? 等价于 {0,1}。
{n}	n 是一个非负整数。匹配确定的 n 次。例如，'a{2}' 能匹配 "baac" 中的两个 a， 但是不能匹配bac中的一个a。
{n,}	n 是一个非负整数。至少匹配n 次。例如，'a{2,}' 不能匹配 "bac" 中的一个a，但能匹配 "baaaac" 中的全部a。
{n,m}	m 和 n 均为非负整数，其中n <= m。最少匹配 n 次且最多匹配 m 次。例如，"a{1,3}" 将匹配 "baaaaaac"中的前三个a。注意：在逗号和两个数之间不能有空格。


<!--more-->



### 多个匹配

匹配token或image存在前面就加#####

```
sed -n "s/\(token\|image\)/######&/"p  ./kubeadm-config.yaml
```

>  ######token: "9a08jv.c0izixklcxtmnze7"
>  description: "kubeadm bootstrap ######token"
>      system:bootstrappers:kubeadm:default-node-######token
>  ######token: uxzaiw.1ar6vc7zi0r16rt6
>   ######imagePullPolicy: IfNotPresent
>    ######imageRepository: "k8s.org/k8s"
>    ######imageTag: "3.5.6-0"
>   ######imageRepository: k8s.org/k8s







