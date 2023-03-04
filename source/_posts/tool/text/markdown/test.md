---
title: md语法示例
permalink: tool/text/markdown/test/
tags:
  - markdown
  - example
  - xxx
categories:
  - tool
  - text
  - markdown
date: 2023-02-26 14:43:05
---

## 

<!--more-->

## 引入





### 图片



```
![图片](/pics/xxxx.png)

sudo ln -s /home/cs/oss/hexo/themes/spfk/source/pics /pics
```

> ![](/pics/xxxx.png)



### 站内文章跳转

A文章跳到B文章的某处

```
[A文章](路径#id-service)


B文章<a id="id-service"/>


```

> eg: [跳转到](/linux/k8s/kubelet#id-service)



### 折叠

```
<details>
  <summary>折叠文本</summary>
  此处可书写文本
  嗯，是可以书写文本的
</details>


<details>
  <summary>折叠代码块</summary>
  <pre><code> 
     System.out.println("虽然可以折叠代码块");
     System.out.println("但是代码无法高亮");
  </code></pre>
</details>

<details>
  <summary>折叠代码块</summary>
  <pre><xmp> 
     System.out.println("不渲染");
     <input />
  </xmp></pre>
</details>

```

示例

<details>
  <summary>折叠文本</summary>
  此处可书写文本
  嗯，是可以书写文本的
</details>
<details>
  <summary>折叠代码块</summary>
  <pre><code> 
     System.out.println("虽然可以折叠代码块");
     System.out.println("但是代码无法高亮");
  </code></pre>
</details>
