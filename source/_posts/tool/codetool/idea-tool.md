---
title: IDEA tool
permalink: tool/codetool/idea-tool/
tags:
  - jpa
  - Template
  - Font
  - active
categories:
  - tool
  - idea
date: 2022-09-01 21:32:59
---



## 激活

### idea64.exe.vmoptions

-javaagent:C:\Program Files\IDEA\jetbra\ja-netfilter.jar=jetbrains

### code

[copy code ]: https://3.jetbra.in/	"code"





## Font

### code 代码区域

File-->Settings

选择Editor--> Font



### console log区域

File-->Settings

选择Editor-->Color Scheme-->*Console* Font



## 模板

### java main

 **1.点击File-->Settings-->Editor-->Live Templates**

 **2 新增**

点击右上角的"+"，添加"Template Group"，如java

 点击右上角的"+"，添加"Live Template"，如main

**3.填写模板内容 Template text**

```Java
public static void main(String[] args){

}
```

**4. 定义作用域  选择"Change",选择Java文件下的选项**



 

## database面板

### 自动生成实体类



<img src="/pics/6fda574f-0050-43f7-84b2-e281a0b62989.png"
style="vertical-align: bottom; max-width: 100%;" />

  

### <span wiz-span="data-wiz-span" style="font-size: 1rem;">连接数据库</span>

<!--more-->

<img src="/pics/6a7e416d-f5a0-4558-8737-6a2c90ff0515.png"
style="vertical-align: bottom; max-width: 100%;" />

  

## Persistence面板

<span
style="color:rgb(47, 47, 47);font-family:-apple-system, &quot;SF UI Text&quot;, Arial, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;WenQuanYi Micro Hei&quot;, sans-serif;font-size:1rem;font-style:normal;font-weight:400;text-align:start;text-indent:0px;background-color:rgb(255, 255, 255);display:inline !important;"><span
style="color:rgb(47, 47, 47);font-family:-apple-system, &quot;SF UI Text&quot;, Arial, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;WenQuanYi Micro Hei&quot;, sans-serif;font-size:1rem;font-style:normal;font-weight:400;text-align:start;text-indent:0px;background-color:rgb(255, 255, 255);display:inline !important;">位置是View-Tool
Windows- Persistence （如果找不到）</span>  
</span>

<span
style="color:rgb(47, 47, 47);font-family:-apple-system, &quot;SF UI Text&quot;, Arial, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;WenQuanYi Micro Hei&quot;, sans-serif;font-size:1rem;font-style:normal;font-weight:400;text-align:start;text-indent:0px;background-color:rgb(255, 255, 255);display:inline !important;"><span
style="color:rgb(47, 47, 47);font-family:-apple-system, &quot;SF UI Text&quot;, Arial, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, &quot;WenQuanYi Micro Hei&quot;, sans-serif;font-size:1rem;font-style:normal;font-weight:400;text-align:start;text-indent:0px;background-color:rgb(255, 255, 255);display:inline !important;">-------先选中项目在点 <span
wiz-span="data-wiz-span"
style="color: rgb(50, 205, 50);">+</span></span></span>

<img src="/pics/d4853c95-e416-4ffe-b0c9-e8d921971a0e.png"
style="vertical-align: bottom; max-width: 100%;" />

  

**spring boot  选择 jpa   选错没有 session factory**

<span
style="color: rgb(47, 47, 47); font-family: -apple-system, 'SF UI Text', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif; font-size: 1rem; font-style: normal; text-align: start; text-indent: 0px; display: inline !important; background-color: rgb(255, 255, 255);">**hibernate
项目选择 hibernate  **</span>

### <span style="color:rgb(47, 47, 47);font-family:-apple-system, 'SF UI Text', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif;font-size:1rem;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;display:inline !important;background-color:rgb(255, 255, 255);">Persistence<span class="Apple-converted-space"> 最下面</span></span> 

<span
style="color:rgb(47, 47, 47);font-family:-apple-system, 'SF UI Text', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif;font-size:1rem;font-style:normal;font-weight:normal;text-align:start;text-indent:0px;display:inline !important;background-color:rgb(255, 255, 255);"><span
class="Apple-converted-space">hibernate</span></span>

<img src="/pics/11d578d1-b5cf-4f49-8623-aab65adb0837.png"
style="vertical-align: bottom; max-width: 100%;" />

选择数据 ，表

<img src="/pics/1cb72990-ff22-4fae-a1ee-3d03e9edf07c.png"
style="vertical-align: bottom; max-width: 100%;" />

jpa

<img src="/pics/5541b376-5ba9-4fa7-bd9e-8ca929bae9e1.png"
style="vertical-align: bottom; max-width: 100%;" />

  

<img src="/pics/30c314a6-b022-4758-9b80-a152853dd1c5.png"
style="vertical-align: bottom; max-width: 100%;" />

点击ok 生成 实体到指定 package

 





