/**
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
 * @license Widget.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.WidgetCache
 * Класс кэширования конфигурации компонентов полученных запросом.
 */
 Ext.define('Ge.WidgetCache', {
    extend: 'Ext.util.HashMap',

    /**
     * Создаёт хэш-ключ из указанных параметров.
     * @param {String} route Маршурт.
     * @param {Object} params Параметры маршрута.
     */
    makeKey: function (route, params = null) {
        if (params !== null)
            return route + '=' +  Ext.encode(params);
        else
            return route;
    },

    /**
     * Добавляет виджет в кэш.
     * @param {String} route Маршурт.
     * @param {Object} params Параметры маршрута.
     */
    addWidget: function (widget, route, params = null) {
        this.add(this.makeKey(route, params), widget);
    },

    /**
     * Возвращает виджет из кэша.
     * @param {String} route Маршурт.
     * @param {Object} params Параметры маршрута.
     * @return {undefined|Object}
     */
    getWidget: function (route, params = null) {
        return this.get(this.makeKey(route, params));
    },

    /**
     * Проверяет, есть ли виджет в кэше.
     * @param {String} route Маршурт.
     * @param {Object} params Параметры маршрута.
     * @return {Boolean}
     */
    hasWidget: function (route, params = null) {
        return this.containsKey(this.makeKey(route, params));
    }
 });


/**
 * @class Ge.Widget
 * Класс загрузчика компонента.
 */
Ext.define('Ge.Widget', {
    /**
     * @cfg {Ge.Application} app 
     * Приложение.
     */
    app: null,

    previous: null,

    /**
     * @cfg {Ext.util.HashMap} cache 
     * Кэш виджетов.
     */
    cache: null,

    /**
     * Конструктор.
     * @param {Object} config Конфигурация.
     */
    constructor: function (config) {
        Ext.apply(this, config);

        this.cache = new Ge.WidgetCache();
    },

    /**
     * Добавить маршрут в историю.
     * @param {String} route Маршурт.
     * @param {Object} params Параметры маршрута.
     */
    addHistory: function (route, params = {}) {
    },

    /**
     * Определить настройки компонента и показать его.
     * @param {Object} obj Настройки компонента.
     */
    defineWidget: function (obj) {
        var container = obj.container || container;
        if (container != null) {
            Ext.getCmp(container).add(obj);
            Ext.getCmp(container).doLayout();
        } else {
            if (Ext.isDefined(obj.dockTo)) {
                obj.dockTo.destroy = obj.dockTo.destroy || false;
                // если объект существует с obj.id, тогда удалить его
                if (obj.dockTo.destroy)
                    if ((h = Ext.getCmp(obj.id)) != null)
                        h.destroy();
            }
            // создание объекта
            let cmp = Ext.ComponentManager.create(obj);
            cmp.widgetRequest = this.previous;
            // php component
            if (cmp.dockTo) {
                let cnt = Ext.getCmp(cmp.dockTo.container);
                if (cnt) {
                    if (this.activeEl != null)
                        this.activeEl.id = cmp.id;
                    cnt.add(cmp);
                    // если слой контейнера, куда добавлен компонент ещё не активен
                    if (Ext.isFunction(cnt.layout.setActiveItem))
                        cnt.layout.setActiveItem(cmp.id);
                    // если контейнера - это вкладка
                    if (!Ext.isDefined(cnt.activeTab) && Ext.isFunction(cnt.setActiveTab))
                    //if (Ext.isFunction(cnt.setActiveTab))
                        cnt.setActiveTab(0);
                }
            }
            if (cmp instanceof Ext.Window) {
                cmp.show();
            }
        }
    },

    /**
     * Определить настройки компонентов и активировать их.
     * @param {Array} data Массив настроек компонентов.
     */
    define: function (data) {
        if (Ext.isString(data)) return;
        if (Ext.isArray(data))
            for (var i = 0; i < data.length; i++) {
                this.defineWidget(data[i]);
            }
        else
            this.defineWidget(data);
    },

    /**
     * Загрузить компонент с указанными настройками.
     * @param {Object} handlerArgs Настройки компонента 
     * (определяются в свойстве "handlerArgs" объекта, который  
     * вызывает компонент).
     */
    loadBy: function (handlerArgs) {
        var route = '';
        if (Ext.isDefined(handlerArgs.pattern)) {
            var template,
                data = {},
                pattern = handlerArgs.route;
            if (Ext.isString(handlerArgs.pattern)) {
                // ели шаблон имеет вид: ":prepareData" => me.prepareData()
                if (handlerArgs.pattern[0] == ':') {
                    var method = handlerArgs.pattern.ltrimChar(':');
                    data = handlerArgs.me[method]();
                } else {
                    switch (handlerArgs.pattern) {
                        case 'data':
                            data = handlerArgs.data;
                            break;
    
                        case 'grid.popupMenu.activeRecord':
                            data = handlerArgs.me.parentMenu.activeRecord;
                            break;
    
                        case 'grid.selectedRow':
                            var count = handlerArgs.me.grid.getSelectionModel().getCount();
                            if (count == 0) {
                                Ext.Msg.warning(handlerArgs.me.msgMustSelect);
                                return;
                            } else
                            if (count == 1) {
                                data = handlerArgs.me.grid.getStore().getOneSelected();
                            } else
                                data = {id: handlerArgs.me.grid.getStore().selectionListAsString()};
                            break;
                    }
                }
            } else {
                data = handlerArgs.pattern;
            }
            if (Ext.Object.isEmpty(data)) return;

            template = new Ext.Template(pattern);
            route = template.apply(data);
            template.destroy();
        } else
            route = handlerArgs.route;

        this.load(
            route,
            Ext.isDefined(handlerArgs.params) ? handlerArgs.params : null,
            Ext.isDefined(handlerArgs.caching) ? handlerArgs.caching : false
        );
    },

    /**
     * Определить настройки компонента Ext.Window.
     * @param {Object} cmp Компонент.
     */
    defineWindow: function (cmp) {
        var window = Ext.getCmp(cmp.id);
        if (typeof window != 'undefined')
            window.close();
        window = cmp;
        if (typeof window.anchorTo != 'undefined') {
            var vw = Ge.getApp().viewport;
            switch (window.anchorTo) {
                case 'right':
                    window.y = 40;
                    window.x = vw.getWidth() - window .width - 5;
                    window.height = vw.getHeight() - 45;
                    break;

                case 'left':
                    break;
            }
        }
    },

    /**
     * Загрузить компонент.
     * @param {String} route Маршрут.
     * @param {Object} params Параметры запроса методом POST (по умолчанию `null`).
     */
    load: function (route, params = null, caching = false) {
        if (route === null) return;

        var me = this;
        if (caching) {
            let widget = me.cache.getWidget(route, params);
            if (widget) {
                this.define(widget);
                return;
            }
        }

        me.previous = {
            url: Ge.url.build(route),
            route: route
        };
        Ge.history.add(me.previous, me.previous.url);

        Ge.getApp().loadMask.show('');
        Ext.Ajax.request({
            url: me.previous.url,
            method: 'post',
            params: params,
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                Ge.getApp().loadMask.hide();
                var response = Ge.response.normalize(response);
                // результат
                if (!response.success) {
                    Ext.Msg.exception(response);
                    return;
                }
                // добавление ассоциации класса с путём (например: ['rg.be.config', '/rg/rg.be.config/src/js'])
                if (response.jsPath.length > 0) {
                    for (let i = 0; i < response.jsPath.length; i++) {
                        let path = response.jsPath[i];
                        Ext.ClassManager.setPath(path[0], path[1]);
                    }
                }
                // подключение скриптов
                if (response.requires.length > 0) {
                    for (let i = 0; i < response.requires.length; i++) {
                        Ext.syncRequire(response.requires[i]);
                    }
                }
                // подключение css
                if (response.css.length > 0) {
                    me.app.loader.load(response.css);
                }
                // сообщение
                if (response.message.text.length > 0)
                    Ext.Msg.alert(response.message.status, response.message.text);
                // если окно ранее было создано
                if (response.data.xtype == 'window') {
                    me.defineWindow(response.data);
                }
                // добавление компонентов
                me.define(response.data);
                // если необходимо кэшировать компонентов
                if (caching) {
                    me.cache.addWidget(response.data, route, params);
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
                Ge.getApp().loadMask.hide();
                Ext.Msg.exception(response, true);
            }
        });
    }
});