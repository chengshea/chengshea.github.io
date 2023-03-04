---
title: Mathjax公式
permalink: tool/text/markdown/formula/
tags:
  - formula
categories:
  - markdown
date: 2022-08-15 22:25:18
mathjax: true
---



When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

![](/pics/mathjax01.png)



<!--more-->

http://mathjax.josephjctang.com/

```shell
$ grep theme.mathjax -rl --include=\*.{ejs,js} /home/cs/oss/hexo/themes/spfk
/home/cs/oss/hexo/themes/spfk/layout/_partial/head.ejs
$ sed -i 's/theme.mathjax/page.mathjax/' /hexo/themes/spfk/layout/_partial/after-footer.ejs
```

> <% if (page.mathjax){ %>



/hexo/public/js/MathJax.js 添加引入

```
  <script type="text/javascript"
     src="http://mathjax.josephjctang.com/MathJax.js?config=TeX-MML-AM_HTMLorMML">
  </script>
```

文章开头加入

```
title: xxxx
permalink: xxxx/
tags: xxxx
date: xxxx
mathjax: true
```

> mathjax: true



引入目录

![](/pics/mathjax.png)
