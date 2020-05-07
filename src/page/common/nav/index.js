'use strict';

require('./index.css');

let _mall = require('util/mall.js');
let _user = require('service/user-service.js');
let _cart = require('service/cart-service.js');

// 通用导航栏功能
let nav = {
	init: function() {
		this.bindEvent();
		this.loadUserInfo();
		this.loadCartCount();
		return this;
	},
	bindEvent: function() {
		// 登入点击事件
		$('.js-login').click(
		function() {
			_mall.doLogin();
		});
		// 注册点击事件
		$('.js-register').click(
		function() {
			window.location.href = './user-register.html';
		});
		// 注销点击事件
		$('.js-logout').click(
		function() {
			_user.logout(function(msg) {
				_user.logout();
				_mall.successTips(msg);
				window.location.reload();
			},
			function(err) {
				_mall.errorTips(err);
			})
		});
		
	},
	// 加载用户信息
	loadUserInfo: function() {
		_user.getUserInfo(function(msg, data) {
			$('.user.not-login').hide().siblings('.user.logined').show().find('.username').text(data.username);
		},
		function() {
			// do nothings.
		});
	},
	// 加载购物车商品数量
	loadCartCount: function() {
		_cart.getCartCount(
		function(msg, data) {
			$('.nav .cart-count').text(data);
		},
		function() {
			$('.nav .cart-count').text('0');
		});
	}
};

module.exports = nav.init();