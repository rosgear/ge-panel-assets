/**
 * Контролер проверки статуса запроса.
 
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
 * @license StatusChecker.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.StatusChecker
 * Класс контролера проверки статуса запроса.
 */
Ext.define('Ge.StatusChecker', {
    mixins: ['Ext.mixin.Observable'],

    /**
     * @cfg {Number|null} interval
     * Указатель вызова setInterval.
     */
    interval: null,

    /**
     * @cfg {Number} step
     * Текущий шаг запроса.
     */
    step: 0,

    config: {
        /**
         * @cfg {String} url
         * URL-адрес HTTP-запроса.
         */
        url: '',

        /**
         * @cfg {Object} params
         * Передаваемые параметры в HTTP-запросе.
         */
        params: {},

        /**
         * @cfg {String} method
         * Метод HTTP-запроса.
         */
        method: 'post',

        /**
         * @cfg {String} checkProperty
         * Свойство возвращаемое в HTTP-ответе. Содержит значения статуса проверки.
         */
        checkProperty: 'data',

        /**
         * @cfg {Number} delay
         * Задержка в мс. перед выполнением запроса проверки.
         */
        delay: 3000,

        /**
         * @cfg {Number} maxSteps
         * Максимальное количество проверок. Если значение "0", условие не 
         * учитывается.
         */
        maxSteps: 0
    },

    listeners: {
        /**
         * Событие наступающие после проверки статуса ответа.
         * 
         * @param  {String} status Статус ответа.
         * @param  {Object} response Объект XHR, содержащий данные ответа.
         * @param  {Object} checker Контроллер проверки.
         * 
         * statusCheck: (status, response, checker) => {}
         */

        /**
         * Событие наступающие при ошибки проверки статуса ответа.
         * 
         * @param  {Object} response Объект XHR, содержащий данные ответа.
         * @param  {Object} checker Контроллер проверки.
         * 
         * failureCheck: (response, checker) => {}
         */
    },

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function(config) {
        this.initConfig(config);

        this.mixins.observable.constructor.call(this, config);
    },

    /**
     * Запускает проверку состояния.
     */
    start: function () {
        var me = this;
        me.step = 0;
        me.interval = setInterval(function () { me._check(); }, me._delay);
    },

    /**
     * Останавливает проверку состояния.
     */
    stop: function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    /**
     * Выполняет проверку состояния.
     */
    _check: function () {
        var me = this;

        this.step++;
        Ext.Ajax.request({
            url: me._url,
            method: me._method,
            params: me._params,
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                var response = Ge.response.normalize(response);
                // результат
                if (!response.success) {
                    me.stop();
                    Ext.Msg.exception(response);
                    me.fireEventArgs('failureCheck', [response, me]); 
                    return;
                }
                // подключение скриптов
                if (response.requires.length > 0) {
                    for (var i = 0; i < response.requires.length; i++)
                        Ext.syncRequire(response.requires[i]);
                }
                if (Ext.isDefined(response[me._checkProperty])) {
                    let status = response[me._checkProperty];
                    me.fireEventArgs('statusCheck', [status, response, me]); 
                    if (status == 'stop') me.stop();
                }

                // выполнить все команды после создания компонент 
                if (response.command) {
                    Ge.response.executeCommands(response.command, 'after');
                }
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: function (response, opts) {
                me.stop();
                Ext.Msg.exception(response, true);
                me.fireEventArgs('failureCheck', [response, me]); 
            }
        });
    }
});