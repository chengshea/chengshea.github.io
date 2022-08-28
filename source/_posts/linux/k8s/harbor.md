---
title: harbor镜像私库
permalink: linux/k8s/harbor/
tags:
  - harbor
categories:
  - linux
  - k8s
date: 2022-08-13 13:47:30
---

## 配置要求

### 硬件

| 资源 | 最低  | 推荐   |
| ---- | ----- | ------ |
| CPU  | 2 CPU | 4 CPU  |
| Mem  | 4 GB  | 8 GB   |
| Disk | 40 GB | 160 GB |



### 软件

docker  v17.06.0-ce+  [Docker 引擎文档](https://docs.docker.com/engine/installation/)

docker-compose v1.18.0+  [Docker Compose 文档](https://docs.docker.com/compose/install/)

OpenSSL



### 网络端口

HTTPS  443/4443

HTTP  80



## 安装

仓库

https://github.com/goharbor/harbor/releases

文档

https://goharbor.io/docs/2.5.3/install-config/download-installer/



### harbor

#### 证书ca.key

https://goharbor.io/docs/2.5.3/install-config/configure-https/

##### 生成CA私钥

```shell
 openssl genrsa -out ca.key 4096
```

<!--more-->

##### 生成CA证书

```shell
 openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=GD/L=SZ/O=cs/OU=shea/CN=k8s.org" \
  -key ca.key \
  -out ca.crtopenssl genrsa -out ca.key 4096
```

#### 服务器证书

##### 生成私钥

```shell
 openssl genrsa -out k8s.org.key 4096
```

##### 生成证书签名请求（CSR）

```shell
openssl  req -sha512 -new \
 -subj "/C=CN/ST=GD/L=SZ/O=cs/OU=shea/CN=k8s.org" \
 -key k8s.org.key \
 -out k8s.org.csr
```

##### 生成一个x509 v3扩展文件

```shell
 cat > v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1=k8s.org
DNS.2=k8s
DNS.3=k8s
EOF
```

##### 使用该v3.ext文件为您的Harbor主机生成证书

```shell
openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in k8s.org.csr \
    -out k8s.org.crt
```



Docker守护程序将.crt文件解释为CA证书，并将.cert文件解释为客户端证书

```shell
openssl x509 -inform PEM -in k8s.org.crt -out k8s.org.cert
```



#### harbor.yml

代理网址 https://ghproxy.com  下载

https://ghproxy.com/https://github.com/goharbor/harbor/releases/download/v2.5.3/harbor-offline-installer-v2.5.3.tgz

```
cs@debian:~/下载/新建文件夹$ md5sum harbor-offline-installer-v2.5.3.tgz 
d858f6969829e4ce2769a790ecaa0cf7  harbor-offline-installer-v2.5.3.tgz

cs@debian:~/下载/新建文件夹$ tar xzvf harbor-offline-installer-v2.5.3.tgz
cs@debian:~/下载/新建文件夹$ tree -L 1 ./harbor
./harbor
├── common.sh
├── harbor.v2.5.3.tar.gz
├── harbor.yml.tmpl
├── install.sh
├── LICENSE
└── prepare

0 directories, 6 files
```



```
sed -n '/hostname/s/reg.mydomain.com/192.168.56.1/'p ./harbor/harbor.yml.tmpl 
hostname: 192.168.56.1
sed -n '/port:/s/443/8443/'p ./harbor/harbor.yml.tmpl 
  port: 8443
sed -n '/certificate:/s/\/your.*path/\/opt\/nginx\/conf\/conf.d\/ssl\/k8s.org.crt/'p ./harbor/harbor.yml.tmpl 
  certificate: /opt/nginx/conf/conf.d/ssl/k8s.org.crt
```

>hostname
>
>https   port ,certificate,private_key
>
>external_url
>
>harbor_admin_password
>
>data_volume
>
>用外部数据库,redis时需要配置 external_database,external_redis 



```
sudo ./install.sh
```

> 默认的 Harbor 安装不包括 Notary 或 Trivy 等服务
>
> ./install.sh --with-notary --with-trivy --with-chartmuseum
>
>  --with-notary  数据权限
>
> --with-trivy   漏洞扫描
>
> --with-chartmuseum helm



### docker

#### certs.d

```shell
tree -L 3 /etc/docker/
/etc/docker/
├── certs.d
│   └── k8s.org
│       ├── ca.crt
│       ├── k8s.org.cert
│       └── k8s.org.key
├── daemon.json
└── key.json

2 directories, 5 files
```

> cp yourdomain.com.cert /etc/docker/certs.d/yourdomain.com/
>cp yourdomain.com.key /etc/docker/certs.d/yourdomain.com/
>cp ca.crt /etc/docker/certs.d/yourdomain.com/



#### daemon.json

```json
{
    "data-root": "/opt/data/docker",
   "registry-mirrors" : [
    "http://hub-mirror.c.163.com"
  ],
"insecure-registries":[
  "https://k8s.org"
  ],
  "debug" : true,
  "experimental" : true
}

```

> insecure-registries 私库地址,非域名格式 ip:端口



#### login

登录密码会保存认证,下次push镜像就不需要输入密码了

```shell
cs@debian:~$ docker login k8s.org
cs@debian:~$ cat  ~/.docker/config.json 
{
	"auths": {
		"cs.org": {
			"auth": "YWRtaW46YWRtaW4="
		},
		"k8s.org": {
			"auth": "YWRtaW46Y3MxMjM0NTY="
		}
	},
	"HttpHeaders": {
		"User-Agent": "Docker-Client/18.09.3 (linux)"
	}
}
```





### nginx

/opt/nginx/conf/conf.d/http/harbor.conf

```
upstream harbors{
     server 192.168.56.1:8443;
     #server 192.168.56.2:8443;
}


log_format  harbor_log  '$remote_addr - $remote_user [$time_local] "$request" '
                     '$status $body_bytes_sent "$http_referer" '
                     '"$http_user_agent" "$http_x_forwarded_for"';


server {
       listen       443 ssl;
       server_name  k8s.org;

        ssl_certificate      conf.d/ssl/k8s.org.crt;
        ssl_certificate_key  conf.d/ssl/k8s.org.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

       access_log  logs/harbors.log  harbor_log;
       location / {
            client_max_body_size  1024m;  # 设置接收客户端 body 最大长度为 1024M
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass https://harbors;
        }
}
```

> error parsing HTTP 413 response body: ...... <title>413 Request Entity Too Large</title>
>
> **client_max_body_size**



## 推送

域名/目录/镜像名:版本号

```shell
$ docker images | grep etcd
k8s.org/k8s/etcd                      3.4.13-0            51401ddb110e        23 months ago       145MB

$ docker push  k8s.org/k8s/etcd:3.4.13-0
```



### 项目 

![](/pics/harbor-01.png)

### 镜像

![](/pics/harbor-02.png)



## 高可用

通过配置数据库(mysql ,redis集群),存储来实现



## ERROR

### pull Retrying in

https://github.com/vmware/harbor/issues/3062

/opt/nginx/conf/nginx.conf

```
http {
    ......
      ####添加以下配置
      proxy_buffers 4 32k;
      proxy_busy_buffers_size 64k;
      proxy_temp_file_write_size 64k;
      #unlimit the proxy temp file size limitaion. Look at issue #3062 (https://github.com/vmware/harbor/issues/3062)
      proxy_max_temp_file_size 0;

  ....      
  }
```



```
http:
  relativeurls: true
```

harbor的helm里需要加上registry.relativeurls=true

参考：https://github.com/docker/distribution/issues/970#issuecomment-284227065



### ImagePullBackOff

#### 创建一个基于现有凭证的 Secret

```
$ kubectl create secret generic login --from-file=.dockerconfigjson=/home/cs/.docker/config.json  --type=kubernetes.io/dockerconfigjson 
secret/login created
```



#### 在命令行上提供凭证来创建 Secret

```
kubectl create secret docker-registry regcred \
--docker-server=<你的镜像仓库服务器> \
--docker-username=<你的用户名> \
--docker-password=<你的密码> \
--docker-email=<你的邮箱地址>
```

>在这里：

>-  是你的私有 Docker 仓库全限定域名（FQDN）。 DockerHub 使用 https://index.docker.io/v1/。
>-  是你的 Docker 用户名。
>-  是你的 Docker 密码。
>-  是你的 Docker 邮箱。

这样你就成功地将集群中的 Docker 凭证设置为名为 regcred 的 Secret

#### 检查 Secret 



```yaml
$ kubectl get secrets
NAME                  TYPE                                  DATA   AGE
login                 kubernetes.io/dockerconfigjson        1      85d
$ kubectl get secret login --output=yaml  
apiVersion: v1
data:
  .dockerconfigjson: ewoJImF1dGhzIjogewoJCSJjcy5vcmciOiB7CgkJCSJhdXRoIjogIllXUnRhVzQ2WVdSdGFXND0iCgkJfSwKCQkiazhzLm9yZyI6IHsKCQkJImF1dGgiOiAiWVdSdGFXNDZZM014TWpNME5UWT0iCgkJfQoJfSwKCSJIdHRwSGVhZGVycyI6IHsKCQkiVXNlci1BZ2VudCI6ICJEb2NrZXItQ2xpZW50LzE4LjA5LjMgKGxpbnV4KSIKCX0KfQ==
kind: Secret
....
```



```
$ kubectl get secret login --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
{
	"auths": {
		"cs.org": {
			"auth": "YWRtaW46YWRtaW4="
		},
		"k8s.org": {
			"auth": "YWRtaW46Y3MxMjM0NTY="
		}
	},
	"HttpHeaders": {
		"User-Agent": "Docker-Client/18.09.3 (linux)"
	}
}
```



```
echo "YWRtaW46Y3MxMjM0NTY=" | base64 --decode 
admin:cs12xx
```



#### pod

创建一个使用你的 Secret 的 Pod

```
apiVersion: v1
kind: Pod
metadata:
  name: private-reg
spec:
  containers:
  - name: private-reg-container
    image: <your-private-image>
  imagePullSecrets:
  - name: login
```

