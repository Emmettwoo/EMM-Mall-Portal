'use strict';

require('./index.css');

let _mall = require('util/mall.js');
let templateIndex = require('./index.string');

// 侧边导航栏功能
let nav_side = {
    option: {
      name: '',
        navList: [
            {name: 'user-center', desc: '用户中心', href: './user-center.html'},
            {name: 'order-list', desc: '我的订单', href: './order-list.html'},
            {name: 'user-pwd-update', desc: '修改密码', href: './user-pwd-update.html'},
            {name: 'about', desc: '关于平台', href: './about.html'}
        ]
    },

    init: function(option) {
        // 合并选项
        $.extend(this.option, option);
        this.renderNav();
    },

    // 渲染导航菜单
    renderNav: function () {
        // 计算active数据
        let optionLength = this.option.navList.length;
        for (let i = 0; i < optionLength; i++) {
            if (this.option.navList[i].name === this.option.name) {
                this.option.navList[i].isActive = true;
            }
        }

        let navHtml = _mall.renderHtml(templateIndex, {
            navList: this.option.navList
        });

        $('.nav-side').html(navHtml);
    }
};

module.exports = nav_side;