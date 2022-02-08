#!/bin/bash


#nginx配置路径
nginxConfigPath="/usr/local/nginx/conf/vhost/"
hostPath="/etc/hosts"
demoName="demo"
emptyStr=""
yesFlag="y"
noFlag="n"
basepath=$(cd `dirname $0`; pwd)"/"$(basename $0)
demoContent='
#demo-content-begin
server
{

        listen 80;
        server_name myServerName;
        index index.php index.html index.htm;
        root  myServerRoot;

        include enable-php.conf;

        location / {
                try_files $uri $uri/ /index.php?$query_string;
        }

        location /nginx_status
        {
            stub_status on;
            access_log   off;
        }

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /.well-known {
            allow all;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log  /home/wwwlogs/myServerLog.log;
}
#demo-content-end
'
#声明
echo -e "
1.需要root权限执行这个脚本
2.仅支持通过lnmp一键安装包(https://lnmp.org/)搭建的开发环境\n
3.默认的nginx虚拟机配置路径是: ${nginxConfigPath}\n
4.默认的hosts文件路径是: ${hostPath}\n
5.如果你的nginx配置路径和hosts文件路径和默认的不同,你可以打开这个shell文件修改相应的变量值\n
"

#输入你需要配置的配置名/日志会存到以这个名命名的文件中
read -p "输入nginx的server配置文件的名称(例如:输入'xiaoming',会在vhost目录下生成一个xiaoming.conf的文件):" confName
echo "\n"
if [ "$confName" = "$emptyStr" ]
then
	echo -e "配置文件名不能为空!\n"
	exit
fi

if [ ! -f "$nginxConfigPath$confName.conf" ]
then
	touch $nginxConfigPath$confName".conf"
fi

#输入网站名
read -p "输入网站名(例如: www.example.com):" myWebSiteName
echo "\n"
if [ "$myWebSiteName" = "$emptyStr" ]
then
	echo -e "网站名不能为空!\n"
	exit
fi


#是否配置host文件，如果需要输入ip地址
configHostFlag="N"
read -p "需要在hosts文件添加域名解析吗?(默认是 n)(y/n):" configHostFlag

if [ "$configHostFlag" = "$yesFlag" ]
then
	read -p "输入解析的IP地址(默认是 127.0.0.1):" myWebSiteIP
	echo "\n"
	if [ "$myWebSiteIP" = "" ]
	then
		myWebSiteIP="127.0.0.1"
	fi
fi

#输入项目root路径
read -p "输入root的绝对路径(例如 /home/www/example/public):" myServerRoot
echo "\n"
if [ "$myServerRoot" = "$emptyStr" ]
then
	echo -e "root路径不能为空!\n"
	exit
fi

if [ ! -d "$myServerRoot" ]
then
	echo -e "目录: "$myServerRoot" 不存在!\n"
	exit
fi

#写入host文件
if [ "$configHostFlag" = "$yesFlag" ]
then
	echo -e $myWebSiteIP"    "$myWebSiteName >> $hostPath
fi

#写入nginx配置文件

sed -n '/^#demo-content-begin/,/^#demo-content-end/p' $basepath | sed -e '{s\myServerName\'$myWebSiteName'\g;s\myServerRoot\'$myServerRoot'\g;s\myServerLog\'$confName'\g}' >> $nginxConfigPath$confName".conf"

lnmp restart