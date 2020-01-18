---
title: 服务器搭建jupyter notebook
mathjax: true
date: 2020-01-18 17:00:05
categories: 
	- server
tags:
---

### anaconda 创建环境并激活

```bash
conda create -n envName python=3.7
conda activate envName
```

### 生成密码

```bash
jupyter notebook password
```

输入两次密码后，加密值保存在 .jupyter/jupyter_notebook_config.json

### 修改配置文件

```bash
vim ~/.jupyter/jupyter_notebook_config.json
```

修改为

```bash
{
  "NotebookApp": {
    "password": "sha1: ***",
    "ip": " Server IP",
    "open_browser": false,
    "port": 9000
  }
}
```

### 后台运行jupyter

在终端中输入

```
nohup jupyter notebook >/tmp/tmp.file 2>&1 &
```

- nohup 表示将任务挂起
- 最后的& 表示在后台运行，只加该符号而不加nohup，任务会在终端关闭后停止
- 2>&1 表示将错误输出流写入到标准输出流。
- \>/tmp/tmp.file 表示将标准输出流写入到文件

可以在浏览器通过服务器IP+端口号进行访问。

### 添加anaconda内核

```bash
conda install ipykernel 
python -m ipykernel install --user --name envName --display-name "envName"
```

### Reference

<https://jupyter-notebook.readthedocs.io/en/latest/public_server.html#notebook-server-security>

<https://www.cnblogs.com/yinzm/p/7881328.html>

