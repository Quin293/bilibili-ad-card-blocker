// ==UserScript==
// @name         Bilibili 广告卡片屏蔽
// @namespace    https://github.com/Quin293/bilibili-ad-card-blocker
// @version      1.2.1
// @description  屏蔽 Bilibili 首页推荐广告、视频页右侧广告和条状广告，支持动态加载。
// @author       Quin293
// @match        https://www.bilibili.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @homepageURL  https://github.com/Quin293/bilibili-ad-card-blocker
// @supportURL   https://github.com/Quin293/bilibili-ad-card-blocker/issues
// ==/UserScript==

(function () {
    'use strict';

    const HOME_CARD = '.bili-video-card.is-rcmd:not(.enable-no-interest)';
    const VIDEO_AD = '.video-card-ad-small';
    const STRIP_AD = '.strip-ad-inner';
    const AD_LINK = 'a[href*="cm.bilibili.com"]';
    const CARD = `${HOME_CARD}, ${VIDEO_AD}, ${STRIP_AD}`;
    const CANDIDATE = `${CARD}, ${AD_LINK}`;

    function isAdLink(link) {
        try {
            const url = new URL(link.getAttribute('href'), document.baseURI);
            return (url.protocol === 'https:' || url.protocol === 'http:') &&
                url.hostname === 'cm.bilibili.com';
        } catch {
            return false;
        }
    }

    function removeAd(element) {
        if (!element.isConnected) return;

        // 视频播放页右侧的广告卡片。
        if (element.matches(VIDEO_AD)) {
            element.remove();
            return;
        }

        // 视频页条状广告：优先删除外层容器，避免残留占位高度。
        if (element.matches(STRIP_AD)) {
            (element.closest('.strip-ad') || element).remove();
            return;
        }

        // 首页卡片需要包含广告链接或明确的“广告”标记。
        if (element.matches(HOME_CARD)) {
            const hasAdLink = [...element.querySelectorAll(AD_LINK)].some(isAdLink);
            const hasAdText = [...element.querySelectorAll('.bili-video-card__stats--text')]
                .some(label => label.textContent.trim() === '广告');

            if (hasAdLink || hasAdText) {
                (element.closest('.bili-feed-card') || element).remove();
            }
            return;
        }

        // 保留原脚本的兜底规则，只移除广告链接所在的卡片。
        if (element.matches(AD_LINK) && isAdLink(element)) {
            const card = element.closest(VIDEO_AD) ||
                element.closest('.strip-ad') ||
                element.closest(STRIP_AD) ||
                element.closest('.bili-feed-card');
            if (card) card.remove();
        }
    }

    function collect(node, candidates, scanChildren = true) {
        const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        if (!element || !element.isConnected) return;

        // querySelectorAll 不包含根节点；同时检查新增节点和所属卡片。
        if (element.matches(CANDIDATE)) candidates.add(element);
        const parentCard = element.closest(CARD);
        if (parentCard) candidates.add(parentCard);

        if (scanChildren) {
            element.querySelectorAll(CANDIDATE).forEach(item => candidates.add(item));
        }
    }

    function start() {
        const observer = new MutationObserver(mutations => {
            const candidates = new Set();

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // 忽略仅删除节点的变化，避免删除广告后重复扫描。
                    if (!mutation.addedNodes.length) continue;
                    collect(mutation.target, candidates, false);
                    mutation.addedNodes.forEach(node => collect(node, candidates));
                } else {
                    // 处理卡片挂载后才补充的链接、样式类和广告文字。
                    collect(mutation.target, candidates, mutation.type === 'attributes');
                }
            }

            candidates.forEach(removeAd);
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['href', 'class']
        });

        const candidates = new Set();
        collect(document.documentElement, candidates);
        candidates.forEach(removeAd);
    }

    if (document.documentElement) {
        start();
    } else {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    }
})();
