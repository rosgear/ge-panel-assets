/**
 * Контроллер компонента "Панели дерева".
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
 * @license TreeController.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.TreeController
 * @extends Ext.app.ViewController
 * Контроллер компонента "Панели дерева".
 */
Ext.define('Ge.view.grid.TreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gridtree',

    /**
     * Применить фильтр к списку.
     * @param {Ge.view.grid.button.Filter} me Кнопка фильтра списка.
     */
    onFilterUpdate: function (me) {
        var btn  = me.up('button'),
            form = me.up('form');

        btn.setIconCls(btn.activeIconCls);
        form.mask(Ext.Txt.loading);
        form.submit({
            clientValidation: true,
            url: form.action,
            success: function (me, action) {
                form.unmask();
                var response = Ge.response.normalize(action.response);
                if (!response.success) {
                    Ext.Msg.exception(response, false, true);
                }
            },
            failure: function (me, action) {
                form.unmask();
                Ext.Msg.exception(action, true, true);
            }
        });
    },

    /**
     * Сброс фильтра списка.
     * @param {Ge.view.grid.button.Filter} me Кнопка фильтра списка.
     */
    onFilterReset: function (me) {
        var btn = me.up('button');
        var form = me.up('form');

        btn.setIconCls(btn.inactiveIconCls);
        form.mask(Ext.Txt.loading);
        form.reset();
        Ext.Ajax.request({
            url: form.action,
            method: 'post',
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                form.unmask();
                var response = Ge.response.normalize(response);
                if (!response.success)
                    Ext.Msg.exception(response, false, true);
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: function (response, opts) {
                form.unmask();
                Ext.Msg.exception(response, true, true);
            }
        });
    },

    /**
     * Событие перед перетягиванием элемента.
     * @param {HTMLElement} node
     * @param {Object} data
     * @param {Ext.data.TreeModel} overModel
     * @param {dropPosition} dropPosition
     * @param {Array} dropHandlers
     * @param {Object} eOpts Параметры слушателя.
     */
    onBeforeDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var config = this.view.nodesDropConfig;
        if (config.confirm) {
            var title, node = data.records[0];
            if (!Ext.isDefined(config.confirmTpl)) {
                config.confirmTpl = new Ext.Template(config.confirmMsg);
            }
            dropHandlers.wait = true;
            Ext.MessageBox.confirm(
                config.confirmTitle,
                config.confirmTpl.apply([node.data[config.dropNodeName], overModel.data[config.dropNodeName]]),
                function(btn) {
                    if (btn === 'yes') {
                        dropHandlers.processDrop();
                    } else {
                        dropHandlers.cancelDrop();
                    }
                }
            );
        }
    },

    /**
     * Событие после перетягивания элемента.
     * @param {HTMLElement} node
     * @param {Object} data
     * @param {Ext.data.TreeModel} overModel
     * @param {dropPosition} dropPosition
     * @param {Object} eOpts Параметры слушателя.
     */
    onDrop: function (node, data, overModel, dropPosition, eOpts) {
        this.view.getStore().move(data.records[0].id, overModel.id, dropPosition);
    },

    /**
     * Событие при обновлении записей списка.
     * @param {Object} me
     */
    onReload: function (me) {
        me.selectorCmp.getStore().fullReload();
    },

    /**
     * Событие при выделении записей списка.
     * @param {Object} me
     */
    onSelection: function (me) {
        var cmp;
        if (Ext.isDefined(me.parentMenu))
            cmp = me.parentMenu.ownerCmp.selectorCmp;
        else
            cmp = me.selectorCmp;
        cmp.getSelectionModel().selectAll();
    },

    /**
     * Событие при снятии выделения записей списка.
     * @param {Object} me
     */
    onRemoveSelection: function (me) {
        var cmp;
        if (Ext.isDefined(me.parentMenu))
            cmp = me.parentMenu.ownerCmp.selectorCmp;
        else
            cmp = me.selectorCmp;
        cmp.getSelectionModel().deselectAll();
    },

    /**
     * Событие при инвертировании выделения записей списка.
     * @param {Object} me
     */
    onInvertSelection: function (me) {
        var cmp;
        if (Ext.isDefined(me.parentMenu))
            cmp = me.parentMenu.ownerCmp.selectorCmp;
        else
            cmp = me.selectorCmp;
        var sm = cmp.getSelectionModel(),
            rows = [];
        cmp.getStore().each(function (row) {
            if (!sm.isSelected(row))
                rows.push(row);
        });
        sm.select(rows);
    },

    /**
     * Событие при удалении  записей списка.
     * @param {Object} me
     */
    onDeleteRecords: function (me) {
        var count = me.selectorCmp.getSelectionModel().getCount();
        if (count == 0) {
            Ext.Msg.warning(me.msgMustSelect);
            return;
        }
        if (me.confirm) {
            Ext.Msg.confirm(Ext.Txt.confirmation, Ext.String.format(me.msgConfirm, count),
            function(btn, text) {
                if (btn == 'yes')
                    me.selectorCmp.getStore().remove();
            }, this);
        } else
            me.selectorCmp.getStore().remove();
    },

    /**
     * Событие при удалении всех записей списка.
     * @param {Object} me
     */
    onDeleteAllRecords: function (me) {
        if (me.confirm) {
            Ext.Msg.confirm(Ext.Txt.confirmation, me.msgConfirm,
            function (btn, text) {
                if (btn == 'yes') {
                    if (me.twiceConfirm) {
                        Ext.Msg.confirm(Ext.Txt.confirmation, me.msgTwiceConfirm,
                        function (btn, text) {
                            if (btn == 'yes') {
                                me.selectorCmp.getStore().removeAll();
                            }
                        }, this);
                    } else
                        me.selectorCmp.getStore().removeAll();
                }
            }, this);
        } else
            me.selectorCmp.getStore().removeAll();
    },

    /**
     * Показать/скрыть {@see Ext.button.Button.toggleHandler} профиль записи списка.
     * @param {Ge.view.grid.button.Button} me Кнопка списка.
     * @param {Boolean} state Следующее состояние кнопки «истинно» означает нажатие.
     */
    onProfilingRecord: function (me, state) {
        var info = me.selectorCmp.navigator.info;
        if (!state)
            Ext.getCmp(info.id).update('');
        info.active = state;
        if (state) {
            me.setIconCls(me.activeIconCls);
            Ge.app.navigator.expand();
        } else {
            me.setIconCls(me.inactiveIconCls);
            Ge.app.navigator.collapse();
        }
    },

    /**
     * Показать/скрыть столбцы списка.
     * 
     * @see Ext.button.Button.toggleHandler Событие кнопки.
     * 
     * @param {Ge.view.grid.button.Button} me Кнопка списка.
     * @param {Boolean} state Следующее состояние кнопки «истинно» означает нажатие.
     */
    onToggleColumns: function (me, state) {
        var hidden = me.selectorCmp.hiddenColumns;
        // показать столбцы
        if (state) {
            me.setText(me.textHide);
            me.setIconCls(me.activeIconCls);
            me.selectorCmp.suspendEvents();
            Ext.each(me.selectorCmp.getColumns(), function (column) {
                if (column.isSubHeader) {
                    if (column.ownerCt.isHidden())
                        column.ownerCt.show();
                }
                if (column.isHidden()) {
                    column.show();
                }
            });
            me.selectorCmp.resumeEvents();
        } else {
            me.setText(me.textShow);
            me.setIconCls(me.inactiveIconCls);
            Ext.each(me.selectorCmp.getColumns(), function (column) {
                if (hidden.indexOf(column.dataIndex) != -1)
                    column.hide();
            });
        }
        me.selectorCmp.doLayout();
    },

    /**
     * Загрузить компонент при клике на ячейку списка {@see Ext.grid.column.Action}.
     * @param {Ge.view.grid.Panel} grid Список.
     * @param {Number} rowIndex Индекс строки.
     * @param {Number} colIndex Индекс столбца.
     * @param {Object} item Выбранный элемент.
     */
    loadWidgetFromCell: function (treegrid, rowIndex, colIndex, item) {
        var rec = treegrid.getStore().getAt(rowIndex);
        Ge.getApp().widget.load(rec.data[item.dataIndex]);
    },

    /**
     * Загрузить компонент.
     * @param {Object} me
     */
    loadWidget: function (me) {
        if (me.confirm) {
            Ext.Msg.confirm(Ext.Txt.confirmation, me.msgConfirm, function (btn, text) {
                if (btn == 'yes') {
                    me.handlerArgs.me = me;
                    Ge.getApp().widget.loadBy(me.handlerArgs);
                }
            }, this);
        } else {
            me.handlerArgs.me = me;
            Ge.getApp().widget.loadBy(me.handlerArgs);
        }
    }
});
