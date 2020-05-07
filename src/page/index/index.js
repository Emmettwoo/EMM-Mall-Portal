'use strict';

require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/slider/index.js');

require('./index.css');

let _mall = require('util/mall.js');
let templateBanner = require('./unslider.string');

/* 初始化首页轮播图 */
$(function() {
    // 渲染轮播图内容
    let bannerHtml = _mall.renderHtml(templateBanner);
    $('.banner-content').html(bannerHtml);
    // 初始化轮播图
    let $slider = $('.banner').unslider({
        dots: true
    });
    // 前后跳转事件
    $('.banner-content .banner-arrow').click(function() {
        let forward = $(this).hasClass('prev') ? 'prev' : 'next';
        $slider.data('unslider')[forward]();
    })
});