/**
 * Панель отображения данных.
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
 * @license Panel.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.data.View
 * @extends Ext.view.View
 * Шаблон отображения данных.
 */
 Ext.define('Ge.view.data.View', {
    extend: 'Ext.view.View',
    xtype: 'g-dataview',
    /**
     * @cfg {Number|String} padding
     * Отступ для этого компонента.
     */
    padding: 0,
    /**
     * @cfg {Boolean|String|Object} scrollable
     * Параметры конфигурации, позволяющие прокручивать этот компонент.
     */
    scrollable: true,
    /**
     * @cfg {Boolean} trackOver
     * Применять стиль к элементам при наведении на них курсора.
     */
    trackOver: true
});


/**
 * @class Ge.view.data.Panel
 * @extends Ext.panel.Panel
 * Панель отображения данных.
 */
Ext.define('Ge.view.data.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'g-datapanel',
    layout: 'fit',

    /**
     * @cfg {Ge.view.data.View} dataView
     * Шаблон отображения данных.
     */
    dataView: {},

    /**
     * @cfg {Ge.ActionRouter} router
     * Маршрутизация при  выполнении действия с формой.
     */
    router: {},

    /**
     * @cfg {String} defaultRoute
     * Маршрут к данным по умолчанию.
     */
    defaultRoute: 'data',

    /**
     * @cfg {Ext.data.Store|null} store
     * Источник данных.
     */
    store: null,

    /**
     * @cfg {Ge.view.plugin.PageSize|null} pagingtoolbar
     * Пагинатор.
     */
    pagingtoolbar: null,

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        let me = this;

        me.router = new Ge.ActionRouter(me.router || {});

        me.store = me.initStore();
        me.dataView = Ext.create(
            'Ge.view.data.View', 
            Ext.applyIf({ store: me.store }, me.dataView)
        );
        me.items = [me.dataView];

        /**
         * Инициализация панели инструментов и пагинатора.
         */
         if (this.dockedItems == null) {
            this.dockedItems = [];
        }
        if (this.pagingtoolbar !== null) {
            this.pagingtoolbar.store = me.store;
            this.dockedItems.push(this.pagingtoolbar);
        }

        this.callParent();
    },

    /**
     * Инициализация хранилища.
     * @return {Ext.data.Store}
     * @private
     */
     initStore: function () {
        var me = this;

        // получить URL-адрес из маршрута
        if (Ext.isDefined(me.store.proxy)) {
            me.store.proxy.url = Ge.url.build(
                me.router.build(me.defaultRoute)
            );
        }
        // получить модель данных
        if (Ext.isDefined(me.store.model)) {
            me.store.model = Ext.create('Ext.data.Model', me.store.model);
        }
        /**
         * Обработчик событий хранилища списка {Ext.data.Store}.
         * @cfg {Object}
         */
         me.store.listeners = {
            /**
             * Загрузка.
             * @param {Ext.data.Store} me
             * @param {Ext.data.Model} records  Записи.
             * @param {Boolean} successful Если true, операция прошла успешно.
                 *@param {Object} eOpts Параметры слушателя.
                */
            load: function (me, records, successful, operation, eOpts) {
                if (!successful) {
                    if (operation._response == null)
                        Ext.Msg.exception('Could not response for request "' + operation.request._url + '"', false, true);
                    else
                        Ext.Msg.exception(operation._response.responseText, true, true);
                }
            }
        };
        return Ext.create('Ext.data.Store', me.store);
    },

    /**
     * Возвращает хранилище.
     * @return {Ext.data.Store|null}
     */
    getStore: function () { return this.store; },

    /**
     * Возвращает модель выделение элементов.
     * @return {Object|Ext.selection.DataViewModel}
     */
    getSelectionModel: function () { return this.dataView.getSelectionModel(); },
});