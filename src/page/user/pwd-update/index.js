'use strict';

require('page/user/pwd-update/index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let _mall = require('util/mall.js');
let _user = require('service/user-service.js');
let navSide = require('page/common/nav-side/index.js');


let page = {
    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        navSide.init({
            name: 'user-pwd-update'
        });
        this.loadUserInfo();
    },
    bindEvent: function() {
        let _this = this;
        // 提交按钮点击事件
        $(document).on('click', '.button-submit', function () {
            _this.submit();
        });
        // 修改表单回车事件
        $('.input').keyup(function(e) {
            if(e.keyCode === 13) {
                _this.submit();
            }
        });
    },

    submit: function() {
        let _this = this,
            userInfo = {
                passwordOld: $.trim($('#password-old').val()),
                passwordNew: $.trim($('#password-new').val()),
                passwordConfirm: $.trim($('#password-confirm').val())
            },
            validateResult = _this.formValidate(userInfo);
        if(validateResult.status) {
            _user.updateUserPassword(
                userInfo.passwordOld,
                userInfo.passwordNew,
                function(msg) {
                    _mall.successTips(msg);
                    // 不跳回当前页面，故不使用_mall.doLogin();
                    window.location.href = './user-login.html';
                }, function(err) {
                    _mall.errorTips(err);
                });
        } else {
            _mall.errorTips(validateResult.msg);
        }
    },

    loadUserInfo: function() {
        _user.getUserInfo(function(msg, data) {
            // 做用户登入验证，不成功跳转登入
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
        // 如果旧密码为空
        if(!_mall.validate(userInfo.passwordOld, 'require')) {
            result.msg = '旧密码不能为空';
            return result;
        }
        // 如果新密码为空
        if(!_mall.validate(userInfo.passwordNew, 'require')) {
            result.msg = '新密码不能为空';
            return result;
        }
        // 如果密码安全性不合规范
        if(userInfo.passwordNew.length < 6) {
            result.msg = '新密码不能少于6位';
            return result;
        }
        // 确认两次密码是否一致
        if(userInfo.passwordNew !== userInfo.passwordConfirm) {
            result.msg = '两次密码不一致';
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