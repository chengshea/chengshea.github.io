---
title: download工具命令
permalink: linux/k8s/download/
tags:
  - download
  - wget
  - curl
categories:
  - linux
  - shell
date: 2022-08-18 20:29:34
---



## wget

### 常规使用

```
wget [options] [url]
```

#### 指定文件

```
wget  -P /opt/docker  https://get.helm.sh/helm-v3.9.3-linux-amd64.tar.gz
```

>-c 断点续传
>
>-O 下载并以不同的文件名保存
>
> -b 后台下载
>
>–spider 测试下载链接
>
>--limit-rate=1m  速度限制为1m/s



### 批量下载

#### 有规律

```
wget http://www.xxxx.com/file_{1..4}.txt
```

> 比如：file_1.txt，file_2.txt，file_3.txt



#### 没有规律

```
cat >downloads.txt<<EOF
http://www.xxxx.com/xxx
http://www.xxxx.com/xxx
EOF
wget -i downloads.txt
```



### 下载整个目录



```
wget -r -np -nH -R index.html http://url/files/download/
```

>-r : 遍历所有子目录
>-np : 不到上一层子目录去
>-nH : 不要将文件保存到主机名文件夹
>-R index.html : 不下载 index.html 文件
>
>-k 将网页内绝对链接转为相对链接



### 模拟

模拟 Edge 浏览器发出来的请求

```
wget --debug --header="User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59" http://www.baidu.com
```

模拟手机

```
wget --debug --header="User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari /604.1" http://www.baidu.com
```





## curl



```
curl   -ikv   http://www.baidu.com
```

