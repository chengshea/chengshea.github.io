---
title: 截取分割
permalink: linux/shell/split/
tags:
  - split
  - partition
  - sed
categories:
  - linux
  - shell
  - split
date: 2023-03-05 16:58:07
---

## #$%

| 格式                       | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| ${string: start :length}   | 从 string 字符串的左边第 start 个字符开始，向右截取 length 个字符。 |
| ${string: start}           | 从 string 字符串的左边第 start 个字符开始截取，直到最后。    |
| ${string: 0-start :length} | 从 string 字符串的右边第 start 个字符开始，向右截取 length 个字符。 |
| ${string: 0-start}         | 从 string 字符串的右边第 start 个字符开始截取，直到最后。    |
| ${string#*chars}           | 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。 |
| ${string##*chars}          | 从 string 字符串最后一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。 |
| ${string%*chars}           | 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。 |
| ${string%%*chars}          | 从 string 字符串最后一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。 |





```
var=https://github.com/csyuancode/csyuancode.github.io/tree/master/js
```



### `#` 

从左边开始截取删除保留匹配剩下字符



```
cs@debian:~/oss/hexo$ var=https://github.com/csyuancode/csyuancode.github.io/tree/master/js

#一次匹配
cs@debian:~/oss/hexo$ echo ${var#*cs}
yuancode/csyuancode.github.io/tree/master/js

##最后一次匹配
cs@debian:~/oss/hexo$ echo ${var##*cs}
yuancode.github.io/tree/master/js

```

![](/pics/split-zifu-q.png)





### `%`

从末尾开始往前删除保留匹配剩下字符

```
cs@debian:~/oss/hexo$ var=https://github.com/csyuancode/csyuancode.github.io/tree/master/js

#截取从后面开始第一次cs前字符
cs@debian:~/oss/hexo$ echo ${var%cs*}
https://github.com/csyuancode/

#截取从后面开始最一次cs前字符
cs@debian:~/oss/hexo$ echo ${var%%cs*}
https://github.com/
```

<!--more-->

![](/pics/split-zifu-h.png)







## tr

去除空行

```
cat file.txt |tr -s ‘\n’

cat file.txt |sed '/^$/d'
```







