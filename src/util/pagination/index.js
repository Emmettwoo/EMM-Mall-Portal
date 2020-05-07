'use strict';

require('./index.css');

let _mall = require('util/mall.js');
let templatePagination = require('./index.string');

let Pagination = function() {
    let _this = this;
    this.defaultOption = {
        container: null,
        pageNum: 1,
        pageRange: 3,
        onSelectPage: null
    };
    // 事件的处理
    $(document).on('click', '.pagination-item', function() {
        let $this = $(this);
        // 当前页面按钮和无作用按钮不做处理
        if($this.hasClass('active') || $this.hasClass('disabled')) {
            return;
        }
        typeof _this.option.onSelectPage === 'function' ? _this.option.onSelectPage($this.data('value')) : null;
    });
    // 当前页输入框回车事件的处理
    $(document).on('keyup', '.total-content', function(e) {
        if(e.keyCode === 13) {
            let target = $('#jump-number').val();
            if(target > _this.option.pages) {
                typeof _this.option.onSelectPage === 'function' ? _this.option.onSelectPage(_this.option.pages) : null;
            } else {
                typeof _this.option.onSelectPage === 'function' ? _this.option.onSelectPage(target) : null;
            }
        }
    });
};

// 渲染分页组件
Pagination.prototype.render = function(userOption) {
    this.option = $.extend({}, this.defaultOption, userOption);
    // 判断容器是否为合法jquey对象
    if(!(this.option.container instanceof jQuery)) {
        return;
    }
    // 判断分页信息是否只有一页
    if(this.option.pages <= 1) {
        return;
    }

    // 开始渲染分页内容
    this.option.container.html(this.getPaginationHtml());
};

// 获取分页的html
Pagination.prototype.getPaginationHtml = function() {
    // 样式设计： |上一页| 2 3 4 =5= 6 7 8 |下一页| 5/9
    let html = '',
        option = this.option,
        pageArray = [],
        // 展示的起止页的判断
        start = option.pageNum - option.pageRange > 0 ? option.pageNum - option.pageRange : 1,
        end = option.pageNum + option.pageRange < option.pages ? option.pageNum + option.pageRange : option.pages;
    // 上一页按钮的数据
    pageArray.push({
        name: '上一页',
        value: option.prePage,
        disabled: !option.hasPreviousPage
    });
    // 数字页按钮的数据
    for(let i = start; i <= end; i++) {
        pageArray.push({
            name: i,
            value: i,
            active: (i === option.pageNum)
        });
    }
    // 下一页按钮的数据
    pageArray.push({
        name: '下一页',
        value: option.nextPage,
        disabled: !option.hasNextPage
    });
    // 当前页数:总页数
    html = _mall.renderHtml(templatePagination, {
        pageArray: pageArray,
        pageNum: option.pageNum,
        pages: option.pages
    });
    return html;
};

module.exports = Pagination;