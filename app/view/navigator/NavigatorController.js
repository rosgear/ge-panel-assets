/**
 * Компонент "Панель навигации компонентов".
 
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
 * @license NavigatorController.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.navigator.NavigatorController
 * @extends Ext.app.ViewController
 * Контроллер компонента "Панель навигации".
 */
Ext.define('Ge.view.navigator.NavigatorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.navigator',

    /**
     * Обновление элементов дерева.
     * @param {Object} me
     */
    refreshTree: function (me) {
        var tree = me.up('treepanel'),
            store = tree.getStore();
        store.getRootNode().removeAll();
        store.load();
    },

    /**
     * Удаление всех элементов дерева.
     * @param {Object} me
     */
    clearTree: function (me) {
        var node = me.up('treepanel').getRootNode();
        node.removeAll();
    },

    /**
     * Свертывание элементов дерева.
     * @param {Object} me
     */
    collapseTree: function (me) {
        var tree = me.up('treepanel');
        tree.collapseAll();
    },

    /**
     * Развертывание элементов дерева.
     * @param {Object} me
     */
    expandTree: function (me) {
        var tree = me.up('treepanel');
        tree.expandAll();
    },

    /**
     * Загрузка компонента из элемента дерева.
     * @param {Ge.view.navigator.Components} tree
     * @param {Ext.data.Model} record Запись, которая принадлежит элементу.
     * @param {HTMLElement} item Элемент.
     * @param {Number} index Индекс элемента.
     * @param {Ext.event.Event} e Необработанный объект события.
      *@param {Object} eOpts Параметры слушателя.
     */
    loadWidgetFromNode: function (tree, record, item, index, e, eOpts) {
        if (record.data.widgetUrl)
            Ge.getApp().widget.load(record.data.widgetUrl)
    }
});
