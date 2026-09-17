// ==UserScript==
// @name         Bilibili 广告屏蔽（精简安全版）
// @namespace    https://www.bilibili.com/
// @version      3.1
// @description  屏蔽首页广告；视频页右侧仅保留推荐列表，并隐藏独立广告位
// @match        https://www.bilibili.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');

    style.textContent = `

        /* =========================
           首页推荐流广告
           ========================= */

        .bili-feed-card:has(
            .bili-video-card a[href*="cm.bilibili.com"]
        ) {
            display: none !important;
        }


        /* =========================
           视频页右侧推荐区域
           只保留正常推荐列表
           ========================= */

        .rcmd-tab > :not(.recommend-list-v1) {
            display: none !important;
        }


        /* =========================
           视频页独立广告
           ========================= */

        #slide_ad,
        .slide-ad-exp,
        .video-card-ad-small,
        .strip-ad,
        .strip-ad-inner {
            display: none !important;
        }

    `;

    (document.head || document.documentElement)
        .appendChild(style);
})();
