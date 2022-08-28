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


exec(){
   tmp=$2
   [ -n "$2" ] || tmp=${tmp:-$1}
   echo "local:$1  title:$tmp"
   hexo new --path $1 $tmp
}



exec $1 $2


<<EOF

ls -l |grep "^d"
find  ./ -type d

EOF