/**
 * Виджет "Bootslide".
 
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
 * @license Bootslide.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.Bootslide
 * Класс виджета всплывающего меню.
 */
Ext.define('Ge.view.Bootslide', {
    /**
     * @cfg {Ge.Application} app 
     * Приложение.
     */
    app: null,
    /**
     * @cfg {HTMLElement} wrapper 
     * Обвёртка панели.
     */
    wrapper: null,
    /**
     * @cfg {HTMLElement} btnStart 
     * Кнопка пуска панели.
     */
    btnStart: null,
    /**
     * @cfg {HTMLElement} tabPanel 
     * Панель.
     */
    panel: null,
    /**
     * @cfg {HTMLElement} tabPanel 
     * Меню панели.
     */
    menu: null,
    /**
     * @cfg {HTMLElement} tabPanel 
     * Вкладки панели.
     */
    tabPanel: null,
    /**
     * @cfg {Array} tabPanel 
     * Пункты меню панели.
     */
    menuItems:  null,
    /**
     * @cfg {Integer} activeItem 
     * Активный пункт меню.
     */
    activeItem: -1,

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        Ext.apply(this, config);

        this.wrapper =  Ext.get('g-bootslide');
        this.btnStart = Ext.get('g-header__button');
        this.btnBack = Ext.get('g-bootslide-panel-back');
        this.panel = Ext.get('g-bootslide-panel');
        this.menu = Ext.get('g-bootslide-menu');
        this.tabPanel = this.wrapper.select('.g-bs-tabs', true).first();
        this.tabs = this.tabPanel.select('.g-bs-tab', true);

        if (this.activeItem != -1)
            this.activeMenuItem(this.activeItem);

        this.initEvents();
    },

    /**
     * Инициализация событий.
     */
    initEvents: function () {
        this.btnStart.on('click', this.onShowPanel, this);
        this.btnBack.on('click', this.onHidePanel, this);
        this.getMenuItems().on('click', this.onClickMenuItem, this);
        this.wrapper.select('div[role="widget"]', true).on('click', this.onClickWidgetLink, this);
        Ext.get('g-bs-item-exit').on('click', this.onSignout, this);
        return this;
    },

    /**
     * Клик по ссылке для вызова виджета.
     * @param {Object} event
     * @param {HTMLElement} me
     */
    onClickWidgetLink: function (event, me) {
        this.hide();
        var role = me.getAttribute('data-role');
        if (role.length > 0)
            Ge.getApp().widget.load(role);
    },

    /**
     * Клик по пункту "Выход".
     * @param {Object} event
     * @param {HTMLElement} me
     */
    onSignout: function (event, me) {
        Ge.getApp().request('@backend/workspace/signout');
    },

    /**
     * Клик по пункту меню.
     * @param {Object} event
     * @param {HTMLElement} me
     */
    onClickMenuItem: function (event, me) {
        this.getMenuItems().removeCls('g-bs-menu__item--is-focused');
        Ext.get(me).addCls('g-bs-menu__item--is-focused');
        this.activeTab(event.target.id + '-tab');
    },

    /**
     * Событие при показа панели.
     */
    onShowPanel: function () {
        this.show();
    },

    /**
     * Событие при скрытии панели.
     */
    onHidePanel: function () {
        this.hide();
    },

    /**
     * Показать панель.
     */
    show: function () {
        this.wrapper.addCls('g-bs--is-show');
        return this;
    },

    /**
     * Скрыть панель.
     */
    hide: function () {
        this.wrapper.removeCls('g-bs--is-show');
        return this;
    },

    /**
     * Скрыть панель вкладок.
     */
    hideTabs: function () {
        this.tabs.setVisibilityMode(Ext.Element.DISPLAY);
        this.tabs.hide();
        return this;
    },

    /**
     * Возвращает пункт меню по индексу.
     * @param {Integer} index
     * @return {HTMLElement}
     */
    getMenuItem: function (index) {
        if (Ext.isNumeric(index)) {
            var items = this.getMenuItems();
            return items.elements[index];
        } else
            return Ext.get(index);
    },

    /**
     * Возвращает все пункты меню.
     * @return {HTMLElement}
     */
    getMenuItems: function () {
        if (this.menuItems !== null) {
            return this.menuItems;
        }
        return this.menuItems = this.menu.select('div[role="menuitem"]', true);
    },

    /**
     * Возвращает вкладку по идентфикатору.
     * @param {String} id Идентфикатор вкладки.
     * @return {HTMLElement}
     */
    getTab: function (id) {
        return Ext.get(id);
    },

    /**
     * Делает активный пункт меню.
     * @param {String} id Идентфикатор пункта меню.
     */
    activeMenuItem: function (id) {
        var item = this.getMenuItem(id);
        item.addCls('g-bs-menu__item--is-focused');
        this.activeTab(item.id + '-tab');
    },

    /**
     * Делает активную вкладку панели.
     * @param {String} id Идентфикатор вкладки.
     * @return {HTMLElement}
     */
    activeTab: function (id) {
        this.hideTabs();
        var tab = this.getTab(id);
        if (tab !== null) {
            tab.show();
        }
        return tab;
    }
});