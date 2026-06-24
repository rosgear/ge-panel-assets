/**
 * Главное меню приложения.
 
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
 * @license Menu.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.main.Menu
 * @extends Ext.Toolbar
 * Главное меню приложения.
 */
Ext.define('Ge.view.main.Menu', {
    extend: 'Ext.Toolbar',
    xtype: 'g-menu',
    ui: 'main',

    /**
     * Конструктор.
     * @param {Object} config Настройки конфигурации.
     */
    constructor: function (config) {
        this.callParent(arguments);

        if (Ge.settings.panel.menu != null)
            this.add(Ge.settings.panel.menu.items);
    },
});
