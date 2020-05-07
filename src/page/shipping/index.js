'use strict';

require('./index.css');

let _mall = require('util/mall.js');
let _region = require('util/region/index.js');
let _shipping = require('service/shipping-service.js');
let templateShippingNew = require('./index.string');

let shipping = {
    bindEvent: function() {
        let _this = this;
        // 省份选定后获取城市
        this.$shippingNewWindow.find('#receiver-province').change(function() {
            let provinceId = $(this).val();
            _this.loadCities(provinceId);
        });
        // 城市选定后获取区县
        this.$shippingNewWindow.find('#receiver-city').change(function() {
            let cityId = $(this).val();
            _this.loadDistricts(_this.$shippingNewWindow.find('#receiver-province').val(), cityId);
        });
        // 提交保存收货地址
        this.$shippingNewWindow.find('.shipping-add-button').click(function() {
            let result = _this.getReceiverInfo(),
                isUpdate = _this.option.isUpdate;
            // 新增地址和更新地址的不同逻辑
            if(!isUpdate && result.status) {
                _shipping.addShipping(result.data, function(msg, data) {
                    _mall.successTips(msg);
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(data);
                }, function(err) {
                    _mall.errorTips(err);
                });
            } else if(isUpdate && result.status) {
                _shipping.updateShipping(result.data, function(msg, data) {
                    _mall.successTips(msg);
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(data);
                }, function(err) {
                    _mall.errorTips(err);
                });
            } else {
                _mall.errorTips(result.msg);
            }
        });
        // 点击关闭按钮或表单外部蒙版(排除表单），关闭弹窗
        this.$shippingNewWindow.find('.shipping-new-window').click(function(e) {
            e.stopPropagation();
        })
        this.$shippingNewWindow.find('.window-close').click(function() {
            _this.hide();
        });
    },

    // 弹窗表格
    show: function(option) {
        // option的绑定
        this.option = option;
        this.option.data = option.data || {};
        this.$shippingNewWindow = $('.mask-panel');
        // 渲染页面
        this.loadWindow();
        // 绑定事件
        this.bindEvent();
    },
    // 关闭弹窗
    hide: function() {
        this.$shippingNewWindow.empty();
    },

    loadWindow: function() {
        let shippingNewHtml = _mall.renderHtml(templateShippingNew, {
            isUpdate: this.option.isUpdate,
            data: this.option.data
        });
        this.$shippingNewWindow.html(shippingNewHtml);
        this.loadProvince();
    },

    // 加载省份选项
    loadProvince: function() {
        let provinceList = _region.getProvinces() || [],
            $provinceForm = this.$shippingNewWindow.find('#receiver-province');
        $provinceForm.html(this.getFormOption(provinceList));
        if(this.option.isUpdate && this.option.data.receiverProvince) {
            let provinceSelected = _region.getProvinceId(this.option.data.receiverProvince)
            $provinceForm.val(provinceSelected);
            this.loadCities(provinceSelected);
        } else {
            this.loadCities(0);
        }
    },
    // 加载城市选项
    loadCities: function(provinceId) {
        let cityList = _region.getCities(provinceId) || [],
            $cityForm = this.$shippingNewWindow.find('#receiver-city');
        $cityForm.html(this.getFormOption(cityList));
        if(this.option.isUpdate && this.option.data.receiverCity) {
            let cityId = _region.getCityId(provinceId, this.option.data.receiverCity);
            $cityForm.val(cityId);
            this.loadDistricts(provinceId, cityId);
        } else {
            this.loadDistricts(provinceId, 0);
        }
    },
    // 加载区县选项
    loadDistricts: function(provinceId, cityId) {
        let DistrictList = _region.getDistricts(provinceId, cityId) || [],
            $districtForm = this.$shippingNewWindow.find('#receiver-district');
        $districtForm.html(this.getFormOption(DistrictList));
        if(this.option.isUpdate && this.option.data.receiverDistrict) {
            $districtForm.val(_region.getDistrictId(provinceId, cityId, this.option.data.receiverDistrict));
        }
    },

    // 渲染可供选择的省市
    getFormOption: function(optionArray) {
        let html = '';
        for(let i=0, length=optionArray.length; i<length; i++) {
            html += '<option value="' + i + '">' + optionArray[i] + '</option>';
        }
        return html;
    },

    // 获取表单所有数据
    getReceiverInfo: function() {
        let receiverInfo = {},
            provinceId = this.$shippingNewWindow.find('#receiver-province').val(),
            cityId = this.$shippingNewWindow.find('#receiver-city').val(),
            districtId = this.$shippingNewWindow.find('#receiver-district').val();
        receiverInfo.id = this.$shippingNewWindow.find('#shipping-id').val();
        receiverInfo.receiverName = $.trim(this.$shippingNewWindow.find('#receiver-name').val());
        receiverInfo.receiverProvince = $.trim(_region.getProvince(provinceId));
        receiverInfo.receiverCity = $.trim(_region.getCity(provinceId, cityId));
        receiverInfo.receiverDistrict = $.trim(_region.getDistrict(provinceId, cityId, districtId));
        receiverInfo.receiverAddress = $.trim(this.$shippingNewWindow.find('#receiver-address').val());
        receiverInfo.receiverPhone = $.trim(this.$shippingNewWindow.find('#receiver-phone').val());
        receiverInfo.receiverZip = $.trim(this.$shippingNewWindow.find('#receiver-zip').val());

        return this.formValidate(receiverInfo);

    },
    // 表单数据验证
    formValidate: function(receiverInfo) {
        let result = {
            status: false,
            msg: '',
            data: receiverInfo
        };
        // 如果收件人姓名为空
        if(!_mall.validate(receiverInfo.receiverName, 'require')) {
            result.msg = '收件人姓名不能为空';
            return result;
        }
        // 如果详细地址为空
        if(!_mall.validate(receiverInfo.receiverAddress, 'require')) {
            result.msg = '详细地址不能为空';
            return result;
        }
        // 验证手机号码格式
        if(!_mall.validate(receiverInfo.receiverPhone, 'phone')) {
            result.msg = '手机号码格式不正确';
            return result;
        }
        // 如果邮政编码格式不正确
        if (!('' === receiverInfo.receiverZip) && !(/^[1-9]\d{5}$/.test(receiverInfo.receiverZip))) {
            result.msg = '邮政编码格式有误';
            return result;
        }
        // 数据验证全通过
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

module.exports = shipping;