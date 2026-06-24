Ext.define('Ge.view.form.field.GridStore', {
    extend: Ext.form.field.Hidden,
    xtype: 'g-field-gridstore',

    /**
     * @cfg {Ge.view.grid.Panel} grid
     * Панель списка.
     */
    gridId: null,

    columns: [],

    /**
     * @cfg {Boolean} addDirtyIndex
     * Если true, добавляет в свойство каждой записи индекс 'dirty', указывающий на 
     * изменение значения текущей записи.
     */
    addDirtyIndex: false,

    /**
     * Возвращает значение, которое будет включено в стандартную отправку формы для этого поля. 
     * Это будет объединено с именем поля, чтобы сформировать пару имя = значение в {@link #getSubmitData submitted parameters}. 
     * Если возвращается пустая строка, будет отправлено только имя; если возвращается null, ничего не будет отправлено.
     *
     * Обратите внимание, что возвращенное значение будет {@link #processRawValue processed} но могло или не могло быть успешно
     * {@link #validate validated}.
     *
     * @return {String} Значение, которое нужно отправить, или null.
     */
    getSubmitValue: function () {
        var grid = Ext.getCmp(this.gridId);
        if (!Ext.isDefined(grid)) {
            return null;
        }
        // если сетка не отобразилась, значит изменений в ней нет
        if (!grid.rendered) {
            return null;
        }
        var me = this,
            rows = [];

        grid.getStore().data.each(function (record, index) {
            var row = {};
            for (var c = 0; c < me.columns.length; c++) {
                row[me.columns[c]] = record.get(me.columns[c]);
            }
            if (this.addDirtyIndex) {
                row['dirty'] = record.modified ? true : false;
            }
            rows.push(row);

        });
        return Ext.util.JSON.encode(rows);
    },

    /**
     * Устанавливает значение в поле, декодирует значение из формата JSON в  
     * массив записей с добавлением в хранилище сетки.
     * @param {Object} value Значение для установки.
     * @return {Ge.view.form.field.GridStore} this
     */
    setValue: function (value) {
        var grid = Ext.getCmp(this.gridId);
        if (value !== null && value.length > 0) {
            var rows = Ext.util.JSON.decode(value);
            grid.getStore().add(rows);
        } else {
            grid.getStore().removeAll();
        }
        return this.callParent([value]);
    }
});


/**
 * @class Ge.view.form.field.Header
 * @extends Ext.form.field.Display
 * Компонент заголовка вкладки,формы.
 */
Ext.define('Ge.view.form.field.Header', {
    extend: 'Ext.form.field.Display',
    xtype: 'g-field-displayheader',
    cls: 'g-form__display__header',
    width: '100%',

    iconCls: '',
    text: '',
    subtext: '',

    /**
     * Инициализация компонента.
     */
    initComponent: function () {
        this.tpl = this.createTpl();
        this.updateHeader();

        this.callParent();
    },

    createTpl: function () {
        return new Ext.Template([
            '<span class="{iconCls}"></span>',
            '<div class="g-form__display__text">{text}</div>',
            '<div class="g-form__display__subtext">{subtext}</div>'
        ]);
    },

    updateHeader: function () {
        if (this.iconCls.length > 0)
            this.addCls('g-form__display__header_icon');
        else
            this.removeCls('g-form__display__header_icon');
        this.value = this.tpl.apply({
            iconCls: this.iconCls,
            text: this.text,
            subtext: this.subtext
        });
    }
});


/**
 * @class Ge.view.form.field.DisplayContacts
 * @extends Ext.form.field.Display
 * Компонент вывода контактов в поле.
 */
 Ext.define('Ge.view.form.field.DisplayContacts', {
    extend: 'Ext.form.field.Display',
    xtype: 'g-field-displaycontacts',

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
     * Добавлять CCS-класс SVG при формировании класса значка в {prepareValue}.
     */
     useIconSvg: true,

     /**
      * @cfg {String} iconSizeCls
      * CCS-класс размера значков при использовании SVG см. {useIconSvg}.
      */
     iconSizeCls: 'g-icon_size_18 g-icon-svg_size_18',

     /**
      * @cfg {String/Ext.XTemplate} tpl
      * Шаблон вывода строк контактов.
      */
     contactsTpl: '',

    /**
     * Инициализация компонента.
     */
     initComponent: function(){
        var me = this;
        me.contactsTpl = (!Ext.isPrimitive(me.contactsTpl) && me.contactsTpl.compile) ? me.contactsTpl : new Ext.XTemplate(me.contactsTpl);
        me.callParent(arguments);
    },

    /**
     * Подготовить контакты для вывода в шаблон.
     * @param {Array} items Массив записей контактной информации.
     * @return {Array} Массив записей с дополненой контактной информацией.
     */
     prepareValue: function (items) {
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

     getDisplayValue: function() {
        var me = this,
            value = this.getRawValue(),
            display;

        if (Ext.isJson(value)) {
            value = Ext.decode(value);
        }
        if (Ext.isArray(value)) {
            value = me.contactsTpl.apply(me.prepareValue(value));
        }
        if (me.renderer) {
             display = me.renderer.call(me.scope || me, value, me);
        } else {
             display = me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value;
        }
        return display;
    }
 });


/**
 * @class Ge.view.form.field.Properties
 * @extends Ext.form.field.Hidden
 * Компонент поля формы для хранения сетки свойств (Ext.grid.property.Grid).
 */
Ext.define('Ge.view.form.field.Properties', {
    extend: Ext.form.field.Hidden,
    xtype: 'g-field-properties',

    /**
     * @cfg {null|String} gridId
     * Идентификатор сетки свойств (Ext.grid.property.Grid).
     */
    gridId: null,

    /**
     * Возвращает значение, которое будет включено в стандартную отправку формы для этого поля. 
     * @return {null|String} Возвращает значение null, если сетка свойств не найдена.
     */
    getSubmitValue: function () {
        let grid = Ext.getCmp(this.gridId);
        if (!Ext.isDefined(grid)) {
            return null;
        }

        // если сетка не отобразилась, значит изменений в ней нет
        if (!grid.rendered) {
            return null;
        }
        let source = grid.getSource();
        if (Ext.isArray(source)) {
            source = Object.assign({}, source);
        }
        return Ext.util.JSON.encode(source);
    },

    /**
     * Устанавливает значение в поле, декодирует значение из формата JSON в  
     * объект с добавлением в сетку записей (Ext.grid.property.Grid).
     * @param {String} value Значение для установки.
     * @return {Ge.view.form.field.Properties} this
     */
    setValue: function (value) {
        let grid = Ext.getCmp(this.gridId);

        if (value !== null && value.length > 0)
            grid.setSource(Ext.util.JSON.decode(value));
        else 
            grid.setSource({});
        return this.callParent([value]);
    }
});