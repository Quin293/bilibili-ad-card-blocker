# Bilibili 广告卡片屏蔽

移除 Bilibili 首页推荐流中的广告卡片，以及视频播放页右侧的广告卡片；支持滚动加载和动态更新。

## 使用方法

安装 Tampermonkey 等用户脚本管理器后，安装本脚本，再刷新 Bilibili 页面即可。

## 识别范围

- 首页推荐卡片中的 `cm.bilibili.com` 广告链接或“广告”标记。
- 视频页右侧的 `.video-card-ad-small` 广告卡片。
- 广告链接所在的 `.bili-feed-card` 卡片。

只处理上述广告卡片，不处理视频内容中的口播或贴片。Bilibili 页面结构变化可能影响效果。

## 隐私与权限

无远程依赖、不收集数据、不发送网络请求、不读写浏览器存储，使用 `@grant none`。

源码和问题反馈：[GitHub 仓库](https://github.com/Quin293/bilibili-ad-card-blocker)。
