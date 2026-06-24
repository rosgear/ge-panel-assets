/**
 * Плагин "Пагинатор элементов".
 
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
 * @license PageSize.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.plugin.PageSize
 * @extends Ext.AbstractPlugin
 * @alias plugin.pagesize
 * Плагин "Пагинатор элементов".
 */
Ext.define('Ge.view.plugin.PageSize', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pagesize',

  /**
   * @cfg {Ext.data.Store} options
   * Количесиво записей на странице. Использует источник данных 
   * выпадающего списка {@link Ext.data.Store}.
   */	
    options: [2, 5, 10, 15, 20, 25, 30, 50, 75, 100, 200, 300, 500, 1000],
  
  /**
   * @cfg {String} mode Допустимые значения: local, remote.
   */
    mode: 'remote',

  /**
   * @cfg {String} displayText
   * Сообщение, отображаемое перед выпадающим списком (по умолчанию «Записей на странице»)
   */
    displayText: 'Records per Page',

    /**
     * Конструктор.
     * @param {Object} config Настройки конфигурации.
     */
    constructor: function (config) {
        Ext.apply(this, config);
    
        this.callParent(arguments);
    },

    /**
     * Инициализация плагина.
     * @param {Ext.toolbar.Toolbar} toolbar Панель инструментов.
     */
    init : function (toolbar) {
        let comboStore = this.options,
            ptStore = toolbar.store,
            combo = Ext.create('Ext.form.field.ComboBox',{
                typeAhead: false,
                triggerAction: 'all',
                forceSelection: true,
                lazyRender:true,
                editable: false,
                mode: this.mode,
                value: ptStore.pageSize,
                width:65,
                store: comboStore,
                listeners: {
                    select: function (combo, records, eOpts) {
                        ptStore.pageSize = records.data.field1;
                        ptStore.loadPage(1);
                    }
                }
            });

        let index = toolbar.items.indexOf(toolbar.items.map['refresh']);
        toolbar.insert(++index, this.displayText);
        toolbar.insert(++index, combo);
    
        //уничтожить выпадающий список перед уничтожением панели пагинатора
        toolbar.on({
            beforedestroy: function () { combo.destroy(); }
        });
  }
});
