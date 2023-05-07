---
title: zimfw shell
permalink: linux/shell/zimfw/
tags:
  - zimfw
  - shell
  - zsh
categories:
  - linux
  - shell
  - zimfw
date: 2023-04-08 18:46:37
---

## zsh



```
sudo apt install zsh

#zsh替换为你的默认shell
chsh -s $(which zsh)
```







## zimfw

### Automatic installation

https://ghproxy.com/https://raw.githubusercontent.com/zimfw/install/master/install.zsh

<!--more-->

```
curl -fsSL https://raw.githubusercontent.com/zimfw/install/master/install.zsh | zsh
```

>) Using Zsh version 5.8
>) ZIM_HOME not set, using the default one.
>密码：
>) Changed your default shell to /usr/bin/zsh
>! You seem to be already calling compinit in /etc/zsh/zshrc. Please remove it, because Zim's completion module will call compinit for you.
>) Downloaded the Zim script to /home/cs/.zim/zimfw.zsh
>) Prepended Zim template to /home/cs/.zimrc
>) Prepended Zim template to /home/cs/.zshrc
>
>.
>
>.
>
>.



### Manual installation

`~/.zshrc`

```
ZIM_HOME=~/.zim

https://github.com/zimfw/zimfw/releases/latest/download/zimfw.zsh
```

>$ cat ~/.zshrc  | grep zstyle
>#zstyle ':zim:zmodule' use 'degit'
>#zstyle ':zim:git' aliases-prefix 'g'
>#zstyle ':zim:input' double-dot-expand yes
>#zstyle ':zim:termtitle' format '%1~'



`~/.zimrc`

<p id="zim-modules" >~/.zim/modules/</p>

>$ cat ~/.zimrc  | grep zmodule
>zmodule environment
>zmodule git
>zmodule input
>zmodule termtitle
>zmodule utility
>zmodule duration-info
>zmodule git-info
>zmodule asciiship
>zmodule zsh-users/zsh-completions --fpath src
>zmodule completion
>zmodule zsh-users/zsh-syntax-highlighting
>zmodule zsh-users/zsh-history-substring-search
>zmodule zsh-users/zsh-autosuggestions



### Uninstalling



```
#rm -rf ~/.zim ~/.zimrc
```

>$ ls -l ~/.z*
>-rw------- 1 cs cs 1574  4月  8 18:54 /home/cs/.zimrc
>-rw------- 1 cs cs 3587  4月  8 18:54 /home/cs/.zshrc
>
>/home/cs/.zim:
>总用量 40
>drwxr-xr-x 15 cs cs  4096  4月  8 19:23 modules
>-rw-r--r--  1 cs cs 36117  4月  8 18:54 zimfw.zsh



## modules

[zimrc add zmodule](#zim-modules)

### autojump

https://github.com/wting/autojump

```
sudo apt install autojump
```

> /usr/share/doc/autojump/README.Debian

autojump 将只跳到先前 `cd` 命令到过的目录

j

```
❯ j k8s
/home/cs/oss/k8s-1.26
❯ j w k8s   #权限小的目录
/home/cs/data/VM/k8s

```







#### stat 

选项可以查看访问过的目录权重

```
❯ j --stat
10.0:	/home/cs/data/VM/k8s
14.1:	/home/cs/oss/k8s-1.26
14.1:	/opt/tools
20.0:	/home/cs/oss/hexo
________________________________________

58:	 total weight
4:	 number of entries
10.00:	 current directory weight

data:	 /home/cs/.local/share/autojump/autojump.txt  #统计存储日志

```



### fzf

https://github.com/junegunn/fzf#examples

```
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
```

>Downloading bin/fzf ...
>  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
>                                 Dload  Upload   Total   Spent    Left  Speed
>  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
>100 1340k  100 1340k    0     0   5941      0  0:03:50  0:03:50 --:--:--  7241
>  - Checking fzf executable ... 0.39.0
>Do you want to enable fuzzy auto-completion? ([y]/n) y
>Do you want to enable key bindings? ([y]/n) y
>
>Generate /home/cs/.fzf.bash ... OK
>Generate /home/cs/.fzf.zsh ... OK
>
>Do you want to update your shell configuration files? ([y]/n) y
>
>Update /home/cs/.bashrc:
>  - [ -f ~/.fzf.bash ] && source ~/.fzf.bash
>    + Added
>
>Update /home/cs/.zshrc:
>  - [ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
>    + Added
>
>Finished. Restart your shell or reload config file.
>   source ~/.bashrc  # bash
>   source ~/.zshrc   # zsh
>
>Use uninstall script to remove fzf.
>
>For more information, see: https://github.com/junegunn/fzf



### fzf-tab

~/.zimrc

```
git clone --depth 1 https://github.com/Aloxaf/fzf-tab.git  /.zim/modules/fzf-tab
#fzf-tab ALSO needs fzf installed
zmodule Aloxaf/fzf-tab
```



```
# disable sort when completing `git checkout`
zstyle ':completion:*:git-checkout:*' sort false
# set descriptions format to enable group support
zstyle ':completion:*:descriptions' format '[%d]'
# set list-colors to enable filename colorizing
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
# preview directory's content with exa when completing cd
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'exa -1 --color=always $realpath'
# switch group using `,` and `.`
zstyle ':fzf-tab:*' switch-group ',' '.'
```

https://github.com/Aloxaf/fzf-tab/wiki/Configuration





### powerlevel10k

doc https://github.com/romkatv/powerlevel10k#installation

```
#add ~/.zimrc
zmodule romkatv/powerlevel10k
```

>/home/cs/.zim/modules/powerlevel10k



#### p10k安装

```
p10k configure
```

> New config: ~/.p10k.zsh.
> Backup of ~/.zshrc: /tmp/.zshrc.JO4Ns3iulN.
>
> See ~/.zshrc changes:
>
>   diff /tmp/.zshrc.JO4Ns3iulN ~/.zshrc
>
> File feature requests and bug reports at
> https://github.com/romkatv/powerlevel10k/issues









#### font

https://www.nerdfonts.com/font-downloads

https://github.com/ryanoasis/nerd-fonts/releases/tag/v2.3.3







#### icons

https://www.nerdfonts.com/cheat-sheet

~/.p10k.zsh

````
POWERLEVEL9K_BATTERY_CHARGING='yellow'
POWERLEVEL9K_BATTERY_CHARGED='green'
POWERLEVEL9K_BATTERY_DISCONNECTED='$DEFAULT_COLOR'
POWERLEVEL9K_BATTERY_LOW_THRESHOLD='10'
POWERLEVEL9K_BATTERY_LOW_COLOR='red'
POWERLEVEL9K_BATTERY_ICON='\uf1e6 '
POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX=''
POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX='\uf0da'
#POWERLEVEL9K_VCS_GIT_ICON='\ue60a'

POWERLEVEL9K_VCS_MODIFIED_BACKGROUND='yellow'
POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND='yellow'
#POWERLEVEL9K_VCS_UNTRACKED_ICON='?'

POWERLEVEL9K_SHORTEN_STRATEGY="truncate_middle"
POWERLEVEL9K_SHORTEN_DIR_LENGTH=4

#POWERLEVEL9K_CUSTOM_TIME_FORMAT="%D{\uf017 %H:%M:%S}"
POWERLEVEL9K_TIME_FORMAT="%D{\uf017 %H:%M \uf073 %d.%m.%y}"

POWERLEVEL9K_STATUS_VERBOSE=false

POWERLEVEL9K_PROMPT_ON_NEWLINE=true
````





### exa

代替ls

https://github.com/ogham/exa/releases/tag/v0.10.1

```
❯ exa -lh -T --icons ./
```

> - **-T**, **--tree**: 递归到树视图中的子目录
> - **--icons**: 显示图标



```
❯ exa -lh -T  --icons ./   -L 1
```

>- **-L**, **--level=(depth)**: 限制递归的深度
>- **-D**, **--only-dirs**: 只列出目录





```
debian# ln -s /home/cs/.zshrc /root/.zshrc
debian# ln -s /home/cs/.zimrc /root/.zimrc

debian# ln -s /home/cs/.fzf.zsh /root/.fzf.zsh     
debian# ln -s /home/cs/.p10k.zsh /root/.p10k.zsh
debian#
debian# ln -s /home/cs/.zim/modules  /root/.zim/modules

```

>lrwxrwxrwx 1 root root     15  4月 15 20:05 /root/.zimrc -> /home/cs/.zimrc
>lrwxrwxrwx 1 root root     15  4月 15 20:05 /root/.zshrc -> /home/cs/.zshrc
>
>lrwxrwxrwx 1 root root  18  4月 15 20:07 /root/.p10k.zsh -> /home/cs/.p10k.zsh
