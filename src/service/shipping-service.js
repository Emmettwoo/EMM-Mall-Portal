'use strict';

let _mall = require('util/mall.js');

let _order = {
	// 获取单条收货地址信息
	getShipping: function(shippingId, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/shipping/select.do'),
			data: {
				shippingId: shippingId
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 获取用户收货地址列表
	getShippingList: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/shipping/list.do'),
			data: {
				pageSize: 10
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 新增收货地址到数据库
	addShipping: function(shipping, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/shipping/add.do'),
			data: shipping,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	updateShipping: function(shipping, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/shipping/update.do'),
			data: shipping,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	deleteShipping: function(shippingId, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/shipping/delete.do'),
			data: {
				shippingId: shippingId
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	}
}

module.exports = _order;