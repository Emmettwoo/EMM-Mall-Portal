'use strict';

require('./index.css');

require('page/common/nav-simple/index.js');
let _mall = require('util/mall.js');
let _payment = require('service/payment-service.js');
let templateIndex = require('./index.string');

let page = {
    data: {
        orderNo: _mall.getUrlParam('orderNo')
    },

    init: function() {
        this.onLoad();
    },
    onLoad: function() {
        this.loadPaymentInfo();
    },

    // 加载支付相关信息
    loadPaymentInfo: function() {
        let _this = this,
            paymentHtml = "",
            $pageWrap = $('.page-wrap');
        _payment.getPaymentInfo(this.data.orderNo,
            function(msg, data) {
                paymentHtml = _mall.renderHtml(templateIndex, data);
                $pageWrap.html(paymentHtml);
                _this.listenPaymentStatus();
            }, function(err) {
                _mall.errorTips(err);
            });
    },

    // 监听订单支付状态
    listenPaymentStatus: function() {
        let _this = this;
        // 每五秒进行一次状态检查
        this.paymentTimer = window.setInterval(function () {
            _payment.getPaymentStatus(_this.data.orderNo,
                function (msg, data){
                    // 如果支付成功进行跳转，失败则忽略
                    if(data === true) {
                        window.location.href = './result.html?type=payment&orderNo=' + _this.data.orderNo;
                    }
                }, function(err){
                    _mall.errorTips(err);
                });
        }, 5e3)
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})