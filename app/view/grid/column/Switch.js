/**
 * Плагин столбца "Переключатель".
 
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
 * @license Switch.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.column.Switch
 * @extends Ext.grid.column.Column
 * Плагин столбца "Переключатель".
 */
Ext.define('Ge.view.grid.column.Switch', {
    extend: 'Ext.grid.column.Column',
    xtype: 'g-gridcolumn-switch',
    alias: 'widget.g-gridcolumn-switch',
    width: 63,
    resizable: false,
    rowId: 0,

    /**
     * @cfg {String} align 
     * @hide
     * Переопределен. Для выравнивания по центру ячейки списка.
     */
    align: 'center',

    /**
     * @cfg {Array} collectData 
     * @private
     * Значения полей указанной записи списка.
     */
    collectData: [],

    /**
     * @cfg {Boolean} [stopSelection=true]
     * Предотвратить выделение ячейки списка при mousedown.
     */
    stopSelection: true,

    clickTargetName: 'el',

    /**
     * @cfg {String}
     * Имя поля уникального идентификатора. Если null, запись 
     *    использует свой уникальный идентификатор.
     */
    idField: null,

    /**
     * @cfg {String} [defaultFilterType=true]
     * По умолчанию тип фильтрации поля, где находится переключатель.
     */
    defaultFilterType: 'boolean',

    /**
     * Конструктор.
     * @param {Object} config Конфигурация плагина.
     */
    constructor: function () {
        this.scope = this;
        this.callParent(arguments);
    },

    /**
     * @cfg {String} selector
     * Имя класса компонента для селектора.
     */
    selector: 'gridpanel',

    /**
     * @private
     * Обработка и снова вызов события, перенаправленные из метода processEvent GridView.
     * @param {String} type Тип события ("click").
     * @param {Ext.view.Table} view Компонент TableView.
     * @param {HTMLElement} cell 
     * @param {Number} recordIndex Индекс ассоциируется с моделью хранилища (-1, если нет).
     * @param {Number} cellIndex Индекс ячейки.
     * @param {Ext.event.Event} e
     * @param {Ext.data.Record} record
     * @param {Object} row
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e, record, row) {
        var me = this,
            key = type === 'keydown' && e.getKey(),
            mousedown = type === 'mousedown',
            disabled = me.disabled,
            ret,
            checked;
 
        // Отметить событие, чтобы SelectionModel не обрабатывал его.
        e.stopSelection = !key && me.stopSelection;
 
        if (!disabled && (mousedown || (key === e.ENTER || key === e.SPACE))) {
            checked = me.isRecordChecked(record);
            if (checked == -1) return ret;
            checked = !checked;
 
            // Разрешить приложению использовать beforecheckchange 
            if (me.fireEvent('beforecheckchange', me, recordIndex, checked, record) !== false) {
                me.setRecordCheck(record, checked, cell, row, e);
                me.fireEvent('checkchange', me, recordIndex, checked, record);
            }
        } else {
            ret = me.callParent(arguments);
        }
        return ret;
    },

    /**
     * Событие при доступности переключателя.
     */
    onEnable: function() {
        this.callParent(arguments);
        this._setDisabled(false);
    },
 
    /**
     * Событие при блокировки переключателя.
     */
    onDisable: function() {
        this._setDisabled(true);
    },

    /**
     * Чтобы не было конфликтов с методом компонента.
     * @param {Boolean} disabled Блокировать.
     */ 
    _setDisabled: function (disabled) {
        var me = this,
            cls = me.disabledCls,
            items;
 
        items = me.up('tablepanel').el.select(me.getCellSelector());
        if (disabled) {
            items.addCls(cls);
        } else {
            items.removeCls(cls);
        }
    },

    /**
     * Рендерер по умолчанию.
     * @param {String} value
     * @param {Object} cellValues
     * @return {String}
     */ 
    defaultRenderer : function (value, cellValues) {
        var cls = 'g-gridcolumn-switch';
 
        if (this.disabled) {
            cellValues.tdCls += ' ' + this.disabledCls;
        }
        value = parseInt(value);
        if (value == 1) {
            cls += ' checked';
        } else
        if (value == -1)
            cls += ' hidden';
        return '<label class="' + cls + '" style="width: 40px;"><span class="g-gridcolumn-switch-slider"></span></label>';
    },

    /**
     * Возвращает хранилище списка.
     * @return {Ext.data.Store}
     */
    getStore: function () {
        if (this.store != null)
            return this.store;

        return this.store = this.up(this.selector).getStore();
    },

    /**
     * Собирает значения указанных полей записи.
     * @param {Ext.data.Model} record Запись в хранилище списка.
     * @return {Object}
     */
    collectRecord: function (record) {
        var data = {};
        for (var i = 0; i < this.collectData.length; i++) {
            data[this.collectData[i]] = record.get(this.collectData[i]);
        }
        return data;
    },

    /**
     * Обновляет запись списка.
     * @param {Ext.data.Model} record Запись в хранилище списка.
     * @param {Boolean} checked Устанавливается состояние переключателю.
     */
    updateRecord: function (record, checked) {
        var id, data = this.collectRecord(record),
            id = record.getId();
        if (this.idField != null)
            id = record.get(this.idField);
        else
            id = record.getId();
        data[this.dataIndex] = checked;
        this.getStore().updateRow(id, data);
        record.set(this.dataIndex, checked);
    },

    /**
     * Проверяет у записи состояние переключателя.
     * @param {Ext.data.Model} record Запись в хранилище списка.
     * @param {Boolean} checked Устанавливается состояние переключателю.
     */
    isRecordChecked: function (record) {
        var prop = this.property;
        if (prop) {
            return parseInt(record[prop]);
        }
        return parseInt(record.get(this.dataIndex));
    },
 
     /**
     * Устанавливает в записе состояние переключателя.
     * @param {Ext.data.Model} record Запись в хранилище списка.
     * @param {Boolean} checked Состояние переключателя.
     * @param {HTMLElement} cell
     * @param {Object} row
     * @param {Ext.event.Event} e
     */
    setRecordCheck: function (record, checked, cell, row, e) {
        var me = this,
            prop = me.property;
 
        if (prop) {
            record[prop] = checked;
            me.updater(cell, checked);
        } else {
            me.updateRecord(record, checked ? 1 : 0);
        }
    },
 
      /**
     * Обновляет интерфейс ячейки списка.
     * @param {HTMLElement} cell
     * @param {Boolean} value Состояние переключателя.
     */
    updater: function (cell, value) {
        cell = Ext.fly(cell);
 
        cell[this.disabled ? 'addCls' : 'removeCls'](this.disabledCls);
        Ext.fly(cell.down(this.getView().innerSelector, true).firstChild)[value ? 'addCls' : 'removeCls']('checked');
    }
});