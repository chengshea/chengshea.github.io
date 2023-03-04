#!/bin/sh

base=/home/cs/oss/hexo/source/_posts

dirlist(){
	cd $base && $1 && cd -
}

dir(){
	[ -n "$(command -v tree)" ] || {  dirlist "find  ./ -type d"  && exit 1 ;}
    dirlist "tree -d" 
}


help(){
	echo "请选择以下目录创建md,没有的目录会自动创建"
	dir
	echo "========================="
	echo 'eg: linux/shell/filename "title"'
	echo ""

}


[ -n "$1" ] || { help && exit 1;}
[[ "$1" != -@(h|help) ]] || { help && exit 1;}

exec(){
   tmp=$2
   [ -n "$2" ] || tmp=${tmp:-$1}
   echo "local:$1  title:${tmp#*/}"
   hexo new --path $1 ${temp#*/}
}



exec $1 $2


<<EOF

ls -l |grep "^d"
find  ./ -type d
@(...) 是扩展模式的一个示例，在最新版本的 [[ ... ]] 中应该默认识别它bash;-h|-help
EOF