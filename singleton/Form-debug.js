/**
 * Класс Формы.
 *
 * Этот файл является частью GePanel.
 *
 * Copyright (c) 2015 RosGear
 * 
 * Contact: https://rosgear.ru/
 *
 * @author    Anton Tivonenko
 * @copyright (c) 2015, by Anton Tivonenko, anton.tivonenko@gmail.com
 * @date      Oct 01, 2015
 * @version   $Id: 1.0 $
 *
 * @license form.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */
 
Ext.namespace('Ge', 'Ge.singleton', 'Ge.singleton.form');

/**
 * @class Ge.singleton.form.Mask
 * @extends Ext.util.Observable
 * Маска формы при обработке данных.
 */
 Ge.singleton.form.Mask = Ext.extend(Ext.util.Observable, {
    /**
     * Конструктор.
     */
    constructor: function (config) {
        Ext.apply(this, config, { id: 'g-bs-mask' });
        this.mask = Ext.get(this.id);
    },

    /**
     * Скрыть маску.
     */
    hide: function(){ this.mask.hide(); },

    /**
     * Показать маску.
     */
    show: function(){ this.mask.show(); }
});

/**
 * @class Ge.singleton.form.Message
 * @extends Ext.util.Observable
 * Сообщение формы.
 */
 Ge.singleton.form.Message = Ext.extend(Ext.util.Observable, {
    /**
     * Конструктор.
     */
    constructor: function (config) {
        Ext.apply(this, config, { id: 'g-notify' });
        this.owner = Ext.get(this.id);
        this.content = this.owner.select(".g-notify__notice div").first();
        this.wrap = this.owner.select(".g-notify__notice").first();
    },

    /**
     * Задать текст сообщения.
     * @param {String} Текст.
     * @return {Ge.singleton.form.Message}
     */
    set: function (text) {
        this.content.el.dom.innerHTML = text;
        return this;
        
    },

    /**
     * Показать сообщение.
     * @param {String} Тип сообщения: error, success, warning.
     * @param {String} Текст сообщения.
     * @return {Ge.singleton.form.Message}
     */
    show: function (type, text) {
         this.wrap.set({"class":"g-notify__notice notice_" + type});
         this.wrap.fadeIn();
         this.set(text);
         return this;
    },

    /**
     * Скрыть сообщение.
     * @return {Ge.singleton.form.Message}
     */
    hide: function () {
        this.wrap.fadeOut();
        this.set('');
        return this;
    }
});

/**
 * @class Ge.singleton.form.Validator
 * @extends Ext.util.Observable
 * Валидатор формы.
 */
Ge.singleton.form.Validator = Ext.extend(Ext.util.Observable, {
    /**
     * Конструктор.
     * @param {Object} config
     */
    constructor: function (config) {
        var o = this;
        o.config = config;

        Ext.apply(o, config, {
            msgEmpty: 'Вы не заполниили поле "{0}"!',
            msgMinLength: 'Длина значения поля "{0}", должна быть больше {1} символов!',
            msgMaxLength: 'Длина значения поля "{0}", должна быть меньше {1} символов!',
            msgRange: 'Длина значения поля "{0}", должна быть от {1} до {2} символов!',
            msgMask: 'Значение поля "{0}", содержит не корректные символы!',
            form: null,
            message: null,
            items: []
        });
        if (o.message == null)
            o.message = new Ge.singleton.form.Message();
    },

    /**
     * Проверка значения на пустоту.
     * @param {String} value Проверяемое значение.
     * @return {String|Boolean}
     */
    validateEmpty: function (value) {
        if (value.length > 0) return true;
        return this.msgEmpty
    },

    /**
     * Проверка диапазона значений.
     * @param {String} value Проверяемое значение.
     * @param {Integer} min Минимальное значение.
     * @param {Integer} max Максимальное значение.
     * @return {String|Boolean}
     */
    validateRange: function (value, min, max) {
        if (min != null && max != null) {
            if (value >= min && value <= max) return true;
        } else
            return true;
        return this.msgRange;
    },

    /**
     * Проверка диапазона значений.
     * @param {String} value Проверяемое значение.
     * @param {Integer} min Минимальное значение.
     * @param {Integer} max Максимальное значение.
     * @return {String|Boolean}
     */
    validateMask: function (value, mask) {
        if (mask == null) return true;
        if ((new RegExp(mask)).test(value)) return true;
        return this.msgMask
    },

    /**
     * Проверка значений полей формы.
     * @return {String|Boolean}
     */
    validate: function () {
        if (this.form == null) return false;

        this.message.hide();
        this.items = this.form.select('input[data-validate=true]').elements;
        for (var item, correct, title, i = 0; i < this.items.length; i++) {
            item = this.items[i];
            title = item.getAttribute('data-title');
            
            correct = this.validateEmpty(item.value);
            if (correct !== true) {
                this.failure(item, String.format(correct, title));
                return false;
            }
            correct = this.validateRange(item.value.length, item.getAttribute('data-min'), item.getAttribute('data-max'));
            if (correct !== true) {
                this.failure(item, String.format(correct, title, item.getAttribute('data-min'), item.getAttribute('data-max')));
                return false;
            }
            correct = this.validateMask(item.value, item.getAttribute('data-mask'));
            if (correct !== true) {
                this.failure(item, String.format(correct, title));
                return false;
            }
        }
        this.success();
    },

    /**
     * Ошибка если одно из полей формы проверку не прошло.
     */
    failure: function (item, message) {
        item.focus();
        this.message.show('warning', message);
    },

    /**
     * Успех если все поля формы проверку прошли.
     */
    success: function() { }
});

/**
 * @class Ge.singleton.form.Form
 * @extends Ext.util.Observable
 * Форма.
 */
Ge.singleton.form.Form = Ext.extend(Ext.util.Observable, {
    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        var me = this;
        me.config = config;

        Ext.apply(me, config, {
            id: 'form',
            initConfig: {
                validator: {},
                message: {}
            }
        });
        /**
         * Инициализация формы.
         */
        me.init = function () {
            this.captcha = null;
            this.form = Ext.get(this.id);
            // маска
            this.mask = new Ge.singleton.form.Mask();
            // сообщение
            this.message = new Ge.singleton.form.Message(this.initConfig.message);
            // валидатор
            this.initConfig.validator.form = this.form;
            this.initConfig.validator.message = this.message;
            this.validator = new Ge.singleton.form.Validator(this.initConfig.validator);
            this.validator.success = function () {
                me.send();
            }
        };
        /**
         * Инициализация событий формы.
         */
        me.initEvents = function () {
            if (this.form !== null)
                Ext.get('submit').on('click', function (e) { me.validator.validate(); });
        };

        me.init();
        me.initEvents();
        me.focus();
        me.keydown();
    },

    /**
     * Событие "keydown" полей формы.
     */
    keydown: function () {
        var me = this;
        this.form.select('input[class^=input]').on('keydown', function (e) {
            if (e.keyCode == 13) me.validator.validate();
        });
    },

    /**
     * Фокус на одном из элементов формы после ее отображения.
     */
    focus: function () {},

    /**
     * Сброс значений полей формы.
     */
    reset: function () { this.form.dom.reset(); },

    testCaptcha: function () {
        if (this.captcha === null) {
            this.captcha = Ext.get('icaptcha');
            if (this.captcha) {
                this.captcha.set({'src-data': this.captcha.getAttribute('src')});
            }
        }
        if (this.captcha) {
            this.captcha.set({'src': this.captcha.getAttribute('src-data') + '?_dc=' + (new Date()).getTime()});
        }
    },

    onFailure: function () {},

    /**
     * Отправка значений полей формы.
     */
    send: function () {
            var me = this;
            me.mask.show();
            me.message.hide();
            Ext.Ajax.request({
                url: me.form.getAttribute('action'),
                form: me.form.id,
                headers: { 'X-Gjax': true },
                /**
                 * Успешное выполнение запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                success: function (response, opts) {
                    me.mask.hide();
                    me.reset();
                    var json = null;
                    if (response.responseText.length == 0) {
                        me.message.show('error', 'Error: response from server is empty');
                        me.onFailure();
                        return;
                    }
                    try {
                        json = Ext.decode(response.responseText);
                    } catch(e) {
                        me.message.show('error', response.responseText);
                        me.onFailure();
                        return;
                    }
                    if (json.success) {
                        if (json.message)
                            me.message.show('success', json.message);
                    } else {
                        if (typeof json.script != 'undefined') {
                            json.message = 'Message: ' + json.script.level + '<br>Script: ' + json.script.file + ' (' + json.script.line + ')' + '<br>Error: ' + json.script.msg;
                        }
                        if (json.message) {
                            if (Ext.isObject(json.message))
                                json.message = json.message.text;
                            me.focus();
                            me.message.show('error', json.message);
                            me.onFailure();
                        }
                    }
                    me.testCaptcha();
                    if (json.redirect != null && json.success) {
                        setTimeout(function () {
                            window.document.location = decodeURI(json.redirect);
                        }, 2000);
                    }
                },
                /**
                 * Ошибка запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                failure: function (response, opts) {
                    me.mask.hide();
                    me.testCaptcha();
                    me.onFailure();
                    if (response.status == 404)
                        me.message.show('error', 'Error: 404 (not found)');
                    else {
                        var json = null;
                        try {
                            json = Ext.decode(response.responseText);
                        } catch(e) {
                            me.message.show('error', response.responseText);
                            return;
                        }
                        if (typeof json.script != 'undefined') {
                            json.message = 'Message: ' + json.script.level + '<br>Script: ' + json.script.file + ' (' + json.script.line + ')' + '<br>Error: ' + json.script.msg;
                        }
                        if (json.message) {
                            if (Ext.isObject(json.message))
                                json.message = json.message.text;
                            me.focus();
                            me.message.show('error', json.message);
                        }
                    }
                }
            });
    }
});