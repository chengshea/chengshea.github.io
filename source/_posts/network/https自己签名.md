---
title: https签名
date: 2016-12-03 23:36:33
tags:
    - https
    - 签名
categories:
    - http协议
    - https
    
---
#### 为服务器端和客户端准备公钥、私钥
```
#私钥
>openssl genrsa -out server.key 1024 -config E:\Git\mingw64\ssl\openssl.cnf
```
```
#公钥
>openssl rsa -in server.key -pubout -out server.pem
```
#### 生成 CA 证书
```
 <!--more--> 
#ca私钥
>openssl genrsa -out ca.key 1024 -config E:\Git\mingw64\ssl\openssl.cnf
```
 **第一次填写信息**
```
>openssl req -new -key ca.key -out ca.csr -config E:\Git\mingw64\ssl\openssl.cnf
```

Country Name (2 letter code) [AU]:
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
**Common Name** (e.g. server FQDN or YOUR name) []:localhost
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:12345678
An optional company name []:cs

```
>openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt -days 365
```

#### 生成服务器端证书
服务器端需要向 CA 机构申请签名证书，在申请签名证书之前依然是创建自己的 CSR 文件  **与第一次信息填写一样**
```
>openssl req -new -key server.key -out server.csr -config E:\Git\mingw64\ssl\openssl.cnf
```
向自己的 CA 机构申请证书，签名过程需要 CA 的证书和私钥参与，最终颁发一个带有 CA 签名的证书
```
>openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial -in server.csr -out server.crt
```
Signature ok
subject=/C=AU/ST=Some-State/O=Internet Widgits Pty Ltd/CN=localhost
Getting CA Private Key


#### 生成cer文件
使用openssl 进行转换
```
>openssl x509 -in server.crt -out server.cer -outform der
```

 生成p12
```
F:\logs\http>openssl pkcs12 -export -clcerts -in server.crt -inkey server.key -out client.p12
WARNING: can't open config file: /usr/local/ssl/openssl.cnf
Loading 'screen' into random state - done
Enter Export Password:12345678
Verifying - Enter Export Password:12345678
```

