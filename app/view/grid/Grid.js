/**
 * Компонент "Панель сетки записей".
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
 * @license Grid.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

Ext.define('Ge.view.grid.Filters', {
    extend: 'Ext.grid.filters.Filters',
    alias: 'plugin.gridfilters',

    requires: [
        'Ge.view.grid.filter.DateTime'
    ],

    defaultFilterTypes: {
        'boolean': 'boolean',
        'int': 'number',
        date: 'date',
        number: 'number',
        datetime: 'datetime'
    },
    createColumnFilter: function (column) {
        var me = this,
            columnFilter = column.filter,
            filter = {
                column: column,
                grid: me.grid,
                owner: me
            },
            field, model, type;
 
        if (Ext.isString(columnFilter)) {
            filter.type = columnFilter;
        } else {
            Ext.apply(filter, columnFilter);
        }
 
        if (!filter.type) {
            model = me.store.getModel();
            // If no filter type given, first try to get it from the data field.
            field = model && model.getField(column.dataIndex);
            type = field && field.type;
 
            filter.type = (type && me.defaultFilterTypes[type]) ||
                           column.defaultFilterType || 'string';
        }
 
        column.filter = Ext.Factory.gridFilter(filter);
        if (!column.menuDisabled) {
            column.requiresMenu = true;
        }
    },
});


/**
 * @class dynamicModel
 * @extends Ext.data.Model
 * Динамическая модель данных.
 */
Ext.define('dynamicModel', {
    extend: 'Ext.data.Model'
});


/**
 * @class Ge.view.grid.Panel
 * @extends Ext.grid.Panel
 * Компонент "Панель сетки записей".
 */
Ext.define('Ge.view.grid.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'g-grid',
    cls: 'g-grid',
    rowLockCls: 'g-grid-row g-grid-row_lock',
    requires: [
        'Ge.view.grid.GridController',
        'Ge.view.grid.column.Column',
        'Ge.view.grid.CellTip'
    ],
    controller: 'grid',
    maskReloadRow: true,
    rowDblClickConfig: { },

    /**
     * @cfg {Object} columnIndexes
     * Столбцы списка для скрыть/показать.
     */
    columnIndexes: {},

    /**
     * @cfg {Ge.ActionRouter} router
     * Маршрутизация при  выполнении действия с формой.
     */
    router: {},

    /**
     * @cfg {Boolean} columnsSupplement
     * Дополнять столбцы списка записями. Определяется в 
     * инициализации столбцов списка {Tree.initColumns}.
     */
    columnsSupplement: false,

    /**
     * Инициализация хранилища списка.
     * @return {Ext.data.Store}
     * @private
     */
    initStore: function () {
        var me = this;

        // получить URL-адрес из маршрута
        if (Ext.isDefined(me.store.proxy)) {
            me.store.proxy.url = Ge.url.build(me.router.build('data'));
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
            load: function (store, records, successful, operation, eOpts) {
                var response;
                if (!successful) {
                    if (!Ext.isDefined(operation.error))
                        response = operation._response;
                    else
                        response = operation.error.response;
                    Ext.Msg.exception(response, true, true);
                }
                if (me.columnsSupplement) {
                    store.supplement();
                }
            }
        };
        /**
         * Дополнить столбцы списка записями.
         */
        me.store.supplement = function () {
            var store = this;
            me.addSupplementColumnsStyle();
            Ext.Ajax.request({
                url: Ge.url.build(me.router.build('supplement')),
                method: 'post',
                /**
                 * Успешное выполнение запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                success: function (response, opts) {
                    var response = Ge.response.normalize(response);
                    if (!response.success) {
                        Ext.Msg.exception(response);
                        return;
                    }
                    me.removeSupplementColumnsStyle();
                    me.supplement(response.data);
                },
                /**
                 * Ошибка запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                failure: function (response, opts) {
                    Ext.Msg.exception(response, true, true);
                }
            });
        };
        /**
         * Удалить все записи в списке.
         */
        me.store.removeAll = function () {
            me.mask(Ext.Txt.waiting);
            Ext.Ajax.request({
                url: Ge.url.build(me.router.build('clear')),
                method: 'post',
                /**
                 * Успешное выполнение запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                success: function (response, opts) {
                    me.unmask();
                    var response = Ge.response.normalize(response);
                    if (!response.success)
                        Ext.Msg.exception(response);
                },
                /**
                 * Ошибка запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                failure: function (response, opts) {
                    me.unmask();
                    Ext.Msg.exception(response, true, true);
                }
            });
        };
        /**
         * Возвращает идентификаторы выделенных записей в виде строки.
         */
         me.store.selectionListAsString = function () {
            var data = [],
                items = me.getSelectionModel().getSelection();
            if (items.length == 0) return '';
            for(var i = 0; i < items.length; i++) {
                data.push(items[i].id);
            }
            return data.join(',');
        };
        /**
         * Возвращает одну запись среди выделенных.
         */
        me.store.getOneSelected = function () {
            let items = me.getSelectionModel().getSelection();
            if (items.length == 0) return {};
            return items[0].data;
        };
        /**
         * Возвращает выделенные записи в виде массива или JSON-формата.
         * @param {Boolean} toJson Если true, возвратит в JSON-формате.
         * @return {String}|{Array}
         */
         me.store.getSelectedRowsAsJson = function (toJson = true) {
            let arr  = [],
                rows = me.getSelectionModel().getSelection();
            if (rows.length > 0) {
                for(let i = 0; i < rows.length; i++) {
                    arr.push(rows[i].data);
                }
            }
            return toJson ? Ext.encode(arr) : arr;
        };
        /**
         * Удаляет выделенные записи.
         */
        me.store.remove = function () {
            var id = this.selectionListAsString();
            if (!id.length) {
                alert('Необходимо выделить записи!');
                return false;
            }
            me.mask(Ext.Txt.waiting);
            Ext.Ajax.request({
                url: Ge.url.build(me.router.build('delete')),
                method: 'post',
                params: {
                    id: id
                },
                /**
                 * Успешное выполнение запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                success: function (response, opts) {
                    me.unmask();
                    var response = Ge.response.normalize(response);
                    if (!response.success)
                        Ext.Msg.exception(response);
                },
                /**
                 * Ошибка запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                failure: function (response, opts) {
                    me.unmask();
                    Ext.Msg.exception(response, true, true);
                }
            });
        };
        /**
         * Отправляет запрос с свойствами записи по указанному маршруту.
         * @param {String} route Маршрут.
         * @param {String} id Идентификатор записи.
         * @param {Object} data Свойства записи.
         */
        me.store.sendRow = function (route, id, data) {
            me.mask(Ext.Txt.waiting);
            Ext.Ajax.request({
                url: Ge.url.build(me.router.build(route, { id: id })),
                method: 'post',
                params: data,
                /**
                 * Успешное выполнение запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                success: function (response, opts) {
                    me.unmask();
                    var response = Ge.response.normalize(response);
                    if (response.success)
                        Ge.getApp().popup.msg(response.message);
                    else
                        Ext.Msg.exception(response);
                },
                /**
                 * Ошибка запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                failure: function (response, opts) {
                    Ext.Msg.exception(response, true, true);
                }
            });
        };
        /**
         * Обновляет свойства записи.
         * @param {String} id Идентификатор записи.
         * @param {Object} data Свойства записи.
         */
        me.store.updateRow = function (id, data) {
            Ext.Ajax.request({
                url: Ge.url.build(me.router.build('updateRow', { id: id })),
                method: 'post',
                params: data,
                /**
                 * Успешное выполнение запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                success: function (response, opts) {
                    var response = Ge.response.normalize(response);
                    if (!response.success)
                        Ext.Msg.exception(response);
                },
                /**
                 * Ошибка запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                failure: function (response, opts) {
                    Ext.Msg.exception(response, true, true);
                }
            });
        };
        /**
         * Обновляет запись.
         * @param {String} id Идентификатор записи.
         */
        me.store.reloadRow = function (id) {
            var record, index = this.findExact('id', id);
            if (index != -1) {
                record = this.getAt(index);
                if (me.maskReloadRow)
                    me.mask(Ext.Txt.waiting);
                Ext.Ajax.request({
                    url: Ge.url.build(me.router.build('dataRow', { id: id })),
                    method: 'post',
                    /**
                     * Успешное выполнение запроса.
                     * @param {XMLHttpRequest} response Ответ.
                     * @param {Object} opts Параметр запроса вызова.
                     */
                    success: function (response, opts) {
                        me.unmask();
                        var response = Ge.response.normalize(response);
                        if (!response.success) {
                            Ext.Msg.exception(response);
                            return;
                        }
                        record.set(response.data);
                        record.commit();
                        me.reconfigure(store);
                    },
                    /**
                     * Ошибка запроса.
                     * @param {XMLHttpRequest} response Ответ.
                     * @param {Object} opts Параметр запроса вызова.
                     */
                    failure: function (response, opts) {
                        me.unmask();
                        Ext.Msg.exception(response, true, true);
                    }
                });
            }
        }
        return Ext.create('Ext.data.Store', me.store);
    },

    /**
     * Инициализация конфигурации представления UI списка.
     * @return {Object}
     * @private
     */
    initViewConfig: function () {
        var me = this;
        //return me.viewConfig;
        return Ext.applyIf(me.viewConfig || {}, {
            /*preserveScrollOnRefresh: false,
            preserveScrollOnReload: false,
            deferInitialRefresh: false,
            blockRefresh: true,*/
            getRowClass: function(record, rowIndex, rowParams, store) {
                var rowCls = record.get('rowCls'),
                    lock = record.get('lockRow');
                if (typeof lock == 'undefined')
                    lock = 0;
                if (typeof rowCls == 'undefined')
                    rowCls = '';

                return rowCls + (lock > 0 ? ' ' + me.rowLockCls : '');
            }
        });
    },

    /**
     * Инициализация столбцов списка.
     * @private
     */
    initColumns: function () {
        var me = this;

        me.hiddenColumns = [];
        me.columnsSupplement = false;
        Ext.each(me.getColumns(), function (column, index) {
            if (column.dataIndex != null)
                me.columnIndexes[column.dataIndex] = column;
            if (column.isHidden())
                me.hiddenColumns.push(column.dataIndex);
            // имеет ли столбец динам-е заполнение
            if (Ext.isDefined(column.supplement) && column.supplement) {
                // делать дополнительный запрос после основного
                me.columnsSupplement = true;
            }
        });
    },

    /**
     * Заполнить столбцы записями.
     * @param {Array} rows Записи.
     */
    supplement: function (rows) {
        if (rows.length > 0) {
            var store = this.getStore(), record;
            for (var i = 0; i < rows.length; i++) {
                record = store.getById(rows[i]['id']);
                if (record)
                    record.set(rows[i]);
            }
        }
    },

    /**
     * Добавить столбцам (которые дополняются записями) стили.
     * @private
     */
    addSupplementColumnsStyle: function () {
        Ext.each(this.getColumns(), function (column, index) {
            if (Ext.isDefined(column.supplement) && column.supplement) {
                column.addCls('g-icon_gridcolumn-loading');
            }
        });
    },

    /**
     * Удалить столбцы (которые дополняются записями) стили.
     * @private
     */
    removeSupplementColumnsStyle: function () {
        Ext.each(this.getColumns(), function (column, index) {
            if (Ext.isDefined(column.supplement) && column.supplement) {
                column.removeCls('g-icon_gridcolumn-loading');
            }
        });
    },

    /**
     * Инициализация всплывающего меню записи списка.
     * @private
     */
    initPopupMenu: function () {
        if (this.popupMenu) {
            this.popupMenu = new Ext.menu.Menu(this.popupMenu);
            this.popupMenu.activeRecord = null;
        }
    },

    /**
     * Инициализация панели навигации.
     * @private
     */
    initNavigator: function () {
        var me = this;

        if (Ext.isDefined(me.initOwnerCt))
            if (typeof me.initOwnerCt.navigator !== 'undefined') {
                //
                me.navigator = Ext.applyIf(me.initOwnerCt.navigator, { info: null });
                // если есть вкладка - информация
                if (me.navigator.info.tpl.length) {
                    var navInfo = me.navigator.info;
                    navInfo.template = Ext.create('Ext.XTemplate', navInfo.tpl);
                    navInfo.cmp = Ext.getCmp(navInfo.id);
    
                    me.getSelectionModel().on('selectionchange', function (sm, selectedRecord) {
                        if (typeof navInfo.cmp.tab != 'undefined')
                            if (selectedRecord.length && me.navigator.info.active) {
                                navInfo.cmp.update(navInfo.template.apply(selectedRecord[0].data));
                                Ge.app.navigatorTabs.activeSomeTab(navInfo.cmp);
                                navInfo.cmp.doLayout();
                                navInfo.cmp.setScrollable('y');
                            }
                    });
                }
            }
    },

    /**
     * Инициализация событий списка.
     */
    initEvents: function () {
        var me = this;

        me.rowDblClickConfig = Ext.applyIf(me.rowDblClickConfig || {}, {
            allow: false,
            route: '',
            pattern: 'data'
        });
        // если указан в настройках 2-й клик по списку
        if (me.rowDblClickConfig.allow) {
            me.on('rowdblclick', function (grid, record, element, rowIndex, e, eOpts) {
                var options = {}, lock = record.get('lockRow');
                if (Ext.isDefined(lock) && lock > 0) return;

                options = {
                    route: me.rowDblClickConfig.route,
                    me: grid,
                    pattern: me.rowDblClickConfig.pattern,
                };
                if (options.pattern == 'data')
                    options.data = record.data;
                Ge.getApp().widget.loadBy(options);
                return false; // иначе будет 2-а события
            }, this);
        };
    },

    /**
     * Инициализация компонента.
     * @param {Object} config Параметры инициализации.
     */
    initComponent: function (config) {
        var me = this;

        me.router = new Ge.ActionRouter(me.router || {});

        var store      = me.initStore(),
            viewConfig = me.initViewConfig();

        /**
         * Обработчик событий списка.
         * @cfg {Object}
         */
        me.listeners = {
            /**
             * Событие после удаления компонента.
             * @param {Ge.view.grid.Panel} me
             * @param {Object} eOpts Параметры слушателя.
             */
             destroy: function (me) {
                 if (Ext.isDefined(me.view.tip)) {
                    me.view.tip.destroy();
                 }
             },
            /**
             * Событие после рендера компонента.
             * @param {Ge.view.grid.Panel} me
             * @param {Object} eOpts Параметры слушателя.
             */
            afterRender: function () {
                var activeRecord = null,
                    activeColumn = null,
                    tpl = null,
                    tipStr = '',
                    columns;
                /**
                 * @cfg {Ge.view.grid.CellTip} Ge.view.grid.Panel.view.tip 
                 * Всплывающая подсказка ячейки списка.
                 */
                me.view.tip = Ext.create('Ge.view.grid.CellTip', {
                    columns: me.getColumns(),
                    grid: me,
                    target: me.view.el,
                    delegate: me.view.cellSelector,
                    listeners: {
                        /**
                         * Событие перед появлением подсказки.
                         * @param {Ge.view.grid.CellTip} tip
                         * @param {Object} eOpts Параметры слушателя.
                         */
                        beforeshow: function updateTipBody (tip) {
                            var columns      = me.view.getGridColumns(),
                                activeColumn = columns[tip.triggerElement.cellIndex],
                                columnId     = me.id + '.' + activeColumn['dataIndex'];
                            if (typeof this.templates[columnId] == 'undefined') {
                                return false;
                            }
                            var activeRecord = me.view.getRecord(tip.triggerElement.parentNode),
                                tpl          = this.templates[columnId];
                            if (Ext.isDefined(activeRecord)) {
                                if (tpl == false)
                                    tip.update(activeRecord.get(activeColumn.dataIndex));
                                else {
                                    tipStr = tpl.apply(activeRecord.data);
                                    if (tipStr.length)
                                        tip.update(tipStr);
                                    else
                                        tip.update(' ... ');
                                }
                            }
                        }
                    }
                });
                me.doLayout();
            }
        };
        /**
         * Инициализация панели инструментов и пагинатора.
         */
        if (this.dockedItems == null) {
            this.dockedItems = [];
        }
        if (Ext.isDefined(this.pagingtoolbar)) {
            this.pagingtoolbar.store = store;
            this.dockedItems.push(this.pagingtoolbar);
        }
        Ext.apply(this, {
            store: store,
            viewConfig: viewConfig
        });

        me.callParent(arguments);

        // инициализация столбцов списка
        me.initColumns();
        // инициализация всплывающего меню записи списка.
        me.initPopupMenu();
        // инициализация панели навигации
        me.initNavigator();
        // инициализация событий списка
        me.initEvents();
    }
});
