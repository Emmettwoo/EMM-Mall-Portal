'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let navSide = require('page/common/nav-side/index.js');
let _mall = require('util/mall.js');
let _order = require('service/order-service.js');
let Pagination = require('util/pagination/index.js');
let templateIndex = require('./index.string');

let page = {
    data: {
        listParam: {
            pageNum: 1,
            pageSize: 10
        }
    },

    init: function() {
        this.onLoad();
    },
    onLoad: function() {
        navSide.init({
            name: 'order-list'
        });
        this.loadOrderList();
    },

    // 加载订单列表
    loadOrderList: function() {
        let _this = this,
            orderListHtml = "",
            $orderListContent = $('.order-list-content');
        _order.getOrderList(_this.data.listParam,
            function(msg, data) {
                orderListHtml = _mall.renderHtml(templateIndex, data);
                $orderListContent.html(orderListHtml);
                _this.loadPagination({
                    hasPreviousPage : data.hasPreviousPage,
                    prePage         : data.prePage,
                    hasNextPage     : data.hasNextPage,
                    nextPage        : data.nextPage,
                    pageNum         : data.pageNum,
                    pages           : data.pages
                });
            }, function(err) {
                _mall.errorTips(err);
            });
    },

    // 分页信息处理
    loadPagination: function(pageInfo) {
        let _this = this;
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({}, pageInfo, {
            container: $('.pagination'),
            onSelectPage: function(pageNum) {
                _this.data.listParam.pageNum = pageNum;
                _this.loadOrderList();
                window.scrollTo(0,0);
            }
        }));
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})