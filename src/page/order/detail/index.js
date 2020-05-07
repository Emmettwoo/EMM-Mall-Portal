'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let navSide = require('page/common/nav-side/index.js');
let _mall = require('util/mall.js');
let _order = require('service/order-service.js');
let templateIndex = require('./index.string');

let page = {
    data: {
        orderNo: _mall.getUrlParam('orderNo')
    },

    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        navSide.init({
            name: 'order-list'
        });
        this.loadOrderDetail();
    },
    bindEvent: function() {
        let _this = this;
        // 取消订单按钮事件
        $(document).on('click', '.order-cancel', function() {
            if(window.confirm("确认要取消该订单吗？")) {
                _order.cancelOrder(_this.data.orderNo,
                    function(msg, data) {
                        _mall.successTips(msg);
                        _this.loadOrderDetail();
                    }, function(err) {
                        _mall.errorTips(err);
                    })
            }
        })
    },

    // 加载订单详情
    loadOrderDetail: function() {
        let _this = this,
            orderDetailHtml = "",
            $content = $('.content');
        _order.getOrderDetail(this.data.orderNo,
            function(msg, data) {
                _this.dataFilter(data);
                orderDetailHtml = _mall.renderHtml(templateIndex, data);
                $content.html(orderDetailHtml);
            }, function(err) {
                _mall.errorTips(err);
            });
    },

    // 订单数据处理
    dataFilter: function(data) {
        data.isPaidAble = data.status == 10;
        data.isCancelAble = data.status == 10;
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})