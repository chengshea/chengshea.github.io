---
title: npm初始
permalink: lang/npm/npm初始/
tags:
  - 源
categories:
  - lang
  - npm
date: 2022-06-13 21:07:35
---



https://www.npmjs.com/package/npm

## 源加速

设置

```
echo "registry = https://registry.npm.taobao.org">>~/.npmrc
```

查看当前源

```
npm config get registry
```

<!--more-->

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



- **`i`** 是 **`install`** 的简写
- **`-g`** 是全局安装，不带 **`-g`** 会安装在个人文件夹
- **`-S`** 与 **`--save`** 的简写，安装包信息会写入 **`dependencies`** 中;生产阶段,项目运行时的依赖
- **`-D`** 与 **`--save-dev`** 的简写，安装包写入 **`devDependencies`** 中;开发阶段,只在开发阶段起作用,例如代码提示工具



## 后台运行

### pm2

```shel
npm install pm2  -g 
```

>pm2 start run.js --name my-api # 命名进程
>pm2 list               # 显示所有进程状态
>pm2 monit              # 监视所有进程
>pm2 logs               #  显示所有进程日志
>pm2 stop all           # 停止所有进程
>pm2 restart all        # 重启所有进程
>pm2 reload all         # 0秒停机重载进程 (用于 NETWORKED 进程)
>pm2 stop 0             # 停止指定的进程
>pm2 restart 0          # 重启指定的进程
>pm2 startup            # 产生 init 脚本 保持进程活着
>pm2 web                # 运行健壮的 computer API endpoint (http://localhost:9615)
>pm2 delete 0           # 杀死指定的进程
>pm2 delete all         # 杀死全部进程



```shell
cat >run.js<<EOF
const { exec } = require('child_process')
exec('hexo server',(error, stdout, stderr) => {
    if(error){
            console.log('exec error: ${error}')
            return
    }
console.log('stdout: ${stdout}')
console.log('stderr: ${stderr}')
})
EOF

pm2 start run.js

```

