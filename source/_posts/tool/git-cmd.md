﻿---
title: git命令
date: 2017-10-05 12:36:33
permalink: tool/git-cmd/
tags:
  - git
  - pull
  - cmd
categories:
  - tool
---


#### checkout

单个文件回滚

```
#获取版本commit SHA-1 标识符前8位
git log

#回滚到指定版本
git checkout 0ebdd2639e8 _config.yml

#撤消此更改并还原文件的最新版
git checkout HEAD index.html
```



#### cached

文件从 Git 跟踪中删除，但将其保留在文件系统

```
git rm --cached <file>
```

> git rm <file>  #将文件从 Git 仓库和文件系统中完全删除



#### show



```
#查看已添加到 Git 索引的文件内容
git show :_config.yml

# <commit> 是要查看的提交的 SHA-1 标识符
git show <commit>:<path>
```





### pull

稀疏检出*sparse checkout*
 <!--more--> 



```
#!/bin/bash

print_help() {
  cat <<EOF
  use params 
   -h , --help   说明   不支持分支
   -u , --url   *必须，下载文件的链接（如https:://github.io/xx/tree/master/a/b ,下载b）  
EOF
}

function src(){
   if [[ "$1" =~ "github.com" ]] || [[ "$1" =~ "gitee.com" ]];then
     echo "downloadUrl--> $1"
   else 
     echo "不支持"
     exit 1
   fi
}

while [ $# -ge 0 ]; do
    case $1 in
        -h|--help)
           print_help  
           exit 1
            ;;
        -u|--url)
              src $2
              break 
            ;;
         *  )
           echo "use param -h or --help !"  
           exit 1
            ;;
    esac
done
function type(){
   uri=$(echo $1 | grep "/tree/master/" | grep -v grep)
   echo "---$uri"
   if [[ $uri != "" ]];then
     echo "-------/tree/master"
     uri=${url%/tree/master*}".git"
     down=${url#*/tree/master/}
   else
     echo "-------/blob/master"
     uri=$(echo $1 |grep -v grep | grep "/blob/master/")
     if [[ $uri != "" ]];then
       uri=${url%/blob/master*}".git"
       down=${url#*/blob/master/}
     else
       echo "只支持拉取master文件下载"
       exit 1
     fi
   fi 
}

url=$2

file=${url##*/}

uri=
down=
type $2
 

if [ ! -f "$file" ];then
	mkdir $file
fi
cd $file

git init
echo "==================添加 源==================="
git remote add -f origin $uri 
#稀疏检出
git config core.sparsecheckout true
#拉取文件
echo "$down">>.git/info/sparse-checkout
echo "==================开始拉取==================="
git pull origin master
 
rm -rf .git
mv $file/*  . && rm -r $file

echo "==================$PWD==================="	
```
>利用git稀疏检出拉取部分文件

### js实现下载
[kinolien gitzip ](http://kinolien.github.io/gitzip/)