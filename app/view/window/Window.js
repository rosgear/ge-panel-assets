/**
 * Компонент "Окно".
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
 * @license Window.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.window.Window
 * @extends Ext.window.Window
 * Компонент окна.
 */
Ext.define('Ge.view.window.Window', {
    extend: 'Ext.window.Window',
    xtype: 'g-window',
    mixins: ['Ext.mixin.Responsive'],

    config: {
        /**
         * @cfg {Array} responsiveProperties 
         * Массив имён свойств объекта с их значениями.
         * @property
         */
        responsiveProperties: null,
    },

    /**
     * @cfg {String} positionAlign 
     * Положение окна относительно экрана: 'left top', 'left bottom', 'left center'...
     * @property
     */
    positionAlign: null,

    /**
     * @cfg {Array} positionAlignOffset 
     * Смещение положения окна относительно экрана: [left, right, top, bottom].
     * @property
     */
    positionAlignOffset: [5, 5, 5, 40],

    /**
     * Измение конфигурации объекта при отзывчивом дизайне.
     * Если указано, что:
     *    responsiveConfig = {responsiveProperties: [...]}
     * @param {Array} properties Массив имён свойств объекта с их значениями.
     */
    updateResponsiveProperties: function (properties) {
        for (var i = 0; i < properties.length; i++) {
            Ge.applyString(this, properties[i].property, properties[i].value);
        }
    },

    /**
     * Устанавливает положение окна относительно экрана.
     * @param {String} position Положение окна относительно экрана: 'left top', 'left bottom', 'left center'...
     */
    setPositionAlign: function (position) {
        let me = this,
            x = 0, 
            y = 0,
            vp = Ge.getApp().viewport,
            offset = me.positionAlignOffset,
            cmd = position.split(' ');

        switch (cmd[0]) {
            case 'left': x = offset[0]; break;
            case 'right': x = vp.getWidth() - me.getWidth() - offset[1]; break;
            case 'center': x = (vp.getWidth() - me.getWidth()) / 2; break;
        }
        switch (cmd[1]) {
            case 'top': y = offset[2]; break;
            case 'bottom': y = vp.getHeight() - me.getHeight() - offset[3]; break;
            case 'center': y = (vp.getHeight() - me.getHeight()) / 2; break;
        }

        if (me.rendered)
            me.setPosition(x, y);
        else {
            me.x = x;
            me.y = y;
        }
    },

    listeners: {
        afterrender: function (me, eOpts) {
            if (me.positionAlign) {
                me.setPositionAlign(me.positionAlign);
            }
        }
    }
});
