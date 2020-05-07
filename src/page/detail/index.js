'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let _mall = require('util/mall.js');
let _product = require('service/product-service.js');
let _cart = require('service/cart-service.js');
let templateIndex = require('./index.string');

let page = {
    data: {
        productId: _mall.getUrlParam('productId') || 'error'
    },

    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        if(this.data.productId === 'error') {
            alert("商品ID错误，点击返回首页");
            _mall.goHome();
        } else {
            this.loadDetail();
        }
    },
    bindEvent: function() {
        let _this = this;
        // 商品数量的变化
        $(document).on('click', '.cart-amount-button', function() {
            let $this = $(this),
                amount = $('.cart-amount'),
                currentAmount = amount.val(),
                minAmount = 1,
                maxAmount = amount.data('max'),
                type = $this.hasClass('plus') ? 'plus' : 'minus';
            if(type === 'plus') {
                if(currentAmount >= maxAmount) {
                    _mall.errorTips('商品数量达到上限');
                    return;
                } else if (currentAmount=="" || isNaN(currentAmount) || currentAmount < minAmount) {
                    return;
                } else {
                    $('.cart-amount').val(parseInt(currentAmount) + 1);
                }
            } else if(type === 'minus') {
                if (currentAmount=="" || isNaN(currentAmount) || currentAmount <= minAmount) {
                    return;
                } else {
                    $('.cart-amount').val(currentAmount - 1);
                }
            }
        });
        // 加入购物车按钮点击事件
        $(document).on('click', '.cart-add', function() {
            _cart.addToCart(_this.data.productId, $('.cart-amount').val(), 
            function(msg, data) {
                window.location.href = './result.html?type=cart-add';
            }, function(err) {
                _mall.errorTips(err);
            })
        });
    },

    // 加载商品详情信息
    loadDetail: function() {
        let _this = this,
            html = '',
            $pageWrap = $('.page-wrap');
        
        _product.getProductDetail(this.data.productId, 
            function(msg, data) {
                _this.dataFilter(data);
                html = _mall.renderHtml(templateIndex, data);
                $pageWrap.html(html);
            }, function(err) {
                $pageWrap.html("<p class='error-tips'>(●'◡'●) " + err + " (●'◡'●)</p>");
            });
    },

    // 处理服务器返回的数据(引用类型)
    dataFilter: function(data) {
        data.subImages = data.subImages.split(',');
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})