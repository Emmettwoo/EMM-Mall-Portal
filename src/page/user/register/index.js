'use strict';

require('./index.css');
require('page/common/nav-simple/index.js');

let _mall = require('util/mall.js');
let _user = require('service/user-service.js');

// 表单错误提示处理
let formError = {
	show: function(err) {
		$('.error-item').show().find('.err-msg').text(err);
	},
	hide: function() {
		$('.error-item').hide().find('.err-msg').text();
	}
};

let page = {
    init: function() {
        _user.getUserInfo(function() {
            alert("您已经登入了，不要开玩笑(*^_^*)。");
			window.location.href = _mall.getUrlParam('redirect') || './index.html';
		},
		function() {
			// bindEvent()不能在这里启动，因为this不同。
        });
        this.bindEvent();
    },

    // 事件监听
    bindEvent: function() {
        let _this = this;
        $('#username').blur(function() {
            let username = $.trim($(this).val());

            // 如果用户名为空，无需验证
            if(!username) {
                return;
            }

            _user.checkUsername(username,
                function(res) {
                    formError.hide();
                },
                function(err) {
                    formError.show(err);
            })
        });
        // 注册按钮点击事件
        $('#submit').click(function() {
            _this.submit();
        });
        // 注册表单回车事件
        $('.user-info').keyup(function(e) {
            if(e.keyCode === 13) {
                _this.submit();
            }
        });
    },

    // 提交注册表单
    submit: function() {
        let userInfo = {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val()),
            passwordConfirm: $.trim($('#password-confirm').val()),
            email: $.trim($('#email').val()),
            phone: $.trim($('#phone').val()),
            question: $.trim($('#question').val()),
            answer: $.trim($('#answer').val())
        };
        let validateResult = this.formValidate(userInfo);
        if(validateResult.status) {
            _user.register(userInfo,
			function(res) {
				window.location.href = './result.html?type=register';
			},
			function(err) {
				formError.show(err);
			});
        } else {
            formError.show(validateResult.msg);
        }
    },

    formValidate: function(userInfo) {
        let result = {
            status: false,
            msg: ''
        };
        // 如果用户名为空
        if(!_mall.validate(userInfo.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        // 如果用户名不合规范
        if(userInfo.username.length < 4) {
            result.msg = '用户名不能少于4位';
            return result;
        }

        // 如果密码为空
        if(!_mall.validate(userInfo.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        // 如果密码安全性不合规范
        if(userInfo.password.length < 6) {
            result.msg = '密码不能少于6位';
            return result;
        }
        // 确认两次密码是否一致
        if(userInfo.password !== userInfo.passwordConfirm) {
            result.msg = '两次密码不一致';
            return result;
        }
        
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
};

// js文件被调用时自动执行
$(function() {
    page.init();
})
