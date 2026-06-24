/**
 * Панель формы.
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
 * @license PanelController.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.form.PanelController
 * @extends Ext.app.ViewController
 * Контроллер панели формы.
 */
Ext.define('Ge.view.form.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-panel',

    /**
     * Возвращает идентификатор представления (панели формы).
     * @param {String} separator Разделитель (по умолчанию '').
     * @return {String}
     */
    getViewId: function (separator = '') { return this.view.id + separator; },

    /**
     * Возвращает компонент или компоненты (панели формы).
     * @param {String} separator Разделитель идентификатора (по умолчанию '__').
     * @return {Ext.Component|Object}
     */
    getViewCmp: function (id, separator = '__') {
        let viewId = this.getViewId(separator);
        if (Ext.isArray(id)) {
            let o = {};
            id.forEach((one) => o[one] = Ext.getCmp(viewId + one));
            return o;
        }
        return Ext.getCmp(viewId + id);
    },

    /**
     * Событие после рендера панели.
     * @param {Ext.Component} cmp
     * @param {Object} eOpts
     */
    onAfterRender: function (cmp) {
        if (cmp.router.hasId() && cmp.loadDataAfterRender) this.onFormLoadData(cmp);
        // если доступна история, возращаем предыдущий URL-адрес
        if (Ge.history.enabled) {
            cmp.up('window').on('close', (window, eOpts) => {
                Ge.history.onlyRefreshUrl = true;
                Ge.history.back();
            });
        }
    },

    /**
     * Получения параметров для оправки данных формы с указанием настроек (options) и параметров 
     * по умолчанию (set).
     * @param {Object} options
     * @param {String|null} router
     * @param {Object} set
     */
    applySubmitOptions: (options, router = null, set = {}) => {
        let o = Ext.applyIf(options, Ext.applyIf(set, {
            validate: true, // проверять поля перед запросом
            closeWindowAfter: true, // закрыть окно после запроса
            confirm: false, // подтвердить запрос
            route: null,  // маршрут запроса
            routeRule: null, // правила формирования маршрута
            submit: {} // параметры запроса
        }));

        Ext.applyIf(o.submit, {
            clientValidation: o.validate, // проверять значения полей
            method: 'post', // метод запроса
            url: null // URL-адрес запроса формы
        });

        if (o.submit.url === null && router !== null) {
            if (o.routeRule !== null)
                o.submit.url = Ge.url.build(router.build(o.routeRule));
            else if (o.route !== null)
                o.submit.url = Ge.url.build(o.route);
        }
        return o;
    },

    /**
     * Запрос на обработку данных формы.
     * @param {Ext.Component} cmp
     */
    request: function (cmp) {
        let options = Ext.applyIf(cmp.handlerArgs, { url: '', method: 'post' });
        Ge.getApp().request(options.url, options.method, options.params);
    },

    /**
     * Загрузка компонента.
     * @param {Ext.Component} cmp
     */
    loadWidget: function (cmp) {
        let options = cmp.handlerArgs || {};
        options.me = cmp;

        Ext.applyIf(options, { closeWindow: true });
        if (options.closeWindow) {
            cmp.up('window').close();
        }

        Ge.getApp().widget.loadBy(options);
    },

    /**
     * Определение значения если оно передано как объект.
     * @param {Object} value Значение поля.
     * @param {String} key Имя поля.
     * @param {Object} form 
     */
    defineValueType: function (value, key, form) {
        switch (value.type) {
            case 'fields':
                let controller = this;
                Ext.iterate(value.value, (fieldKey, fieldValue) => {
                    if (Ext.isObject(fieldValue))
                        controller.defineValueType(fieldValue, fieldKey, form);
                    else
                        form.findField(fieldKey).setValue(fieldValue);
                });
                break;

            case 'tagfield':
                var field = form.findField(key);
                if (field != null) {
                    if (Ext.isDefined(value.store))
                        field.getStore().add(value.store);
                    field.setValue(value.value);
                }
                break;

            case 'combobox':
                var field = form.findField(key);
                if (field != null) {
                    if (field instanceof Ext.form.field.ComboBox) {
                        field.setValue(value.value);
                        field.setRawValue(value.text);
                        field.originalValue = value.value;
                    } else
                        field.setValue(value.value);
                }
                break;
        }
    },

    /**
     * Загрузка указанных значений в поля формы.
     * @param {Object} form 
     * @param {Object} data 
     */
    loadCustomData: function (form, data) {
        let controller = this;

        Ext.iterate(data, (key, value) => {
            if (Ext.isObject(value)) controller.defineValueType(value, key, form);
        });
    },

    /**
     * Событие при клике на кнопке тригера поля формы.
     * @param {Ext.form.field.Text} field
     * @param {Ext.form.trigger.Trigger} trigger
     */
    onTriggerWidget: (field, trigger) => {
        let args = trigger.handlerArgs || {};
        args.me = trigger;
        Ge.getApp().widget.loadBy(args);
    },

    /**
     * Загрузка значений в поля формы.
     * @param {Ext.form.Panel} me 
     */
    onFormLoadData: function (me) {
        var form = me.getForm(),
            self = this;

        me.mask(Ext.Txt.loading);
        Ext.Ajax.request({
            url: Ge.url.build(me.router.build('data')),
            method: 'post',
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: (response, opts) => {
                me.unmask();
                var response = Ge.response.normalize(response);
                if (response.success) {
                    form.setValues(response.data);
                     self.loadCustomData(form, response.data);
                     var window =  me.up('window'),
                         tpl = new Ext.Template(window.titleTpl);
                     window.setTitle(tpl.apply(response.data));

                    if (self.view.formController.length > 0) {
                        if (Ext.isFunction(self.onFormSetValues))
                            self.onFormSetValues(response.data);
                    }
                } else
                    Ext.Msg.exception(response, false, true);
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: (response) => {
                me.unmask();
                Ext.Msg.exception(response, true);
            }
        });
    },

    /**
     * Выполняет удаление данных формы через AJAX запрос.
     * @param {Ext.form.Panel} form
     * @param {Object} options
     */
    doFormDelete: function (form, options = {}) {
        let o = this.applySubmitOptions(options, form.router, {routeRule: 'delete', validate: false});

        this.formSubmit(form, o);
    },

    /**
     * Выполняет добавление данных формы через AJAX запрос.
     * @param {Ext.form.Panel} form
     * @param {Object} options
     */
    doFormAdd: function (form, options = {}) {
        let o = this.applySubmitOptions(options, form.router, {routeRule: 'add'});

        if (o.validate && !form.isValid()) { this.showMsgFillFields(form); return; }
        this.formSubmit(form, o);
    },

    /**
     * Выполняет отправку данных формы через AJAX запрос.
     * @param {Ext.form.Panel} form 
     * @param {Object} options
     */
    doFormSubmit: function (form, options = {}) {
        let o = this.applySubmitOptions(options, form.router, {routeRule: 'submit'});

        if (o.validate && !form.isValid()) { this.showMsgFillFields(form); return; }

        this.formSubmit(form, o);
    },

    /**
     * Выполняет действие над данными формы через AJAX запрос c возможностью подтверждения запроса.
     * @param {Ext.form.Panel} form 
     * @param {Object} options
     */
    doFormAction: function (form, options = {}) {
        let o = this.applySubmitOptions(options, form.router);

        if (o.validate && !form.isValid()) { this.showMsgFillFields(form); return; }

        // подтверждение запроса запросом
        if (o.confirm) {
            let cntrl = this;
            this.doConfirm(form, o, (success) => { if (success) cntrl.formSubmit(form, o); });
        } else
            this.formSubmit(form, o);
    },

    /**
     * Выполняет изменение данных формы через AJAX запрос.
     * @param {Ext.form.Panel} form 
     * @param {Object} options
     */
    doFormUpdate: function (form, options = {}) {
        let o = this.applySubmitOptions(options, form.router, {routeRule: 'update'});

        if (o.validate && !form.isValid()) { this.showMsgFillFields(form); return; }

        this.formSubmit(form, o);
    },

    /**
     * Выполняет вызов диалогового окна выбора данных через AJAX запрос.
     * @param {Ext.form.Panel} form 
     * @param {Object} options
     */
    doFormBrowse: function (form, options = {}) {
        let o = Ext.applyIf(
            this.applySubmitOptions(options, form.router, {routeRule: 'pickup', validate: false}),
            {browseGrid: null}
        );

        if (o.browseGrid) {
            let grid = form.down('gridpanel');
            let browse = Ext.applyIf(o.browseGrid, {
                selectOne: false,
                msgMustSelect: 'Entry must be selected!',
                msgMustSelectOne: 'Only one entry needs to be selected!'
            });
            let selection = grid.getSelectionModel();
            if (selection.getCount() == 0) {
                Ext.Msg.warning(browse.msgMustSelect);
                return;
            }
            if (selection.getCount() > 1 && browse.selectOne) {
                Ext.Msg.warning(browse.msgMustSelectOne);
                return;
            }
            let value = grid.getStore().getSelectedRowsAsJson(true);
            form.getForm().findField('pickup').setValue(value);
        }

        this.formSubmit(form, o);
    },

    /**
     * Выполняет вызов подтверждения запроса через AJAX.
     * @param {Ext.form.Panel} form 
     * @param {Object} options
     * @param {Func} onResponse
     */
    doConfirm: function (form, options = {}, onResponse) {
        form.mask();
        Ext.Ajax.request({
            url: options.submit.url,
            method: 'post',
            params: {
                fields: Ext.encode(form.getValues(false, false, false, true)),
                confirm: options.confirm
            },
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: (response, opts) => {
                form.unmask();
                var response = Ge.response.normalize(response);
                if (!response.success) {
                    Ext.Msg.exception(response);
                }
                if (Ext.isFunction(onResponse)) {
                    if (Ext.isDefined(response.confirm)) {
                        Ext.Msg.show({
                            title: Ext.Txt.confirmation,
                            message: response.confirm.message,
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: (btn) => { if (btn === 'yes') onResponse(response.success); }
                        });
                    } else
                        onResponse(response.success);
                }
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: (response, opts) => {
                form.unmask();
                Ext.Msg.exception(response, true, true);
                if (Ext.isFunction(onResponse)) {
                    onResponse(false);
                }
            }
        });
    },

    formSubmit: function (form, options) {
        let submit = Ext.applyIf(options.submit, {
            /**
             * Успешное выполнение запроса.
             * @param {Ext.form.Basic} self
             * @param {Object} action
             */
            success: (self, action) => {
                form.unmask();
                var response = Ge.response.normalize(action.response);
                if (response.success) {
                    if (options.closeWindowAfter) {
                        let win = form.up('window');
                        !win || win.close();
                    }
                } else
                    Ext.Msg.exception(response, false, true);
            },
            /**
             * Ошибка запроса.
             * @param {Ext.form.Basic} self
             * @param {Object} action
             */
            failure: (self, action) => {
                form.unmask();
                Ext.Msg.exception(action, true);
            }
        });

        form.mask(Ext.Txt.loading);
        form.submit(submit);
    },

    /**
     * Событие при клике на кнопке формы "Отмена".
     * @param {Ext.Component} me 
     */
    onFormCancel: (cmp) => { cmp.up('window').close(); },

     /**
      * Событие при клике на кнопке формы "Сбросить".
      * @param {Ext.Component} cmp 
      */
    onFormReset: (cmp) => { cmp.up('form').reset(); },

    /**
     * Событие при клике на кнопке формы "Удалить".
     * @param {Ext.Component} cmp
     */
    onFormDelete: function (cmp) { this.doFormDelete(cmp.up('form'), cmp.handlerArgs || {}); },

     /**
      * Событие при клике на кнопке формы "Добавить".
      * @param {Ext.Component} cmp
      */
    onFormAdd: function (cmp) { this.doFormAdd(cmp.up('form'), cmp.handlerArgs || {}); },

    /**
     * Событие при клике на кнопке формы "Submit".
     * @param {Ext.Component} cmp
     */
    onFormSubmit: function (cmp) { this.doFormSubmit(cmp.up('form'), cmp.handlerArgs || {}); },

    /**
     * Событие при клике на кнопке формы.
     * @param {Ext.Component} cmp
     */
    onFormAction: function (cmp) { this.doFormAction(cmp.up('form'), cmp.handlerArgs || {}); },

    /**
     * Событие при клике на кнопке формы "Изменить".
     * @param {Ext.Component} cmp
     */
    onFormUpdate: function (cmp) { this.doFormUpdate(cmp.up('form'), cmp.handlerArgs || {}); },

    /**
     * Событие при клике на кнопке формы "Выбрать" (диалоговое окно выбора).
     * Параметры конфигурация кнопки:
     * {
     *     // для диалогового окна выбора с таблицей
     *     browseGrid: {
     *         selectOne: {Boolean}, // выбор только одной записи
     *         msgMustSelect: {String}, // сообщение о выборе записи
     *         msgMustSelectOne: {String} // сообщение о выборе только одной записи
     *     }
     * }
     * @param {Ext.button.Button} btn 
     */
    onFormBrowse: function (btn) { this.doFormBrowse(btn.up('form'), cmp.handlerArgs || {}); },

    /**
     * Показывает сообщение о необходимости заполнения полей.
     * @param {Ext.form.Panel} form 
     */
    showMsgFillFields: function (form) {
        Ext.Msg.show({
            title: Ext.Txt.error,
            msg: form.msgFillFields + ': ' + this.collectInvalidFields(form),
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING
        });
    },

    /**
     * Собрать имена полей, которые имеют не корректные значения полей.
     * @param {Object} form
     * @param {Integer} limit Допустимое количество полей.
     */
    collectInvalidFields: (form, limit = 10) => {
        var msg, i, field, ellipsis = '', titles = [], fields = form.query("field{isValid()==false}");
        if (fields.length > limit) {
            fields.length = limit;
            ellipsis = '...';
        }
        for (i = 0; i < fields.length; i++) {
            msg   = '';
            field = fields[i];
            if (Ext.isDefined(field.msgFillField))
                msg = field.msgFillField;
            else
            if (Ext.isDefined(field.fieldLabel))
                msg = field.fieldLabel;
            if (msg.length > 0)
                titles.push('"' + Ext.util.Format.stripTags(msg) + '"');
        }
        return titles.join(', ') + ellipsis;
    }
});


/**
 * Переопределение свойств и методов компонента Ext.form.field.Text.
 */

Ext.form.field.Text.override({
    tooltip : { text: '' },
    requiredChar: true,
    requiredCharTpl: '<span class="g-form__field-required_char" data-qtip="Необходимо заполнить поле"></span>',
    infoChar: true,
    infoCharTpl: '<i class="fa fa-info-circle g-form__field-info_char" aria-hidden="true"></i>',
    note: '',
    /**
     * @event beforeRender
     * Событие перед рендером компонента.
     * @param {Object} ct Контейнер.
     * @param {Object} eOpts
     */
    beforeRender: function (ct, eOpts) {
        var me = this;
        if (Ext.isString(me.tooltip))
            me.tooltip = { text: me.tooltip };

        if (me.tooltip.text.length > 0 && me.infoChar)
            me.fieldLabel = me.infoCharTpl + me.fieldLabel;
        if (!me.allowBlank && me.requiredChar)
            me.afterLabelTextTpl = [ me.requiredCharTpl ];
        if (me.note.length > 0) {
            me.fieldLabel = me.fieldLabel + me.labelSeparator + '<note>' + me.note + '</note>';
            me.labelSeparator = '';
        }

        me.callParent(arguments);
    },
    /**
     * @event afterRender
     * Событие после рендера компонента.
     * @param {Object} ct Контейнер.
     * @param {Object} position Положение.
     */
    afterRender: function (ct, position) {
        var me = this;

        me.callParent(arguments);

        if (me.tooltip.text.length > 0) {
            new Ext.ToolTip({
                target     : this.id,
                trackMouse : false,
                maxWidth   : 250,
                minWidth   : 100,
                html       : me.tooltip.text
            });
        }
    }
});
