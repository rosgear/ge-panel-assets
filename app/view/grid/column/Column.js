/**
 * Компонент "Столбцы панели списка записей".
 
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
 * @license Column.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

Ext.define('Ge.view.grid.column.Column', {
    extend: 'Ext.grid.column.Column',
    xtype: 'g-gridcolumn'
});


/**
 * @class Ge.view.grid.column.MenuAction
 * @extends Ext.grid.column.Action
 * Вид столбца "Контекстное меню управляющнй ячейки".
 */
Ext.define('Ge.view.grid.column.MenuAction', {
    extend: 'Ext.grid.column.Action',
    xtype: 'g-gridcolumn-menuaction',
    menuText: '',
    resizable: false,
    hideable: false,
    width: 30,
    menuDisabled: true,

    items: [{
        iconCls: 'g-icon_gridcolumn-menu',
        /**
         * Клик на элементе.
         * @param {Ext.view.Table} me
         * @param {Number} rowIndex Индекс строки.
         * @param {Number} colIndex Индекс столбца.
         * @param {Object} item Выбранный элемент.
         * @param {Event} e Событие.
         * @param {Ext.data.Model} record Запись.
         */
        handler: function (me, rowIndex, colIndex, e, c) {
            var data = me.grid.getStore().getAt(rowIndex).data;
            me.grid.popupMenu.activeRecord = data;

            // есть ли заголовок для меню
            if (typeof data.popupMenuTitle != 'undefined') {
                me.grid.popupMenu.setTitle(data.popupMenuTitle);
            }
            // есть ли управление элементами меню
            // элемент имеет вид: [[index, action{hide, disabled}],...]
            if (typeof data.popupMenuItems != 'undefined') {
                me.grid.popupMenu.items.each(function (item) {
                    if (item.isDisabled()) item.setDisabled(false);
                    if (item.isHidden()) item.show();
                });
                if (data.popupMenuItems.length > 0) {
                    for (var i = 0; i < data.popupMenuItems.length; i++) {
                        let menuItem = data.popupMenuItems[i],
                            item = me.grid.popupMenu.items.getAt(menuItem[0]);
                        if (Ext.isDefined(item)) {
                            if (menuItem[1] == 'enabled')
                                item.setDisabled(false);
                            else
                            if (menuItem[1] == 'disabled')
                                item.setDisabled(true);
                            else
                            if (menuItem[1] == 'hide')
                                item.hide();
                        }
                    }
                }
            }
            me.grid.popupMenu.showAt([c.pageX - c.event.layerX + 22, c.pageY- c.event.layerY + 5]);
        },
        /**
         * Проверка доступности элемента.
         * @param {Ext.view.Table} view
         * @param {Number} rowIndex Индекс строки.
         * @param {Number} colIndex Индекс столбца.
         * @param {Object} item Выбранный элемент.
         * @param {Ext.data.Model} record Запись.
         */
        isDisabled: function (view, rowIndex , colIndex, item, record) {
            var lock = record.get('lockRow');
            if (typeof lock == 'undefined')
                lock = 0;
            return lock > 0 ? true : false;
        }
    }]
});


/**
 * @class Ge.view.grid.column.Action
 * @extends Ext.grid.column.Action
 * Вид столбца "Действие".
 */
Ext.define('Ge.view.grid.column.Action', {
    extend: 'Ext.grid.column.Action',
    xtype: 'g-gridcolumn-action',
    menuText: '',
    resizable: false,
    hideable: false,
    width: 32,
    menuDisabled: true,

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        var me = this, 
            cfg = Ext.apply({}, config),
            items = cfg.items || [me],
            l = items.length,
            i,
            item,
            itemDisabled,
            cls;

        me.callParent(arguments);

        /**
         * Рендер ячейки.
         * @param {Object} value Значение данных для текущей ячейки.
         * @param {Object} metaData Метаданные ячейки.
         * @param {Ext.data.Model} record Запись для текущей строки.
         * @param {Number} rowIndex Индекс текущей строки.
         * @param {Number} colIndex Индекс текущего столбца.
         * @param {Ext.data.Store} store Источник данных списка.
         * @param {Ext.view.View} view
         * @return {String}
         */
        me.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
            value = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments)||'' : '';

            metaData.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
            for (i = 0; i < l; i++) {
                item = items[i];
                valueIndex = record.data[item.dataIndex];
                cls = me.getClassItem(item, metaData, record);
                itemDisabled = false;
                switch (valueIndex) {
                    case null:
                    case '::disable':
                        itemDisabled = true;
                        record.data[item.dataIndex] = null;
                        break;
                    case '::hide': continue; break;
                }
                //
                value  += '<img alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                    '" class="' + Ext.baseCSSPrefix + 'action-col-icon ' + Ext.baseCSSPrefix + 'action-col-' + String(i) + ' ' + (itemDisabled ? Ext.baseCSSPrefix + 'item-disabled' : ' ') + /*(item.iconCls || '') +*/
                    ' ' + cls + '"' +
                    ((item.tooltip) ? ' data-qtip="' + item.tooltip + '"' : '') + ' />';
            }
            return value;
        };
    },

    /**
     * Возвращает css класс элемента столбца.
     * @param {Ext.view.Table} item
     * @param {Number} metaData Индекс строки.
     * @param {Number} record Индекс столбца.
     * @return {String|null}
     */
    getClassItem: function (item, metaData, record) {
        if (record.data[item.dataIndex] === null)
            return null;
        else
            return '';
    }
});


/**
 * @class Ge.view.grid.column.Switch
 * @extends Ext.grid.column.Column
 * Плагин столбца "Переключатель".
 */
Ext.define('Ge.view.grid.column.Checker', {
    extend: 'Ext.grid.column.Column',
    xtype: 'g-gridcolumn-checker',
    alias: 'widget.g-gridcolumn-checker',
    width: 60,

    clsChecker: 'g-gridcolumn-checker',

    /**
     * @cfg {String} align 
     * @hide
     * Переопределен. Для выравнивания по центру ячейки списка.
     */
    align: 'center',

    /**
     * Рендерер по умолчанию.
     * @param {String} value
     * @param {Object} cellValues
     * @return {String}
     */ 
    defaultRenderer: function (value, cellValues) {
        var valueInt = parseInt(value),
            cls      = this.clsChecker;

        if (valueInt == -1 || value === 'hide') {
            cls += ' hidden';
        } else
        if (valueInt == 1)
            cls += ' checked';
        return '<span class="' + cls + '"></span>';
    }
});


/**
 * @class Ge.view.grid.column.Control
 * @extends Ext.grid.column.Action
 * Вид заголовка столбца сетки "Действие".
 * Отображает значок или серию значков (иконок шрифта) в ячейке сетки, для 
 * выполнения действий над записями сетки.
 */
Ext.define('Ge.view.grid.column.Control', {
    extend: 'Ext.grid.column.Action',
    xtype: 'g-gridcolumn-control',
    alias: 'widget.g-gridcolumn-control',
    tdCls: 'g-gridcolumn-control__td',
    sortable: false,
    menuDisabled: true,
    resizable: false,
    hideable: false,
    align: 'center',

    iconFaCls: null,

    // Renderer closure iterates through items creating an <img> element for each and tagging with an identifying 
    // class name x-action-col-{n} 
    defaultRenderer: function (v, cellValues, record, rowIdx, colIdx, store, view) {
        var me = this,
            scope = me.origScope || me,
            items = me.items,
            len = items.length,
            i, item, ret, disabled, hidden, tooltip, indexValue;
 
        // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!) 
        // Assign a new variable here, since if we modify "v" it will also modify the arguments collection, meaning 
        // we will pass an incorrect value to getClass/getTip 
        ret = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';
 
        cellValues.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
        for (i = 0; i < len; i++) {
            item = items[i];
            // 
            if (Ext.isFunction(item.initRenderer))
                item.initRenderer.apply(item, arguments);

            indexValue = record.data[item.dataIndex];
            if (indexValue === null || indexValue === '::disabled') {
                disabled = true;
                record.data[item.dataIndex] = null;
            } else {
                disabled = item.disabled || (item.isDisabled ? item.isDisabled.call(item.scope || scope, view, rowIdx, colIdx, item, record) : false);
            }
            if (indexValue === '::hidden') {
                hidden = true;
                record.data[item.dataIndex] = null;
            } else {
                hidden = item.hidden || false;
            }

            tooltip = disabled ? null : (item.tooltip || (item.getTip ? item.getTip.apply(item.scope || scope, arguments) : null)); 
            if (hidden) continue;

            // Only process the item action setup once. 
            if (!item.hasActionConfiguration) {
                // Apply our documented default to all items 
                item.stopSelection = me.stopSelection;
                item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
                item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
                item.hasActionConfiguration = true;
            }
            if (Ext.isDefined(item.iconFaCls) || me.iconFaCls)
                ret += '<span role="button" ' +
                    'class="' + Ext.baseCSSPrefix + 'action-col-' + String(i) + ' ' +
                    (disabled ? me.disabledCls + ' ' : ' ') +
                    (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : '') + 
                    ' g-action-col g-action-col-' + (Ext.isDefined(item.name) ? item.name : String(i)) + '"' +
                    (tooltip ? ' data-qtip="' + tooltip + '"' : '') + ' >' + 
                    '<i class="x-action-col-' + (Ext.isDefined(item.name) ? item.name : String(i)) + ' ' + 
                    (item.iconFaCls || me.iconFaCls || '') + '"></i></span>';
            else {
                ret += '<img role="button" alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                    '" class="' + me.actionIconCls + ' ' + Ext.baseCSSPrefix + 'action-col-' + String(i) + ' ' +
                    (disabled ? me.disabledCls + ' ' : ' ') +
                    (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : (item.iconCls || me.iconCls || '')) + 
                    ' g-action-col g-action-col-' + (Ext.isDefined(item.name) ? item.name : String(i)) + '"' +
                    (tooltip ? ' data-qtip="' + tooltip + '"' : '') + ' />';
            }
        }
        return ret;
    }
});


/**
 * @class Ge.view.grid.column.DeleteAction
 * @extends Ge.view.grid.column.Action
 * Вид заголовка столбца сетки "Действие удаления".
 * Отображает значок для удаления записей сетки.
 */
Ext.define('Ge.view.grid.column.DeleteAction', {
    extend: 'Ge.view.grid.column.Control',
    xtype: 'g-gridcolumn-delete-action',
    alias: 'widget.g-gridcolumn-delete-action',
    tdCls: 'g-gridcolumn-action-delete__td',
    width: 32,

    constructor: function (config) {
        var cfg = Ext.apply({ actionItem: null }, config);

        cfg.items = [{
            scope: this,
            handler: function (grid, rowIndex, colIndex) {
                grid.getStore().removeAt(rowIndex);
            }
        }];

        this.callParent([cfg]);
    }
});


/**
 * @class Ge.view.grid.column.Editor
 * @extends Ext.grid.column.Column
 * Вид заголовка столбца сетки "Редактор".
 * Отображает виджет в ячейке сетки для изменения ёё значений.
 */
Ext.define('Ge.view.grid.column.Editor', {
    extend: 'Ext.grid.column.Column',
    xtype: 'g-gridcolumn-editor',
    alias: 'widget.g-gridcolumn-editor',
    tdCls: 'g-gridcolumn-editor__td',

    getEditor: function(record) {
        var grid = this.up('grid'),
            cellediting = grid.findPlugin('cellediting'),
            editors = cellediting.editors,
            editor = editors.getByKey(this.id),
            fieldType;
        
        if (editor) {
            editors.remove(editor);
        }
        fieldType = isNaN(parseFloat(record.get('salary'))) ? 'textfield' : 'numberfield';

        return {
            xtype: fieldType,
            allowBlank: false
        };
    }
});


/**
 * @class Ge.view.grid.column.MediaLink
 * @extends Ge.view.grid.column.Conrol'
 * Вид заголовка столбца сетки "Медиаресурс".
 * Отображает ссылку на медиаресурс в виде значка ячейке сетки, где конфигурация ссылки 
 * изменяется в зависимости от значения атрибута записи столбца.
 */
Ext.define('Ge.view.grid.column.MediaLink', {
    extend: 'Ge.view.grid.column.Control',
    xtype: 'g-gridcolumn-link',
    alias: 'widget.g-gridcolumn-medialink',
    tdCls: 'g-gridcolumn-medialink__td',
    width: 34,

    /**
     * @cfg {String} iconIndex
     * Имя свойства записи {Ext.data.Model}, определяющие класс CSS значка.
     */
    iconIndex: null,

    /**
     * @cfg {String} configIndex
     * Имя свойства записи {Ext.data.Model}, определяющие конфигурацию медиаресурса.
     */
    configIndex: null,

    /**
     * @cfg {String} dataIndex
     * Имя свойства записи {Ext.data.Model}, определяющие часть href медиаресурса.
     */
    dataIndex: null,

    /**
     * @cfg {Boolean} useIconSvg
     * Добавлять SVG при формировании {getClass} класса значка.
     */
    useIconSvg: true,

    /**
     * Конструктор.
     * @param {Array} config Конфигурация.
     */
    constructor: function (config) {
        var me = this,
            cfg = Ext.apply({ iconIndex: null, dataIndex: null }, config);

        var link = {
            /**
             * Возвращает имя класса CSS для значка.
             * @param {Object} value Значение данных для текущей ячейки.
             * @param {Object} metaData Метаданные ячейки.
             * @param {Ext.data.Model} record Запись для текущей строки.
             * @param {Number} rowIndex Индекс текущей строки.
             * @param {Number} colIndex Индекс текущего столбца.
             * @param {Ext.data.Store} store Источник данных списка.
             * @param {Ext.view.View} view
             * @return {String}
             */
            getClass: function (value, metaData, record, rowIndex, colIndex, store, view) {
                if (me.iconIndex !== null) {
                    var icon = record.get(me.iconIndex);
                    if (icon.length > 0) {
                        if (me.useIconSvg)
                            return 'g-icon-svg g-icon_' + icon  + ' g-icon_size_17 g-icon-svg_size_17';
                        else
                            return 'g-icon-' + icon;
                    }
                }
                return me.iconCls || this.iconCls;
            },

            /**
             * Инициализация рендерера перед вызовом Ge.view.grid.column.Action.defaultRenderer 
             * @param {Object} value Значение данных для текущей ячейки.
             * @param {Object} metaData Метаданные ячейки.
             * @param {Ext.data.Model} record Запись для текущей строки.
             * @param {Number} rowIndex Индекс текущей строки.
             * @param {Number} colIndex Индекс текущего столбца.
             * @param {Ext.data.Store} store Источник данных списка.
             * @param {Ext.view.View} view
             * @return {String}
             */
            initRenderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var config = record.get(me.configIndex);
                this.hidden = config.handler === null;
                this.tooltip = config.tooltip || '';
            },

            /**
             * Обработчик клика по ссылке.
             * @param {Ext.grid.Panel} grid Панель сетки.
             * @param {Number} rowIndex Индекс текущей строки.
             * @param {Number} colIndex Индекс текущего столбца.
             * @return {Boolean}
             */
            handler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex),
                    value  = record.get(me.dataIndex),
                    config = record.get(me.configIndex);
                if (config.handler === null) return false;
                switch (config.handler) {
                    // загрузка виджета с указанным маршрутом
                    case 'widget':
                        break;
                    // переход по указанной ссылке
                    case 'anchor':
                        window.open(config.uri.replace(/{value}/i, value), '_blank');
                        break;
                    // открыть страницу по указанной схеме
                    case 'scheme':
                        window.location = config.uri.replace(/{value}/i, value);
                        break;
                }
            }
        }
        cfg.items = [link];

        this.callParent([cfg]);
    }
});


/**
 * @class Ge.view.grid.column.Contacts
 * @extends Ge.view.grid.column.Control
 * Вид заголовка столбца сетки "Медиаресурс".
 * Отображает ссылку на медиаресурс в виде значка ячейке сетки, где конфигурация ссылки 
 * изменяется в зависимости от значения атрибута записи столбца.
 */
Ext.define('Ge.view.grid.column.Contacts', {
    extend: 'Ext.grid.column.Template',
    xtype: 'g-gridcolumn-contacts',
    alias: 'widget.g-gridcolumn-contacts',

    /**
     * @cfg {String} dataIndex
     * Имя поля контактов (массив с контактами).
     */
    dataIndex: '',

    /**
     * @cfg {String} cotactIndex
     * Имя поля контакта (в массиве контактов).
     */
    cotactIndex: 'contact',

    /**
     * @cfg {Array} types
     * Виды контактов (из классификатора), где тип имеет вид:
     * {
     *     handler: имя обработчика (null, widget, anchor, scheme),
     *     id: идент. вида контакта,
     *     name: имя контакта,
     *     type: имя вида контакта,
     *     uri: шаблона вызова контакта
     * }
     */
    types: [],

    /**
     * @cfg {Boolean} useIconSvg
     * Добавлять SVG при формировании {getClass} класса значка.
     */
    useIconSvg: true,

    /**
     * @cfg {String} iconSizeCls
     * CCS-класс размера значков при использовании SVG.
     */
    iconSizeCls: 'g-icon_size_18 g-icon-svg_size_18',

    /**
     * Подготовить контакты для вывода в шаблон.
     * @param {Object} data Запись сетки.
     * @return {Object}
     */
    prepareDataIndex: function (items) {
        var cls, href;
        for (var i = 0; i < items.length; i++) {
            if (Ext.isDefined(this.types[items[i].classifier])) {
                let type = this.types[items[i].classifier];
                let contact = items[i][this.cotactIndex];
                if (this.useIconSvg)
                    cls = 'g-icon g-icon_' + type.type  + ' ' + this.iconSizeCls;
                else
                    cls = 'g-icon-' + type.type;
                switch (type.handler) {
                    // переход по указанной ссылке
                    case 'anchor':
                        href = type.uri.replace(/{value}/i, contact);
                        items[i].icon = '<a class="' + cls + '" title="' + type.name + ': ' + contact +  '" href="' + href + '" target="_blank"></a>';
                        break;
                    // открыть страницу по указанной схеме
                    case 'scheme':
                        href = type.uri.replace(/{value}/i, contact);
                        items[i].icon = '<a class="' + cls + '" title="' + type.name + ': ' + contact +  '" href="' + href + '"></a>';
                        break;
                    default:
                        items[i].icon = '<span class="' + cls + '" title="' + type.name + ': ' + contact +  '"></span>';
                }
            }
        }
        return items;
    },

    defaultRenderer: function (value, meta, record) {
        if (Ext.isJson(value))
            value = Ext.decode(value);
        if (Ext.isArray(value)) {
            value = this.tpl.apply(this.prepareDataIndex(value));
            record.data[this.dataIndex] = value;
        }
        return value;
    }
});


/**
 * @class Ge.view.grid.column.Template
 * @extends Ext.grid.column.Template
 * Вид заголовка столбца сетки "Шаблон".
 * Декодирует значение JSON в массив или объект элементов.
 */
 Ext.define('Ge.view.grid.column.Template', {
    extend: 'Ext.grid.column.Template',
    xtype: 'g-gridcolumn-template',
    alias: 'widget.g-gridcolumn-template',

    /**
     * @cfg {Boolean} useJson
     * Декодировать значение JSON.
     */
     useJson: false,
    
    defaultRenderer: function (value, meta, record) {
        if (Ext.isString(value) && value.length > 0 && this.useJson) {
            try {
                value = Ext.decode(value);
            } catch {
                return '[ invalid JSON String ]';
            }
        }
        return this.tpl.apply(value);
    }
 })
