// 本地浏览器验证：node verify.cjs；打开 http://127.0.0.1:18763。
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<title>Bilibili 广告脚本 3.1 验证</title>
<script src="/bilibili-ad-card-blocker.user.js"></script>
<body><h1>Bilibili 广告脚本 3.1 验证</h1><pre id="results">运行中…</pre>
<section id="fixture">
<div class="bili-feed-card" id="home-ad"><div class="bili-video-card"><a href="https://cm.bilibili.com/example">首页广告</a></div></div>
<div class="bili-feed-card" id="normal-card"><div class="bili-video-card"><a href="https://www.bilibili.com/video/BVexample">普通视频</a></div></div>
<div class="rcmd-tab">
  <div class="recommend-list-v1" id="recommend"><div id="recommend-video">正常推荐视频</div></div>
  <div id="other-sidebar">推荐列表外模块</div>
</div>
<div id="slide_ad">独立广告</div><div class="slide-ad-exp" id="expanded-ad">展开广告</div>
<div class="video-card-ad-small" id="small-ad">右侧广告</div>
<div class="strip-ad" id="strip"><div class="strip-ad-inner" id="strip-inner">条状广告</div></div>
<div class="strip-ad-inner" id="standalone-strip">独立条状广告</div>
<div id="player">视频播放器</div><div id="comments">评论区</div>
</section>
<script>
(() => {
    const results = [];
    const element = id => document.getElementById(id);
    const hidden = id => getComputedStyle(element(id)).display === 'none';
    const check = (name, ok) => results.push({ name, ok });
    check('首页广告隐藏，普通视频保留', hidden('home-ad') && !hidden('normal-card'));
    check('推荐列表及其中视频保留', !hidden('recommend') && !hidden('recommend-video'));
    check('推荐列表外的右侧模块隐藏', hidden('other-sidebar'));
    check('独立广告和条状广告隐藏', ['slide_ad', 'expanded-ad', 'small-ad', 'strip', 'strip-inner', 'standalone-strip'].every(hidden));
    check('广告 DOM 仍保留', !!element('home-ad') && !!element('small-ad') && !!element('strip'));
    check('播放器和评论区保留', !hidden('player') && !hidden('comments'));
    element('fixture').insertAdjacentHTML('beforeend', '<div class="bili-feed-card" id="dynamic-ad"><div class="bili-video-card"><a href="https://cm.bilibili.com/example">动态广告</a></div></div>');
    check('动态新增广告自动隐藏', hidden('dynamic-ad'));
    element('normal-card').querySelector('a').href = 'https://cm.bilibili.com/example';
    check('已有卡片链接变化后自动隐藏', hidden('normal-card'));
    const passed = results.filter(result => result.ok).length;
    document.querySelector('#results').textContent = passed + '/' + results.length + ' 通过\\n' + results.map(result => (result.ok ? 'PASS ' : 'FAIL ') + result.name).join('\\n');
    document.title = passed === results.length ? '全部验证通过' : '验证失败';
})();
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
