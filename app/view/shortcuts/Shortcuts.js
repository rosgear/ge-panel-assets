/**
 * Виджет макета отображения доступных модулей, плагинов и т.д.
 
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
 * @license Shortcuts.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.shortcuts.Shortcuts
 * @extends Ext.view.View
 */
Ext.define('Ge.view.shortcuts.Shortcuts', {
    extend: 'Ext.view.View',
    xtype: 'g-shortcuts',
    cls: 'g-shortcuts g-shortcuts_background',
    requires: ['Ge.view.shortcuts.ShortcutsController'],
    controller: 'shortcuts',
    padding: 0,

    /**
     * Инициализация хранилища.
     * @return {Ext.data.Store}
     * @private
     */
    initStore: function () {
        var me = this;
        me.store = {
            model: Ext.create('Ext.data.Model', {
                fields: [
                   {name: 'title'},
                   {name: 'description'},
                   {name: 'tooltip'},
                   {name: 'icon'},
                   {name: 'iconCls'},
                   {name: 'cls'},
                   {name: 'disabled'}
                ]
            }),
            proxy: {
                type: 'ajax',
                url: Ge.url.build(me.router.build('data')),
                actionMethods: { read: 'POST' },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            listeners: {
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
            }
        };
        return me.store;
    },

    /**
     * Инициализация компонента.
     * @param {Object} config Параметры инициализации.
     */
    initComponent: function (config) {
        var me = this;

         me.router = new Ge.ActionRouter(me.router || {});

        Ext.apply(this, {
            store: me.initStore()
        });

        me.callParent(arguments);
    },
    tpl: [
        '<tpl for=".">',
            '<div class="g-shortcuts__item {disabled} {cls}" title="{tooltip}">',
                '<div class="g-shortcuts__thumb"><img class="{iconCls}" src="{icon}" title="{title:htmlEncode}"><div class="g-shortcuts__thumb-title">{title}</div><div class="g-shortcuts__thumb-description">{description}</div></div>',
            '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],
    multiSelect: true,
    trackOver: true,
    overItemCls: 'g-shortcuts__item_over',
    selectedItemCls: 'g-shortcuts__item_selected',
    itemSelector: 'div.g-shortcuts__item',
    listeners: {
        /**
         * Событие после рендера компонента.
         * @param {Ge.view.shortcuts.Shortcuts} me
         * @param {Object} eOpts Параметры слушателя.
         */
        afterrender: function (me) {
            me.store.load();
        },
        /**
         * Событие при клике на элементе.
         * @param {Ge.view.shortcuts.Shortcuts} me
         * @param {Ext.data.Model} record Запись, которая принадлежит элементу.
         * @param {HTMLElement} Элемент.
         * @param {Number} Индекс элемента.
         * @param {Ext.event.Event} e Необработанный объект события.
          *@param {Object} eOpts Параметры слушателя.
         */
        itemclick: function (me, record, item, index, e, eOpts) {
            Ge.getApp().widget.load(record.data.widgetUrl);
        }
    }
});