'use strict';

require('page/user/center/index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let _mall = require('util/mall.js');
let _user = require('service/user-service.js');
let navSide = require('page/common/nav-side/index.js');
let templateIndex = require('./index.string');


let page = {
    init: function() {
        this.onLoad();
    },
    onLoad: function() {
        navSide.init({
            name: 'user-center'
        });
        this.loadUserInfo();
    },

    loadUserInfo: function() {
        let userHtml = '';
        _user.getUserInfo(function(msg, data) {
            userHtml = _mall.renderHtml(templateIndex, data);
            $('.panel-body').html(userHtml);
        }, function(err) {
            _mall.errorTips(err);
            _mall.doLogin();
        });
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})