---
title: Sublime设置
permalink: tool/codetool/sublime03/
tags:
  - 插件
  - 设置
  - xxx
categories:
  - tool
  - sublime
date: 2022-09-01 21:13:45
---

###  插件

#### Sublimelint3

Sublimelint支持显示高亮错误代码

安装路径  ~/.config/sublime-text-3/Packages/

ctrl+shift+p  输入 install    **sublimelinter**


>打开 SublimeLinter 的配置文件：菜单 Preferences -> Package Settings -> SublimeLinter -> Settings - User，
>
>加入 "sublimelinter": "save-only"



<!--more-->



### 设置

toolbar -> Preferences -> Browse packages  -> open User file 

左侧目录字体

Default.sublime-theme 手动创建

```
[
    {
        "class": "tab_label",
        "font.size": 18
    },
    {
        "class": "sidebar_label",
        "font.size": 18
    }
]
```

