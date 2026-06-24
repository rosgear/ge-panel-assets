/**
 * Панель вкладок компонентов.
 
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
 * @license Widgets.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.tab.Widgets
 * @extends Ext.tab.Panel
 * Панель вкладок компонентов приложения.
 */
Ext.define('Ge.view.tab.Widgets', {
    extend: 'Ext.tab.Panel',
    xtype: 'g-widgets',
    id: 'g-widgets',
    bodyCls: 'g-widgets__body',
    closeTooltip: 'Close',
    helpTooltip: 'Help',
    prevTooltip: 'Previous tab',
    nextTooltip: 'Next tab',
    tabPosition: 'bottom',
    reference: 'widgets',
    referenceHolder: true,
    defaults: {
        bodyPadding: 10,
        scrollable: true,
        closable: true
    },

    /**
     * Закрыть все вкладки.
     */
    closeTabs: function () {
        this.items.each(function (item, index, len) {
            if (index > 0)
                item.close();
        });
    },
    listeners: {
        /**
         * Событие при смене вкладки.
         * @param {Ext.panel.Panel} tabPanel Панель вкладок.
         * @param {Object} newCard Новая вкладка.
         * @param {Object} oldCard Предыдущая вкладка.
         * @param {Object} eOpts Параметры события.
         */
        tabchange: function (tabPanel, newCard, oldCard, eOpts) {
            //document.title = Ge.settings.title.replace('%s', newCard.title);
            //Ge.getApp().header.activeTitle.update(newCard.title);
            Ge.getApp().setTitle(newCard.title);
            
            var navigator = Ext.getCmp('g-navigator-tabs');
            if (Ext.isDefined(newCard.navigator))
                navigator.openSomeTabs(newCard.navigator.show);
            else
                navigator.openSomeTabs(['g-navigator-modules']);
                
            // если история доступа и виджет имеет последний адрес своего запроса, 
            // полученный из Ge.Widget.load
            if (Ge.history.enabled && Ext.isDefined(newCard.widgetRequest)) {
                Ge.history.add(newCard.widgetRequest, newCard.widgetRequest.url);
            }
        },
        /**
         * Событие при закрытии вкладки.
         * @param {Ext.panel.Panel} panel Панель вкладок.
         * @param {Object} eOpts Параметры.
         */
        beforeclose: function (panel , eOpts) {
            this.removeAll();
        },
        /**
         * Событие при закрытии (удалении) вкладки.
         * @param {Ext.Component } me Вкладка.
         * @param {Ext.container.Container} ownerCt Панель вкладок.
         * @param {Object} eOpts Параметры события.
         */
        remove: function (me, ownerCt, eOpts ) {
            // если после закрытии вкладки, панель не имеет вкладок
            if (me.items.length == 0) {
                Ge.getApp().setTitle();
                // если история доступна, то главная страница
                Ge.history.add(Ge.settings.workspace, Ge.settings.workspace.url);
            }
        }
    }
});


/**
 * Переопределение свойств и методов компонента Ext.tab.Tab.
 */
Ext.define('Ext.tab.Tab', {
  override: 'Ext.tab.Tab',
    /**
     * Установка подсказки.
     * @param {String} tooltip Подсказка.
     * @param {Boolean} initial Если false, удалть уже ранее созданную подсказку.
     * @return {Ext.tab.Tab}
     */
    setTooltip: function (tooltip, initial) {
        var me = this;

        if (typeof me.config.card.tooltipType != 'undefined')
            if (me.config.card.tooltipType != 'tooltip')
                return me.callParent(arguments);
 
        if (me.rendered) {
            if (!initial || !tooltip) {
                me.clearTip();
            }
            if (tooltip) {
                if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
                    var tip = Ext.applyIf(tooltip, { icon: '', title: '', text: '' }),
                        tipHtml = '';
                    if (tip.icon.length)
                        tipHtml += '<img class="g-tab-tip__icon" src="' + tip.icon + '">';
                    if (tip.title.length)
                        tipHtml += '<div class="g-tab-tip__title">' + tip.title + '</div>';
                    if (tip.text.length)
                        tipHtml += '<div class="g-tab-tip__text">' + tip.text + '</div>';
                    me.tooltip = Ext.create('Ext.tip.ToolTip', {
                            cls: 'g-tab-tip' + (tip.icon.length ? ' g-tab-tip_icon' : ''),
                            bodyCls: 'g-tab-tip__body',
                            target: me.el.id + '-btnWrap',
                            trackMouse: false,
                            autoHide: true,
                            mouseOffset: [10, -120],
                            anchor: 'top',
                            animCollapse: false,
                            anchorToTarget: true,
                            html: tipHtml,
                    });
                } else {
                    me.el.dom.setAttribute(me.getTipAttr(), tooltip);
                }
            }
        } else {
            me.tooltip = tooltip;
        }
        return me;
    }
});