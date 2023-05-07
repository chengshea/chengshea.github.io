---

title: markdown画图
permalink: tool/text/markdown/flow/
tags:
  - mermaid
  - flow
categories:
  - markdown
date: 2022-06-03 18:46:58
---

doc https://mermaid.js.org/intro/

[**Live Editor!**](https://mermaid.live/)

## 流程图

```mermaid
graph LR;
START(开始)-->准备材料-->编写博客-->推送文章-->END(结束)
```





```mermaid
graph TB;
subgraph 前置
A(准备写博客)-->B{想了很久}
end
B--N-->C[放弃]
B--Y-->F{思考流程}
subgraph 工作中
F-.圆形流程图.->J((圆形流程))
F-.右向旗帜流程图.->H>右向旗帜流程]
end
H---I(测结束)
C---I(结束)
J---I(结束)
```

<!--more-->



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





## 泳道图



```mermaid
sequenceDiagram
Title: 建造者模式
director->>builder: 指导
builder ->> building: 建造
```



```mermaid
sequenceDiagram
Title: 写markdown设计文档
participant auther as 你
participant brower as 浏览器
participant soft as typora软件
auther->>brower: 打开浏览器
auther -x +brower: 输入编辑器的官网地址
brower --x -auther: 加载官网地址内容
auther ->> +brower: 点击下载
brower ->> -brower: 下载
auther ->> soft: 打开
loop 循环写，直到字数比较满意
auther ->> soft: 编写
end
alt 发现网上有更好的文章
auther ->> soft: 关闭
else 没有我的想法好
auther ->> soft: 写更好的文章
end
par 并行执行
auther ->> soft : 编写多篇文档
end
opt time > 24：00
auther ->> soft : 关闭，去睡觉
end
Note left of auther : 一个技术大佬
Note over brower,soft : 助力你进步的工具
```



| 类型 | 描述                             |
| ---- | -------------------------------- |
| ->   | 无箭头的实线                     |
| –>   | 无箭头的虚线                     |
| ->>  | 有箭头的实线(主动发出消息)       |
| –>>  | 有箭头的虚线(响应)               |
| -x   | 末端为X的实线(主动发出异步消息)  |
| –x   | 有箭头的实线(以异步形式响应消息) |

>alt 可以理解为可替代的方案，可能的情况
>
>opt可以理解为一个if语句，满足条件下执行的操作



## UML类图



```mermaid
classDiagram
class classA{
int	id
-List<String> msg
getId(int id) List~int~
}
classA : setMessages(List~string~ messages)
```




```mermaid
classDiagram
class Shape{
    <<interface>>
    noOfVertices
    draw()
}
class Color{
    <<enumeration>>
    RED
    BLUE
    GREEN
    WHITE
    BLACK
}
```




```mermaid
classDiagram
    classA --|> classB : 继承
    classC --* classD : 组合
    classE --o classF : 聚合
    classG --> classH : 单向关联
    classI -- classJ : 双向关联
    classK ..> classL : 依赖
    classM ..|> classN : 接口实现
    classO .. classP : Link(Dashed)
```





```mermaid
   classDiagram
    Customer "1" --> "*" Ticket
    Student "1" --> "1..*" Course
    Galaxy --> "many" Star : Contains
```











