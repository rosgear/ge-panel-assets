/**
 * Кнопки.
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
 * @license Button.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.button.Adder
 * @extends Ext.form.Panel
 * Кнопка добавления компонентов в приёмник (контейнер).
 */
Ext.define('Ge.view.button.Adder', {
    extend: 'Ext.container.Container',
    xtype: 'g-button-adder',
    cls: 'g-adder',
    layout: {
        type: 'vbox',
        align: 'middle'
    },

    /**
     * @cfg {Array} receiver:
     *     {String} "id" Идентификатор приемника;
     *     {Array|Object} "component" Компонент.
     */
    receiver: {},

    /**
     * @cfg {Integer} limitClick
     * Предел кликов по кнопке, после чего, кнопка скрывается.
     */
    limitClick: 2,

    /**
     * @cfg {Object} button
     * Настройки кнопки.
     */
    button: {},

    //indexMask: '{index}',

    index: 0,

    parentIndex: 0,

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.receiverCnt = Ext.getCmp(this.receiver.id);
        this.items = [this.addButton()];

        this.callParent();
    },

    addButton: function () {
        let me = this;
        return Ext.apply(
            {
                xtype: 'button',
                cls: 'g-adder__button',
                text: 'add',
                handler: function () {
                    if (me.limitClick > 0) {
                        if (me.receiverCnt.items.length + 1 >= me.limitClick) {
                            me.hide();
                        }
                    }
                    me.addToReceiver();
                }
            },
            me.button
        );
    },

    /**
     * Добавляет компонент в приёмник (контейнер).
     */
    addToReceiver: function () {
        let component = Object.assign({}, this.receiver.component);
        this.replaceName(this.index++, this.parentIndex, component);
        let item = this.receiverCnt.add(component);
        this.receiverCnt.doLayout();
        return item;
    },

    replaceName: function (index, parentIndex, object) {
        //
        if (Ext.isDefined(object.xtype) && object.xtype == 'g-button-adder') {
            object.parentIndex = index;
            if (Ext.isDefined(object.receiver.idMask)) {
                object.receiver.id = Ext.String.format(object.receiver.idMask, index, parentIndex);
            }
        }
        //
        if (Ext.isDefined(object.idMask)) {
            object.id =  Ext.String.format(object.idMask, index, parentIndex);
        }
        //
        if (Ext.isDefined(object.nameMask)) {
            object.name = Ext.String.format(object.nameMask, index, parentIndex);
        }
        //
        if (Ext.isDefined(object.hiddenNameMask)) {
            object.hiddenName = Ext.String.format(object.hiddenNameMask, index, parentIndex);
        }
        //
        if (Ext.isDefined(object.items)) {
            for (let i = 0; i < object.items.length; i++) {
                if (Ext.isObject(object.items[i])) {
                    this.replaceName(index, parentIndex, object.items[i]);
                }
            }
        }
    }
});

