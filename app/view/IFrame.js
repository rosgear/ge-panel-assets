/**
 * Виджет "IFrame".
 
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
 * @license IFrame.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.IFrameHistory
 * Класс истории переходов страниц плавающего фрейма.
 */
Ext.define('Ge.view.IFrameHistory', {
    extend: 'Ext.util.Collection',

    /**
     * @cfg {Ge.view.IFrame} frame
     * Плавающий фрейм.
     */
    frame: null,

    /**
     * Добавляет страницу фрейма в историю.
     */
    push: function () {
        let url = this.frame.getSrc(),
            index = this.indexOfKey(url);
        if (index === -1) {
            this.add({id: url});
        }
    },

    /**
     * Устанавливает фрейму указанную страницу из истории.
     * @return {Numeric} index Порядковый номер страницы в истории.
     */
    go: function (index) {
        let url = this.frame.getSrc(),
            indexOf = this.indexOfKey(url);
        if (indexOf !== -1) {
            let item = this.getAt(indexOf + index);
            if (item) {
                this.frame.setSrc(item.id);
                return true;
            }
        }
        return false;
    },

    /**
     * Проверяет, можно ли установить фрейму указанную страницу из истории.
     * @return {Numeric} index Порядковый номер страницы в истории.
     */
    canGo: function (index) {
        let url = this.frame.getSrc(),
            indexOf = this.indexOfKey(url);
        if (indexOf !== -1) {
            let item = this.getAt(indexOf + index);
            if (item) return true;
        }
        return false;
    },

    /**
     * Проверяет, можно ли установить фрейму предыдущую страницу из истории.
     * @return {Boolean}
     */
    canBack: function () { return this.canGo(-1); },

    /**
     * Проверяет, можно ли установить фрейму следующую страницу из истории.
     * @return {Boolean}
     */
    canForward: function () { return this.canGo(1); },

    /**
     * Устанавливает фрейму предыдущую страницу из истории.
     * @return {Boolean} Возвращает значение `true` если страница установлена.
     */
    back: function () { return this.go(-1); },

    /**
     * Устанавливает фрейму следующую страницу из истории.
     * @return {Boolean} Возвращает значение `true` если страница установлена.
     */
    forward: function () { return this.go(1); }
});


/**
 * @class Ge.view.IFrame
 * Класс плавающего фрейма.
 */
Ext.define('Ge.view.IFrame', {
    extend: 'Ext.Component',
    xtype: 'g-iframe',
    alias: 'widget.iframe',
    renderTpl: [
        '<iframe src="{src}" id="{id}-iframeEl" data-ref="iframeEl" name="{frameName}" width="{width}" height="{height}" frameborder="0"></iframe>'
    ],
    childEls: ['iframeEl'],

    /**
     * @cfg {Ge.view.IFrameHistory} history
     * История переходов по фрейму.
     */
    history,

    /**
     * @cfg {String} loadMask
     * Текст маски загрузки фрейма.
     */
    loadMask: 'Loading...',

    /**
     * @cfg {String} src
     * URL-адрес фрейма.
     */
    src: 'about:blank',

    /**
     * @cfg {String} frameWidth
     * Ширина фрейма.
     */
    frameWidth: '100%',

    /**
     * @cfg {String} frameHeight
     * Высота фрейма.
     */
    frameHeight: '100%',

    /**
     * @cfg {String} frameName
     * Имя фрейма.
     */
     frameName: '',

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.callParent();

        this.frameName = this.frameName || this.id + '-frame';
        this.history = new Ge.view.IFrameHistory({frame: this});
        this.focus();
    },

    /**
     * Инициализация событий компонента.
     */
    initEvents : function() {
        var me = this;

        me.callParent();
        me.iframeEl.on('load', me.onLoad, me);
        // me.iframeEl.on('click', me.onClick, me);
    },

    /**
     * Инициализация свойств фрейма.
     */
    initRenderData: function() {
        return Ext.apply(this.callParent(), {
            src: this.src,
            width: this.frameWidth,
            height: this.frameHeight,
            frameName: this.frameName
        });
    },

    /**
     * Возвращает тело документа фрейма.
     * @return {HTMLElement} 
     */
    getBody: function() {
        var doc = this.getDoc();
        return doc.body || doc.documentElement;
    },

    /**
     * Возвращает документ фрейма.
     * @return {Document|null} 
     */
    getDoc: function() {
        try {
            return this.getWin().document;
        } catch (ex) {
            return null;
        }
    },

    /**
     * Возвращает окно фрейма.
     * @return {Window} 
     */
    getWin: function() {
        var me = this,
            name = me.frameName,
            win = Ext.isIE
                ? me.iframeEl.dom.contentWindow
                : window.frames[name];
        return win;
    },

    /**
     * Возвращает DOM фрейма.
     * @return {HTMLElement} 
     */
    getFrame: function() { return this.iframeEl.dom; },

    /**
     * Возвращает URL-адрес страницы фрейма.
     * @return {String} 
     */
    getSrc: function () { return this.getWin().location.href; },

    /**
     * Устанавливает URL-адрес странице фрейма.
     * @param {String} src URL-адрес страницы фрейма.
     * @return {String} 
     */
    setSrc: function (src) { this.getFrame().src = src; },

    /**
     * Загружает страницу фрейма по указанному URL-адрес.
     * @param {String} src URL-адрес страницы фрейма.
     * @return {String} 
     */
    loadSrc: function (src) { this.getFrame().src = src; },

    /**
     * Событие перед удалением фрейма.
     */
    beforeDestroy: function () {
        this.cleanupListeners(true);
        this.callParent();
    },

    /**
     * Удаление слушателей событий фрейма.
     * @param {String} destroying Удалить каждое свойство слушателя.
     */
    cleanupListeners: function (destroying) {
        var doc, prop;

        if (this.rendered) {
            try {
                doc = this.getDoc();
                if (doc) {
                    Ext.get(doc).un(this._docListeners);
                    if (destroying) {
                        for (prop in doc) {
                            if (doc.hasOwnProperty && doc.hasOwnProperty(prop)) {
                                delete doc[prop];
                            }
                        }
                    }
                }
            } catch (e) { }
        }
    },

    /**
     * Событие загрузки страницы фрейма.
     */
    onLoad: function() {
        var me = this,
            doc = me.getDoc(),
            fn = me.onRelayedEvent;

        if (doc) {
            try {
                // Эти события необходимо передать из внутреннего документа (где они 
                // перестают всплывать) во внешний документ. Это необходимо сделать на 
                // уровне DOM, чтобы событие достигло слушателей тела документа. 
                Ext.get(doc).on(
                    me._docListeners = {
                        mousedown: fn, // закрытие меню (MenuManager) и Window onMouseDown
                        mousemove: fn, // обнаружение перетаскивания изменения размера окна
                        mouseup: fn,   // прекращение изменения размера окна
                        click: fn,
                        dblclick: fn, 
                        scope: me
                    }
                );
            } catch (e) {
                // не могу этого сделать xss
            }

            Ext.get(this.getWin()).on('hashchange', me.onHashChange, me);

            // нужно быть уверенными, что удалили все события из iframe при выгрузке, иначе произойдет учтечка
            Ext.get(this.getWin()).on('beforeunload', me.cleanupListeners, me);

            this.el.unmask();
            this.history.push();
            this.fireEvent('load', this);
        } else if (me.src) {
            this.el.unmask();
            this.fireEvent('error', this);
        }
    },

    /**
     * Событие по ретрансляции событий фрейма.
     * @param {Event} event
     */
    onRelayedEvent: function (event) {
        // ретранслировать событие из документа iframe в документ, которому принадлежит iframe...
        var iframeEl = this.iframeEl,
            // Получить позицию iframe слева
            iframeXY = iframeEl.getTrueXY(),
            originalEventXY = event.getXY(),
            // Получите позицию XY слева.
            // Это связано с тем, что потребитель внедренного события будет 
            // выполнить собственную нормализацию RTL.
            eventXY = event.getTrueXY();

        // событие из внутреннего документа имеет XY относительно источника этого документа, поэтому настройте его так, чтобы он использовал источник iframe во внешнем документе:
        event.xy = [iframeXY[0] + eventXY[0], iframeXY[1] + eventXY[1]];
        event.injectEvent(iframeEl);
        event.xy = originalEventXY; // восстановить исходный XY (просто для безопасности)
    },

    /**
     * Событие при смене параметров URL-адреса фрейма.
     */
    onHashChange: function () { this.fireEvent('changeurl', this); },

    /**
     * Загрузить страницу фрейма по указанному URL-адресу.
     * @param {String} src URL-адрес сайта.
     */
    load: function (src) {
        var me = this,
            text = me.loadMask,
            frame = me.getFrame();

        if (me.fireEvent('beforeload', me, src) !== false) {
            if (text && me.el) {
                me.el.mask(text);
            }

            frame.src = me.src = (src || me.src);
        }
    },

    /**
     * Обновить страницу фрейма.
     */
    reload: function () { this.load(this.getFrame().src); }
});