/**
 * Основной контроллер приложения.
 
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
 * @license App.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.controller.App
 * @extends Ext.app.Controller'
 * Основной контроллер приложения.
 */
Ext.define('Ge.controller.App', {
    extend: 'Ext.app.Controller',
    alias: 'controller.app',

    /**
     * Инициализация контроллера.
     */
    init: function () {
        this.control({
            'combobox': {
                afterrender : function (me) {
                    me.getStore().on('load', function(me, records, successful, operation, eOpts) {
                        var response;
                        if (!successful) {
                            if (!Ext.isDefined(operation.error))
                                response = operation._response;
                            else
                                response = operation.error.response;
                            Ext.Msg.exception(response, true, true);
                        }
                    });
                }
            }
        });
    },

    /**
     * Изменение URL-адреса приложению.
     * @param {String} url URL-адрес.
     */
    redirect: (url) => document.location = url,

    /**
     * Обновить панель списка записей.
     * @param {String} gridId Идентификатор компонента панели списка.
     */
    reloadGrid: (gridId) => {
        let grid = Ext.getCmp(gridId);
        if (grid)
            grid.getStore().reload();
    },

    supplementGrid: (gridId) => {
        let grid = Ext.getCmp(gridId);
        if (grid)
            grid.getStore().supplement();
    },

    /**
     * Обновить панель дерева записей.
     * @param {String} id Идентификатор компонента панели дерева.
     * @param {String} nodeId Идентификатор обновляемого узла (корень = "root" или "null").
     */
    reloadTreeGrid: (id, nodeId = 'root') => {
        let tree = Ext.getCmp(id);
        if (tree) {
            let store = Ext.getCmp(id).getStore();
            if (nodeId === 'root' || nodeId === 'null' || nodeId == null) {
                store.reload();
            } else {
                let node = store.getNodeById(nodeId);
                if (node !== null) {
                    node.set('leaf', false);
                    node.collapse();
                    node.removeAll();
                    node.set('loaded', false);
                    node.expand();
                }
            }
        }
    },

    /**
     * Обновить панель дерева.
     * @param {String} id Идентификатор компонента панели дерева.
     * @param {String} nodeId Идентификатор обновляемого узла (корень = "root" или "null").
     */
     reloadTree: (id, nodeId = 'root') => {
        let tree = Ext.getCmp(id);
        if (tree) {
            let store = Ext.getCmp(id).getStore();
            console.log(nodeId);
            if (nodeId === 'root' || nodeId === 'null' || nodeId == null) {
                store.reload();
            } else {
                let node = store.getNodeById(nodeId);
                if (node !== null) {
                    node.getTreeStore().reload();
                }
            }
        }
    },

    /**
     * Перезагрузить источник данных компонента.
     * @param {String} cmpId Идентификатор компонента.
     */
    reloadStore: (cmpId) => Ext.getCmp(cmpId).getStore().reload(),

    /**
     * Обновляет данные указанной записи списка.
     * @param {String} gridId Идентификатор компонента панели списка.
     * @param {String} rowId Идентификатор записи списка.
     */
    reloadRowGrid: (gridId, rowId) => Ext.getCmp(gridId).getStore().reloadRow(rowId),

    /**
     * Устанавливает данные указанному узлу дерева.
     * @param {String} treeId Идентификатор дерева.
     * @param {String} nodeId Идентификатор узла дерева.
     * @param {Object} data Данные узла дерева.
     */
    setTreeNode: (treeId, nodeId, data) => {
        let node = Ext.getCmp(treeId).getStore().getNodeById(nodeId);
        node.set(data);
    },

    /**
     * Загрузить компонент по указанному маршруту.
     * @param {String} route Маршрут.
     * @param {Object} params Параметры запроса методом POST (по умолчанию `null`).
     */
    loadWidget: (route, params = null) => Ge.getApp().widget.load(route, params),

    /**
     * Показать всплывающие сообщение приложения.
     * @param {String} msg Сообщение.
     * @param {String|null} title Заголовок сообщения.
     * @param {String|null} type Тип сообщения.
     * @param {String|null} icon URL-адрес значка.
     */
    popupMsg: (msg, title = null, type = null, icon = null) => Ge.getApp().popup.msg(msg, title, type, icon),

    /**
     * Показать сообщение с предупреждением.
     * @param {String} msg Сообщение.
     * @param {String} title Заголовок сообщения.
     */
    alertMsg: (msg, title) => Ext.Msg.alert(title, msg),

    /**
     * Показать диалоговое сообщение.
     * @param {Object} params Настройки сообщения.
     */
    msgBox: (params) => {
        params.icon = Ext.Msg[params.icon];
        params.buttons = Ext.Msg[params.buttons];
        Ext.Msg.show(params);
    },

    /**
     * Показать сообщение c маской.
     * @param {Object} params Настройки сообщения.
     */
    msgMask: (params) => Ge.getApp().msgMask.show(params),

    /**
     * Закрыть окно.
     * @param {String} cmpId Идентификатор окна.
     */
    closeWindow: (cmpId) => {
        let window = Ext.getCmp(cmpId);
        if (window !== null) window.close();
    },

    /**
     * Скрыть окно.
     * @param {String} cmpId Идентификатор окна.
     */
    hideWindow: (cmpId) => {
        let window = Ext.getCmp(cmpId);
        if (window !== null) window.hide();
    },

    /**
     * Создаёт объект Ext.
     * @param {Array} config Конфигурация объекта.
     */
    create: (config) => Ext.create(config).show(),

    /**
     * Выполнить действие над компонентом HTMLElement.
     * @param {String} id Идентификатор компонента.
     * @param {String} method Имя вызываемого метода компонента.
     * @param {Object|null} attributes Агрументы вызываемого метода компонента.
     */
    htmlElement: (id, method, attributes = null) => {
        let element = Ext.get(id);
        if (element === null) return;
        if (attributes !== null)
            element[method].apply(element, attributes);
        else
            element[method]();
    },

    /**
     * Выводит в консоль браузера сообщения.
     * @param {Object|null} args Агрументы вызываемого метода.
     */
    console: (type, args) => { console[type].apply(null, args); },

    /**
     * Вызывает метод (функцию) Ge.
     * @param {String} method Имя вызываемого метода.
     * @param {Object|null} args Агрументы вызываемого метода.
     */
     ge: (method, args = null) => args !== null ? Ge[method].apply(Ge, args) : Ge[method](),

    /**
     * Выполнить действие над компонентом HTMLElement.
     * @param {String} id Идентификатор компонента.
     * @param {String} method Имя вызываемого метода компонента.
     * @param {Object|null} args Агрументы вызываемого метода компонента.
     */
    component: (id, method, args = null) => Ge.callMe(id, method, args),

    /**
     * Выполнить действие над компонентом Ge.app.
     * @param {String} name Имя компонента.
     * @param {String} method Имя вызываемого метода компонента.
     * @param {Object|null} args Агрументы вызываемого метода компонента.
     */
    appComponent: (name, method, args = null) => {
        let cmp = Ge.getApp()[name];
        args !== null ? cmp[method].apply(cmp, args) : cmp[method]();
    },

    /**
     * Вызывает метод контроллера компонента ExtJS.
     * @param {String} id Идентификатор компонента.
     * @param {String} method Имя вызываемого метода.
     * @param {Object|null} args Агрументы вызываемого метода.
     */
    callControllerMethod: (id, method, args = null) => {
        let cnt = Ext.getCmp(id).getController();
        args !== null ? cnt[method].apply(cnt, args) : cnt[method]();
    }
});