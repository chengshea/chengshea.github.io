---
title: tomcat优化
permalink: services/container/tomcat/
tags:
  - tomcat
categories:
  - services
  - container
date: 2022-07-16 17:00:55
---





## jvm参数



```
JAVA_OPTS="-server -XX:NewSize=256m -XX:MaxNewSize=256m -XX:PermSize=512M -XX:MaxPermSize=1024m -Xms2048m -Xmx2048m "
```



>-Xms：Java虚拟机初始化时堆的最小内存，一般与 Xmx配置为相同值，这样的好处是GC不必再为扩展内存空间而消耗性能；
>
>-Xmx：Java虚拟机可使用堆的最大内存；
>
>-XX:PermSize：Java虚拟机永久代大小；
>
>-XX:MaxPermSize：Java虚拟机永久代大小最大值；
>
>-XX:NewSize=：新生代空间初始化大小 
>
>-XX:MaxNewSize=：新生代空间最大值

## 配置优化

### 连接属性

/tomcat-8.5.38/conf/server.xml



https://tomcat.apache.org/tomcat-8.5-doc/config/executor.html

```
<Executor   name="tomcatThreadPool"
  namePrefix="req-thead-exc"
  maxHttpHeaderSize="8192" 
  maxThreads="1000"
  minSpareThreads="75"
  maxQueueSize="Integer.MAX_VALUE"
  maxIdleTime="60000"
  threadPriority="5"
  className="org.apache.catalina.core.StandardThreadExecutor"
 />
```

> maxThreads:  服务器端最佳线程数量=((线程等待时间+线程cpu时间)/线程cpu时间) * cpu数量,压测计算,要排除单纯处理业务耗时方法,如果未指定，默认值为200
>
> minSpareThreads：线程的最小运行数目，这些始终保持运行。如果未指定，默认值为10。
>
> maxHttpHeaderSize：请求和响应的HTTP头的最大大小，以字节为单位指定。如果没有指定，这个属性被设置为8192（8 KB）。





```
sed -i '/connectionTimeout=/i\  executor="tomcatThreadPool"' /opt/apache/tomcat-8.5.38/conf/server.xml 

<Connector port="8080" protocol="HTTP/1.1" 
  executor="tomcatThreadPool"
  connectionTimeout="20000"   
  redirectPort="8443" />  
```

> connectionTimeout代表连接超时时间，单位为毫秒,默认值为60000。通常情况下设置为30000。

https://tomcat.apache.org/tomcat-8.5-doc/config/http.html



###  cache

/tomcat-8.5.38/conf/context.xml

tomcat8以上对resource采取了cache，而默认的大小是10M



consider increasing the maximum size of the cache



```
sed -i '/^<\/Context>/i\<Resources cachingAllowed="true"  cacheMaxSize="102400" \/>'  /opt/apache/tomcat-8.5.38/conf/context.xml
```

><Resources cachingAllowed="true"  cacheMaxSize="102400" />
>
>context.xml文件内添加到<Context>节点内</Context>
>
>cacheMaxSize值按需设置,单位K , 