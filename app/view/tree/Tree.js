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

Ext.define('Ge.view.tree.TreeStore', {
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
 * @class Ge.view.tree.Tree
 * @extends Ext.tree.Panel
 * Компонент "Панель дерева".
 */
Ext.define('Ge.view.tree.Tree', {
    extend: 'Ext.tree.Panel',
    xtype: 'g-tree',
    cls: 'g-tree',
    /*
    requires: [
        'Ge.view.grid.CellTip'
    ],*/

    /**
     * @cfg {Ge.ActionRouter} router
     * Маршрутизация при  выполнении действия с формой.
     */
    router: null,

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
    initRouter: function () {
        let me = this;

        if (Ext.isSimpleObject(me.router)) {
            me.router = new Ge.ActionRouter(me.router);
        }
    },

    /**
     * Инициализация хранилища узлов дерева.
     * @return {Ext.data.Store}
     * @private
     */
    initStore: function () {
        let me = this;

        if (me.store === null) {
            me.store = me.remoteStore();
        }
        // получить URL-адрес из маршрута
        if (me.router) {
            me.store.proxy.url = Ge.url.build(me.router.build('data'));
        }
    },

    remoteStore: function () {
        return {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '',
                method: 'POST',
                reader: {
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            }
        };
    },


    /**
     * Инициализация компонента.
     * @param {Object} config Параметры инициализации.
     */
    initComponent: function() {
        var me = this;

        me.initRouter();
        me.initStore();

        me.callParent(arguments);

        // инициализация всплывающего меню записи списка.
        //me.initPopupMenu();
    }
});