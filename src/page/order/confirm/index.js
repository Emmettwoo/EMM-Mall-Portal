'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('page/shipping/index.js');

let _mall = require('util/mall.js');
let shippingNew = require('page/shipping/index.js');
let _shipping = require('service/shipping-service.js');
let _order = require('service/order-service.js');
let templateShipping = require('./shipping.string');
let templateProduct = require('./product.string');

let page = {
    data: {
        selectedShippingId: null
    },
    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        this.loadShippingList();
        this.loadProductList();
    },
    bindEvent: function() {
        let _this = this;
        // 地址的选择
        $(document).on('click', '.shipping-item', function() {
            $(this).addClass('active').siblings('.shipping-item').removeClass('active');
            _this.data.selectedShippingId = $(this).data('id');
        });
        // 添加收货地址
        $(document).on('click', '.shipping-new', function() {
            shippingNew.show({
                isUpdate: false,
                onSuccess: function() {
                    _this.loadShippingList();
                }
            });
        });
        // 编辑收货地址
        $(document).on('click', '.shipping-update', function(e) {
            e.stopPropagation();
            _shipping.getShipping(
                $(this).parents('.shipping-item').data('id'), 
                function(msg, data) {
                    // fixme: linux下带空格的字符串分割会异常，在没找到解决办法前去掉空格
                    /*
                        check:
                            console.log(data.receiverAddress);
                        input:
                            data.receiverAddress = 中关村 测试街
                        output:
                            <input class="content-input" id="receiver-address" placeholder="请精确到门牌号" value="中关村" 测试街="">
                     */
                    data.receiverAddress = data.receiverAddress.replace(/ /g,'')
                    shippingNew.show({
                        isUpdate: true,
                        data: data,
                        onSuccess: function() {
                            _this.loadShippingList();
                        }
                    });
                }, function(err) {
                    _mall.errorTips(err);
                });
        });
        // 删除收货地址
        $(document).on('click', '.shipping-delete', function(e) {
            e.stopPropagation();
            if(window.confirm("确认删除该收货地址？")) {
                _shipping.deleteShipping(
                    $(this).parents('.shipping-item').data('id'), 
                    function(msg, data) {
                        _mall.successTips(msg);
                        _this.loadShippingList();
                    }, function(err) {
                        _mall.errorTips(err);
                    });
            }
        });
        // 订单的提交
        $(document).on('click', '.submit-button', function() {
            let shippingId = _this.data.selectedShippingId;
            if(shippingId) {
                _order.createOrder({
                    shippingId: shippingId
                }, function(msg, data) {
                    window.location.href = './payment.html?orderNo=' + data.orderNo;
                }, function(err) {
                    _mall.errorTips(err);
                })
            } else {
                _mall.errorTips('请选择收货地址');
            }
        });
    },

    // 获取用户的收货地址列表
    loadShippingList: function() {
        let _this = this;
        _shipping.getShippingList( function(msg, data) {
            _this.shippingFilter(data);
            let shippingListHtml = _mall.renderHtml(templateShipping, data);
            $('.shipping-list').html(shippingListHtml);
        }, function(err) {
            _mall.errorTips(err);
        });
    },
    // 分析筛选之前选中的收货地址
    shippingFilter: function(data) {
        if(this.data.selectedShippingId) {
            let selectedShippingIdFlag = false;
            for(let i=0, length=data.list.length; i<length; i++) {
                if(data.list[i].id === this.data.selectedShippingId) {
                    data.list[i].isActive = true;
                    selectedShippingIdFlag = true;
                };
            }
            // 之前选中的收货地址已经失效或访问异常
            if(!selectedShippingIdFlag) {
                this.data.selectedShippingId = null;
            }
        }
    },

    // 获取购物车选中商品列表
    loadProductList: function() {
        _order.getProductList( function(msg, data) {
            let productListHtml = _mall.renderHtml(templateProduct, data);
            $('.product-list').html(productListHtml);
        }, function(err) {
            _mall.errorTips(err);
        });
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})