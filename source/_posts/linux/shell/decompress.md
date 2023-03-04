---
title: 解压/压缩
permalink: linux/shell/decompress/
tags:
  - tar
  - unzip
  - xz
  - decompress
categories:
  - linux
  - shell
date: 2022-08-18 20:59:41
---



## tar

### 解压

```
tar -zxvf  helm-v3.9.3-linux-amd64.tar.gz
```

>-z    tar.gz  tgz
>
>-j    tar.bz2   tbz
>
>-C  接指定目录



### 压缩



```
tar zcvf /dir/file.tar.gz   /dir/file
```

> -z  gzip压缩
>
> -j  bzip2压缩
>
> -zp  gzip压缩，并且保留权限信息(-p的属性是很重要的，尤其是当您要保留原本文件的属性时)
>
> --strip-components 1  去掉最外层目录
