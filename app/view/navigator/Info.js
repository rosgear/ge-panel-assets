/**
 * Компонент "Панель навигации записей списка".
 
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
 * @license Info.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.navigator.Info
 * @extends Ext.Panel
 * Компонент "Панель навигации записей списка".
 */
Ext.define('Ge.view.navigator.Info', {
    extend: 'Ext.Panel',
    xtype: 'g-navigator-info',
    cls: 'g-navigator g-navigator_info',
    bodyCls: 'g-navigator__body',
    requires: ['Ge.view.navigator.NavigatorController'],
    controller: 'navigator',
    bodyPadding: 5,
    animate: false,
    hidden: true
});
