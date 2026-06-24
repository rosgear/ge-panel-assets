/**
 * Плагин "Расширитель строки".
 
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
 * @license RowExpander.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.plugin.RowExpander
 * @extends Ext.grid.plugin.RowExpander
 * Плагин "Расширитель строки списка".
 */
Ext.define('Ge.view.grid.plugin.RowExpander', {
    extend: 'Ext.grid.plugin.RowExpander',
    alias: 'plugin.g-rowexpander',

    /**
     * @cfg {String} rowBodyTpl
     * Шаблон строки по умолчанию.
     */
    rowBodyTpl: '<div class="g-grid__rowbody-waiting">' + Ext.Txt.waiting + '</div>',

    /**
     * @cfg {Boolean} [cacheAjaxTpls=true]
     * Если true, делать только один AJAX запрос для получения шаблона строки.
     */
    cacheAjaxTpls: true,

    /**
     * Конструктор.
     * @param {Object} config Конфигурация плагина.
     */
    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);
        me.callParent(arguments);
    
        me.rowBodyCache = {};
    },

    /**
     * Возвращает контент тела строки с приминением шаблона.
     * @param {String} rowBodyTpl Шаблон.
     * @return {String}
     */
    getRowBodyContentsFn: function (rowBodyTpl) {
        var me = this;
        return function (rowValues) {
            rowBodyTpl.owner = me;
            if (Ext.isDefined(me.rowBodyCache[rowValues.record.id]))
                return me.rowBodyCache[rowValues.record.id];
            else
                return rowBodyTpl.applyTemplate(rowValues.record.getData());
        }
    },

    /**
     * Инициализация плагина.
     * @param {Ext.grid.Panel} grid Список.
     */
    init: function (grid) {
        var me = this;

        me.callParent(arguments);
        me.view.on('expandbody', me.expandRow, me);
    },

    /**
     * Развернуть строку списка.
     * @event expandbody
     * @param {HTMLElement} rowNode Элемент "<tr>", которому принадлежит расширенная строка.
     * @param {Ext.data.Model} record Запись, предоставляющая данные.
     * @param {HTMLElement} expandRow Элемент "<tr>", содержащий расширенные данные.
     * @param {Object} eOpts Параметры слушателя.
     */
    expandRow: function (rowNode, record, expandRow, eOpts) {
        var me = this;
        if (Ext.isDefined(me.rowBodyCache[record.id]) && me.cacheAjaxTpls) return;
        me.grid.mask(Ext.Txt.waiting);
        Ext.Ajax.request({
            url:  Ge.url.build(me.cmp.router.build('expandRow', { id: record.id })),
            method: 'POST',
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                me.grid.unmask();
                var response = Ge.response.normalize(response);
                if (!response.success) {
                    Ext.Msg.exception(response);
                    return;
                }
                me.rowBodyCache[record.id] = response.data;
                me.grid.getView().refresh();
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: function (response, opts) {
                me.grid.unmask();
                Ext.Msg.exception(response, true, true);
            }
        });
    }
});