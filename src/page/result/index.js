'use strict';

require('./index.css');

require('page/common/nav-simple/index.js');
let _mall = require('util/mall.js');

$(function () {
    let type = _mall.getUrlParam('type') || 'default',
    $element = $('.' + type + '-success');
    // 支付成功需要处理订单id获取和填入
    if(type==="payment") {
        $element.find('.check-order')
        .attr('href', "./order-detail.html?orderNo=" + _mall.getUrlParam('orderNo'));
    }
    // 显示对应的（成功）提示
    $element.show();
});