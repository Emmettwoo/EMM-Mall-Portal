#!/usr/bin/env bash
echo "---------- EMM-Ark前端 部署开始 ----------"


echo "1. 清理以前的部署残留"
rm -rf /home/mall/Git/EMM-Mall-Portal/dist
rm -rf /www/server/tomcat/webapps/mall/*.html

echo "2. 进入前端项目目录"
cd /home/mall/Git/EMM-Mall-Portal/

echo "3. 切换git到主分支"
git checkout arknight

echo "4. 更新git的分支信息"
git fetch

echo "5. 拉取git的更新文件"
git pull 

echo "6. 安装nodejs依赖库"
npm install

echo "7. 编译生成dist文件夹"
npm run dist_linux

echo "8. 将view部署到Tomcat"
mv /home/mall/Git/EMM-Mall-Portal/dist/view/* /www/server/tomcat/webapps/mall/

echo "9. 移出旧的resource文件"
rm -rf /www/wwwroot/mall/resource/*

echo "10. 部署新的resource文件"
mv /home/mall/Git/EMM-Mall-Portal/dist/* /www/wwwroot/mall/resource


echo "---------- EMM-Ark前端 部署完成 ----------"