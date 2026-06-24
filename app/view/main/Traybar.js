/**
 * Панель уведомлений.
 
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
 * @license Traybar.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.main.Traybar
 * @extends Ext.Toolbar
 * Панель уведомлений.
 */
Ext.define('Ge.view.main.Traybar', {
    extend: 'Ext.Toolbar',
    xtype: 'g-traybar',
    cls: 'g-traybar',
    plain: true,
    items: [],
    /**
     * Конструктор.
     * @param {Object} config Настройки конфигурации.
     */
    constructor: function (config) {
        this.callParent(arguments);

        if (Ge.settings.panel.traybar != null)
            this.add(Ge.settings.panel.traybar.items);
    },
});
