/**
 * Компонент "Подсказка".
 
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
 * @license CellTip.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.CellTip
 * @extends Ext.tip.ToolTip
 * Подсказка ячейки списка.
 */
Ext.define('Ge.view.grid.CellTip', {
    extend: 'Ext.tip.ToolTip',
    baseCls: 'g-grid-celltip',
    trackMouse: true,
    shadow: false,
    renderTo: Ext.getBody(),

    /**
     * @cfg {Array} Столбцы списка.
     */
    columns: [],

    /**
     * @cfg {Array} Шаблоны подсказок.
     */
    templates: [],

    /**
     * Инициализация компонента.
     * @param {Object} config Параметры инициализации.
     */
    initComponent : function (config) {
        var me = this;
        Ext.each(me.columns, function (column, index) {
            if (typeof column.cellTip != 'undefined') {
                me.templates[me.grid.id + '.' + column.dataIndex] = new Ext.XTemplate(column.cellTip);
            }
        });

        me.callParent();
    },

    /**
     * Обработчик событий списка.
     * @cfg {Object}
     */
    listeners: {
        /**
         * Событие после удаления компонента.
         * @param {Ge.view.grid.CellTip} me
         * @param {Object} eOpts Параметры слушателя.
         */
         destroy: function (me, eOpts) {
            Ext.each(me.columns, function (column, index) {
                column.destroy();
            });
            me.columns = [];
         }
    }
});
