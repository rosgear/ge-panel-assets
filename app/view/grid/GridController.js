/**
 * Контроллер компонента "Панель сетки записей".
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
 * @license GridController.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.PanelController
 * @extends Ext.app.ViewController
 * Контроллер компонента "Панели списка записей".
 */
Ext.define('Ge.view.grid.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.grid',

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
     * Отправка запроса по клику из панели инструмента списка.
     * @param {Ge.view.grid.button.Button} me Кнопка списка.
     */
    onSendData: function (me) {
        function send(component, data) {
            component.mask(Ext.Txt.loading);
            Ext.Ajax.request({
                url: Ge.url.build(me.handlerArgs.route),
                method: 'post',
                params: data,
                /**
                 * Успешное выполнение запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                success: function( response, opts) {
                    component.unmask();
                    var response = Ge.response.normalize(response);
                    if (response.success)
                        Ge.getApp().popup.msg(response.message);
                    else
                        Ext.Msg.exception(response, false, true);
                },
                /**
                 * Ошибка запроса.
                 * @param {XMLHttpRequest} response Ответ.
                 * @param {Object} opts Параметр запроса вызова.
                 */
                failure: function (response, opts) {
                    component.unmask();
                    Ext.Msg.exception(response, true, true);
                }
            });
        }

        var grid = me.up('gridpanel'),
            id = '',
            data = {};

        // если необходимо отправить только выделенные записи
        if (Ext.isDefined(me.selectRecords) && me.selectRecords) {
            id = grid.getStore().selectionListAsString();
            if (!id.length) {
                Ext.Msg.show({
                    title: Ext.Txt.warning,
                    msg: me.msgMustSelect,
                    buttons: Ext.Msg.OK, icon: Ext.Msg.WARNING
                });
                return false;
            } else
                data.id = id;
        }
        // если необходимо подтверждение
        if (Ext.isDefined(me.confirm) && me.confirm) {
            Ext.Msg.confirm(
                Ext.Txt.confirmation,
                Ext.String.format(me.msgConfirm, id),
                function(btn, text) {
                    if (btn == 'yes')
                        send(grid, data);
                },
                this
            );
        } else
            send(grid, data);
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
     * Событие при перегрузке данных списка.
     * @param {Object} me
     */
    onReload: function (me) {
         me.up('gridpanel').getStore().reload();
    },

    /**
     * Событие при выделении записей списка.
     * @param {Object} me
     */
    onSelection: function (me) {
        me.up('gridpanel').getSelectionModel().selectAll();
    },

    /**
     * Событие при снятии выделения записей списка.
     * @param {Object} me
     */
    onRemoveSelection: function (me) {
        me.up('gridpanel').getSelectionModel().deselectAll();
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
            if (me.getText() !== null)
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
            if (me.getText() !== null)
                me.setText(me.textShow);
            me.setIconCls(me.inactiveIconCls);
            Ext.each(me.selectorCmp.getColumns(), function (column) {
                if (hidden.indexOf(column.dataIndex) != -1)
                    column.hide();
            });
        }
        me.selectorCmp.doLayout();
    },

    onColumnWidgetLoad: function (grid, rowIndex, colIndex, item) {
        var record = grid.getStore().getAt(rowIndex);
        // если указан шаблон
        if (Ext.isDefined(item.tpl)) {
            item.tpl = (!Ext.isPrimitive(item.tpl) && item.tpl.compile) ? item.tpl : new Ext.XTemplate(item.tpl);
            var data = Ext.apply({}, record.data, record.getAssociatedData());
            Ge.getApp().widget.load(item.tpl.apply(data));
        } else
            Ge.getApp().widget.load(record.data[item.dataIndex]);
    },

    onColumnWidgetDelete: (grid, rowIndex, colIndex, widget, e) => {
        var row = grid.getStore().getAt(rowIndex);

        grid.getSelectionModel().select([row]);
        if (widget.confirm || false) {
            Ext.Msg.confirm(
                Ext.Txt.confirmation,
                widget.msgConfirm || '',
                (btn, text) => {
                    if (btn == 'yes')
                        grid.getStore().remove();
                },
                this);
        } else
            grid.getStore().remove();
    },

    /**
     * Загрузить компонент (виджет) при клике на компонент ячейки столбца (Ext.grid.column.Action) сетки.
     * @param {Ge.view.grid.Panel} grid Сетка.
     * @param {Number} rowIndex Индекс строки.
     * @param {Number} colIndex Индекс столбца.
     * @param {Object} item Выбранный элемент.
     */
    loadWidgetFromCell: function (grid, rowIndex, colIndex, item) {
        var record = grid.getStore().getAt(rowIndex);
        // если указан шаблон
        if (Ext.isDefined(item.tpl)) {
            item.tpl = (!Ext.isPrimitive(item.tpl) && item.tpl.compile) ? item.tpl : new Ext.XTemplate(item.tpl);
            var data = Ext.apply({}, record.data, record.getAssociatedData());
            Ge.getApp().widget.load(item.tpl.apply(data));
        } else {
            Ge.getApp().widget.load(record.data[item.dataIndex]);
        }
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
