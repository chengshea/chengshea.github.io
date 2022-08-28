---
title: redis集群
permalink: linux/k8s/redis/
tags:
  - redis
  - redis-cluster
categories:
  - linux
  - k8s
date: 2022-07-17 21:05:54
---



### pod

```
kubectl -n devops get pods
NAME          READY   STATUS    RESTARTS   AGE
redis-app-0   1/1     Running   0          50m
redis-app-1   1/1     Running   0          50m
redis-app-2   1/1     Running   0          44m
redis-app-3   1/1     Running   0          38m
redis-app-4   1/1     Running   0          38m
redis-app-5   1/1     Running   0          38m

kubectl -n devops exec -it redis-app-2 /bin/bash
kubectl -n devops exec -it redis-app-4 /bin/bash
```

redis-cli -c -p 6379

![](/pics/k8s-redis-c-set01.png)



### svc ClusterIP

两次认证?

```
cs@debian:~/oss/hexo$ kubectl get svc -n devops
NAME                     TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)              AGE
jenkins                  ClusterIP   121.21.92.146    <none>        8081/TCP,50000/TCP   105d
redis-headless-service   ClusterIP   None             <none>        6379/TCP             13d
redis-service            ClusterIP   121.21.24.33     <none>        6379/TCP             13d
tomcat                   ClusterIP   121.21.191.100   <none>        8082/TCP             105d

cs@debian:~/oss/hexo$ kubectl exec -it redis-app-1 -n devops  /bin/bash
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl kubectl exec [POD] -- [COMMAND] instead.
.............
root@redis-app-1:/data# redis-cli  -c -h 121.21.24.33 -p 6379
121.21.24.33:6379> auth 123456
OK
121.21.24.33:6379> ping
PONG
121.21.24.33:6379> get test21
-> Redirected to slot [8530] located at 121.21.35.3:6379
(error) NOAUTH Authentication required.  
121.21.35.3:6379> auth 123456
OK
121.21.35.3:6379> get test21
"20220721cs"
```







traefik  deploay  配置 redis

```
cs@debian:/opt/kubernetes/yaml/k8s/tcp/redis$ redis-cli  -c  -p  6379
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> ping
PONG
```

>127.0.0.1 - 192.168.56.103:6379, 192.168.56.101:6379, 192.168.56.102:6379 - [19/Jul/2022:22:10:12 +0800] 200 0, 0, 82



### 不通超时

![](/pics/k8s-redis-timeout.png)



![](/pics/k8s-redis-c-set02.png)

根据podip定位集群pod

```
cs@debian:~/oss/hexo$  kubectl  get pod --field-selector status.podIP=121.21.35.3 -o wide -n devops
NAME          READY   STATUS    RESTARTS   AGE   IP            NODE     NOMINATED NODE   READINESS GATES
redis-app-1   1/1     Running   1          9d    121.21.35.3   node04   <none>           <none>
```

