'use strict';

let _mall = require('util/mall.js');

let _product = {
	getProductList: function(listParam, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/product/search.do'),
			data: listParam,
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	getProductDetail: function(productId, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/product/detail.do'),
			data: {
				productId: productId
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	}
}

module.exports = _product;