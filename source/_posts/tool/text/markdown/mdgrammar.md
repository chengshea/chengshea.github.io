---
title: md语法
permalink: tool/text/markdown/mdgrammar/
tags:
  - grammar
categories:
  - markdown
date: 2022-02-16 20:49:21
---

<p id="id-sample" hidden/>

/hexo/_config.yml 

```
permalink: :title//
```

### 站内文章链接

#### 绝对路径

/_posts

```
$ tree -L 2 ./_posts/
./_posts/
├── linux
│   ├── debian
│   ├── k8s
│   └── shell
├── markdown
│   ├── flow.md
│   ├── formula.md
│   └── mdgrammar.md

```



```
[点击查看md写flow文章](/markdown/flow)
```

>[点击查看md写flow文章](/markdown/flow)
>
>[] 自定义链接标题
>
>()绝对地址,permalink的值

#### post_link

```
{% post_link tool/text/markdown/flow/ '点击查看md写flow文章' %}
```

> {% post_link tool/text/markdown/flow '点击查看md写flow文章' %}
>
> post_link 相对路径 '标题' 



### 跳转

#### 页内跳转指定位置

锚点链接

```
[跳到本页的开头](#id-sample)
```

[跳到开头](#id-sample)

#### 其他页面跳转到指定位置

锚点链接

```
[跳到其他页指定位置](permalink的值#id-sample)
```



#### 设置锚点

```
锚点<p id="id-sample" hidden/>
```

