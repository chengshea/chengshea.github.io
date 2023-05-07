---
title: maven介绍
permalink: tool/maven/
tags:
  - maven
  - mvn
categories:
  - tool
date: 2022-07-30 19:51:46
---







## 安装

### 环境变量

```
cs@debian:~/oss/hexo$ wget https://dlcdn.apache.org/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz -O apache-maven-3.8.6-bin.tar.gz
cs@debian:~/oss/hexo$ tar -zxvf apache-maven-3.8.6-bin.tar.gz -C /opt/apache
cs@debian:~/oss/hexo$ cat >>  ~/.bashrc <<EOF
#maven
if [ -d "/opt/apache/maven-3.8.6" ] ; then
    export MAVEN_HOME=/opt/apache/maven-3.8.6
    export PATH=${MAVEN_HOME}/bin:\$PATH
fi
EOF
```

### 版本

```
cs@debian:~/oss/hexo$ mvn -version
```

> Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
> Maven home: /opt/apache/apache-maven-3.8.6
> Java version: 11.0.12, vendor: Oracle Corporation, runtime: /opt/jdk/jdk-11.0.12
> Default locale: zh_CN, platform encoding: UTF-8
> OS name: "linux", version: "4.9.0-8-amd64", arch: "amd64", family: "unix"



##  基本命令

### 编译

```
mvn compile　
```

  --src/main/java目录java源码编译生成class （target目录下）

　　　　　　　　　　

### 测试

```
mvn test　
```

   --src/test/java 目录编译

　　　　　　　　　　

### 清理

```
mvn clean
```

  --删除target目录，也就是将class文件等删除

　　　　　　　　　　

### 打包

```
mvn package　
```

 --生成压缩文件：java项目#jar包；web项目#war包，也是放在target目录下

　　　　　　　　　　

### 安装

```
mvn install　　
```

--将压缩文件(jar或者war)上传到本地仓库

　　　　　　　　　　

### 部署|发布

```
mvn deploy　　
```

--将压缩文件上传私服



### [多模块](#idmore)





场景:几百个微服务只打部分包



<!--more-->



### 周期

| **验证（validate）**                        | 验证项目是正确的，所有必要的信息可用。                       |
| ------------------------------------------- | ------------------------------------------------------------ |
| **初始化（initialize）**                    | 初始化构建状态，例如设置属性或创建目录。                     |
| **产生来源（generate-sources）**            | 生成包含在编译中的任何源代码。                               |
| **流程源（process-sources）**               | 处理源代码，例如过滤任何值。                                 |
| **生成资源（generate-resources）**          | 生成包含在包中的资源。                                       |
| **流程资源（process-resources）**           | 将资源复制并处理到目标目录中，准备打包。                     |
| **编译（compile）**                         | 编译项目的源代码。                                           |
| **工艺类（process-classes）**               | 从编译后处理生成的文件，例如对Java类进行字节码增强。         |
| **生成测试来源（generate-test-sources）**   | 生成包含在编译中的任何测试源代码。                           |
| **流程测试来源（process-test-sources）**    | 处理测试源代码，例如过滤任何值。                             |
| **生成测试资源（generate-test-resources）** | 创建测试资源。                                               |
| **流程测试资源（process-test-resources）**  | 将资源复制并处理到测试目标目录中。                           |
| **测试编译（test-compile）**                | 将测试源代码编译到测试目标目录中                             |
| **流程检验类（process-test-classes）**      | 从测试编译中处理生成的文件，例如对Java类进行字节码增强。对于Maven 2.0.5及以上版本。 |
| **测试（test）**                            | 使用合适的单元测试框架运行测试。这些测试不应该要求代码被打包或部署。 |
| **制备包（prepare-package）**               | 在实际包装之前，执行必要的准备包装的操作。这通常会导致打包的处理版本的包。（Maven 2.1及以上） |
| **打包（package）**                         | 采取编译的代码，并以其可分发的格式（如JAR）进行打包。        |
| **预集成测试（pre-integration-test）**      | 在执行集成测试之前执行所需的操作。这可能涉及诸如设置所需环境等。 |
| **集成测试（integration-test）**            | 如果需要，可以将该包过程并部署到可以运行集成测试的环境中。   |
| **整合后的测试（post-integration-test）**   | 执行集成测试后执行所需的操作。这可能包括清理环境。           |
| **校验（verify）**                          | 运行任何检查以验证包装是否有效并符合质量标准。               |
| **安装（install）**                         | 将软件包安装到本地存储库中，以作为本地其他项目的依赖关系。   |
| **部署（deploy）**                          | 在集成或发布环境中完成，将最终软件包复制到远程存储库，以与其他开发人员和项目共享。 |



## 高级命令

<p id="idmore" hidden/>

在多模块 Maven项目中，反应堆（Reactor）是一个包含了所有需要构建模块的抽象概念，对于Maven用户来说，主要关心的是两点：

1. 哪些模块会被包含到反应堆中？
2. 反应堆中所有模块的构建顺序是什么？



```
$ tree -L 3 -P *xml -I "src|target" ./spring-boot/
./spring-boot/
├── cs-framework
│   ├── cs-msc
│   │   ├── lib
│   │   ├── msc
│   │   └── pom.xml
│   ├── cs-ocr
│   │   ├── libs
│   │   └── pom.xml
│   ├── cs-shiro
│   │   └── pom.xml
│   └── pom.xml
├── cs-tool
│   ├── cs-common
│   │   └── pom.xml
│   ├── cs-email
│   │   └── pom.xml
│   ├── cs-jpa
│   │   └── pom.xml
│   ├── cs-rw-aop
│   │   └── pom.xml
│   ├── cs-rw-druid
│   │   └── pom.xml
│   └── pom.xml
└── pom.xml
```



一级

```xml
<groupId>com.cs</groupId>
  <artifactId>cs-parent</artifactId>
   <version>${version}</version>

  <modules>
    <module>cs-framework</module>
    <module>cs-tool</module>
  </modules>
  <packaging>pom</packaging>
  
  <name>cs-parent</name>
```





二级

```xml
 <parent>
    <groupId>com.cs</groupId>
    <artifactId>cs-parent</artifactId>
    <version>${version}</version>
  </parent>

 <groupId>com.cs</groupId>
  <artifactId>cs-framework</artifactId>
   <version>${version}</version>
  <name>cs-framework</name>
  <packaging>pom</packaging>
  
   <modules>
     <module>cs-shiro</module>
    <module>cs-ocr</module>
    <module>cs-msc</module>
  </modules>
```



子

```xml
  <parent>
    <groupId>com.cs</groupId>
    <artifactId>cs-framework</artifactId>
    <version>${version}</version>
  </parent>
  <groupId>com.cs</groupId>
  <artifactId>cs-ocr</artifactId>
  <version>${version}</version>
  <name>cs-ocr</name>
```



```
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary for cs-parent 0.0.1-SNAPSHOT:
[INFO] 
[INFO] cs-parent .......................................... SUCCESS [  0.163 s]
[INFO] cs-tool ............................................ SUCCESS [  0.005 s]
[INFO] cs-common .......................................... SUCCESS [  0.800 s]
[INFO] cs-framework ....................................... SUCCESS [  0.006 s]
[INFO] cs-ocr ............................................. SUCCESS [  3.194 s]
[INFO] cs-msc ............................................. SUCCESS [  0.271 s]
[INFO] cs-jpa ............................................. SUCCESS [  0.471 s]
[INFO] cs-rw-aop .......................................... SUCCESS [  1.074 s]
[INFO] cs-rw-druid ........................................ SUCCESS [  0.893 s]
[INFO] cs-email ........................................... SUCCESS [  2.520 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  9.736 s
[INFO] Finished at: 2022-07-30T21:51:32+08:00
[INFO] ------------------------------------------------------------------------
```





### 指定 -pl

手动选择项目，多个逗号隔开

```
mvn install -pl web/style,web/login
```

>-pl,--projects <arg>                   
>Build specified reactor projects instead of all projects. 
>A project can be specified by [groupId]:artifactId or by its relative path.



### 所需依赖 -am

构建某个子模块

```
mvn install -pl web/style  -am
```

>项目被指定，构建该项目所需依赖
>
> -am,--also-make                      
>  If project list is specified, also  build projects required by the  list

构建 parent ，framework, web, redis ,style



### 依赖该模块 -amd 

构建父模块，公用模块

```
mvn install -pl web/redis  -amd
```

> 项目被指定，构建依赖该模块的模块 
>
> -amd,--also-make-dependents          
>    If project list is specified, also  build projects that depend on projects on the list

构建 redis, login, style



### 裁剪 -rf

在前命令裁剪基础上，从rf指定模块开始构建

```
mvn install -pl web/style  -am -rf  web/redis
```

>从原有构建过程中裁剪反应堆，去掉指定模块原有构建顺序的前面部分
>
>-rf,--resume-from <arg>              
>Resume reactor from specified  project

构建 redis style







## 错误

### find main class

 repackage failed: Unable to find main class

```
 <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>none</phase>
                    </execution>
                </executions>
            </plugin>
        </plugins>
   </build>
```

