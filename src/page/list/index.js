'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

let _mall = require('util/mall.js');
let _product = require('service/product-service.js');
let templateIndex = require('./index.string');
let Pagination = require('util/pagination/index.js');

let page = {

    data: {
        listParam: {
            productId:  _mall.getUrlParam('productId'),
            productName: _mall.getUrlParam('keyword'),
            categoryId: _mall.getUrlParam('categoryId'),
            pageNum: _mall.getUrlParam('pageNum') || 1,
            pageSize: _mall.getUrlParam('pageSize') || 20,
            orderBy: _mall.getUrlParam('orderBy') || 'default'
        }
    },

    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        this.loadList();
    },
    bindEvent: function() {
        let _this = this;
        // 排序按钮点击事件
        $('.sort-item').click(function(){
            // 缓存一直存取的元素，提高效率
            let $this = $(this);
            _this.data.listParam.pageNum = 1;
            // 点击默认排序
            if($this.data('type') === 'default'){
                // 已经是active样式
                if($this.hasClass('active')) {
                    console.log("first");
                    return;
                } else {
                    console.log("second");
                    $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                    _this.data.listParam.orderBy = 'default';
                }
            }
            // 点击价格排序
            else if($this.data('type') === 'price'){
                // active class 的处理
                $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                // 升序、降序的处理
                if(!$this.hasClass('asc')){
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'price_asc';
                }else{
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'price_desc';
                }
            }
            // 重新加载列表
            _this.loadList();
        });
    },

    // 加载商品列表数据
    loadList: function() {
        let _this = this,
            listHtml = '',
            listParam = this.data.listParam;
        _product.getProductList(listParam, function(msg, data) {
            listHtml = _mall.renderHtml(templateIndex, {
                list: data.list
            });
            $('.list-content').html(listHtml);
            _this.loadPagination({
                hasPreviousPage : data.hasPreviousPage,
                prePage         : data.prePage,
                hasNextPage     : data.hasNextPage,
                nextPage        : data.nextPage,
                pageNum         : data.pageNum,
                pages           : data.pages
            });
        }, function(err) {
            console.log(err);
        })
    },

    // 分页信息处理
    loadPagination: function(pageInfo) {
        let _this = this;
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({}, pageInfo, {
            container: $('.pagination'),
            onSelectPage: function(pageNum) {
                _this.data.listParam.pageNum = pageNum;
                _this.loadList();
                window.scrollTo(0,0);
            }
        }));
    }
}

// js文件被调用时自动执行
$(function() {
    page.init();
})