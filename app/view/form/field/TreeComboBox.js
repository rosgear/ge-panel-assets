/**
 * Компонент формы "Поле выпадающего дерева".
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
 * @license TreeComboBox.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.form.field.TreeComboBox
 * @extends Ext.form.field.ComboBox
 * Компонент выпадающего дерева.
 */
Ext.define('Ge.view.form.field.TreeComboBox', {
	extend: 'Ext.form.field.ComboBox',
	xtype: 'g-field-treecombobox',
    alias: 'widget.g-field-treecombobox',
    requires: ['Ge.view.form.field.TreeComboBoxList'],
    store: false,
    queryMode: 'local',
    anyMatch: true,
    enableKeyEvents: true,
    valueField: 'text',

    /**
     * @cfg {Number} filterDelayBuffer
     * Задержка в мс. для смены значения поля.
     */
    filterDelayBuffer: 100,

    /**
     * @cfg {Boolean} allowFolderSelect
     * Возможность выбирать папки из выпадающего дерева.
     */
    allowFolderSelect: false,

    /**
     * @cfg {null|Ext.data.Model} selectedRecord
     * Выбранная запись из выпадающего дерева.
     * @private
     */
    selectedRecord: null,

    /**
     * @cfg {Boolean} expandAllNodes
     * Раскрывать все узлы при нажатии на кнопку поля.
     */
    expandAllNodes: false,

    /**
     * @cfg {String} pickedRawValue
     * Название элемента выбранного из выпадающего дерева.
     */
    pickedRawValue: '',

    /**+
     * @cfg {String} pickedValue
     * Значение элемента выбранного из выпадающего дерева.
     */
    pickedValue: '',

    /**
     * @cfg {Object} treeConfig
     * Параметры конфигурации выпадающего дерева.
     */
    treeConfig: {},

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.on('change', this.onTreeComboValueChange, this, {
            buffer: this.filterDelayBuffer
        });
        this.callParent();
    },

    /**
     * Событие изменения значения поля.
     * @event change
     * @param {Ext.form.field.Field} field
     * @param {Object} newValue
     * @param {Object} oldValue
     * @param {Object} eOpts
     */
    onTreeComboValueChange: function (field,  newValue, oldValue, eOpts) {
        this.selectedRecord = false;

        let rawValue = field.getRawValue();
        // если введённое значение отличается от выбранного из списка
        if (rawValue !== field.pickedRawValue) {
            switch (this.queryMode) {
                case 'local': this.getPicker().doLocalQuery(rawValue); break;
                case 'remote': this.getPicker().doRemoteQuery(rawValue); break;
            }
        }
        // показать все элементы дерева если нет значения
        if (rawValue === '') {
            this.expand();
        }
    },

    /**
     * Разворачивает узлы дерева при выборе поля.
     */
    expand: function () {
        let picker = this.getPicker();
        if (this.expandAllNodes)
            picker.expandAll();
        else {
            let root = picker.getRootNode();
            if (!root.isExpanded()) root.expand(false);
        }
        this.callParent([arguments]);
    },

    /**
     * Создает и возвращает компонент, который будет использоваться в качестве 
     * выбора этого поля.
     * @return {Ge.view.form.field.TreeComboBoxList}
     */
    createPicker: function () {
        let treeConfig = Ext.apply({
            xtype: 'g-field-treecomboboxlist',
            store: this.store,
            valueField: this.valueField,
            displayField: this.displayField,
            anyMatch: this.anyMatch,
            queryParam: this.queryParam,
            allowFolderSelect: this.allowFolderSelect
        }, this.treeConfig);

        let picker = Ext.widget(treeConfig);
        picker.on({
            picked: this.onPicked,
            filtered: this.onFiltered,
            beforeselect: this.onBeforeSelect,
            beforedeselect: this.onBeforeDeselect,
            scope: this
        });
        return picker;
    },

    onFiltered: function (store, treeList) {
        /*if (store.getCount() > 0) {
            this.expand();
            this.focus();
        }*/
    },

    /**
     * Событие возникающие при выборе записи из выпадающего списка.
     * @event picked
     * @param {Ext.data.Model} record
     */
    onPicked: function (record) {
        this.pickedRawValue = record.get(this.displayField);
        this.pickedValue = record.get(this.valueField);

        this.suspendEvent('change');
        this.selectedRecord = record;
        this.setValue(this.pickedValue);
        this.setRawValue(this.pickedRawValue);
        this.originalValue = this.pickedValue;
        this.collapse();
        this.resumeEvent('change');
        this.fireEvent('select', record);
    },

    /**
     * Возвращает значение выбранного элемента.
     * @return {String}
     */
    getValue: function () {
        let value;
        if (this.valueField && this.selectedRecord)
            value = this.selectedRecord.get(this.valueField);
        else
            value = this.getRawValue();
        return value;
    },

    /**
     * Возвращает отправляемое значение.
     * @return {String}
     */
    getSubmitValue: function () {
        let value = this.getValue();
        if (Ext.isEmpty(value)) {
            value = '';
        }
        return value;
    },

    /**
     * Событие срабатывает до того, как выбранный элемент дерева будет выделен.
     * @event beforeselect
     * @param {Ext.form.field.ComboBox} comboBox
     * @param {Ext.data.Model} record Выбранная запись.
     * @param {Number} index Порядковый номер выбранной заиси.
     * @param {Object} eOpts
     */
    onBeforeSelect: function (comboBox, record, index, eOpts) {
        return this.fireEvent('beforeselect', this, record, index);
    },

    /**
     * Событие срабатывает перед снятием выделения выбранного элемента дерева.
     * @event beforedeselect
     * @param {Ext.form.field.ComboBox} comboBox
     * @param {Ext.data.Model} record Выбранная запись.
     * @param {index} index Порядковый номер выбранной заиси.
     * @param {Object} eOpts
     */
    onBeforeDeselect: function (comboBox, record, index, eOpts) {
        return this.fireEvent('beforedeselect', this, record, index);
    },

    /**
     * Возвращает выбранную запись из выпадающего дерева.
     * @return {null|Ext.data.Model}
     */
    getSelectedRecord: function () {
        return this.selectedRecord;
    }
});
