# Bilibili 广告卡片屏蔽

适用于 Tampermonkey（篡改猴）的用户脚本，移除 Bilibili 首页推荐流广告卡片和视频播放页右侧广告卡片，支持动态加载。

## 安装

1. 在浏览器中安装 [Tampermonkey](https://www.tampermonkey.net/)。
2. 点击 [安装脚本](https://raw.githubusercontent.com/Quin293/bilibili-ad-card-blocker/main/bilibili-ad-card-blocker.user.js)。
3. 在脚本管理器弹出的页面中确认安装，然后刷新 Bilibili 页面。

如果浏览器只显示源代码，可以复制 `bilibili-ad-card-blocker.user.js` 的全部内容，在 Tampermonkey 的“添加新脚本”中替换默认内容并保存。

## 屏蔽规则

- 首页：检查 `.bili-video-card.is-rcmd:not(.enable-no-interest)`，发现 `cm.bilibili.com` 广告链接或“广告”标记时，删除所属推荐卡片。
- 视频播放页：删除 `.video-card-ad-small`。
- 兜底：删除 `cm.bilibili.com` 链接所属的 `.bili-feed-card` 或 `.video-card-ad-small`。
- 监听新增节点、链接和样式类变化、广告文字更新；同时检查新增节点本身，避免漏检。

此脚本仅移除符合上述规则的页面元素，不处理视频内容中的口播、贴片或所有类型的商业推广。Bilibili 页面结构调整后，规则可能需要更新。

## 隐私

脚本不发送网络请求、不收集数据、不读写浏览器存储、不加载远程依赖；使用 `@grant none`，仅在 `https://www.bilibili.com/*` 的顶层页面运行。

## 1.2.0 更新

- 修正元数据中混入的 Markdown 链接和代码围栏。
- 修复动态新增广告节点本身、已有卡片后补广告内容的漏检。
- 校验广告链接的实际域名，避免仅因链接参数包含广告域名而误删。
- 移除重复日志，按每批 DOM 变化去重处理候选元素。

## 反馈

请通过 [GitHub Issues](https://github.com/Quin293/bilibili-ad-card-blocker/issues) 提交问题，并说明页面类型、浏览器、脚本版本以及可复现步骤。

## 本地验证

运行 `node --check bilibili-ad-card-blocker.user.js` 检查语法。运行 `node verify.cjs`，再打开 `http://127.0.0.1:18763`，可在浏览器中执行 16 项模拟 DOM 验证，涵盖广告移除、动态更新和普通卡片保留。

这些验证不等同于当前 Bilibili 真实页面实测。

本仓库未指定开源许可证。
