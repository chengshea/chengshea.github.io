---
title: Sublime运行脚本
permalink: tool/codetool/sublime02/
tags:
  - shell
  - 脚本
  - lua
categories:
  - tool
  - sublime
date: 2022-09-01 21:07:03
---

### shell 

Build Stytem > New Build Stytem ...

```
{    "shell_cmd": "chmod a+x $file && /bin/sh $file"}
```

ctrl+s 保存 sh.sublime-build

路径： ~/.config/sublime-text-3/Packages/User/sh.sublime-build

执行脚本快捷键 ctrl+b

<!--more-->

### lua

/usr/local/bin/lua

lua

```
{    "cmd": ["lua", "$file"],    "file_regex": "^(?:lua:)?[\t ](...*?):([0-9]*):?([0-9]*)",    "selector": "source.lua"}
```



luajit

```
{    "cmd": ["luajit", "$file"],    "file_regex": "^(?:lua:)?[\t ](...*?):([0-9]*):?([0-9]*)",    "selector": "source.lua"}
```





