/**
 * Компонент формы "Поле объекта в формате JSON".
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
 * @license Object.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.form.field.Object
 * @extends Ext.form.field.Text
 * Компонент текстового поля редактирования объекта в формате JSON.
 */
Ext.define('Ge.view.form.field.Object', {
    extend: 'Ext.form.field.Text',
    xtype: 'g-field-object',
    alias: ['widget.g-objectfield'],
    alternateClassName: 'Ge.form.ObjectField',

    /**
     * Устанавливает значение в поле, кодирует объект в формат JSON.
     * @param {Object|String} value Значение.
     * @return {Ge.view.form.field.Object} this
     */
     setValue: function (value) {
        if (Ext.isObject(value)) {
            value = Ext.util.JSON.encode(value);
        }
        return this.callParent([value]);
    },

    /**
     * Возвращает значение поля, декодирует значение из формата JSON в объект.
     * @return {Object}
     */
    getRawValue: function() {
        let value = this.callParent();

        if (value) { 
            value = Ext.util.JSON.decode(value, true);
         }
         return value || {};
    }
});