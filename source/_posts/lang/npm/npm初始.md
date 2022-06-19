---
title: npm初始
permalink: lang/npm/npm初始
tags:
  - 源
categories:
  - lang
  - npm
date: 2022-06-13 21:07:35
---



## 源加速

设置

```
echo "registry = https://registry.npm.taobao.org">>~/.npmrc
```

查看当前源

```
npm config get registry
```



## 使用

### 全局安装(-g)

 typescript

```
npm install -g typescript
```

>/opt/node/bin/tsc -> /opt/node/lib/node_modules/typescript/bin/tsc
>/opt/node/bin/tsserver -> /opt/node/lib/node_modules/typescript/bin/tsserver
>+ typescript@4.7.3
>added 1 package from 1 contributor in 2.252s
>



### 卸载

```
npm uninstall -g  typescript
```

