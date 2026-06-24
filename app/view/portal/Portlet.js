/**
 * Компонент "Портлет".
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
 * @license Portlet.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.portal.Portlet
 * @extends Ext.panel.Panel
 * Компонент "Портлет".
 */
Ext.define('Ge.view.portal.Portlet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portlet',
    layout: 'fit',
    anchor: '100%',
    frame: false,
    margin: '8 8 0 0',
    animCollapse: true,
    draggable: { moveOnDrag: false },
    // Важно: портлет имеет фиксированную ширину. Меняться может только высота, и то только снизу
    resizeHandles: 's',
    resizable: true,
    cls: 'g-portlet color-white',

    /**
     * @cfg {String} contentType
     * Вид контента портлета: html, items, store (сетки и т.п.), template (шаблон контента).
     */
    contentType: 'html',
    /**
     * @cfg {null|String|Ext.Template} tpl
     * Шаблон портлета для вывода его контента.
     */
    tpl: null,
    /**
     * @cfg {Numeric} rowId
     * Идентификатор портлета в базе данных.
     */
    rowId: 0,
    /**
     * @cfg {Boolean} autoload
     * Автозагрузка контента портлета сразу после его вывода.
     * Автозагрузка применяется в событии "afterrender" портлета и должна определяться 
     * его контроллером.
     */
    autoload: false,

    /**
     * Переопределяем doClose чтобы обеспечить свой эффект затухания при удалении 
     * портлета.
     */
    doClose: function() {
        if (!this.closing) {
            this.closing = true;
            this.el.animate({
                opacity: 0,
                callback: function(){
                    var closeAction = this.closeAction;
                    this.closing = false;
                    this.fireEvent('close', this);
                    this[closeAction]();
                    if (closeAction == 'hide') {
                        this.el.setOpacity(1);
                    }
                },
                scope: this
            });
        }
    },

    /**
     * @param {String|Array} data Контент портлета.
     * Обновляет контент портлета.
     */
    updateContent: function (data) {
        switch (this.contentType) {
            case 'html':
                this.update(data);
                break;

            case 'template':
                if (Ext.isString(this.tpl)) {
                    this.tpl = new Ext.Template(this.tpl, {compiled: true});
                }
                if (this.tpl) {
                    this.update(this.tpl.apply(data));
                }
                break;

            case 'localStore':
                var cmp = this.items.getAt(0);
                cmp.getStore().load(data);
                break;

            case 'remoteStore':
                var cmp = this.items.getAt(0);
                cmp.getStore().reload();
                break;
        }
    }
});
