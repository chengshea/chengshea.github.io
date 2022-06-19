---
title: md流程图
permalink: markdown/flow
tags:
  - 流程图
  - flow
categories:
  - markdown
date: 2022-06-03 18:46:58
---

```flow
start=>start: 接收到消息
info=>operation: 读取信息
cd=>condition: 是否存在
setC=>subroutine: 设置缓存
getC=>operation: 读取缓存
xx=>inputoutput: 返回信息
end=>end: 处理结束

start->info->cd
cd(yes)->getC->xx
cd(no)->setC->xx
xx->end
```

<!--more-->

![md_flow](/pics/md_flow.png)


>基本语法：定义模块 id=>关键字: 描述 （“描述”的前面必须有空格，“=>” 两端不能有空格）
>
>关键字：
>
>start 流程开始，以圆角矩形绘制
>
>operation 操作，以直角矩形绘制
>
>condition 判断，以菱形绘制
>
>subroutine 子流程，以左右带空白框的矩形绘制
>
>inputoutput 输入输出，以平行四边形绘制
>
>end 流程结束，以圆角矩形绘制
>
>定义模块间的流向：
>
>模块1 id->模块2 id ：
>
>一般的箭头指向条件模块id (描述)->模块id(direction) ：条件模块跳转到对应的执行模块，并指定对应分支的布局方向


