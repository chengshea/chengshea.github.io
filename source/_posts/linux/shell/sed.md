---
title: sed替换查找
permalink: linux/shell/sed/
tags:
  - sed
categories:
  - linux
  - shell
date: 2022-07-09 21:18:56
---

### 参数

```
sed [options] 'command' file(s) 

sed [options] -f scriptfile file(s)
```

>g 表示行内全面替换。     global 全局   
>p 表示打印行。 P 打印模板第一行
>r 读文件
>-n ：使用安静(silent)模式。在一般 sed 的用法中，所有来自 STDIN 的数据一般都会被列出到终端上。但如果加上 -n 参数后，则只有经过sed 特殊处理的那一行(或者动作)才会被列出来。 
>-e ：直接在命令列模式上进行 sed 的动作编辑； 
>-f ：直接将 sed 的动作写在一个文件内， -f filename 则可以运行 filename 内的 sed 动作；
>-r ：sed 的动作支持的是延伸型正规表示法的语法。(默认是基础正规表示法语法) -i ：直接修改读取的文件内容，而不是输出到终端   
> w 表示把行写入一个文件。
> x 表示互换模板块中的文本和缓冲区中的文本。
> y 表示把一个字符翻译为另外的字符（但是不用于正则表达式）
> \1 子串匹配标记 
>& 已匹配字符串标记元字符集
>^ 匹配行开始，如：/^sed/匹配所有以sed开头的行。 
>$ 匹配行结束，如：/sed$/匹配所有以sed结尾的行。
> . 匹配一个非换行符的任意字符，如：/s.d/匹配s后接一个任意字符，最后是d。
> * 匹配0个或多个字符，如：/*sed/匹配所有模板是一个或多个空格后紧跟sed的行。
> [] 匹配一个指定范围内的字符，如/[ss]ed/匹配sed和Sed。
>  [^] 匹配一个不在指定范围内的字符，如：/[^A-RT-Z]ed/匹配不包含A-R和T-Z的一个字母开头，紧跟ed的行。
>  \(..\) 匹配子串，保存匹配的字符，如s/\(love\)able/\1rs，loveable被替换成lovers。
>  & 保存搜索字符用来替换其他字符，如s/love/**&**/，love这成**love**。
>  \< 匹配单词的开始，如:/\ 匹配单词的结束，如/love\>/匹配包含以love结尾的单词的行。
>  x\{m\} 重复字符x，m次，如：/0\{5\}/匹配包含5个0的行。
>  x\{m,\} 重复字符x，至少m次，如：/0\{5,\}/匹配至少有5个0的行。
>  x\{m,n\} 重复字符x，至少m次，不多于n次，如：/0\{5,10\}/匹配5~10个0的行。

 

### 批量替换

把目录下所有格式文件内容进行批量替换

```shell
sed -n "s#$src#$dest#g"p `grep $src -rl --include=\*.{yaml,md} $path`
```

>扫描path路径对应格式的文件,把src替换成dest,

>**sed** 
>
>-n p  结合打印改变内容,不执行变更
>
>**grep**
>
>-r 表示查找当前目录以及所有子目录
>
>-l 表示仅列出符合条件的文件名
>
>--include="*.[ch]" 表示仅查找.c、.h文件
>
>上面不适用大多数情况,推荐下面
>
>--include=*.{yaml,md}

<!--more-->

​           

样本1 test.txt   (cat -n 显示行号)

```
111111111 
222222222   
```

 

#### **a\ ** 追加

在当前行下面插入文本。  append  追加

N;2a  指定第二行后追加append

```shell
cs@debian:~/～$ sed -i 'N;2a这是a' test.txt 
cs@debian:~/～$ cat -n test.txt    
1	11111111    
2	22222222    
3	这是a      
```

​        

/匹配/  不确定行数 a\ **反斜杠可以不要** a

```shell
 cs@debian:~/～$ sed -i "/这是a/a\匹配追加" test.txt 
 cs@debian:~/～$ cat -n test.txt    
 1	这是i    
 2	11111111    
 3	22222222    
 4	这是a    
 5  匹配追加      
```

​        

####  **i\ **  插入

在当前行上面插入文本。 insert 插入

 N;2i 指定第二行前插入insert  'N;2i\这是i' （\省略）

```
cs@debian:~/～$ sed -i 'N;2i这是i' test.txt
cs@debian:~/～$ cat -n test.txt    
1	这是i    
2	11111111    
3	22222222    
```

​          

/匹配/  不确定行数

```
cs@debian:~/～$ sed -i "/这是i/i\匹配插入" test.txt 
cs@debian:~/～$ cat -n test.txt    
1	匹配插入    
2	这是i    
3	11111111    
4	22222222    
5	这是a      
```

​        

匹配多个---》 批量插入

```
 cs@debian:~/～$ sed -i "/这是/i\匹配多个" test.txt 
 cs@debian:~/～$ cat -n test.txt    
 1	匹配多个    
 2	这是i    
 3	11111111    
 4	22222222    
 5	匹配多个    
 6	这是a   
```

​           

 c\ 把选定的行改为新的文本。 



#### d 删除

删除选择的行。

确定行数

```
cs@debian:~/～$  sed '2,5d' test.txt
```

> #2-5行删除  
>
>  '2d' 第2行
>
>   '10,$d' 10到最后一行

​             

匹配删除 删除匹配下一行  d删除 p打印  #加 -i 直接修改 

```
sed '/这是i/d' test.txt
```





样本2

```
cs@debian:~/～$ cat -n test.txt     
1	11111111     
2	这是i     
3	22222222     
4	这是a     
5	33333333             
```



#### n N p

```shell
cs@debian:~/～$ sed '/这是i/{n;d;p}' test.txt
11111111     
这是i     
这是a     
33333333
cs@debian:~/～$ sed '/这是i/{N;d;p}' test.txt 
11111111     
这是a     
33333333
```

>n匹配下一行  
>
>N匹配当前行和下一行



n命令-->移动到匹配行的下一行  {n;操作;}

```
$ sed -i '/^ZOOKEEPER_PREFIX/{n;s#$#JAVA_HOME=/opt/jdk/jdk-11.0.12#;}' ./zkEnv.sh
```

>ZOOKEEPER_PREFIX="${ZOOBINDIR}/.."
>
>JAVA_HOME=/opt/jdk/jdk-11.0.12
>
>#check to see if the conf dir is given as an optional argument



上一行 (提供多的特征匹配)

```
sed -n '/^if.*JAVA_HOME/i\JAVA_HOME=/opt/jdk/jdk-11.0.12' ./zkEnv.sh 
```

>JAVA_HOME=/opt/jdk/jdk-11.0.12
>
>if [[ -n "$JAVA_HOME" ]] && [[ -x "$JAVA_HOME/bin/java" ]];  then
>
>​    JAVA="$JAVA_HOME/bin/java"
>
>elif type -p java; then





 N 将下一行读入并附加到当前行后面放到当前空间模式

 最后一行结束

```shell
cs@debian:~/～$ echo -e "11111\n2222222\n3333" | sed 'N;p'
11111
2222222
11111
2222222
333
```



 P模式空间第一行 N再次执行就到了3 ，隔行  

```shell
cs@debian:~/～$ echo -e "11111\n2222222\n3333\n44\n55\n6" | sed 'N;P'
1111111111
2222222
33333333
44
5555
6
```



```
cs@debian:~$ cat /etc/hosts
127.0.0.1	localhost
192.168.56.1  master01 ui.k8s.cn k8s.org jenkins.k8s.cn  gogs.k8s.cn
192.168.56.101  node01
192.168.56.108  node02 
cs@debian:/ip$ ip=192.168.56.108
cs@debian:/ip$ cat hosts | sed -e  "s/^\(${ip}\)\([[:space:]]*\)\(.*\)/\3/g" p
node01
```



```
cs@debian:/ip$ ip=node02
cs@debian:/ip$ cat hosts | sed -n "s/\(.*\)\([[:space:]]*\)\(${ip}\)/\1/g"p
192.168.56.108  
```



```shell
zookeeper.connect=localhost:2181
 cat ./config/server.properties | sed -n 's/^zookeeper\.connect=\(.*\)/\1/'p
localhost:2181
cat ./config/server.properties | sed -n "s#^listeners=PLAINTEXT://\(.*\)#\1#"p
127.0.0.1:9092
```



​         



####  D

 删除模板块的第一行。



####  s 替换

s/指定字符/替换字符/

relative/directory/  改为/etc/supervisor.conf.d/

```shell
cs@debian:~/～$ sed -n   's/relative\/directory\//\/etc\/supervisor.conf.d\//'p /etc/supervisord.conf
```

> -n选项和p命令一起使用表示只打印发生替换的行

  

 防火墙关闭

```
cat /etc/selinux/config | grep ^SELINUX= | sed  's/^SELINUX=.*/SELINUX=disabled/'
sed -i '/SELINUX/s/enforcing/disabled/' /etc/selinux/config
```



替换整行

  ```shell
cs@debian:~/～$  sed  -i  '2s/^.*$/xxxxx/'  file  
  ```





#### 截取 

```shell
cs@debian:~/～$ echo "tinkle-app-style-0.0.1-SNAPSHOT.jar" | sed 's/\([a-z]-*\)-[0-9].*/\1/'
```



```shell
cs@debian:~/～$  echo "abcdef-shea-df" | sed 's/\(.*\)-\(.*\)-\(.*\)/\2/g'
命令解释
\(.*\)- : 表示第一个引号前的内容
-\(.*\)-：表示两引号之间的内容
-\(.*\)：表示引号后的内容
\2: 表示第二对括号里面的内容
括号里的表达式匹配的内容，可以用\1，\2等进行引用，第n个括号对内的内容，就用\n引用。
这个命令的意思是：
用\2代表的第二个括号的内容（shea）去替换整个字符串，这样就得到了我们所需要的子字符串了。
```



```shell
cs@debian:~$ echo "etch-master.sh" | sed 's/\(.*\)-\(.*\)\.\(.*\)/\2/g'
master
cs@debian:~$ echo "gen-flanneld.sh" | sed 's/^gen-\(.*\)\..*/\1/g'
flanneld
```



```shell
cs@debian:~$ systemctl status flanneld.service
● flanneld.service - Flanneld overlay address etcd agent
   Loaded: loaded (/opt/kubernetes/flanneld/flanneld.service; disabled; vendor p
   Active: inactive (dead)
cs@debian:~$ systemctl status flanneld.service | grep Active: | sed 's/.*(\([a-z]*\)).*/\1/g'
dead
cs@debian:~$ systemctl status nginx | grep Active | sed 's/.*(\(.*\)).*/\1/g'
running
cs@debian:~$ systemctl status kube-scheduler  |  sed -n 's/.*ctive:.*(\(.*\)).*/\1/g'p
dead
```



### 标记跳转

删除前一行  (:a  ;ta) a标记，ta执行成功在跳转，类似循环

   ```shell
cs@debian:~/～$ sed -e :a -e '$!N;s/.*\n\(.*是.*\)/\1/;ta' -e 'P;D'  test.txt
这是i
这是a
33333333 
   ```



前置 s/正则/\1/    $最后一行 ！不进行 

```shell
cs@debian:~/～$ sed -e   '$!N;s/.*\n\(.*是i\)/\1/' -e 'p;d'  test.txt
这是i
22222222
这是a
33333333
cs@debian:~/～$ sed -e   '$!N;s/.*\n\(.*是i\)/\1/' -e 'P;D'  test.txt
这是i
22222222
这是a
33333333
cs@debian:~/～$ sed -e :a -e '$!N;s/.*\n\(.*是.*\)/\1/;ta' -e 'P;D'  test.txt
这是i
这是a
33333333
```





test

```
3d5f
<Proxy>
这是i
<P>
22222222
</Proxy>
abcde
```

替换Proxy 标签中间部分

```shell
sed '/<P/{:a;N;/<\//!ba;s/>[^<].*</>\n替换你们\n</}'  test

<p  :a;N;/<\//!ba
匹配<Proxy  :a标记  </ 结束匹配标记  !b （匹配不了，执行下句命令）
s/>[^<]*</>\n1234567\n</
>把中间内容<  替换指定内容
```









### 注释       

join.yaml

```
#kind: JoinConfiguration

nodeRegistration:
  name: debian  #节点名,master要能解析
```

#### 添加

```
sed -n '/debian/s/^/#/'p ./join.yaml
```

> \#  name: debian  #节点名,master要能解析

```
sed -n 's/debian/#&/'p ./join.yaml
```

>  name: #debian  #节点名,master要能解析



```
cs@debian:~$ cat /etc/fstab | grep swap | sed '/swap/s/^/#/' 
## swap was on /dev/sda5 during installation
##UUID=0fd6cee8-fdfa-459b-a7c6-1898ea2ade8e none            swap    sw              0       0
[vagrant@master03 ~]$ cat /etc/fstab | grep swap | sed '/swap/s/^/#/' 
##/swapfile none swap defaults 0 0
```



```
sed -i '/匹配字符串/,+4 s/^/#/' 文件名   #匹配行和下面4行
```

> +4表示匹配行和下面4行，一共5行注释





#### 删除

```
#去掉所有行注释
sed -n '/^#.*$/s/^#//'p ./join.yaml
#去匹配行注释
sed -n '/^#.*debian.*$/s/^#//'p ./join.yaml
```

>  name: debian  #节点名,master要能解析



```shell
sed 's/^#.*\(en_US.UTF-8\)/\1/' test
```





```
#去注释行
sed -i '/^#/d' ./join.yaml
#去空行和注释行
sed -i '/^$/d;/^#/' ./join.yaml
#空格字符
sed -n  '/^[:space:]/##/' ./join.yaml
```



```
sed -i '/匹配字符串/,+4 s/^#*//' 文件名

[vagrant@node06 ~]$ grep 'HOME'  /etc/profile
export JAVA_HOME=/opt/mq/jre
export CLASSPATH=.:${JAVA_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
# echo $(sed -n  '/export\ JAVA_HOME/,+2 s/export/#/'p /etc/profile)
# sed -i '/export\ JAVA_HOME/,+2 s/export/#/' /etc/profile
```



#### 乱码

 unknown directive

```
root@racknerd-070082:~# cat -n -v /usr/local/openresty/nginx/conf/nginx.conf | grep 88
    88	 M-BM-  M-BM-  M-BM-  M-BM- proxy_set_header Host 127.94.137.185;
    
root@racknerd-070082:~# sed 's/\xc2\xa0/ /g' -i /usr/local/openresty/nginx/conf/nginx.conf
root@racknerd-070082:~# cat -n -v /usr/local/openresty/nginx/conf/nginx.conf | grep 88
    88	        proxy_set_header Host 127.94.137.185;

```

> cat -v #显示输出不打印M-等一些特殊字符
>
>  sed 's/\xc2\xa0/ /g' -i 文件路径  #把"M-BM-" 替换成空格

![](/pics/cat-unknown.png)



