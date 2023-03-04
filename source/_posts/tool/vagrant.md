---
title: vagrant
permalink: tool/vagrant/
tags:
  - vagrant
  - vm
  - batch
categories:
  - tool
  - vagrant
date: 2022-11-26 22:52:41
---

doc https://developer.hashicorp.com/vagrant/docs

## box

kvm libvirt

virtualbox

https://app.vagrantup.com/boxes/search

```
$ vagrant box list
centos/7 (libvirt, 7.1.0)
centos/7 (virtualbox, 7.1.0)

```



### add

`**`vagrant box add metadata.json`**`

```
cat >metadata.json <<EOF
{
    "name": "centos/7",
    "versions": [{
        "version": "7.1.0",
        "providers": [{
            "name": "virtualbox",
            "url": "file:///home/cs/data/VM/VirtualBox/CentOS-7-x86_64-Vagrant-2004_01.VirtualBox.box"
        }]
    }]
}
EOF
```



<!--more-->

### init

生成Vagrantfile模板文件 **`vagrant init centos/7`**



#### Vagrantfile

https://developer.hashicorp.com/vagrant/docs/vagrantfile/version

```
ENV["LC_ALL"] = "en_US.UTF-8"

Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
 
  config.vm.provider :virtualbox do |v|
    v.memory = 1024
    v.cpus = 1
          ##修改为具有 50% 的主机 CPU 执行上限
    v.customize ["modifyvm", :id, "--cpuexecutioncap", "50"]
  end

  ##是否使用公私钥来登录,默认true
  config.ssh.insert_key = false
  config.ssh.private_key_path = [ 
    '~/.ssh/id_rsa', 
    '~/.vagrant.d/insecure_private_key' 
    ] 
    config.vm.provision 'file', 
    source: '~/.ssh/id_rsa.pub', 
    destination: '~/.ssh/authorized_keys' 

  # 激活hostmanager插件
  config.hostmanager.enabled = true

  # 在宿主机上的hosts文件中添加虚拟机的主机名解析信息
  config.hostmanager.manage_host = true

  # 在各自虚拟机中添加各虚拟机的主机名解析信息
  config.hostmanager.manage_guest = true

  #不忽略私有网络的地址
  config.hostmanager.ignore_private_ip = false

    config.vm.define "master11" do |node|
            node.vm.hostname = "master11"
            node.vm.network "private_network", ip: "192.168.56.111", hostname: true
    end  
    
     config.vm.provision "shell", path: "k8s.sh"
 
end
```



根据文件创建虚拟机`vagrant up`



https://www.jianshu.com/p/120c4380c69c
