/**
 * Компонент формы "Выпадающее дерево поля".
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
 * @license TreeComboBoxList.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.form.field.TreeComboBoxList
 * @extends Ext.tree.Panel
 * Компонент выпадающего дерева поля применяется для Ge.view.form.field.TreeComboBox.
 */
Ext.define('Ge.view.form.field.TreeComboBoxList', {
	extend: 'Ext.tree.Panel',
	xtype: 'g-field-treecomboboxlist',
    alias: 'widget.g-field-treecomboboxlist',
    floating: true,
    hidden: true,
    rootVisible: false,
    useArrows: true,

    /**
     * @cfg {Boolean} anyMatch
     * Configure as true to allow matching of the typed characters at any position in the valueField's value.
     */
    anyMatch: true,

    /**
     * @cfg {Boolean} allowFolderSelect
     * Возможность выбирать папки из выпадающего дерева.
     */
    allowFolderSelect: false,

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.initStore();
        this.listeners = {
            'cellclick': this.onCellClick,
            'itemkeydown': this.onItemKeyDown
        };

        this.callParent();
    },

    /**
     * Инициализация хранилища значением по умолчанию.
     */
     initStore: function () {
        this.store.listeners = {
            load: function (me) {
                var response = Ge.response.normalize(me.proxy.reader.rawData);
                if (response == null)
                    Ext.Msg.exception(me.proxy.reader.rawData, false, true);
                else
                if (!response.success)
                    Ext.Msg.exception(response, false, true);
            }
        };
    },

    /**
     * Обновление дерева.
     */
    refresh: function () {},

    /**
     * @event cellclick
     * @inheritdoc Ext.view.Table#cellclick
     */
    onCellClick: function (tree, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if (this.allowFolderSelect || record.isLeaf()) {
            this.fireEvent('picked', record);
        }
    },

    /**
     * @event itemkeydown
     * @inheritdoc Ext.view.Table#itemkeydown
     */
    onItemKeyDown: function (view, record, item, index, e, eOpts) {
        if (this.allowFolderSelect || record.isLeaf() && e.keyCode == e.ENTER) {
            this.fireEvent('picked', record);
        }
    },

    /**
     * Выделяет первый лист дерева.
     */
    selectFirstLeaf: function () {
        var firstLeaf = this.getStore().findRecord('leaf', true);
        this.getSelectionModel().select(firstLeaf);
    },

    /**
     * Выполняет локальный поиск значения в дереве.
     * @param {String} searchValue
     */
    doLocalQuery: function (searchValue) {
        var store = this.getStore();
        this.searchValue = searchValue.toLowerCase();

        store.setRemoteFilter(false);
        store.filterBy(this.pickerStoreFilter, this);
        this.fireEvent('filtered', store, this);
    },

    /**
     * Выполняет фильтрацию записи.
     * @param {Ext.data.Model} record
     */
    pickerStoreFilter: function (record) {
        var itemValue = record.get(this.displayField).toLowerCase();
        if (this.anyMatch) {
            if (itemValue.indexOf(this.searchValue) != -1) {
                return true;
            }
        } else {
            if (itemValue.startsWith(this.searchValue)) {
                return true;
            }
        }
        return false;
    },

    /**
     * Выполняет удаленный поиск значения в дереве.
     * @param {String} searchValue
     */
    doRemoteQuery: function (searchValue) {
        let store = this.getStore();

        store.setRemoteFilter(true);
        store.on('load', this.onPickerStoreLoad, this, {
            single: true
        });
        if (searchValue) {
            store.filter(new Ext.util.Filter({
                operator: this.anyMatch ? 'like' : 'eqv',
                property: this.displayField,
                value: searchValue
            }));
        } else
            store.clearFilter();
    },

    /**
     * Событие загрузки записей в хранилище.
     * @event load
     * @param {Ext.data.TreeStore} store
     * @param {Ext.data.Model[]} records
     */
    onPickerStoreLoad: function (store, records) {
        this.fireEvent('filtered', store, this);
    }
});
