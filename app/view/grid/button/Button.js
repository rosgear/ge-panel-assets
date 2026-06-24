/**
 * Кнопки панели списка.
 
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
 * @license Button.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * d development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.button.Button
 * @extends Ext.button.Button
 * Базовый компонент кнопки.
 */
Ext.define('Ge.view.grid.button.Button', {
    extend: 'Ext.button.Button',
    xtype: 'g-gridbutton',
    ui: 'plain',

    /**
     * @cfg {String} selector
     * Имя класса компонента для селектора
     */
    selector: 'gridpanel',

    /**
     * @cfg {Boolean} confirm
     * Подтверждение выполнения действия над списком.
     */
    confirm: false,

    /**
     * @cfg {String} msgConfirm
     * Текст подтверждения выполнения действия над списком.
     */
    msgConfirm: '',

    /**
     * @cfg {Ge.view.grid.Panel} grid
     * Панель списка.
     */
    grid: null,
    selectorCmp: null,

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.grid = this.up(this.selector);
        this.selectorCmp = this.up(this.selector);

        this.callParent();
    }
});


/**
 * @class Ge.view.grid.button.Split
 * @extends Ext.button.Split
 * Базовый компонент кнопки с разделителем.
 */
Ext.define('Ge.view.grid.button.Split', {
    extend: 'Ext.button.Split',
    xtype: 'g-gridbutton-split',
    scale: 'small',
    ui: 'plain',

    /**
     * @cfg {String} selector
     * ...
     */
    selector: 'gridpanel',

    /**
     * @cfg {Ge.view.grid.Panel} grid
     * Панель списка.
     */
    grid: null,
    selectorCmp: null,

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.grid = this.up(this.selector);
        this.selectorCmp = this.up(this.selector);

        this.callParent();
    },

    /**
     * Обработчик событий кнопки.
     * @cfg {Object}
     */
    listeners: {
        /**
         * @event afterrender
         * Событие после рендера компонента.
         * @param {Ge.view.grid.button.Split} me
         * @param {Object} eOpts Параметры слушателя.
         */
        afterrender: function (me, eOpts) {
            me.getMenu().addListener('click', function(menu, item, e) {
                if (Ext.isDefined(item.handler))
                    me.handler = item.handler;
                if (Ext.isDefined(item.handlerArgs))
                     me.handlerArgs = item.handlerArgs;
                me.setTooltip(item.text);
            }, this);
        }
    }
});


/**
 * @class Ge.view.grid.button.Columns
 * @extends Ext.button.Split
 * Кнопка управления столбцами списка.
 */
Ext.define('Ge.view.grid.button.Columns', {
    extend: 'Ext.button.Split',
    xtype: 'g-gridbutton-columns',
    ui: 'plain',

    /**
     * @cfg {String} selector
     * ...
     */
    selector: 'gridpanel',

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        var grid = this.up(this.selector);
        var text, items = [];
        Ext.each(grid.getColumns(), function (column) {
            if (column.hideable) {
                if (typeof column.ownerCt.text != 'undefined')
                    text = column.text + ' <span class="g-menu-subtext">' + column.ownerCt.text + '</span>';
                else
                    text= column.text;
                items.push({ xtype: 'menucheckitem', text: text, checked: !column.isHidden(), dataIndex: column.dataIndex });
            }
        });

        this.menu = Ext.create('Ext.menu.Menu', {
            items: items,
            listeners: {
                click: function (me, item, e, eOpts) {
                    if (item.checked)
                        grid.columnIndexes[item.dataIndex].show();
                    else
                        grid.columnIndexes[item.dataIndex].hide();
                }
            }
        });

        this.callParent();
    }
});


/**
 * @class Ge.view.grid.button.Edit
 * @extends Ge.view.grid.button.Split
 * Кнопка правки записи списка через контекстное меню.
 */
Ext.define('Ge.view.grid.button.Edit', {
    extend: 'Ge.view.grid.button.Split',
    xtype: 'g-gridbutton-edit',

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.menu = this.up(this.selector).popupMenu;

        this.callParent();
    },

    /**
     * Обработчик событий кнопки.
     * @cfg {Object}
     */
    listeners: {
        /**
         * @event menushow
         * Показать контекстное меню.
         * @param {Ge.view.grid.button.Edit} me
         * @param {Ext.menu.Menu} menu Контекстное меню.
         * @param {Object} eOpts Параметры слушателя.
         */
         menushow: function (me, menu, eOpts) {
            var sm = me.grid.getSelectionModel(),
                disabled = false;
            if (sm.getCount() != 1)
                menu.setDisabled(true);
            else {
                var lock = 0,
                    rows = sm.getSelection();
                menu.activeRecord = rows[0].data;
                lock = menu.activeRecord['lockRow'];
                if (typeof lock != 'undefined')
                    if (lock > 0) disabled = true;

                menu.setDisabled(disabled);
            }
         }
    }
});


/**
 * @class Ge.view.grid.button.Filter
 * @extends Ge.view.grid.button.Split
 * Кнопка фильтрации списка.
 */
Ext.define('Ge.view.grid.button.Filter', {
    extend: 'Ge.view.grid.button.Split',
    xtype: 'g-gridbutton-filter',

    /**
     * @cfg {String} applyIconCls
     * CCS-значок кнопки после приминения фильтра.
     */
    inactiveIconCls: '',

    /**
     * @cfg {String} applyIconCls
     * CCS-значок кнопки после приминения фильтра.
     */
    activeIconCls: '',

    /**
     * @cfg {String} applyBtnText
     * Текст кнопки применения фильтра формы.
     */
    applyBtnText: 'Apply',

    /**
     * @cfg {String} resetBtnText
     * Текст кнопки сброса фильтра формы.
     */
    resetBtnText: 'Reset',

    /**
     * @cfg {Ext.form.Panel} form
     * Панель формы.
     */
    form: null,

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        var form,
            formCfg = Ext.applyIf(this.form, {
                xtype : 'form',
                cls: 'g-form-filter',
                flex : 1,
                width : 400,
                height : 180,
                bodyPadding: '5',
                buttons: [{
                    text: this.applyBtnText,
                    handler: 'onFilterUpdate'
                }, {
                    text: this.resetBtnText,
                    handler: 'onFilterReset'
                }]
        });
        form = new Ext.create('Ext.form.Panel', formCfg);

        this.menu =  Ext.create('Ext.menu.Menu', {
            items : [form]
        });

        this.callParent();
    }
});

/**
 * @class Ge.view.grid.button.AddRecord
 * @extends Ext.button.Button
 * Кнопка добавления записи в сетку.
 */
 Ext.define('Ge.view.grid.button.AddRecord', {
    extend: 'Ext.button.Button',
    xtype: 'g-gridbutton-addrecord',
    cls: 'g-grid__button g-grid__button_small',
    minWidth: 85,
    minHeight: 30,
    defaultRecord: {},

    /**
     * Обработчик событий кнопки.
     * @cfg {Object}
     */
    listeners: {
        /**
         * Клик на кнопке.
         * @param {Ge.view.grid.button.RemoveRecord} me
         * @param {Event} e Событие клика.
         * @param {Object} eOpts Параметры слушателя.
         */
         click: function (me, e, eOpts) {
            let record = Object.assign({}, me.defaultRecord);
            this.up('grid').getStore().add(record);
         }
    }
});


/**
 * @class Ge.view.grid.button.RemoveRecord
 * @extends Ext.button.Button
 * Кнопка удаления записи из сетки.
 */
Ext.define('Ge.view.grid.button.RemoveRecord', {
    extend: 'Ext.button.Button',
    xtype: 'g-gridbutton-removerecord',
    cls: 'g-grid__button g-grid__button_small',
    minWidth: 85,
    minHeight: 30,

    removeAll: true,

    /**
     * Обработчик событий кнопки.
     * @cfg {Object}
     */
    listeners: {
        /**
         * Клик на кнопке.
         * @param {Ge.view.grid.button.RemoveRecord} me
         * @param {Event} e Событие клика.
         * @param {Object} eOpts Параметры слушателя.
         */
        click: function (me, e, eOpts) {
            let grid = me.up('grid');
            if (me.removeAll)
                grid.getStore().removeAll();
            else {
                let rows = grid.getSelectionModel().getSelection();
                grid.getStore().remove(rows);
            }
         }
    }
});


/**
 * @class Ge.view.grid.button.AddRecordTpl
 * @extends Ext.button.Split
 * Кнопка добавления записи из выбранного шаблона записей.
 */
Ext.define('Ge.view.grid.button.AddMediaRecord', {
    extend: 'Ext.button.Split',
    xtype: 'g-gridbutton-addmediarecord',
    scale: 'small',
    iconAlign: 'left',
    cls: 'g-grid__button g-grid__button_small',
    arrowAlign: 'right',
    minWidth: 85,
    minHeight: 30,

    records: [],

    /**
     * @cfg {String} dataIndex
     * Панель формы.
     */
    dataIndex: 'name',


    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        var me = this,
            i,
            record,
            items = [];
        me.rowId = 0;
        //
        for (i = 0; i < me.records.length; i++) {
            record = me.records[i];
            items.push({
                index: i,
                text: record[me.dataIndex],
                iconCls: 'g-icon_svg g-icon_' + record.type + ' g-icon-svg_size_16'
            });
            
        }
        me.menu = Ext.create('Ext.menu.Menu', {
            items: items
        });

        me.callParent();

        me.menu.on({
            click: function (menu, item, e, eOpts) {
                me.addRecord(item.index);
            }
        });
    },

    listeners: {
        click: function (me, e, eOpts) {
           me.addRecord(0);
        }
    },

    addRecord: function (index) {
        this.rowId++;
        var record = Object.assign({}, this.records[index]);
        this.up('grid').getStore().add(record);
    }
});
