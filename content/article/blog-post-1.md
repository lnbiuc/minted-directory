---
card_image: /default_cover.jpg
#featured: true
#tags:
#  - SAAS
---

# Example Blog Post

content of the first blog post. 🌺

> 关于安装使用的用户
> - 安装部分需要使用root用户，服务器使用systemctl运行时需要使用非root用户
> - 后续游戏更新时，需要使用root用户

> 服务器使用的端口
> - 新版游戏只需要开启7777端口的TCP和UDP即可（截至20241207）

> 我的ubuntu系统信息
```txt
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.1 LTS
Release:        24.04
Codename:       noble
```

> 我是用的时物理机安装配置为i9-12900HX，32GB内存，490GB固态
> 游戏时间80小时左右，服务器5人情况下CPU占用16% - 20%，内存占用6-7GB，安装完系统和游戏之后，总占用
17GB磁盘空间，使用frp内网穿透白天在线1-2人，晚上在线4-5人情况下，一天UDP上传流量在1.7-1.8GB左右
>
> 建议磁盘分配30GB以上，否则在使用SteamCMD安装游戏时可能会报错！



## 更新系统软件

```bash
sudo apt-get update
sudo NEEDRESTART_MODE=a apt-get upgrade --yes
```

## 安装SteamCMD

```bash
sudo add-apt-repository multiverse; sudo dpkg --add-architecture i386; sudo apt update
```

```bash
sudo apt install steamcmd
```

## 安装幸福工厂服务器

此指令同样可用于游戏服务端更新（更新前需停止游戏服务器）

```bash
steamcmd +force_install_dir ~/SatisfactoryDedicatedServer +login anonymous +app_update 1690800 -beta experimental validate +quit
```

## 启动服务器

此时服务器文件应该位于root用户目录下，需要将其移动到执行用户目录下，此处使用的用户名为violet，实际使用需要自行替换

```bash
mv /root/SatisfactoryDedicatedServer /home/violet/
```

创建启动脚本

```bash
vi /etc/systemd/system/satisfactory.service
```

写入以下内容

```service
[Unit]
Description=Satisfactory dedicated server
Wants=network-online.target
After=syslog.target network.target nss-lookup.target network-online.target

[Service]
Environment="LD_LIBRARY_PATH=./linux64"

# 每次启动前是否自动更新游戏（推荐关闭，手动执行该指令更新游戏）

# ExecStartPre=/usr/games/steamcmd +force_install_dir /home/violet/SatisfactoryDedicatedServer +login anonymous +app_update 1690800 validate +quit

ExecStart=/home/violet/SatisfactoryDedicatedServer/FactoryServer.sh -ServerQueryPort=15777 -BeaconPort=15000 -Port=7777 -log -unattended -multihome=0.0.0.0

User=violet
Group=violet
StandardOutput=journal
Restart=on-failure
WorkingDirectory=/home/violet/SatisfactoryDedicatedServer


[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable satisfactory
```

切换到非root用户后执行，可能需要输入密码

```bash
sudo systemctl start satisfactory
```

查看状态

```bash
sudo systemctl status satisfactory
```

## 修改服务器人数上限
在该目录下创建文件Game.ini

文件夹没有可以自行创建，注意大小写

```bash
/home/violet/SatisfactoryDedicatedServer/FactoryGame/Saved/Config/LinuxServer
```

创建文件Game.ini，写入以下内容
```ini
[/Script/Engine.GameSession] 
MaxPlayers=30
```

重启服务器

```bash
sudo systemctl restart satisfactory
```
