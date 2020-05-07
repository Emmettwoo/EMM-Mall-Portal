'use strict';

let _mall = require('util/mall.js');

let _order = {
	// 获取购物车选中商品
	getProductList: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/order/cart.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 提交订单
	createOrder: function(orderInfo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/order/create.do'),
			data: orderInfo,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 加载订单列表
	getOrderList: function(pageParam, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/order/list.do'),
			data: pageParam,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 加载订单详情
	getOrderDetail: function(orderNo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/order/detail.do'),
			data: {
				orderNo: orderNo
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 取消订单
	cancelOrder: function(orderNo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/order/cancel.do'),
			data: {
				orderNo: orderNo
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
}

module.exports = _order;