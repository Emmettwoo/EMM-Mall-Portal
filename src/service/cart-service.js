'use strict';

let _mall = require('util/mall.js');

let _cart = {
	// 获取购物车商品数量
	getCartCount: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/count_all.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 添加商品到购物车
	addToCart: function(productId, amount, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/add.do'),
			data: {
				productId: productId,
				amount: amount
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 获取购物车商品列表
	getCartList: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/list.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 勾选购物车某一商品
	selectProduct: function(productId, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/checked.do'),
			data: {
				productId: productId
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 取消勾选购物车某一商品
	unselectProduct: function(productId, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/unchecked.do'),
			data: {
				productId: productId
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 勾选购物车全部商品
	selectProducts: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/checked_all.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 取消勾选购物车全部商品
	unselectProducts: function(resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/unchecked_all.do'),
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 更新购物车商品信息（数量）
	updateProduct: function(productInfo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/update.do'),
			data: productInfo,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 删除购物车商品（支持批量）
	deleteCartProducts: function(productIds, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/cart/delete.do'),
			data: {
				productIds: productIds
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	}
}

module.exports = _cart;