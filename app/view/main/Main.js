/**
 * Основной контейнер приложения.
 
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
 * @license Main.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.main.Main
 * @extends Ext.container.Viewport
 * Основной специализированный контейнер, представляющий видимую 
 * область приложения.
 */
Ext.define('Ge.view.main.Main', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Ge.plugin.TabReorderer',
        'Ge.view.navigator.Modules',
        'Ge.view.navigator.Info',
        'Ge.view.tab.Widgets',
        'Ge.view.main.Menu',
        'Ge.view.main.Traybar',
        'Ge.view.main.MainController',
        'Ge.view.main.MainModel'
    ],

    layout: 'border',
    cls: 'g-workspace',
    bodyBorder: false,
    controller: 'main',
    viewModel: 'main',
    items: [{
        xtype: 'container',
        id: 'g-header',
        cls: 'g-header',
        region: 'north',
        layout: 'fit',
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        items: [{
            xtype: 'container',
            cls: 'g-header-top',
            layout: {
                type: 'hbox',
                align: 'top'
            },
            items: [{
               xtype: 'container',
               html: '<span id="g-header__button" class="g-header__button"></span>' +
                     '<span id="g-header__title" class="g-header__title"></span>' +
                     '<span id="g-header__title-active" class="g-header__title-active"></span>'
            }, {
                xtype: 'g-traybar',
                id: 'g-traybar'
            }]
        }, {
            xtype: 'g-menu',
            id: 'g-menu'
        }]
    }, 
    // определение панели разделов, может быть отключена
    function () {
        if (Ge.settings.panel.partitionbar === null || Ge.settings.panel.partitionbar.items.legth == 0) {
            return {};
        } else 
            return {
                id: 'g-partitionbar',
                cls: 'g-partitionbar',
                bodyCls: 'g-partitionbar__body',
                width:  Ge.settings.panel.partitionbar.width,
                height: Ge.settings.panel.partitionbar.height,
                region: Ge.settings.panel.partitionbar.position,
                scrollable: true,
                layout: 'fit',
                dockedItems: Ge.settings.panel.partitionbar.items
            }
    }(),
    {
        id: 'g-navigator',
        cls: 'g-navigator g-navigator_sidebar',
        title: 'Navigation',
        bind: {
            title: '{locale.main.navigation.title}'
        },
        region: Ge.settings.panel.navigator.position,
        hidden: Ge.settings.panel.navigator.hidden,
        collapsible: Ge.settings.panel.navigator.collapsible,
        collapsed: true,
        split:  Ge.settings.panel.navigator.split,
        layout: 'fit',
        floatable: true,
        alwaysOnTop :true,
        margin: '5 0 5 0',
        width: Ge.settings.panel.navigator.width,
        minWidth: 100,
        maxWidth: Ge.settings.panel.navigator.width,
        enableTabScroll: true,
        tabAliases: {},
        items: [{
            xtype: 'tabpanel',
            id: 'g-navigator-tabs',
            padding: 1,
            defaults: {
                autoDestroy: false
            },
            items: [{
                xtype: 'g-navigator-modules',
                id: 'g-navigator-modules',
                iconCls: 'g-icon-svg g-icon_navigator-tab-modules',
                tabAlias: 'modules',
            }, {
                xtype: 'g-navigator-info',
                id: 'g-navigator-info',
                iconCls: 'g-icon-svg g-icon_navigator-tab-info',
                tabAlias: 'info',
            }],
            listeners: {
                'afterrender': function (me, eOpts) {
                    me.tabAliases = {};
                    me.items.each(function (item) {
                        me.tabAliases[item.tabAlias] = item.id;
                    });
                }
            },
            hideBodyTab: function (id) {
                Ext.get(id + '-innerCt').setStyle('display', 'none');
            },
            showBodyTab: function (id) {
                Ext.get(id + '-innerCt').setStyle('display', 'table-cell');
            },
            activeSomeTab: function (id) {
                this.setActiveTab(id).tab.show();
            },
            openSomeTabs: function (tabs) {
                this.items.each(function (item, index, len) {
                    if (tabs.indexOf(item.id) != -1) {
                        if (item.id == 'g-navigator-info')
                            item.update('');
                        item.tab.show();
                        item.show();
                    } else {
                        item.tab.hide();
                        item.hide();
                    }
                });
            },
            openTabs: function (tabs = null) {
                this.items.each(function (item, index, len) {
                    if (tabs != null) {
                        if (tabs.indexOf(item.id) != -1) {
                            item.tab.show();
                            item.show();
                        }
                    } else {
                        item.tab.show();
                        item.show();
                    }
                });
            },
            closeTabs: function (tabs = null) {
                this.items.each(function (item, index, len) {
                    if (tabs != null) {
                        if (tabs.indexOf(item.id) != -1) {
                            item.tab.hide();
                            item.hide();
                        }
                    } else {
                        item.tab.hide();
                        item.hide();
                    }
                });
            },
            closeActiveTab: function () {
                var at = this.getActiveTab();
                at.close();
            }
        }]
    }, {
        xtype: 'g-widgets',
        id: 'g-widgets',
        ui: 'widgets',
        collapsible: false,
        alias: 'widget.tab',
        region: 'center',
        margin: '5 0 5 0',
        plugins: ['responsive', 'tabreorderer'],
        responsiveConfig: {
            landscape: {
                tabPosition: 'bottom'
            },
            portrait: {
                tabPosition: 'right'
            }
        }
    }]
});


/**
 * @class Ge.view.main.Frame
 * @extends Ext.Panel
 * Панель с плавающем фреймом.
 */
Ext.define('Ge.view.main.Frame', {
    extend: 'Ext.Panel',
    xtype: 'g-navigator-info',
    cls: 'g-navinfo',
    requires: ['Ge.view.navigator.NavigatorController'],
    controller: 'navigator',
    bodyPadding: 5,
    animate: false,
    hidden: true
});
