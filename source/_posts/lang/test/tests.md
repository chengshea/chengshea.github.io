---
title: 前置操作/后置操作
permalink: lang/test/tests/
tags:
  - api
  - request
  - response
categories:
  - lang
  - test
date: 2022-08-27 23:24:33
---

postman **https://learning.postman.com/docs/writing-scripts/intro-to-scripts/**

设置变量 {{变量名}}，可用于Pre-request Script，Body，request url ,Tests...



### 前置操作

Pre-request-script

![](/pics/test-2022-08-31-21-02.gif)

body 的json串在图片上仅为展示可以设置变量

#### 设置变量

 <!--more--> 

##### 字符串

```js
var url = "scripts/pre-request-script"; 
pm.environment.set("example", url.split("/")[0]);
pm.environment.set("function", url.split("/")[1]);
```

>环境变量 environment ；例如:测试,预发,生产url
>
>全局变量 globals；例如:登录token

##### 非字符串

对于数组和对象需要 JSON.stringify() 转换成字符串

###### 设置

```js
var array = [1, 2, 3, 4];
pm.environment.set('array', JSON.stringify(array));

var obj = { a: [1, 2, 3, 4], b: { c: 'val' } };
pm.environment.set('obj', JSON.stringify(obj));
```



###### 读取

```js
try {
  var array = JSON.parse(pm.environment.get('array'));
  var obj = JSON.parse(pm.environment.get('obj'));
} catch (e) {
  // 处理异常
}
```





### 后置操作

Tests  

#### 设置token

返回请求头toekn写入环境变量,给其他接口调用

![](/pics/test-2022-08-28-14-48.gif)

```js
//获取返回header信息,如“Authorization”,"X-Subject-Token"
var token = pm.response.headers.get("X-Subject-Token");
console.log(token)
pm.environment.set("token",token)
```



```js
var tk = JSON.parse(responseBody);//pm.response.json();
pm.globals.set("token", tk.data.Token)
```

>{
>
>   "code":200,
>
>​    "data":{
>
>​         "Token":"xxxxxxxxxxxx",
>
>​         "Expired-in":720000
>
>​    }
>
>}



```js
var type = pm.response.headers.get("Content-Type");
pm.test('返回类型', function() {
  pm.expect(type).to.be.contain("text/html");
});
pm.test('返回结果状态码正常', function() {
  pm.response.to.have.status(200);
});
```

>expect  运行结果    期望结果
>
>