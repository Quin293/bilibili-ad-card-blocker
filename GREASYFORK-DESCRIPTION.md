# Bilibili 广告屏蔽（精简安全版）

3.1 版使用 CSS 隐藏 Bilibili 首页广告；视频页右侧仅保留推荐列表，并隐藏独立广告位。

## 使用方法

安装 Tampermonkey 等用户脚本管理器后，安装本脚本，再刷新 Bilibili 页面即可。若装过旧版“Bilibili 广告卡片屏蔽”，请停用旧版，避免重复运行。

## 屏蔽范围

- 首页：隐藏包含 `.bili-video-card a[href*="cm.bilibili.com"]` 的 `.bili-feed-card`。
- 右侧：`.rcmd-tab` 的直接子元素仅保留 `.recommend-list-v1`，其余全部隐藏，包括可能存在的非广告模块。
- 独立广告：隐藏 `#slide_ad`、`.slide-ad-exp`、`.video-card-ad-small`、`.strip-ad`、`.strip-ad-inner`。

样式自动作用于随后出现的匹配元素，不删除 DOM，不使用 MutationObserver。首页规则需要浏览器支持 CSS `:has()`。不处理视频内容中的口播或贴片，页面结构变化可能影响效果。

## 隐私与权限

无远程依赖、不收集数据、不发送网络请求、不读写浏览器存储，使用 `@grant none`。

源码和问题反馈：[GitHub 仓库](https://github.com/Quin293/bilibili-ad-card-blocker)。
