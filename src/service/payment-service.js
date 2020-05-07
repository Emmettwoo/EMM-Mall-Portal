'use strict';

let _mall = require('util/mall.js');

let _payment = {
	// 获取支付相关信息
	getPaymentInfo: function(orderNo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/order/pay.do'),
			data: {
				orderNo: orderNo
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	},
	// 获取订单支付状态
	getPaymentStatus: function(orderNo, resolve, reject) {
		_mall.request({
			url: _mall.getServerUrl('/order/get_pay_status.do'),
			data: {
				orderNo: orderNo
			},
			method: 'POST',
			success: resolve,
			error: reject
		});
	}
}

module.exports = _payment;