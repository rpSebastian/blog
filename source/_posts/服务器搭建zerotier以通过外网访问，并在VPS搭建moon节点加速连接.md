---
title: 服务器搭建zerotier以通过外网访问，并在VPS搭建moon节点加速连接
mathjax: true
date: 2020-01-18 17:13:01
categories:
	- Server
tags:
	- Server
---

## Zerotier

Zerotier利用服务器创建了一个虚拟局域网，所有连接到虚拟局域网的服务器被分配到了一个IP，利用这个IP即可进行点对点的访问。利用Zerotier，即可在没用公网IP的情况下，在外网访问服务器。

### 注册Zerotier并创建虚拟局域网

[Zerotier官网地址](https://xuhang.ink/2019/12/05/%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%90%AD%E5%BB%BAzerotier%E4%BB%A5%E9%80%9A%E8%BF%87%E5%A4%96%E7%BD%91%E8%AE%BF%E9%97%AE%EF%BC%8C%E5%B9%B6%E5%9C%A8VPS%E6%90%AD%E5%BB%BAmoon%E8%8A%82%E7%82%B9%E5%8A%A0%E9%80%9F%E8%BF%9E%E6%8E%A5/my.zerotier.com)，利用邮箱注册用户并登录。

在Networks选项页中单击 “Create a Network”，即可在下方看到创建成功的网络，并会产生1个16位唯一代表这个网络，之后在加入网络时需要用到这个ID。

在网络的设置中有一项Access Control，为了安全起见，设置为PRIVATE，任何加入网络的节点，需要允许才可以访问。

### Ubuntu 配置 Zerotier

#### 安装 Zerotier

> curl -s <https://install.zerotier.com/> | sudo bash

#### 加入虚拟局域网

> sudo zerotier-cli join (network id)

在加入虚拟网后，可以在Zerotier的网络设置页面的Member项中看到连接信息，在左侧打钩以允许访问，其中Managed IPs即为分配到的虚拟局域网中的内网IP。

#### 查看虚拟局域网情况

> sudo zerotier-cli listpeers

其中Leaf是每一个连接节点，Planet是官方设置的转发根服务器，Moon为用户设置的转发服务器。

### VPS 搭建 Moon服务器加速连接

官方设置的转发根服务器速度较慢且不稳定，可以搭建自己的Moon转发服务器来加速访问。

首先需要注册一个VPS，阿里云的服务器或者其他都可以。

#### 安装Zerotier并加入虚拟局域网

与之前相同，输入命令在VPS上安装Zerotier并加入虚拟局域网，然后在配置页面中通过。

#### 生成moon模板

> cd /var/lib/zerotier-one
> zerotier-idtool initmoon identity.public > moon.json

#### **修改moon.json**

编辑 moon.json，将 stableEndpoints 改为 “服务器IP/9993”

> “stableEndpoints”: [ “x.x.x.x/9993” ]

#### 生成签名文件

> zerotier-idtool genmoon moon.json

之后可以看到生成了 000000xxxx.moon 文件。

#### 创建moon网络

在当前目录下创建 moons.d文件，并将 .moon文件拷贝进去

> mkdir moons.d
>
> cp *.moon moons.d

#### 重启服务器

### 本机加入moon节点

在 Zerotier 配置页面中可以看到VPS对应的 10位 Address ID。

在终端中输入

> sudo zerotier-cli orbit (VPSid) (VPSid)

在等待一段时间后，再次查看局域网情况，即可看到增加一条，ID为VPS的ID，最后为 Moon

### 连接远程服务器

远程服务器的配置和本机相同，配置完后利用生成的IP即可进行连接。

> curl -s <https://install.zerotier.com/> | sudo bash
>
> sudo zerotier-cli join (network id)
>
> sudo zerotier-cli orbit (VPSid) (VPSid)

## Reference

[在vps上搭建Zerotier的Moon节点](https://www.lingbaoboy.com/2019/03/vpszerotiermoon.html)

[无公网IP通过ZeroTier方便实现内网穿透](https://blog.whsir.com/post-3685.html)