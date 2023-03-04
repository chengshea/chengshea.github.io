---
title: singleton单例模式
permalink: other/design-pattern/singleton/
tags:
  - singleton
categories:
  - design-pattern
date: 2022-07-13 21:03:13
---



## 懒汉  

 **第一次调用时实例化**

```
public class LHanDanli {
//定义一个私有类变量来存放单例，私有的目的是指外部无法直接获取这个变量，而要使用提供的公共方法来获取
private static LHanDanli dl = null;
//定义私有构造器，表示只在类内部使用，亦指单例的实例只能在单例类内部创建
private LHanDanli(){}
//定义一个公共的公开的方法来返回该类的实例，由于是懒汉式，需要在第一次使用时生成实例，所以为了线程安全，使用synchronized关键字来确保只会生成单例
public static synchronized LHanDanli getInstance(){
if(dl == null){
dl = new LHanDanli();
}
return dl;
}
}
```
## 双重判断  

不用每次获取对象都加锁
volatile  屏蔽虚拟机代码优化(代码执行顺序)，运行效率会成问题

```
public class SLHanDanli {
private static volatile SLHanDanli dl = null;
private SLHanDanli(){}
public static SLHanDanli getInstance(){
if(dl == null){
          synchronized (SLHanDanli.class) {
       if(dl == null){
    dl = new SLHanDanli();
}
}
 }
return dl;
}
}
`

```

## 饿汉   

加载类内就实例化

<!--more-->

```
public class EHanDanli {
//此处定义类变量实例并直接实例化，在类加载的时候就完成了实例化并保存在类中
private static EHanDanli dl = new EHanDanli();
//定义无参构造器，用于单例实例
private EHanDanli(){}
//定义公开方法，返回已创建的单例
public static EHanDanli getInstance(){
    return dl;
}
}

```
会有占用空间的问题存在







## 静态内部类 

类加载机制   只有在调用时，才会加载实例，
静态实例化``jvm线程安全``

```
public class ClassInnerClassDanli {
    public static class DanliHolder{
        private static ClassInnerClassDanli dl = new ClassInnerClassDanli();
    }
    private ClassInnerClassDanli(){}
        public static ClassInnerClassDanli getInstance(){
                return DanliHolder.dl;
        }
    }
}
```
