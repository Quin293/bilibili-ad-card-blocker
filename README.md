# Bilibili 广告屏蔽（精简安全版）

当前版本：**3.1**。使用 CSS 隐藏 Bilibili 首页广告；视频页右侧仅保留推荐列表，并隐藏独立广告位。

## 安装

推荐通过 [Greasy Fork 脚本页面](https://greasyfork.org/zh-CN/scripts/596146) 点击“安装此脚本”。

也可以从 GitHub 安装：

1. 在浏览器中安装 [Tampermonkey](https://www.tampermonkey.net/)。
2. 点击 [安装脚本](https://raw.githubusercontent.com/Quin293/bilibili-ad-card-blocker/main/bilibili-ad-card-blocker.user.js)。
3. 在脚本管理器弹出的页面中确认安装，然后刷新 Bilibili 页面。

如果浏览器只显示源代码，可以复制 `bilibili-ad-card-blocker.user.js` 的全部内容，在 Tampermonkey 的“添加新脚本”中替换默认内容并保存。

从本仓库 1.2.x 版升级时，由于脚本名称和 namespace 已改变，安装后请停用旧的“Bilibili 广告卡片屏蔽”，避免两个版本同时运行。

## 屏蔽规则

- 首页：隐藏包含 `.bili-video-card a[href*="cm.bilibili.com"]` 的 `.bili-feed-card`。
- 右侧推荐区：在 `.rcmd-tab` 的直接子元素中，仅保留 `.recommend-list-v1`，其他直接子元素全部隐藏。
- 独立广告位：隐藏 `#slide_ad`、`.slide-ad-exp`、`.video-card-ad-small`、`.strip-ad` 和 `.strip-ad-inner`。

脚本注入一份样式，通过 `display: none !important` 隐藏元素，不删除 DOM，不使用 MutationObserver。样式也适用于随后出现的匹配元素。首页规则需要浏览器支持 CSS `:has()`。

脚本只处理上述页面元素，不处理视频内容中的口播或贴片。右侧规则会隐藏推荐列表之外的所有直接子元素，包括可能存在的非广告模块；Bilibili 页面结构调整后可能需要更新选择器。

## 隐私

脚本不发送网络请求、不收集数据、不读写浏览器存储、不加载远程依赖；使用 `@grant none`，在 `https://www.bilibili.com/*` 运行。

## 3.1 更新

- 改用用户提供的精简 CSS 版本，保留其选择器和执行逻辑。
- 修正粘贴内容中混入元数据的 Markdown 链接，移除代码围栏。
- 同步更新脚本名称、namespace 和版本号。

## 本地验证

运行 `node --check bilibili-ad-card-blocker.user.js` 检查语法。运行 `node verify.cjs`，再打开 `http://127.0.0.1:18763`，可在浏览器中验证 CSS 隐藏效果、推荐列表保留、DOM 保留和动态元素匹配。

模拟页面验证不等同于当前 Bilibili 真实页面实测。

## 反馈

请通过 [GitHub Issues](https://github.com/Quin293/bilibili-ad-card-blocker/issues) 提交问题，并说明页面类型、浏览器、脚本版本以及可复现步骤。

本仓库未指定开源许可证。
