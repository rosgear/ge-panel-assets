/**
 * Маска (загрузки, сообщений).
 
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
 * @license Mask.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.Mask
 * Базовый класс маски.
 */
Ext.define('Ge.Mask', {
    /**
     * @cfg {Ge.Application} app 
     * Приложение.
     */
    app: null,

    /**
     * @cfg {String} effectCls 
     * Имя стиля эффекта маски.
     */
    effectCls: 'g-mask_blur',

    /**
     * @cfg {Boolean} useEffect 
     * Применить эффект маски.
     */
    useEffect: true,

    /**
     * @cfg {Array} effectTo 
     * Применить эффект для компонентов (идент.).
     */
    effectTo: ['g-header', 'g-navigator', 'g-widgets'],

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        Ext.apply(this, config);

        this.tagBody = Ext.get('body');
    },

    /**
     * Показать эффект маски.
     */
    showEffect: function () {
        var me = this;
        Ext.Array.each(this.effectTo, function (item, index, allItems) { Ext.get(item).addCls(me.effectCls); });
    },

    /**
     * Скрыть эффект маски.
     */
    hideEffect: function () {
        var me = this;
        Ext.Array.each(this.effectTo, function (item, index, allItems) { Ext.get(item).removeCls(me.effectCls); });
    },

    /**
     * Показать маску.
     * @param {Object} config
     */
    show: function (config) {
        if (this.useEffect)
            this.showEffect();
        this.mask.show();
    },

    /**
     * Скрыть маску.
     */
    hide: function () {
        if (this.useEffect)
            this.hideEffect();
        this.mask.hide();
    }
});


/**
 * @class Ge.LoadMask
 * @extends Ge.Mask
 * Класс маски загрузчика.
 */
Ext.define('Ge.LoadMask', {
    id: 'g-mask-load',
    extend: 'Ge.Mask',

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        this.callParent(arguments); 
        var me = this;

        this.mask = this.tagBody.createChild({
            tag: 'div',
            id: me.id,
            cls: 'g-mask g-mask_load',
            html: '<div class="g-mask__loader-wrap">' +
                      '<div class="g-mask__loader"></div>' +
                      '<div class="g-mask__loader-title"></div>' +
                   '</div>'
        }); 
    },

    /**
     * Установка заголовка маски.
     * @param {String} title Заголовок.
     */
    setTitle: function (title) {
        this.mask.select('.loader-title').update(title)
    },

    /**
     * Показать маску.
     * @param {String} msg Сообщение маски.
     */
    show: function (msg) {
        this.callParent(arguments);

        Ext.applyIf(msg, { title: '' });

        this.setTitle(msg.title);
    }
});


/**
 * @class Ge.MessageMask
 * @extends Ge.Mask
 * Класс маски сообщения.
 */
Ext.define('Ge.MessageMask', {
    id: 'g-mask-message',
    extend: 'Ge.Mask',

    /**
     * @cfg {String} icon 
     * Значок.
     */
    icon: '',

    /**
     * @cfg {String} type 
     * Вид значка (svg, svg-m, glyph).
     */
    type: '',

    /**
     * @cfg {String} msg 
     * Сообщение.
     */
    msg: '',

    /**
     * @cfg {String} title 
     * Заголовок сообщения.
     */
    title: '',

    /**
     * @cfg {String} action 
     * Действие на которое появляется сообщение.
     */
    action: null,

    /**
     * @cfg {Object} actions 
     * Действия по умолчанию, определяющие параметры сообщения.
     */
    actions: {
        // не прав доступа
        access: {
            type: 'svg',
            icon: 'access'
        },
        // сообщение
        message: {
            type: 'svg',
            icon: 'message'
        },
        // информация
        info: {
            type: 'svg',
            icon: 'info'
        },
        // ошибка
        error: {
            type: 'svg',
            icon: 'error'
        },
        // разрыв соединения
        brokenConnection : {
            type: 'glyph',
            icon: 'fas fa-plug'
        },
        // ошибка соединения с сервером
        connection: {
            type: 'svg',
            icon: 'connect'
        },
        // ошибка соединения с бд
        dbConnection: {
            type: 'svg',
            icon: 'db-connect'
        }
    },

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        this.callParent(arguments); 
        var me = this;

        this.mask = this.tagBody.createChild({
            tag: 'div',
            id: me.id,
            cls: 'g-mask g-mask_white',
            html: '<div class="g-mask__body">' +
                      '<div class="g-mask__title"></div>' + 
                      '<div class="g-mask__inner">' +
                          '<div class="g-mask__icon"></div>' +
                          '<div class="g-mask__text"></div>' +
                      '</div>' +
                      '<div class="g-mask__buttons"><button>Закрыть</button></div>' +
                   '</div>'
        }); 
        var btn = this.mask.select('#' + me.id + ' button').first();
        this.btn = Ext.get(btn);
        this.btn.on('click', function(){ me.hide(); });
        this.body = this.mask.select('#' + me.id + ' .g-mask__body').first();
    },

    /**
     * Обновление контейнера значка.
     * @param {Object} cnt
     * @param {String} icon
     * @param {String} type
     */
    updateIcon: function (cnt, icon, type) {
        switch (type) {
            case 'svg':
                cnt.setCls('g-mask__icon g-icon-svg g-icon_msg-' + icon).update('');
                break;

            case 'glyph':
                cnt.setCls('g-mask__icon g-glyph').update('<i class="' + icon + '"></i>');
                break;
        }
    },

    /**
     * Установка значка.
     * @param {String} icon
     * @param {String} type
     * @return {Ge.MessageMask}
     */
    setIcon: function (icon, type = 'glyph') {
        var mskInner = this.mask.select('.g-mask__inner'),
            mskIcon  = this.mask.select('.g-mask__icon');
        
        this.icon = icon;
        this.type = type;
        if (icon.length > 0) {
            mskInner.setCls('g-mask__inner g-mask__inner_icon');
            this.updateIcon(mskIcon, icon, type);
        } else {
            mskInner.setCls('g-mask__inner').update('');
        }
        return this;
    },

    /**
     * Установка заголовка маски.
     * @param {String} title Заголовок.
     * @return {Ge.MessageMask}
     */
    setTitle: function (title) {
        this.title = title;
        this.mask.select('.g-mask__title').update(title)
        return this;
    },

    /**
     * Установка сообщения маски.
     * @param {String} msg Сообщение.
     * @return {Ge.MessageMask}
     */
    setMsg: function (msg) {
        this.msg = msg;
        this.mask.select('.g-mask__text').update(msg);
        return this;
    },

    /**
     * Определения значка из действия.
     * @param {String} action
     */
    defineIcon: function (action) {
        if (Ext.isDefined(this.actions[action])) {
            var src = this.actions[action];
            this.setIcon(src.icon, src.type);
        }
    },

    /**
     * Показать маску.
     * @param {String} msg Сообщение.
     * @return {Ge.MessageMask}
     */
    show: function (msg) {
        this.callParent(arguments);

        Ext.applyIf(msg, { title: '', message: '', icon: 'info', type: 'svg', action: null });
        if (msg.action !== null)
            this.defineIcon(msg.action);
        else
            this.setIcon(msg.icon, msg.type);
        this.setTitle(msg.title);
        this.setMsg(msg.message);
        return this;
    }
});