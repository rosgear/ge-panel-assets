/**
 * Локалиазция приложения.
 
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
 * @license Locale.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * d development library or toolkit without explicit permission.
 */

/**
 * @class Ge.Locale
 * Класс локализации приложения.
 */
Ext.define('Ge.Locale', {
    /**
     * @cfg {Ge.Application} app 
     * Приложение.
     */
    app: null,

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        Ext.apply(this, config);
    },

    /**
     * Установить имя локали.
     * @param {String} name Имя локали. 
     */
    setLanguage: function (name) {
        _settings.locale.language = language;
    },

    /**
     * Возвращает имя локали.
     * @return {String}
     */
    getLanguage: function () {
        return Ge.settings.locale.language;
    },

    /**
     * Загрузка сценариев локали.
     */
    load: function () {
        var me = this;

        Ext.Ajax.request({
            url: Ge.settings.locale.path + '/panel-view-locale.json',
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                var res = Ext.decode(response.responseText);
                me.app.viewport.getViewModel().setData(res);
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметры запроса вызова.
             */
            failure: function (response, opts) {
                Ext.Msg.showError(response, 'response');
            }
        });
    }
});