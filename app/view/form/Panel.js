/**
 * Панель формы.
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
 * @class Ge.view.form.Panel
 * @extends Ext.form.Panel
 * Компонент панели формы.
 */
Ext.define('Ge.view.form.Panel', {
    extend: 'Ext.form.Panel',
    xtype: 'g-formpanel',
    cls: 'g-form',
    requires: ['Ge.view.form.PanelController'],
    controller: 'form-panel',
    mixins: ['Ext.mixin.Responsive'],

    /**
     * @cfg {String} msgFillFields
     * Сообщение при совершении действия над формой с отсутствием заполнения полей.
     */
    msgFillFields: 'You need to fill in the fields',

    /**
     * @cfg {Ge.ActionRouter} router
     * Маршрутизация при  выполнении действия с формой.
     */
    router: {},

    /**
     * @cfg {Boolean} loadDataAfterRender
     * Загружать данные в поля формы AJAX-запросом после рендера.
     */
    loadDataAfterRender: true,

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.router = new Ge.ActionRouter(this.router || {});

        this.callParent();
    },

    /**
     * Обработчик событий панели.
     * @cfg {Object}
     */
    listeners: {
        afterrender: 'onAfterRender'
    }
});


/**
 * @class Ge.view.form.field.Combobox
 * @extends Ext.form.ComboBox
 * Компонент выпадающего списка формы.
 */
Ext.define('Ge.view.form.field.Combobox', {
    extend: 'Ext.form.ComboBox',
    xtype: 'g-field-combobox',
    minChars: 3,
    queryParam: 'q',
    queryMode: 'remote',

    /**
     * Возвращает значение поля.
     * @return {String}
     */
    getValue: function () {
        var me = this,
            store = me.getStore(),
            picker = me.picker,
            rawValue = me.getRawValue(), 
            value = me.value;
                       
        if (!store.isEmptyStore && me.getDisplayValue() !== rawValue) {
            me.displayTplData = undefined;
            if (picker) {
                me.valueCollection.suspendEvents();
                picker.getSelectionModel().deselectAll();
                me.valueCollection.resumeEvents();
                me.lastSelection = null;
            }
            if (store.isLoaded() && (me.multiSelect || me.forceSelection)) {
                value = me.value = undefined;
            } else {
                if (me.value != null)
                    value = me.value;
                else
                    value = me.value = rawValue;
            }
        }

        me.value = value == null ? null : value;
        return me.value;
    }
});


/**
 * @class Ge.view.form.field.RemoteCombobox
 * @extends Ge.view.form.field.Combobox
 * Компонент выпадающего списка формы для с удаленной загрузкой данных.
 */
 Ext.define('Ge.view.form.field.RemoteCombobox', {
    extend: 'Ge.view.form.field.Combobox',
    xtype: 'g-field-combobox-remote',
    pageSize: 50,
    displayField: 'name',
    valueField: 'id',
    minChars: 3,
    queryParam: 'q',
    queryMode: 'remote',
    editable: true,
    allowBlank: false,

    /**
     * @cfg {Object} storeProxy
     * Для определения proxy хранилища данных.
     */
     storeProxy: {},

    /**
     * Инициализация компонента.
     */
     initComponent: function () {
        this.initStore();
        this.callParent();
    },

    /**
     * Инициализация хранилища значением по умолчанию.
     * Для определения proxy хранилища используется {this.storeProxy}.
     */
    initStore: function () {
        if (!Ext.isDefined(this.store)) {
            this.store = {
                fields: ['id', 'name'],
                proxy: {
                    type: 'ajax',
                    reader: {
                        type: 'array',
                        rootProperty: 'data'
                    }
                }
            };
            this.store.proxy = Ext.applyIf(this.store.proxy, this.storeProxy);
        }
    }
});


/**
 * @class Ge.view.form.field.LocalCombobox
 * @extends Ge.view.form.field.Combobox
 * Компонент выпадающего списка формы для с удаленной загрузкой данных.
 */
 Ext.define('Ge.view.form.field.LocalCombobox', {
    extend: 'Ge.view.form.field.Combobox',
    xtype: 'g-field-combobox-local',
    forceSelection: true,
    displayField: 'name',
    valueField: 'id',
    minChars: 0,
    queryMode: 'local',
    editable: false,
    allowBlank: false,

    /**
     * Инициализация компонента.
     */
     initComponent: function () {
        this.initStore();
        this.callParent();
    },

    /**
     * Инициализация хранилища значением по умолчанию.
     */
     initStore: function () {
        if (!Ext.isDefined(this.store.fields)) {
            this.store.fields = ['id', 'name'];
        }
    }
});