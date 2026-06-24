/**
 * Компонент "Панель сетки свойств".
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
 * @license Grid.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.property.Grid
 * @extends Ext.grid.property.Grid
 * Компонент "Панель сетки свойств".
 */
Ext.define('Ge.view.grid.property.Grid', {
    extend: 'Ext.grid.property.Grid',
    xtype: 'g-property-grid',
    alias: ['widget.g-propertygrid'],
    alternateClassName: 'Ge.grid.PropertyGrid',
    requires: [
        'Ge.view.form.field.Object',
        'Ge.view.form.field.Array',
        'Ge.view.grid.CellTip'
    ],

    /**
     * Инициализация компонента.
     */
    initComponent : function () {
        let me = this;

        /**
         * Обработчик событий.
         * @cfg {Object}
         */
        me.listeners = {
           /**
             * Событие после удаления компонента.
             * @param {Ge.view.grid.property.Grid} me
             * @param {Object} eOpts Параметры слушателя.
             */
            destroy: (me) => {
                if (Ext.isDefined(me.view.tip)) {
                   me.view.tip.destroy();
                }
            },
           /**
            * Событие после рендера компонента.
            * @param {Ge.view.grid.Panel} me
            * @param {Object} eOpts Параметры слушателя.
            */
           afterRender: function () {
                /**
                 * @cfg {Ge.view.grid.CellTip} Ge.view.grid.property.Grid.view.tip 
                 * Всплывающая подсказка ячейки сетки.
                */
                me.view.tip = Ext.create('Ge.view.grid.CellTip', {
                    columns: me.getColumns(),
                    grid: me,
                    target: me.view.el,
                    delegate: me.view.cellSelector,
                    listeners: {
                        /**
                         * Событие перед появлением подсказки.
                         * @param {Ge.view.grid.CellTip} tip
                         * @param {Object} eOpts Параметры слушателя.
                         */
                        beforeshow: function (tip) {
                            let record = me.view.getRecord(tip.triggerElement.parentNode);
                            if (Ext.isDefined(record)) {
                                // Добавляем подсказу к записи свойства для вывода в шаблон
                                let config = me.sourceConfig[record.id] || false;
                                if (config && Ext.isDefined(config.tooltip)) {
                                    record.data.tooltip = config.tooltip;
                                }

                                let tpl = this.templates[me.id + '.' + me.nameField];
                                let tipStr = tpl.apply(record.data);
                                tip.update(tipStr.length ? tipStr : ' ... ');
                           }
                       }
                   }
               });
               me.doLayout();
           }
        }

        this.callParent();

        this.editors['object'] = new Ext.grid.CellEditor({ field: new Ge.form.ObjectField({selectOnFocus: true}) });
        this.editors['array'] = new Ext.grid.CellEditor({ field: new Ge.form.ArrayField({selectOnFocus: true}) });
        this.columns[0].cellTip  = '{tooltip}';
    },

    /**
     * @private
     * @override
     */
    configure: function (config) {
        var me = this,
            store = me.store,
            i = 0,
            len = me.store.getCount(),
            nameField = me.nameField,
            valueField = me.valueField,
            name, value, rec, type;
 
        me.configureLegacy(config);
 
        if (me.inferTypes) {
            for (; i < len; ++i) {
                rec = store.getAt(i);
                name = rec.get(nameField);
                if (!me.getConfigProp(name, 'type')) {
                    value = rec.get(valueField);
                    if (Ext.isDate(value)) {
                        type = 'date';
                    } else if (Ext.isNumber(value)) {
                        type = 'number';
                    } else if (Ext.isBoolean(value)) {
                        type = 'boolean';
                    } else if (Ext.isObject(value)) {
                        type = 'object';
                    } else if (Ext.isArray(value)) {
                        type = 'array';
                    } else {
                        type = 'string';
                    }
                    me.setConfigProp(name, 'type', type);
                }
            }
        }
    },

    /**
     * @private 
     * @override
     * Возвращает правильный тип редактора для типа свойства или пользовательский тип, основанный на имени свойства.
     */
    getCellEditor: function(record, column) {
        var me = this,
            propName = record.get(me.nameField),
            val = record.get(me.valueField),
            editor = me.getConfigProp(propName, 'editor'),
            type = me.getConfigProp(propName, 'type'),
            editors = me.editors,
            field;
 
        // Если был найден собственный редактор, то он не имеет обертки для CellEditor.
        if (editor) {
            if (!(editor instanceof Ext.grid.CellEditor)) {
                if (!(editor instanceof Ext.form.field.Base)) {
                    editor = Ext.ComponentManager.create(editor, 'textfield');
                }
                editor = me.setConfigProp(propName, 'editor', new Ext.grid.CellEditor({ field: editor }));
            }
        } else if (type) {
            switch (type) {
                case 'date': editor = editors.date; break;
                case 'number': editor = editors.number; break;
                case 'object': editor = editors.object; break;
                case 'array': editor = editors.array; break;
                case 'boolean':
                    // Не должен быть ".boolean" - YUI ненавидит использовать такие зарезервированные слова
                    editor = me.editors['boolean']; // jshint ignore:line 
                    break;
                default:
                    editor = editors.string;
            }
        } else if (Ext.isDate(val)) {
            editor = editors.date;
        } else if (Ext.isNumber(val)) {
            editor = editors.number;
        } else if (Ext.isObject(val)) {
            editor = editors.object;
        } else if (Ext.isArray(val)) {
            editor = editors.array;
        } else if (Ext.isBoolean(val)) {
            // Не должен быть ".boolean" - YUI ненавидит использовать такие зарезервированные слова 
            editor = editors['boolean']; // jshint ignore:line 
        } else {
            editor = editors.string;
        }
 
        field = editor.field;
 
        if (field && field.ui === 'default' && !field.hasOwnProperty('ui')) {
            field.ui = me.editingPlugin.defaultFieldUI;
        }
 
        // Редактору нужен уникальный идентификатор, поскольку плагин CellEditing кэширует их
        editor.editorId = propName;
        editor.field.column = me.valueColumn;
        return editor;
    }
});


/**
 * Переопределение методов объекта Ext.grid.property.Reader.
 */
Ext.override(Ext.grid.property.Reader, {
    isEditableValue: (val) => {
        return Ext.isPrimitive(val) || Ext.isDate(val) || Ext.isArray(val) || Ext.isObject(val) || val === null;
    }
});


/**
 * Переопределение методов объекта Ext.grid.property.HeaderContainer.
 */
Ext.override(Ext.grid.property.HeaderContainer, {
    renderCell: function (val, meta, rec) {
        var me = this,
            grid = me.grid,
            renderer = grid.getConfigProp(rec.get(grid.nameField), 'renderer'),
            result = val;
 
        if (renderer) return renderer.apply(me, arguments);
        
        if (Ext.isDate(val)) {
            result = me.renderDate(val);
        } else if (Ext.isBoolean(val)) {
            result = me.renderBool(val);
        } else if (Ext.isArray(val)) {
            result = me.renderArray(val);
        } else if (Ext.isObject(val)) {
            result = me.renderObject(val);
        }

        return Ext.util.Format.htmlEncode(result);
    },

    /**
     * @param {Array} val
     * @return {String}
     */
    renderArray: (val) => { return val.join(','); },

    /**
     * @param {Object} val
     * @return {String}
     */
    renderObject: (val) => { return val ? Ext.util.JSON.encode(val) : '{}'; }
});