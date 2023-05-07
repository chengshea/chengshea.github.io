---
title: venv虚拟环境
permalink: lang/python/venv/
tags:
  - venv
  - environment
  - virtual
categories:
  - lang
  - python
  - venv
date: 2023-03-27 22:55:52
---

### venv



https://docs.python.org/zh-cn/3/library/venv.html

```
python -m venv -h

python -m venv /path/to/new/virtual/environment

source <venv>/bin/activate
```



```
python3 -m venv /opt/stable-diffusion/sd-venv

#激活虚拟环境
source /opt/stable-diffusion/sd-venv/bin/activate
```

>(sd-venv) cs@debian:/opt/stable-diffusion/



```
#查看当前pip源
pip config list
#pip config set global.index-url 源网址

pip install -r requirements.txt

#已经安装的包以requirements的格式
pip freeze



pip wheel -w ./tmp_dir -r requirements.txt
pip download  -d ./tmp_dir -r requirements.txt
pip install -no-index --find-links=./tmp_dir   -r requirements.txt
```





```
#停止使用虚拟环境
source /opt/stable-diffusion/sd-venv/bin/deactivate
```



<!--more-->



##

    if torch.cuda.is_available():
      device = torch.device('cuda')
    else:
      device = torch.device('cpu')
      
    #等价  
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')



```
source /home/cs/data/sd-venv/bin/activate

sudo python setup.py install --prefix /home/cs/.local

python setup.py install --prefix /home/cs/stable-diffusion-webui/venv
```



7z x yajiu.7z 





#### python wheel 安装包的制作与安装

http://coolpython.net/informal_essay/20-09/python-wheel-make-and-install.html
