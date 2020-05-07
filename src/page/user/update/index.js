'use strict';

require('page/user/update/index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let _mall = require('util/mall.js');
let _user = require('service/user-service.js');
let navSide = require('page/common/nav-side/index.js');
let templateIndex = require('./index.string');


let page = {
    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        navSide.init({
            name: 'user-center'
        });
        this.loadUserInfo();
    },
    bindEvent: function() {
        let _this = this;
        // 提交按钮点击事件
        $(document).on('click', '.button-submit', function() {
            let userInfo = {
                email: $.trim($('#email').val()),
                phone: $.trim($('#phone').val()),
                question: $.trim($('#question').val()),
                answer: $.trim($('#answer').val())
            },
            validateResult = _this.formValidate(userInfo);
            if(validateResult.status) {
                _user.updateUserInfo(userInfo,
                    function(msg, data) {
                        _mall.successTips(msg);
                        window.location.href = './user-center.html';
                }, function(err) {
                    _mall.errorTips(err);
                });
            } else {
                _mall.errorTips(validateResult.msg);
            }
        });
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
    },

    formValidate: function(userInfo) {
        let result = {
            status: false,
            msg: ''
        };
        // 验证邮箱格式
        if(!_mall.validate(userInfo.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }
        // 验证手机号码格式
        if(!_mall.validate(userInfo.phone, 'phone')) {
            result.msg = '手机号码格式不正确';
            return result;
        }
        // 安全问题为空
        if(!_mall.validate(userInfo.question, 'require')) {
            result.msg = '安全问题不能为空';
            return result;
        }
        // 问题答案为空
        if(!_mall.validate(userInfo.answer, 'require')) {
            result.msg = '问题答案不能为空';
            return result;
        }

        // 数据验证全通过
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})