# 绘语AI

<p align="center">
    <img src="./docs/icon.png" alt="Huiyu logo" style="width: 200px; height: 200px">
</p>
<p align="center">
    <img src="https://img.shields.io/badge/Node.js-16-brightgreen">
    <img src="https://img.shields.io/badge/uview--ui-1.8.4-blue">
    <img src="https://img.shields.io/badge/Vue-2.6.11-brightgreen">
    <img src="https://img.shields.io/badge/license-MIT-blue">
    <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FHuiyuAI%2Fhuiyu-cloud&count_bg=%2344CC11&title_bg=%23555555&title=hits&edge_flat=false">
</p>



## 绘语AI 是什么？

绘语AI是一套面向普通用户，提供 Stable Diffusion AI绘画功能的程序，现已支持微信小程序端，并有完善的Web后台管理界面。

模块结构分为：

- **uniapp用户端（已支持微信小程序） - 本仓库**
- [后端服务](https://github.com/HuiyuAI/huiyu-cloud)
- [Web后台管理](https://github.com/HuiyuAI/huiyu-web-admin)
- [SD调用端（对接 Stable Diffusion API 的程序）](https://github.com/HuiyuAI/huiyu-sdapi)



## 功能预览

微信小程序端：

|            首页             |            画夹             |            广场             |            我的             |
| :-------------------------: | :-------------------------: | :-------------------------: | :-------------------------: |
| ![](./docs/wxminiapp/1.jpg) | ![](./docs/wxminiapp/2.jpg) | ![](./docs/wxminiapp/3.jpg) | ![](./docs/wxminiapp/4.jpg) |
|      **画夹作品详情**       |      **广场作品详情**       |        **积分记录**         |        **个人信息**         |
| ![](./docs/wxminiapp/5.jpg) | ![](./docs/wxminiapp/6.jpg) | ![](./docs/wxminiapp/7.jpg) | ![](./docs/wxminiapp/8.jpg) |



Web管理端：

| ![](./docs/web/1.jpg)  | ![](./docs/web/2.jpg)  |
| ---------------------- | ---------------------- |
| ![](./docs/web/3.jpg)  | ![](./docs/web/4.jpg)  |
| ![](./docs/web/5.jpg)  | ![](./docs/web/6.jpg)  |
| ![](./docs/web/7.jpg)  | ![](./docs/web/8.jpg)  |
| ![](./docs/web/9.jpg)  | ![](./docs/web/10.jpg) |
| ![](./docs/web/11.jpg) | ![](./docs/web/12.jpg) |



QQ机器人功能预览：

<img src="./docs/qqbot/1.jpg" style="width: 70%">



## 功能特性

参见[后端服务](https://github.com/HuiyuAI/huiyu-cloud)



## 快速开始

> [!NOTE]
>
> 如需完整运行所有模块，强烈建议有 Stable Diffusion 相关的安装、使用经验者尝试
>
> 以下仅包括**uniapp用户端 - 本仓库**的运行方式，其它模块请看：
>
> - [后端服务](https://github.com/HuiyuAI/huiyu-cloud)
> - [Web后台管理](https://github.com/HuiyuAI/huiyu-web-admin)
> - [SD调用端](https://github.com/HuiyuAI/huiyu-sdapi)

**本模块非 HBuilder 项目，是以 npm 创建的项目**

1. 将 `/src/manifest.json` 中的 `mp-weixin.appid` 修改为自己的微信小程序 AppID
2. 将 `/src/config.js` 中的 `baseServerUrl` 与后端服务的网关 `Gateway8000` 地址保持一致
3. 将 `/src/config.js` 中的 `shareAppImageUrlList` 修改为可公网访问的图片，推荐长宽比5:4（可选操作，用于小程序分享给好友时卡片展示的内容）
4. 安装依赖 `npm install`
5. 本地运行 `npm run dev:mp-weixin`
6. 打开微信开发者工具，导入项目目录 `/dist/dev/mp-weixin` 

>  如需构建静态资源 `npm run build:mp-weixin`





## 常见问题

参见[后端服务](https://github.com/HuiyuAI/huiyu-cloud)





## LICENSE

[MIT](https://github.com/HuiyuAI/huiyu-uniapp/blob/master/LICENSE)

















