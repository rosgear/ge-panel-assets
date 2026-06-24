/**
 * Компонент "Панель дерева".
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
 * @license Tree.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class dynamicTreeDataModel
 * @extends Ext.data.Model
 * Динамическая модель данных.
 */
Ext.define('dynamicTreeDataModel', {
    extend: 'Ext.data.Model'
});

Ext.define('Ge.view.grid.TreeStore', {
    extend: 'Ext.data.TreeStore',

    getTotalCount : function() {
        if(!this.proxy.reader.rawData) return 0;
        var prop = this.proxy.reader.initialConfig.totalProperty;
        if (this.proxy.reader.rawData.isRootNode) {
            return this.totalCount = this.proxy.reader.rawData[prop];
        } else
            return this.totalCount;
    },

    listeners: {
       beforeload: function (store, operation, eOpts) {
        // bug: чтобы не было повторного вызова при загрузке узлов дерева
        if(store.isLoading()) return false;
       }
    } 
});


/**
 * @class Ge.view.grid.Tree
 * @extends Ext.tree.Panel
 * Компонент "Панель дерева".
 */
Ext.define('Ge.view.grid.Tree', {
    extend: 'Ext.tree.Panel',
    xtype: 'g-gridtree',
    cls: 'g-grid',
    requires: [
        'Ge.view.grid.TreeController',
        'Ge.view.grid.column.Column',
        'Ge.view.grid.CellTip'
    ],
    controller: 'gridtree',

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
     * @cfg {Boolean} nodesDraggable
     * Возможность перетаскивать узлы дерева. Для этого 
     * используется плагин Ext.tree.plugin.TreeViewDragDrop (treeviewdragdrop).
     * Если значение `true`, то это равносильно выражению:
     * `this.viewConfig.plugins = [{ptype: 'treeviewdragdrop', allowParentInserts: true, ...}]`.
     */
    nodesDraggable: false,

    /**
     * @cfg {Object} nodesDragConfig
     * Параметры инициализации для плагина Ext.tree.plugin.TreeViewDragDrop.
     * Для этого необходимо указать nodesDraggable = true.
     */
     nodesDragConfig: {},

    /**
     * @cfg {Object} nodesDropConfig
     * Параметры диалогового окна отображаемого после перетаскивания узла.
     * Диалог просит подтверждения перетягивания узла.
     * Имеет свойства:
     * {
     *     confirm: false, // показывать диалог
     *     confirmTitle: 'Drop', // заголовок диалога 
     *     confirmMsg: 'You agree to move "{0}" to "{1}"?', // сообщение диалога
     *     dropNodeName: 'text' // название свойства имени узла
     * }
     */
     nodesDropConfig: {},

    /**
     * Инициализация хранилища узлов дерева.
     * @return {Ext.data.Store}
     * @private
     */
    initStore: function () {
        var me = this;

        // получить URL-адрес из маршрута
        me.store.proxy.url = Ge.url.build(me.router.build('data'));
        /**
         * Обработчик событий хранилища списка {Ext.data.Store}.
         * @cfg {Object}
         */
        me.store.listeners = {
            /**
             * Загрузка.
             * @param {Ext.data.Store} store
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
        }
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
         * Перемещает выделенную запись (узел) в указанное положение.
         * @param {String} id Идентификатор записи.
         * @param {Object} data Свойства записи.
         */
        me.store.move = function (from, to, position = 'after') {
            Ext.Ajax.request({
                url: Ge.url.build(me.router.build('move', { id: from })),
                method: 'post',
                params: {
                    moveTo: to,
                    position: position
                },
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
        };
        /**
         * Полная перегрузка записей.
         */
        me.store.fullReload = function () {
            me.store.load({
                page: 1,
                start: 0,
                limit: me.store.pageSize
            });  
        };
        return Ext.create('Ge.view.grid.TreeStore', me.store);
    },

    /**
     * Инициализация конфигурации представления UI списка.
     * @return {Object}
     * @private
     */
    initViewConfig: function () {
        var me = this,
            viewConfig = me.viewConfig || {};

        // если плагины ранее не указаны
        if (!Ext.isDefined(viewConfig.plugins)) {
            viewConfig.plugins = [];
        }

        // если узлы дерева перетягиваются, указываем плагин
        if (this.nodesDraggable) {
            viewConfig.plugins.push(Ext.applyIf(me.nodesDragConfig, {
                'ptype': 'treeviewdragdrop',
            }));
            viewConfig.listeners = viewConfig.listeners || {};
            viewConfig.listeners.drop = 'onDrop';
            viewConfig.listeners.beforedrop = 'onBeforeDrop';
        }

        return Ext.applyIf(viewConfig, {
            /*
            preserveScrollOnRefresh: false,
            preserveScrollOnReload: false,
            deferInitialRefresh: false,
            blockRefresh: true,
            */
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
     * Инициализация всплывающего меню узла дерева.
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

        if (typeof me.initOwnerCt.navigator !== 'undefined') {
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
     * Инициализация компонента.
     * @param {Object} config Параметры инициализации.
     */
    initComponent: function() {
        var me = this;

        me.router = new Ge.ActionRouter(me.router || {});

        var store      = me.initStore(),
            viewConfig = me.initViewConfig();

        me.nodesDropConfig = Ext.applyIf(me.nodesDropConfig || {}, {
            confirm: false,
            confirmTitle: 'Drop',
            confirmMsg: 'You agree to move "{0}" to "{1}"?',
            dropNodeName: 'text'
        });

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
                 me.view.tip.destroy();
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
    }
});