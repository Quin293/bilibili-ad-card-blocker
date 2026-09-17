// 本地浏览器验证：node verify.cjs；打开 http://127.0.0.1:18763。
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<title>Bilibili 广告脚本回归验证</title>
<body><h1>Bilibili 广告脚本回归验证</h1><pre id="results">运行中…</pre>
<section id="fixture">
<div class="bili-feed-card" id="initial-ad"><div class="bili-video-card is-rcmd"><span class="bili-video-card__stats--text">广告</span></div></div>
<div class="bili-feed-card" id="initial-normal"><div class="bili-video-card is-rcmd"><a href="https://www.bilibili.com/video/BVexample">普通视频</a></div></div>
<div class="video-card-ad-small" id="initial-sidebar">侧栏广告</div>
<div class="strip-ad" id="initial-strip"><div class="strip-ad-inner">条状广告</div></div>
</section>
<script src="/bilibili-ad-card-blocker.user.js"></script>
<script>
(async () => {
    const fixture = document.querySelector('#fixture');
    const results = [];
    const settle = () => new Promise(resolve => setTimeout(resolve, 0));
    const exists = id => !!document.getElementById(id);
    const check = (name, ok) => results.push({ name, ok });
    const insert = async html => {
        fixture.insertAdjacentHTML('beforeend', html);
        await settle();
    };
    check('初始首页广告被移除', !exists('initial-ad'));
    check('初始普通视频保留', exists('initial-normal'));
    check('初始侧栏广告被移除', !exists('initial-sidebar'));
    check('初始条状广告连同外层容器被移除', !exists('initial-strip'));
    await insert('<div class="video-card-ad-small" id="root-ad">动态侧栏广告</div>');
    check('新增节点本身是广告时被移除', !exists('root-ad'));
    await insert('<div class="bili-feed-card" id="link-ad"><a href="https://cm.bilibili.com/example">广告链接</a></div>');
    check('广告链接兜底移除卡片', !exists('link-ad'));
    await insert('<div class="bili-feed-card" id="query-normal"><a href="https://www.bilibili.com/video/BVx?ref=cm.bilibili.com">普通链接</a></div>');
    check('仅参数含广告域名的普通链接保留', exists('query-normal'));
    await insert('<div class="bili-feed-card" id="host-normal"><a href="https://cm.bilibili.com.example.org/">不同域名</a></div>');
    check('相似域名链接保留', exists('host-normal'));
    await insert('<div class="bili-video-card is-rcmd" id="standalone-ad"><span class="bili-video-card__stats--text">广告</span></div>');
    check('没有外层容器的广告卡片被移除', !exists('standalone-ad'));
    await insert('<div class="bili-feed-card" id="late-content"><div class="bili-video-card is-rcmd" id="late-card"></div></div>');
    document.querySelector('#late-card').insertAdjacentHTML('beforeend', '<span class="bili-video-card__stats--text">广告</span>');
    await settle();
    check('已有卡片后补广告标记被移除', !exists('late-content'));
    await insert('<div class="bili-feed-card" id="late-href"><a id="changing-link" href="https://www.bilibili.com/">链接</a></div>');
    document.querySelector('#changing-link').href = 'https://cm.bilibili.com/example';
    await settle();
    check('链接更新为广告地址被移除', !exists('late-href'));
    await insert('<div class="bili-video-card is-rcmd" id="late-text"><span class="bili-video-card__stats--text" id="changing-label">播放量</span></div>');
    document.querySelector('#changing-label').firstChild.data = '广告';
    await settle();
    check('广告文字节点更新被检测', !exists('late-text'));
    await insert('<div id="late-class">后补广告样式类</div>');
    document.querySelector('#late-class').className = 'video-card-ad-small';
    await settle();
    check('后补广告样式类被检测', !exists('late-class'));
    await insert('<div class="bili-video-card is-rcmd enable-no-interest" id="excluded-card"><span class="bili-video-card__stats--text">广告</span></div>');
    check('保留原脚本的 enable-no-interest 排除规则', exists('excluded-card'));
    await insert('<a id="outside-link" href="https://cm.bilibili.com/">卡片外链接</a>');
    check('卡片之外的链接不删除', exists('outside-link'));
    await insert('<div class="bili-video-card is-rcmd" id="ad-title"><h2>广告设计教程</h2><span class="bili-video-card__stats--text">10万</span></div>');
    check('标题包含广告的普通视频保留', exists('ad-title'));
    await insert('<div class="bili-feed-card" id="relative-ad"><a href="//cm.bilibili.com/example">协议相对链接</a></div>');
    check('协议相对广告链接被移除', !exists('relative-ad'));
    await insert('<div class="strip-ad" id="dynamic-strip"><div class="strip-ad-inner">动态条状广告</div></div>');
    check('动态条状广告连同外层容器被移除', !exists('dynamic-strip'));
    await insert('<div class="strip-ad-inner" id="standalone-strip">独立条状广告</div>');
    check('无外层容器的条状广告被移除', !exists('standalone-strip'));
    await insert('<div class="strip-ad" id="late-strip"></div>');
    document.querySelector('#late-strip').insertAdjacentHTML('beforeend', '<div class="strip-ad-inner">后补条状广告</div>');
    await settle();
    check('已有容器后补条状广告时删除整个容器', !exists('late-strip'));
    await insert('<div class="strip-ad" id="link-strip"><a href="https://cm.bilibili.com/example">条状广告链接</a></div>');
    check('条状广告链接兜底删除外层容器', !exists('link-strip'));
    const passed = results.filter(result => result.ok).length;
    document.querySelector('#results').textContent = passed + '/' + results.length + ' 通过\\n' + results.map(result => (result.ok ? 'PASS ' : 'FAIL ') + result.name).join('\\n');
    document.title = passed === results.length ? '全部验证通过' : '验证失败';
})().catch(error => { document.querySelector('#results').textContent = error.stack; });
</script></body></html>`;

http.createServer((req, res) => {
    if (req.url === '/bilibili-ad-card-blocker.user.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
        res.end(fs.readFileSync(path.join(__dirname, 'bilibili-ad-card-blocker.user.js')));
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    }
}).listen(18763, '127.0.0.1', () => console.log('验证页面：http://127.0.0.1:18763'));
