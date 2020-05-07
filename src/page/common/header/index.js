'use strict';

require('./index.css');

let _mall = require('util/mall.js');

// 通用头部功能
let header = {
	init: function() {
		this.onload();
		this.bindEvent();
		return this;
	},
	onload: function() {
		/* 搜索输入框初始化，存在keyword时自动填充 */
		let keyword = _mall.getUrlParam("keyword");
		if(keyword) {
			/* JQuery选择器 */
			$('#search-input').val(keyword);
		};
	},
	bindEvent: function() {
		let _this = this;
		
		/* 搜索提交按钮事件 */
		$('#search-button').click(
			function() {
				_this.searchSubmit();
			}
		);
		
		/* 搜索输入键盘事件 */
		$('#search-input').keyup(
			function(e) {
				/* 如果键盘按下的是回车键 */
				if(e.keyCode === 13) {
					_this.searchSubmit();
				}
			}
		)
	},
	
	/* 搜索提交方法 */
	searchSubmit: function() {
		let keyword = $.trim($('#search-input').val());
		if(keyword) {
			window.location.href = './list.html?keyword=' + keyword;
		} else {
			/* 无搜索关键词时返回主页 */
			_mall.goHome();
		}
	}
};

// 仅供内部调用，无需 module.exports 
header.init();