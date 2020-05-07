'use strict';

let _mall = require('util/mall.js');

let _user = {
	// 登入用户
	login: function(userInfo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/login.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 获取登入用户信息
	getUserInfo: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/check_login.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 用户登出
	logout: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/logout.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 检查用户名是否重复
	checkUsername: function(username, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/check.do'),
			data: {
				str: username,
				type: 'username'
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 注册用户
	register: function(userInfo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/register.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 获取用户安全问题
	getQuestion: function(username, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/forget_password_question.do'),
			data: {
				username: username
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 检查安全问题答案
	checkAnswer: function(userInfo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/forget_password_answer.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 通过Token重置密码
	resetPassword: function(userInfo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/forget_password_reset.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 登入状态修改密码
	updateUserPassword: function(passwordOld, passwordNew, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/logined_password_update.do'),
			data: {
				passwordOld: passwordOld,
				passwordNew: passwordNew
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 更新用户个人信息
	updateUserInfo: function(userInfo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/user/update.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject
		});
	}
}

module.exports = _user;