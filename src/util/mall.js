'use strict';

let hogan = require('hogan.js');

let conf = {
    serverHost: ''
};

let _mall = {
    request: function(param) {
        let _this = this;

        $.ajax({
            type: param.method || 'get',
            url: param.url || '',
            dataType: param.type || 'json',
            data: param.data || "",
            
            success: function(res) {
                // 请求成功
                if(0 === res.status) {
                    typeof param.success === 'function' && param.success(res.msg, res.data);
                }
                // 需要登入
                else if(10 === res.status) {
                    alert(res.msg);
                    _this.doLogin();
                }
                // 错误请求
                // else if(1 === res.status) {
                //     typeof param.error === 'function' && param.error(res.msg);
                // }
                else {
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },

            error: function(err) {
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },

    // 获取服务器地址
    getServerUrl: function(path) {
        return conf.serverHost + path;
    },
    // 获取URL参数
    getUrlParam: function(name) {
        // 使用正则表达式适配参数
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },

    // 渲染html模板
    renderHtml: function(htmlTemplate, data) {
        let template = hogan.compile(htmlTemplate);
        return template.render(data);
    },

    // 成功提示
    successTips: function(msg) {
        alert(msg || "请求成功");
    },
    // 错误提示
    errorTips: function(msg) {
        alert(msg || "请求失败");
    },
    
    // 字段验证
    validate: function(value, type) {
        // 空字符串认为是null
        value = $.trim(value);

        // 若为必填项，非空验证
        if(type === 'require') {
            return !!value;
        }
        // 若为手机号，1开头11位数
        if(type === 'phone') {
            return /^1\d{10}$/.test(value);
        }
        // 若为邮箱，xx@xx.xx
        if(type === 'email') {
            return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
        }
    },

    // 登入跳转函数
    doLogin: function() {
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    // 主页跳转函数
    goHome: function() {
        window.location.href = './index.html';
    }
};

module.exports = _mall;