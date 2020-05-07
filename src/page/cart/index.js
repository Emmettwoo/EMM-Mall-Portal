'use strict';

require('./index.css');
require('page/common/header/index.js');

let _mall = require('util/mall.js');
let _cart = require('service/cart-service.js');
let _nav = require('page/common/nav/index.js');
let templateIndex = require('./index.string');

let page = {
    data: {
        cartInfo: null
    },

    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        this.loadCart();
    },
    bindEvent: function() {
        let _this = this;
        // 商品的单选和反选
        $(document).on('click', '.cart-select-one', function() {
            let $this = $(this),
                productId = $this.parents('.cart-table').data('product-id');
            if($this.is(':checked')) {
                _cart.selectProduct(productId, 
                function(msg, data) {
                    _this.renderCart(data);
                }, function(err) {
                    _mall.errorTips(err);
                });
            } else {
                _cart.unselectProduct(productId, 
                function(msg, data) {
                    _this.renderCart(data);
                }, function(err) {
                    _mall.errorTips(err);
                });
            }
        });
        // 商品的全选和反选
        $(document).on('click', '.cart-select-all', function() {
            let $this = $(this);
            if($this.is(':checked')) {
                _cart.selectProducts(function(msg, data) {
                    _this.renderCart(data);
                }, function(err) {
                    _mall.errorTips(err);
                });
            } else {
                _cart.unselectProducts(function(msg, data) {
                    _this.renderCart(data);
                }, function(err) {
                    _mall.errorTips(err);
                });
            }
        });
        // 商品数量的变化
        $(document).on('click', '.cart-amount-button', function() {
            let $this = $(this),
                type = $this.hasClass('plus') ? 'plus' : 'minus',
                productId = $this.parents('.cart-table').data('product-id'),
                amount = $this.siblings('.cart-amount'),
                currentAmount = amount.val(),
                minAmount = 1,
                maxAmount = amount.data('max'),
                newAmount = 0;
            if(type === 'plus') {
                if(currentAmount >= maxAmount) {
                    _mall.errorTips('商品数量达到上限');
                    return;
                } else if (currentAmount=="" || isNaN(currentAmount) || currentAmount < minAmount) {
                    return;
                } else {
                    newAmount = parseInt(currentAmount) + 1;
                }
            } else if(type === 'minus') {
                if (currentAmount=="" || isNaN(currentAmount) || currentAmount <= minAmount) {
                    return;
                } else {
                    newAmount = parseInt(currentAmount) - 1;
                }
            }
            _cart.updateProduct({
                productId: productId,
                amount: newAmount
            }, function(msg, data) {
                _this.renderCart(data);
            }, function(err) {
                _mall.errorTips(err);
            });
        });
        // 删除某一商品
        $(document).on('click', '.cart-delete', function() {
            if(window.confirm("确认删除该商品？")) {
                let productId = $(this).parents('.cart-table').data('product-id');
                _this.deleteCartProducts(productId);
            }
        });
        // 删除选中商品
        $(document).on('click', '.cart-delete-selected', function() {
            if(window.confirm("确认删除选中的商品？")) {
                let productIds = [],
                    selectedItem = $('.cart-select-one:checked');
                // 循环查找选中的商品Id列表
                for(let i=0, iLength=selectedItem.length; i < iLength; i++) {
                    productIds.push($(selectedItem[i]).parents('.cart-table').data('product-id'));
                }
                if(productIds.length) {
                    _this.deleteCartProducts(productIds.join(','));
                } else {
                    _mall.errorTips("没有选中的商品，无法删除");
                }
            }
        });
        // 提交选中商品
        $(document).on('click', '.submit-button', function() {
            let selectedItem = $('.cart-select-one:checked');
            if(!!selectedItem.length) {
                window.location.href = './order-confirm.html';
            } else {
                _mall.errorTips("没有选中的商品，无法提交");
            }
        });
    },

    // 加载商品详情信息
    loadCart: function() {
        let _this = this;

        // 获取购物车商品列表
        _cart.getCartList(function(msg, data) {
            _this.renderCart(data);
        }, function(err) {
            _mall.errorTips(err);
        })
    },

    // 删除指定商品（支持批量，用逗号隔开
    deleteCartProducts: function(productIds) {
        let _this = this;
        _cart.deleteCartProducts(productIds,
        function(msg, data) {
            _this.renderCart(data);
        }, function(err) {
            _mall.errorTips(err);
        });
    },

    // 渲染购物车信息
    renderCart: function(data) {
        this.dataFilter(data);
        this.data.cartInfo = data;
        let html = _mall.renderHtml(templateIndex, data);
        $('.page-wrap').html(html);
        // 通知导航栏的购物车信息更新
        _nav.loadCartCount();
    },

    // 处理服务器返回的数据(引用类型)
    dataFilter: function(data) {
        data.notEmpty = !!data.cartProductVOList;
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})