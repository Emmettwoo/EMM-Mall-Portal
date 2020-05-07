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
        // 登入按钮点击事件
        $('#submit').click(function() {
            _this.submit();
        });
        // 登入表单回车事件
        $('.user-info').keyup(function(e) {
            if(e.keyCode === 13) {
                _this.submit();
            }
        });
    },

    // 提交登入表单
    submit: function() {
        let userInfo = {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val())
        };
        let validateResult = this.formValidate(userInfo);
        if(validateResult.status) {
            _user.login(userInfo,
			function(res) {
				window.location.href = 
				_mall.getUrlParam('redirect') || './index.html';
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
        // 如果密码为空
        if(!_mall.validate(userInfo.password, 'require')) {
            result.msg = '密码不能为空';
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
