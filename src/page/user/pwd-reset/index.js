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
    data: {
        username: '',
        question: '',
        answer: '',
        token: ''
    },

    init: function() {
        _user.getUserInfo(function() {
            alert("您已经登入了，不要开玩笑(*^_^*)。");
			window.location.href = _mall.getUrlParam('redirect') || './index.html';
		},
		function() {
			// bindEvent()不能在这里启动，因为this不同。
        });
        this.onLoad();
        this.bindEvent();
    },

    // 载入初始框
    onLoad: function() {
        this.loadStepUsername();
    },

    // 事件监听
    bindEvent: function() {
        let _this = this;
        // 1/3找回按钮点击事件
        $('#submit-username').click(function() {
            let username = $.trim($('#username').val());
            if(username) {
                _user.getQuestion(username, 
                    function(msg, data) {
                        _this.data.username = username;
                        _this.data.question = data;
                        _this.loadStepAnwser();
                    },
                    function(err) {
                        formError.show(err);
                    });
            } else {
                formError.show("用户名为空");
            }
        });
        // 2/3验证按钮点击事件
        $('#submit-answer').click(function() {
            let answer = $.trim($('#answer').val());
            if(answer) {
                _user.checkAnswer({
                    username: _this.data.username,
                    question: _this.data.question,
                    answer: answer
                },
                function(msg, data) {
                    _this.data.answer = answer;
                    _this.data.token = data;
                    _this.loadStepPassword();
                },
                function(err) {
                    formError.show(err);
                });
            } else {
                formError.show("问题答案为空");
            }
        });
        // 3/3提交按钮点击事件
        $('#submit-password').click(function() {
            let password = $.trim($('#password').val());
            let passwordConfirm = $.trim($('#password-confirm').val());
            let validateResult = _this.formValidate(password, passwordConfirm);
            if(validateResult.status) {
                _user.resetPassword({
                    username: _this.data.username,
                    password: password,
                    forgetToken: _this.data.token
                }, function() {
                    window.location.href = './result.html?type=pwd-reset';
                }, function(err) {
                    formError.show(err);
                });
            } else {
                formError.show(validateResult.msg);
            }
        });
    },

    /* 载入各个步骤框的函数 */
    loadStepUsername: function() {
        $('.step-username').show();
    },
    loadStepAnwser: function() {
        formError.hide();
        $('.step-username').hide()
        .siblings('.step-answer').show()
        .find('#question').text(this.data.question);
    },
    loadStepPassword: function() {
        $('.step-answer').hide();
        $('.step-password').show();
    },

    // 表单数据验证
    formValidate: function(password, passwordConfirm) {
        let result = {
            status: false,
            msg: ''
        };
        // 如果密码为空
        if(!_mall.validate(password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        if(password.length < 6) {
            result.msg = '密码不能少于6位';
            return result;
        }
        if(!_mall.validate(passwordConfirm, 'require')) {
            result.msg = '确认密码为空';
            return result;
        }
        if(password !== passwordConfirm) {
            result.msg = '两次密码不一致';
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
