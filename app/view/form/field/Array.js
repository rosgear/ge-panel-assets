/**
 * Компонент формы "Поле массива".
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
 * @license Array.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.form.field.Array
 * @extends Ext.form.field.Text
 * Компонент текстового поля редактирования массива.
 */
Ext.define('Ge.view.form.field.Array', {
    extend: 'Ext.form.field.Text',
    xtype: 'g-field-array',
    alias: ['widget.g-arrayfield'],
    alternateClassName: 'Ge.form.ArrayField',

    /**
     * @cfg {String} separator
     * Разделитель элементов массива.
     */
    separator: ',',

    /**
     * Устанавливает значение в поле.
     * @param {Array|String} value Значение.
     * @return {Ge.view.form.field.Array} this
     */
     setValue: function (value) {
        if (Ext.isArray(value)) {
            value = value.join(this.separator);
        }
        return this.callParent([value]);
    },

    /**
     * Возвращает значение поля, декодирует значение в Array.
     * @return {Array}
     */
    getRawValue: function() {
        let value = this.callParent();

        if (value) { 
            value = value.split(this.separator);
         }
         return value || [];
    }
});