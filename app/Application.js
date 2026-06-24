/**
 * Приложение.
 
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
 * @license Application.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

Ext.define('Ge.Application', {
    extend: 'Ext.app.Application',
    name: 'Ge',
    appFolder: Ge.settings.path + '/app',
    requires: [
        'Ge.Locale',
        'Ge.Loader',
        'Ge.Widget',
        'Ge.Mask',
        'Ge.view.Bootslide'
    ],
    controllers: ['App'],
    header: {},

    /**
     * Временное определение объекту свойств компонентами приложения для обмена с 
     * друг-другом.
     * @var {Object} tmp
     */
    tmp: {},

    /**
     * Инициализация перед запуском приложения.
     * @param {Ext.app.Application} application
     */
    init: function (application) {
        /**
         * Отображения сообщения с предупреждением.
         * @param {String} message Сообщение.
         */
        Ext.Msg.warning = function (message) {
            Ext.Msg.show({ title: Ext.Txt.warning, message: message, icon: Ext.Msg.WARNING, buttons: Ext.Msg.OK });
        }
        /**
         * Отображения сообщения с ошибкой.
         * @param {String} message Сообщение.
         */
         Ext.Msg.error = function (message) {
            Ext.Msg.show({ title: Ext.Txt.error, message: message, icon: Ext.Msg.ERROR, buttons: Ext.Msg.OK });
        }
        /**
         * Отображения сообщения с исключением (ошибкой).
         * @param {Object} config Сообщение.
         * @param {Boolean} normalize Привести сообщение к нормальной форме.
         * @param {Boolean} sendException Если true, оправить отчёт с ошибкой в техподдержку.
         */
        Ext.Msg.exception = function(config, normalize = false, sendException = false) {
            if (!Ext.isDefined(config)) {
                 Ext.Msg.show({title: Ext.Txt.error, icon: Ext.Msg.ERROR, message: 'Unknow error: the response from the server contains an error.'});
                return;
            }
            // если нет соединения
            if (config.status == 0) {
                Ge.getApp().msgMask.show({ title: Ext.Txt.errorConnect, message: Ext.Txt.serverErrorConnection, action: 'brokenConnection' });
                return;
            }
            let report = '',
                sendReport = false,
                exception = {
                    title: Ext.Txt.error,
                    message: 'Unknow',
                    icon: Ext.Msg.ERROR,
                    fn: function (btn, o) {
                        if (btn === 'yes') {
                            Ge.getApp().report.send(config.message, Ext.isDefined(config.data) ? config.data: '');
                        }
                    }
            };
            if (normalize)
                config = Ge.response.normalize(config);
            if (Ext.isString(config))
                exception.message = config;
            else
            if (Ext.isObject(config)) {
                let message = Ge.response.normalizeMessage(config.message);
                if (Ext.isObject(message))
                    exception = Ext.applyIf(message, exception);
                else
                    exception = Ext.applyIf({ message: config.message }, exception);
            }

            let isMask = Ext.isDefined(config.mask) ? config.mask : false;
            if (Ext.isDefined(config.report))
                report = config.report;
            sendReport = (sendException && Ge.settings.report) || (report.length > 0 && Ge.settings.report);
            // если в ответе нет report, значит message имеет text
            if (sendReport && (report.length == 0))
                report = config.message.text;
            exception.buttons = sendReport ? Ext.Msg.YESNO : Ext.Msg.OK;
            if (sendReport&& !isMask)
                exception.message = exception.message + Ext.Txt.sendErrorReport;
            if (isMask)
                Ge.getApp().msgMask.show(config.mask);
            else
                Ext.Msg.show(exception);
        }

        /**
         * Ассоциация путей с именами классов.
         */
        let classPath = Ge.settings.classPath;
        for (let i = 0; i < classPath.length; i++) {
            Ext.ClassManager.setPath(classPath[i][0], classPath[i][1]);
        }
    },

    /**
     * Предварительная загрузка перед запуском приложения.
     */
    load: function () {
        var me = this;

        me.loadMask.hide();
        me.navigatorModules.getStore().getRootNode().expand();
        /*
        Ext.Ajax.request({
            url: Ge.url.toRoute('@backend/workspace/data'),
            method: 'post',
            success: function(response) {
                me.loadMask.hide();
                var response = Ge.response.normalize(response);
                if (response.success) {
                    // bug: вместо expand должен быть load
                    me.navigatorComponents.getStore().load({
                        callback: function() {
                            me.navigatorComponents.getStore().getRootNode().expand();
                        }
                    });
                 } else
                    Ext.Msg.exception(response);
            },
            failure: function(response) {
                Ext.Msg.exception(response, true);
            }
        });*/
    },

    /**
     * Загрузка виджетов после запуска приложения.
     */
    autorun: function () {
        let autorun = Ge.settings.autorun;
        if (autorun.routes.length > 0) {
            // загрузить сразу
            this.widget.load( '@backend/' + autorun.routes[0]);
            // остальные подождать
            if (autorun.routes.length > 1) {
                for (let i = 1; i < autorun.routes.length; i++) {
                    setTimeout(
                        function (app, route) {
                            app.widget.load( '@backend/' + route);
                        },
                        autorun.waiting * i,
                        this, autorun.routes[i]
                    );
                }
            }
        }
    },

    /**
     * Запрос клиента.
     * @param {String} route Маршрут запроса {@see Ge.url.build}.
     * @param {String} method Метод запроса (get, post, put, options).
     * @param {Object} params Параметры запроса.
     */
    request: function (route, method = 'post', params = {}) {
        var me = this;

        Ext.Ajax.request({
            url: Ge.url.build(route),
            method: method,
            params: params,
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                var response = Ge.response.normalize(response);
                if (!response.success)
                    Ext.Msg.exception(response);
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: function (response, opts) {
                Ext.Msg.exception(response, true);
            }
        });
    },

    /**
     * Проверка состояния задач сервера.
     */
    taskVerifyStatus: function() {
        var me = this;

        Ext.Ajax.request({
            url: Ge.url.build('@backend/task/verify/status'),
            method: 'post',
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                var response = Ge.response.normalize(response);
                if (response.success)
                    Ge.app.traybar.setButtons(res.data.tray);
                else
                    Ext.Msg.exception(response);
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: function (response, opts) {
                Ext.Msg.exception(response, true);
            }
        });
    },

    setTitle: function (title) {
        if (Ext.isDefined(title)) {
            document.title = Ge.settings.title.replace('%s', title);
            this.header.activeTitle.update(title);
        } else {
            document.title = Ge.settings.title.replace('%s',  Ge.settings.name);
            this.header.activeTitle.update('');
        }
    },

    /**
     * Вызывается автоматически, когда страница полностью загружена.
     * @param {String} profile Профиль приложения.
     * @return {Boolean} По умолчанию, приложение вызывает настроенный 
     * контроллер запуска и выполняет это метод сразу после запуска функции 
     * контроллера. Вернёт false, если пуск предотвращен.
     */
    launch: function (profile) {
        Ge.getApp = Ge.getApplication;

        this.active = {};

        // маски
        Ext.get('g-bootstrap-mask').hide();
        this.loadMask = Ext.create('Ge.LoadMask', { app: this });
        this.loadMask.show({title: Ext.Txt.loading});
        this.msgMask = Ext.create('Ge.MessageMask', { app: this });
        // панель уведомлений
        this.traybar = Ext.getCmp('g-traybar');
        // главное меню
        this.menu = Ext.getCmp('g-menu');
        // панель навигации
        this.navigator = Ext.getCmp('g-navigator');
        this.navigatorTabs = Ext.getCmp('g-navigator-tabs');
        this.navigatorModules = Ext.getCmp('g-navigator-modules');
        // панель разделов
        this.partitionbar = Ext.getCmp('g-partitionbar');
        // viewport
        this.viewport = this.getMainView();
        // локализация приложения
        this.locale = Ext.create('Ge.Locale', { app: this });
        this.locale.load();
        // работа с компонентами
        this.widget = Ext.create('Ge.Widget', { app: this });
        // загрузчик приложения
        this.loader = Ext.create('Ge.Loader', { app: this });
        // всплывающие уведомления
        this.popup = function() {
            var msgCt;

            function createBox(title, msg, type = null, icon = null) {
                type = type || 'message';
                icon = icon ? ' style="background-image: url(' + icon + ');"' : '';
                return '<div class="g-popup-msg__text g-popup-msg__text_' + type + ' ' + Ext.baseCSSPrefix + 'border-box">' +
                           '<div class="g-icon-svg g-icon_dlg-' + type + '"' + icon + '>' +
                               '<h3>' + title + '</h3><p>' + msg + '</p>' +
                           '</div>' +
                       '</div>';
            }
            return {
                msg : (msg, title = null, type = null, icon = null) => {
                    if (msgCt) {
                        document.body.appendChild(msgCt.dom);
                    } else {
                        msgCt = Ext.DomHelper.append(document.body, {id: 'g-popup-msg', 'class': 'g-popup-msg'}, true);
                    }
                    if (!Ext.isString(msg)) {
                        icon  = msg.icon || null;
                        type  = msg.type || null;
                        title = msg.status;
                        msg   = msg.text;
                    }
                    if (msg.length == 0) return;
                    if (title === null)
                        title = 'Message';
                    var m = Ext.DomHelper.append(msgCt, createBox(title, msg, type, icon), true);
                    m.hide();
                    m.slideIn('t').ghost("t", { delay: 4000, remove: true});
                }
            };
        }();

        // отчеты об ошибках
        this.report = {
            app: this,
            send: function (error, details = '') {
                Ge.makeRequest({
                    route: '@backend/reporting/error',
                    params: {error: error, details: details}
                });
            }
        };

        // панель выхода
        this.signout = {
            app: this,
            mask: Ext.get('g-signout'),
            exit: Ext.get('g-signout-exit'),
            account: Ext.get('g-signout-account'),
            back: Ext.get('g-signout-back'),
            init: function () {
                var me = this;
                this.exit.on('click', function () {
                    this.app.request('@backend/workspace/signout');
                    this.hide();
                }, this);
                this.account.on('click', function (event, me) { 
                    this.hide();
                    this.app.widget.load(me.getAttribute('data-role'));
                }, this);
                this.back.on('click', function () { this.hide(); }, this);
            },
            show: function () { this.mask.addCls('g-signout--show'); },
            hide: function () { this.mask.removeCls('g-signout--show'); }
        }
        this.signout.init();
        // всплывающие меню
        this.bootslide = Ext.create('Ge.view.Bootslide', { app: this, activeItem: 0 });
        // предварительная загрузка перед запуском приложения
        this.load();
        this.header.activeTitle = Ext.get('g-header__title-active');
        // заголовок
        Ext.get('g-header__title').update(Ge.settings.versionName);
        // запуск менеджера задач
        /*
        Ext.TaskManager.start({
            run: this.taskVerifyStatus,
            interval: 5000
        });
        */
       this.autorun();
    }
});
