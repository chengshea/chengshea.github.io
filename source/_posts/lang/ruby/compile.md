---
title: ruby从git拉取编译安装
permalink: lang/ruby/compile/
tags:
  - git
  - compile
  - ruby
categories:
  - lang
  - ruby
  - compile
date: 2023-02-28 12:15:49
---

https://github.com/ruby/ruby/blob/master/doc/contributing/building_ruby.md

## build



### Dependencies

1. Install the prerequisite dependencies for building the CRuby interpreter:

   - C compiler

   For RubyGems, you will also need:

   - OpenSSL 1.1.x or 3.0.x / LibreSSL
   - libyaml 0.1.7 or later
   - zlib

   If you want to build from the git repository, you will also need:

   - autoconf - 2.67 or later
   - bison - 3.0 or later
   - gperf - 3.1 or later
     - Usually unneeded; only if you edit some source files using gperf
   - ruby - 2.2 or later
     - We can upgrade this version to system ruby version of the latest Ubuntu LTS.

2. Install optional, recommended dependencies:

   - readline/editline (libedit, to build readline)
   - libffi (to build fiddle)
   - gmp (if you with to accelerate Bignum operations)
   - libexecinfo (FreeBSD)
   - rustc - 1.58.0 or later (if you wish to build [YJIT](https://github.com/ruby/ruby/blob/master/doc/yjit/yjit.md))

   If you installed the libraries needed for extensions (openssl, readline, libyaml, zlib) into other than the OS default place, typically using Homebrew on macOS, add `--with-EXTLIB-dir` options to `CONFIGURE_ARGS` environment variable.

   ```
   export CONFIGURE_ARGS=""
   for ext in openssl readline libyaml zlib; do
     CONFIGURE_ARGS="${CONFIGURE_ARGS} --with-$ext-dir=$(brew --prefix $ext)"
   done
   ```

<!--more-->



##



```
$ ./configure --prefix=/opt/ruby  --disable-install-doc
checking for ruby... /usr/bin/ruby
downloading config.guess ... done
downloading config.sub ... done
checking build system type... x86_64-pc-linux-gnu
checking host system type... x86_64-pc-linux-gnu
checking target system type... x86_64-pc-linux-gnu
checking for gcc... no
checking for clang... no
checking for cc... no
checking for gcc... no
checking for cc... no
checking for cl.exe... no
configure: error: in `/home/cs/下载/ruby-3_2_1':
configure: error: no acceptable C compiler found in $PATH
See `config.log' for more details

```



### 源



```
gem sources
gem sources -a url地址
gem sources -r url地址
gem sources -u
```





sudo gem install nokogiri
