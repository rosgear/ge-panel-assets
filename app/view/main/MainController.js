/**
 * Основной контроллер представления приложения.
 
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
 * @license MainController.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.main.MainController
 * @extends Ext.app.ViewController
 * Основной контроллер представления приложения. Если представления компонентов не 
 * имеют собственный контроллер, то обработка событий компонентов вызывается здесь.
 */
Ext.define('Ge.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    /**
     * Загрузка компонента через пункт меню.
     * @param {Object} me
     */
    loadWidgetFromMenu: function (me) {
        Ge.getApp().widget.load(me.parentMenu.widgetUrl);
    },

    /**
     * Загрузка компонента.
     * @param {Object} me
     */
     loadWidget: function (me) {
        me.handlerArgs.me = me;
        Ge.getApp().widget.loadBy(me.handlerArgs);
    },

    /**
     * Закрытие окна.
     * @param {Object} me
     */
    windowClose: function (me) {
        me.up('window').close();
    },

    /**
     * Устанавливает высоту окна равной высоте страницы.
     * Применяется для Ext.window.Window.tools = [{type: "up", callback: "windowFullHeight"}].
     * @param {Ext.window.Window} window
     * @param {Object} toolEl
     * @param {Object} event
     */
    windowFullHeight: function (window, toolEl, event) {
        if (!Ext.isDefined(window.isFullHeight)) {
            window.isFullHeight = true;
        }
        if (window.isFullHeight) {
            let viewport = Ge.getApp().viewport,
                position = window.getPosition(),
                size     = window.getSize();
            window.oldPosition = position;
            window.oldSize     = size;
            window.setPosition(position[0],  10);
            window.setSize(size[0], viewport.getHeight() - 20);
            window.isFullHeight = false;
            toolEl.setType('down');
        } else {
            window.setPosition(window.oldPosition);
            window.setSize(window.oldSize);
            window.isFullHeight = true;
            toolEl.setType('up');
        }
    },

    /**
     * Удаляет маску модального окна. Окно становится не модальным.
     * Применяется для Ext.window.Window.tools = [{type: "pin", callback: "windowModalRemove"}].
     * @param {Ext.window.Window} window
     * @param {Object} toolEl
     * @param {Object} event
     */
    windowModalRemove: function (window, toolEl, event) {
        if (toolEl.type === 'pin') {
            toolEl.setType('unpin');
            window.modal = false;
            window.show();
        } else {
            if (Ext.isDefined(toolEl.msgNotification)) {
                Ext.Msg.warning(toolEl.msgNotification);
            }
        }
    },

    /**
     * Показать панель выхода.
     * @param {Object} me
     */
    signuotShow: function (me) {
         Ge.getApp().signout.show();
    },

    /**
     * Открыть окно браузера.
     * @param {Object} me
     */
    openBrowserWindow: function (me) {
        window.open(me.handlerArgs.url);
    },

    /**
     * Показать компонент.
     * @param {Object} me
     */
    showComponent: function (me) {
        Ext.getCmp(me.handlerArgs.id).show();
    },

    /**
     * Скрыть компонент.
     * @param {Object} me
     */
    hideComponent: function (me) {
        Ext.getCmp(me.handlerArgs.id).hide();
    },

    /**
     * Развернуть/свернуть главное меню.
     * @param {Object} me
     */
    slideMainMenu: function (me) {
        if (me.checked)
            Ext.getCmp('g-menu').show();
        else
            Ext.getCmp('g-menu').hide();
    },

    /**
     * Развернуть/свернуть панель навигации.
     * @param {Object} me
     */
    slideNavigation: function (me) {
        if (me.checked)
            Ext.getCmp('g-navigation').expand();
        else
            Ext.getCmp('g-navigation').collapse();
    },

    /**
     * Показать предыдущую вкладку панели компонентов.
     */
    prevTabComponent: function () {
        var ct = Ext.getCmp('g-widgets'); // this.lookupReference('componentstabs')
        var at = ct.getActiveTab(),
            j = 0,
            count = ct.items.getCount();
        if (!Ext.isDefined(at)) return;
        ct.items.each(function (item, index, len) {
            if (at.id == item.id) {
                j = index - 1;
                return;
            }
        });
        if (j < 0)
            j = count - 1;
        ct.setActiveTab(ct.items.getAt(j).id);
    },

    /**
     * Показать следующую вкладку панели компонентов.
     */
    nextTabComponent: function () {
        var ct = Ext.getCmp('g-widgets'), // this.lookupReference('componentstabs')
            at = ct.getActiveTab(),
            j = 0,
            count = ct.items.getCount();
        if (!Ext.isDefined(at)) return;
        ct.items.each(function (item, index, len) {
            if (at.id == item.id) {
                j = index + 1;
                return;
            }
        });
        if (j >= count)
            j = 0;
        ct.setActiveTab(ct.items.getAt(j).id);
    },

    /**
     * Закрыть активную вкладку панели компонентов.
     */
    closeTabComponent: function () {
        var ct = Ext.getCmp('g-widgets'), // this.lookupReference('componentstabs')
            at = ct.getActiveTab();
        if (typeof at != 'undefined')
            at.close();
    },

    /**
     * Закрыть все вкладки панели компонентов.
     */
    closeTabsComponent: function () {
        var ct = Ext.getCmp('g-widgets'); // this.lookupReference('componentstabs')
        ct.items.each(function (item, index, len) {
            item.close();
        });
    }
});
