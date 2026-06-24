/**
 * Инициализация приложения, классов и переопределение свойств и методов объектов.
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
 * @license app.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * Кодирует строку, как универсальный идентификатор ресурса (URI).
 * @param  {String} value Строка для преобразования.
 * @return {String} Строка.
 */
Ext.util.Format.encodeURI = (value) => { return encodeURI(value) };

/**
 * Возвращает стиль DOM в виде строки.
 * @param  {Object} properties Свойства стиля DOM в виде "property.value" .
 * @param {Array} exclude Имена свойств, которые не попадут в результат.
 */
Ext.util.CSS.styleToString = (properties, exclude = []) => {
    return Array.from(properties).reduce((str, property) => {
        if (exclude && exclude.indexOf(property) !== -1) return '';

        return `${str}${property}: ${properties.getPropertyValue(property)};`;
    }, '');
}

/**
 * Переопределение свойств и методов объекта Ext.data.proxy.Proxy.
 */
Ext.override(Ext.data.proxy.Proxy, {
    /**
     * Конструктор.
     * @param {Array} config Конфигурация.
     */
    constructor: function (config) {
        config = config || {};
        if (Ext.isDefined(config.url) && Ext.isArray(config.url)) {
            config.initUrl = config.url;
            config.url = Ge.url.build.apply(Ge.url, config.url);
        }
         
        this.mixins.observable.constructor.call(this, config);
        
        // нужно прервать все ожидающие операции при уничтожении
        this.pendingOperations = {};
    }
});

Ext.override(Ext.data.proxy.Ajax, {
    openRequest: function (options) {
        var xhr = this.callParent(arguments);
        if (options.progress) {
            xhr.upload.onprogress = options.progress;
        }
        return xhr;
    }
});


/**
 * Переопределение свойства Ext.menu.Menu.
 */
 Ext.override(Ext.menu.Menu, {
    mouseLeaveDelay: 0, // убираем тормознутость подсветки пунктов меню
    saveDelay: 0
});


/**
 * Переопределение свойств и методов объекта Number.
 */
 Ext.override(Number, {
    /**
     * Округление числа.
     * @this   {Number}
     * @param  {Number} decimalPlaces
     * @return {Number}
     */
    round: function (decimalPlaces) {
        let number = this,
            multiplier = 10 ** decimalPlaces;
        return Math.round(number * multiplier) / multiplier;
    }
 });


/**
 * Переопределение свойств и методов объекта String.
 */
Ext.override(String, {
    /**
     * Удаляет слово из начала строки.
     * @this   {String}
     * @param  {String} word Удаляемое слово.
     * @return {String} Строка.
     */
    trimWord: function (word) {
        let string = this;
        if (string.startsWith(word)) string = string.substr(word.length);
        return string.toString();
    },

    /**
     * Удаляет слова из начала строки.
     * @this   {String}
     * @param  {Array} words Удаляемые слова (удалит только одно слово).
     * @return {String} Строка.
     */
    trimWords: function (words) {
        let string = this,
            length = string.length;
        words.forEach(word => { if (length === string.length) string = string.trimWord(word) });
        return string;
    },

    /**
     * Удаляет символ из начала и конца строки.
     * @this   {String}
     * @param  {String} ch Удаляемай символ.
     * @return {String} Строка.
     */
    trimChar: function (ch) {
        let string = this;
        if (string.charAt(0) == ch) string = string.substr(1);
        if (string.charAt(string.length - 1) == ch) string = string.substr(0, string.length - 1);
        return string.toString();
    },

    /**
     * Удаляет символ из начала строки.
     * @this   {String}
     * @param  {String} ch Удаляемай символ.
     * @return {String} Строка.
     */
    ltrimChar: function (ch) {
        let string = this;
        if (ch.length == 0) return string;
        if (string.charAt(0) == ch) string = string.substr(1);
        return string.toString();
    },

    /**
     * Удаляет символ из конца строки.
     * @this   {String}
     * @param  {String} ch Удаляемый символ.
     * @return {String} Строка.
     */
    rtrimChar: function (ch) {
        let string = this;
        if (string.charAt(string.length - 1) == ch) string = string.substr(0, string.length - 1);
        return string.toString();
    },

    /**
     * Проверяет существования символа в строке.
     * @this   {String}
     * @param  {String} ch Символ.
     * @return {Boolean} Если true, символ присутствует.
     */
    hasChar: function (ch) {
        let string = this;
        return string.indexOf(ch) != -1;
    },

    /**
     * Выполняет замену символов на указанные значения в строке.
     * Пример: `'Translate from {0} to {1}'.put(['english', 'russian'])` => 'Translate from english to russian'
     * @this   {String}
     * @param  {Array} values Замена на указанные значения.
     * @return {String}
     */
    put: function (values) {
        let string = this;
        for (let i = 0; values.length > i; i++) {
            string = string.replace('{' + i + '}', values[i]);
        }
        return string;
    },

    /**
     * Экранирует в строке двойную кавычку (") слешами.
     * @this   {String}
     * @return {String}
     */
    escapeDQuotes: function () { return this.replace(/"/g, '\\"'); },

    /**
     * Экранирует строку слешами.
     * @this   {String}
     * @return {String}
     */
    addslashes: function () {
        return this.replace(/\\/g, '\\\\').
            replace(/\u0008/g, '\\b').
            replace(/\t/g, '\\t').
            replace(/\n/g, '\\n').
            replace(/\f/g, '\\f').
            replace(/\r/g, '\\r').
            replace(/'/g, '\\\'').
            replace(/"/g, '\\"');
    }
});


/**
 * Переопределение свойств и методов объекта URL.
 */
Ext.override(URL, {
    /**
     * Возвращает имя файла из URL-пути с суфиксом и без.
     * @param  {String} suffix Суфик.
     * @return {String}
     */
    basename: function (suffix) {
        var path = this.pathname;
        let p = path.split( /[\/\\]/ ), name = p[p.length-1];
    
        return ('string' != typeof suffix) ? name : name.replace(new RegExp(suffix.replace('.', '\\.')+'$'),'');
    },

    /**
     * Проверяет указан ли URL-путь (не учитывая "/").
     * @return {Boolean}
     */
    hasPathname: function () {
        return this.pathname.length > 0 && this.pathname != '/';
    },

    /**
     * Проверяет имеет ли URL-путь файл.
     * @return {Boolean}
     */
    hasFilename: function () { return this.pathname.indexOf('.') !== -1; },

    /**
     * Установка параметров запроса одним объектом.
     * @param {Object} Параметры запроса в виде набора пар ключ-значение.
     * @return {URL}
     */
    setSearchParams: function (params) {
        for(var name in params) {
            this.searchParams.set(name, params[name]);
        }
        return this;
    },

    /**
     * Обновляет все свойства объекта URL.
     * @param {Object} Свойства объекта URL в виде набора пар ключ-значение.
     * @return {URL}
     */
    update: function (prop) {
        for(var name in prop) {
            if (name == 'searchParams') {
                this.setSearchParams(prop[name]);
            } else
            if (Ext.isDefined(this[name])) {
                this[name] = prop[name];
            }
        }
        return this;
    }
});


/**
 * Обработчик события ошибок.
 * 
 * @override
 * @this   {Window}
 * @param  {String} msg Сообщение ошибки.
 * @param  {String} url Где произошла ошибка.
 * @param  {Number} lineNo Номер строки, где прошизошла ошибка.
 * @param  {Number} columnNo Номер столбца для строки, в которой произошла ошибка.
 * @param  {Error} error Объект ошибки.
 * @return {Boolean}
 */
window.onerror = (msg, url, lineNo, columnNo, error) => {
    var string = msg.toLowerCase(),
        substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        if (typeof Ext.Msg != 'undefined')
            Ext.Msg.show({
                title: 'Ошибка / JavaScript',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR,
                msg: '<b>Сообщение:</b> ' + error + '<br><b>Cтрока:</b> ' + lineNo + ' [' + columnNo + ']<br><b>Ресурс:</b> ' + url,
                icon: 'g-icon-svg g-icon_dlg-script-error'
            });
        else
            alert('Сообщение: ' + error + "\r\n" + 
                  'Cтрока: ' + lineNo + ' [' + columnNo + "]\r\n" +
                  'Ресурс: ' + url);
    }
    // просто запустить обработчик события по умолчанию.
    return false;
};


/**
 * @method isJson
 * @member Ext
 * Проверка строки на принадлежность к формату JSON.
 *
 * @param  {String} str Строка.
 * @return {Boolean} Если true, строка содержит JSON представление.
 */
Ext.isJson = (str) => {
    if (!Ext.isString(str)) return false;
    str = str.trimChar(' ');
    if (str.length == 0) return false;
    if (str[0] != '{' || str[str.length - 1] != '}') 
        if (str[0] != '[' || str[str.length - 1] != ']')
            return false;
    return true;
}


/**
 * @method defineCommand
 * @member Ext.Ajax
 * Выполнение одного из методов основного контроллера (Main) приложения при получении 
 * ответа при AJAX запросе.
 *
 * @param  {String} command Имя метода контроллера.
 */
Ext.Ajax.defineCommand = (command) => {
    var cnt = Ge.app.getController('App');
    Ext.each(command, function(cmd) {
        cnt[cmd.name].apply(this, cmd.attr);
        /*switch (cmd.name) {
            case 'redirect': document.location = cmd.attr; break;
            default:
        }*/
    });
}
/**
 * Заголовки отправляемые на сторону сервера по умолчанию.
 */
Ext.Ajax.setDefaultHeaders(Ge.settings.request.headers);


/**
 * Событие наступающие после выполнения AJAX запроса.
 * 
 * @link   https://docs.sencha.com/extjs/5.1.3/api/Ext.Ajax.html#event-requestcomplete
 * @param  {Ext.data.Connection} conn Это объекта соединение.
 * @param  {Object} response Объект XHR, содержащий данные ответа.
 * @param  {Object} options Объект конфигурации параметров передается методу запроса.
 * @param  {String} eOpts Объект параметров передан Ext.util.Observable.addListener.
 */
Ext.Ajax.on('requestcomplete',(conn, response, options, eOpts) => {
    try {
        if (response.responseText) {
            if (!Ext.isJson(response.responseText)) {
                Ext.Msg.show({
                    title: 'Ошибка сервера',
                    msg: response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        }
    } catch(err) { }
});


/**
 * @class Ge
 * @extends Ge.Application
 * Загружает класс Ge.Application и запускает его с заданной конфигурацией 
 * после того, как страница готова.
 */
Ext.application({
    extend: 'Ge.Application',
    name: 'Ge',
    appFolder: Ge.settings.path + '/app',
    autoCreateViewport: 'Ge.view.main.Main',
});


/**
 * @class Ge.Response
 * Класс Ge.Response создаёт HTTP-ответа в формате JSONG.
 */
Ext.define('Ge.Response', {
    /**
     * @cfg {Object} initParams 
     * Шаблон ответа сервера клиенту.
     * @private
     */
    initParams: {
        success: false,
        message: 'Unknow',
        mask: false,
        data: [],
        'do': '',
        jsPath: [],
        requires: [],
        css: [],
        command: []
    },

    /**
     * Возвращает все свойства config в объект, если они еще не существуют 
     * подставляет параметры по умолчанию {@see Ge.Response.initParams}.
     * @return {Object} 
     */
    define: function (config) { return Ext.applyIf(config, this.initParams); },

    /**
     * Нормализация сообщения.
     * @param {String} message Сообщение.
     * @return {Object} 
     */
    defineByMessage: function (message) {
        return Ext.applyIf({ success: false, message: message }, this.initParams);
    },

    /**
     * Нормализация статуса сообщения.
     * @param {Object} response Ответ от сервера.
     * @return {Object}
     */
    defineByStatus: function (response) {
        return Ext.applyIf({
            success: false,
            message: Ext.Txt.error + ' ' + response.status + ' (' + response.statusText + ').'
        }, this.initParams);
    },

    /**
     * Нормализация сообщения ответа.
     * @param  {String|Object} config Ответ от сервера.
     * @return {String|Object} Если сообщение в виде объекта - msgBox, 
     * иначе объект запроса.
     */
    normalizeMessage: function (config) {
        var msgBox = {};
        if (Ext.isObject(config)) {
            if (Ext.isDefined(config.icon))
                msgBox.icon = 'g-icon-svg g-icon_dlg-' + config.icon;
            if (Ext.isDefined(config.text))
                msgBox.message = config.text;
            if (Ext.isDefined(config.status)) {
                if (config.status.length > 0)
                    msgBox.title = config.status;
            }
            return msgBox;
        }
        return config;
    },

    /**
     * Вызывает методы главного контроллера (Main) приложения.
     * @param {Array} commands Методы вызова контроллера, 
     * имеет вид: [{"name": "Имя метода", "attr": ["Аргумент 1", "Аргумент 2"...]}...].
     * @param {String} event Имя свойства объекта (если имя метода представлено как имя объекта, <object>::<event>) 
     * для изменения свойств объекту.
     */
    executeCommands: function (commands, event = '') {
        if (commands.length == 0) return;

        var controller = Ge.app.getController('App'),
            cmd = '';
        Ext.each(commands, function (command) {
            cmd = command.name.split('::');
            // cmd[0] = name, cmd[1] = event
            if (cmd.length > 1) {
                 if (event.length > 0 && cmd[1] == event)
                    controller[cmd[0]].apply(this, command.attr);
            } else {
                controller[cmd].apply(this, command.attr);
            }
        });
    },

    /**
     * Нормализация ответа от сервера.
     * @param  {String|Json|XMLHttpRequest|Ext.form.action.Action} config Ответ от сервера.
     * @return {Object} Нормализованный ответ (приведение к общему типу).
     */
    normalize: function (config) {
        if (!Ext.isDefined(config)) return null;

        var response = this.initParams;
        if (Ext.isString(config)) {
            // если string
            if (!Ext.isJson(config)) {
                //alert(config);
                response = this.defineByMessage(config);
            // если responseText
            } else
                response = this.define(Ext.decode(config));
        }
        else
        if (Ext.isObject(config)) {
            // XMLHttpRequest
            if (Ext.isDefined(config.responseText)) {
                if (config.status == 404)
                    response = this.defineByStatus(config);
                else
                if (config.responseText.length == 0 && config.status == 200)
                    response = this.defineByMessage(Ext.Txt.serverDidNotAnswer);
                else
                if (config.responseText.length == 0)
                    response = this.defineByStatus(config);
                else
                // если responseText
                if (Ext.isJson(config.responseText)) {
                    response = this.define(Ext.decode(config.responseText));
                // если string
                } else {
                    response = this.defineByMessage(config.responseText);
                }
            } else
            // Ext.form.action.Action
            if (config instanceof Ext.form.action.Action) {
                switch (config.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        response = this.defineByMessage('Form fields may not be submitted with invalid values');
                        break;
                    /*
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        response = this.defineByMessage('Ajax communication failed');
                        break;
                    */
                    case Ext.form.action.Action.LOAD_FAILURE:
                        response = this.defineByMessage('No field values are returned in the response\'s data property');
                        break;

                    case Ext.form.action.Action.SERVER_INVALID:
                        return Ge.response.normalize(config.response);

                    default:
                        return Ge.response.normalize(config.response);
                }
            // normalize
            } else
                response = config;
        }
        if (Ext.isDefined(response.command) && response.command.length > 0) {
            this.executeCommands(response.command);
            response.command = [];
        }
        return response;
    }
});
Ge.response = Ext.create('Ge.Response', {});


/**
 * @class Ge.Url
 * Класс Ge.Url анализирует и обрабатывает HTTP-запросы и создаёт новые URL-адреса на 
 * основе установленных правил.
 */
Ext.define('Ge.Url', {
    /**
     * Конструктор.
     * @param {Object} config Настройки конфигурации.
     */
    constructor: function (config) {
        config = Ext.applyIf(config, {
            enablePrettyUrl:     false,
            showScriptName:      false,
            enableTrailingSlash: false,
            showScriptName:      false,
            routeParam:          '',
            scriptName:          '',
            hashParam:           '_hash',
            baseUrl:             '',
            aliases:             {},
            lt: ''
        });

        this.initConfig(config);
        Ext.applyIf(this, config);
        this.initAliases(this.aliases);
        this._url = new URL(document.location.origin);

        return this;
    },

    /**
     * Создаёт коллекцию из набора пар ключ(псевдоним пути)-значение(путь).
     * @param {Object} aliases Объект с набором пар ключ(псевдоним пути)-значение(путь).
     */
    initAliases: function (aliases) {
        this.aliases = new Ext.util.MixedCollection();
        this.aliases.addAll(aliases);
        this.aliases.replace = function (str) {
            var pos, key;
            if ((pos = str.indexOf('/')) !== -1) {
                key = this.get(str.substring(0, pos));
                if (Ext.isDefined(key))
                    return key + str.substring(pos);
                else
                    return str;
            } else {
                key = this.get(str);
                if (Ext.isDefined(key))
                    return key;
                else
                    return str;
            }
        }
    },

    /**
     * Разбор маршрута на параметры URL.
     * @param {String} route Маршрут, имеет вид: "@backend/path/path1?param=1&param2=2#hash"
     */
    parseRoute: function (route) {
        var pos;

        if ((pos = route.indexOf('#')) !== -1) {
            this._url.hash = route.substr(pos);
            route = route.substr(0, pos);
        }
        if ((pos = route.indexOf('?')) !== -1) {
            this._url.search = route.substr(pos);
            route = route.substr(0, pos);
        }
        if (route.charAt(0) === '@') {
            route = this.aliases.replace(route);
        }
        if (this._url.hash.length && this.hashParam.length) {
            var hash = this._url.hash;
            this._url.searchParams.set(this.hashParam, hash.ltrimChar('#'));
        }
        this._url.pathname = route;
    },

    /**
     * Добавляет к маршрутизации локаль.
     * @param  {String} pathname Маршрут запроса.
     * @param  {Object} options Правила формирования URL-адреса.
     * @return {String} Маршрут запроса.
     */
    addLocale: function (pathname, options) {
        /* добавление к маршрутизации локали */
        // если локаль быбрана
        if (!Ge.settings.locale.isDefault) {
            if (options.enablePrettyUrl) {
                var parts = pathname.split('/');
                // слева
                if (Ge.settings.locale.isPosPrefix) {
                    if (parts[0] != Ge.settings.locale.language)
                        pathname = Ge.settings.locale.language + '/' + pathname;
                // справа
                } else {
                    if (parts[parts.length - 1] != Ge.settings.locale.language)
                        pathname = pathname + '/' + Ge.settings.locale.language;
                }
            } else {
                this._url.searchParams.set(Ge.settings.locale.slugParam, Ge.settings.locale.language);
            }
        }
        return pathname;
    },

    /**
     * Возвращает URL-адрес на основе указанных правил.
     * @param  {String} route Маршрут запроса (пример: "path1/path2/path3?var=1#hash").
     * @param  {Object} options Правила формирования URL-адреса.
     * @return {String} URL-адрес.
     */
    build: function (route, options = {}) {
        this.reset();
        this.parseRoute(route);

        var o = Ext.applyIf(options, this.initialConfig),
            pathname = this._url.pathname.trimChar('/');

        pathname = this.addLocale(pathname, o);

        if (o.enablePrettyUrl) {
            this._url.pathname = (o.showScriptName ? '/' + o.scriptName : '')
                + (pathname.length ? '/' + pathname : '');
            if (o.enableTrailingSlash) {
                if (o.showScriptName) {
                    if (pathname.length  && !pathname.hasChar('.'))
                        this._url.pathname += '/';
                } else {
                    if (this._url.hasPathname() && !pathname.hasChar('.'))
                        this._url.pathname += '/';
                }
            }
        } else {
            if (this._url.hasPathname()) {
                this._url.searchParams.set(o.routeParam, pathname);
            }
            this._url.pathname = (o.showScriptName ? '/' + o.scriptName : '')
                + (o.enableTrailingSlash && (!o.showScriptName) ? '/' : '');
        }
        this._url.pathname = o.baseUrl + this._url.pathname.ltrimChar(o.baseUrl.length ? '/' : '');
        return decodeURIComponent(this._url.toString());
    },

    /**
     * Сброс параметров URL к начальному адресу.
     */
    reset: function () { this._url.href = document.location.origin; },

    /**
     * Возвращает объект URL.
     * @return {URL}
     */
    get: function () { return this._url; },

    /**
     * Метод возвращает USVString, содержащую весь URL. Это фактически 
     * версия URL.href только для чтения.
     * @return {String} 
     */
    toString: function () {
        this._url.toString();
    }
});
Ge.url = Ext.create('Ge.Url', Ge.settings.urlManager);


/**
 * @method callMe
 * @member Ge
 * Вызов одного из методов компонента Ext.Component с указанием аргументов.
 *
 * @param {String} id Идентфикатор компонента.
 * @param {String} method Имя вызываемого метода.
 * @param {Array} args Аргументы метода.
 */
Ge.callMe = function (id, method, args = null) {
    var component = Ext.getCmp(id);
    if (component === null || !Ext.isDefined(component)) return;

    var methods = method.split('.');
    if (methods.length > 1) {
        var method;
        for(var i = 0; i < methods.length - 1; i++) {
            method = methods[i];
            if (typeof component[method] !== "undefined") {
                component = component[method];
            } else
                break;
        }
        method = methods[methods.length - 1];
    }
    component[method].apply(component, args === null ? [] : args);
};


/**
 * @method makeRequest
 * @member Ge
 * Выполняет AJAX запрос.
 * К параметрам запроса добавлены свойства:
 * - {String} route Маршрут будет преобразован в url;
 * - {String} confirm Окно диалога с подтверждением выполнения запроса;
 * - {Func} afterRequest(success, response) Событие после выполнения запроса.
 * 
 * @param {Object} request Параметры запроса {@see Ext.Ajax.request()}.
 */
Ge.makeRequest = function (request) {
    request = Ext.applyIf(request, {
        url: Ext.isDefined(request.route) ? Ge.url.build(request.route) : request.url,
        method: 'post',
        /**
         * Успешное выполнение запроса.
         * @param {XMLHttpRequest} response Ответ.
         * @param {Object} opts Параметр запроса вызова.
         */
        success: function (response, opts) {
            var response = Ge.response.normalize(response);
            if (!response.success) {
                Ext.Msg.exception(response, false, true);
            }
            if (Ext.isDefined(request.afterRequest)) {
                request.afterRequest(true, response);
            }
        },
        /**
         * Ошибка запроса.
         * @param {XMLHttpRequest} response Ответ.
         * @param {Object} opts Параметр запроса вызова.
         */
        failure: function(response) {
            Ext.Msg.exception(response, true);
            if (Ext.isDefined(request.afterRequest)) {
                request.afterRequest(false, response);
            }
        }
    });

    if (Ext.isDefined(request.confirm)) {
        Ext.Msg.show({
            title: Ext.Txt.warning,
            message: request.confirm,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request(request);
                }
            }
        });
    } else
        Ext.Ajax.request(request);
}


/**
 * @method applyString
 * @member Ge
 * Устанавливает значение свойству объекта указанного в виде строки.
 * Пример: 
 *    obj = {
 *       items: [{ width: 100 }]
 *    },
 * свойство указывается, как "items.0.width".
 * 
 * @param {Object} obj Объект.
 * @param {String} str Имя свойства.
 * @param {Mixed} value Значение свойства.
 */
Ge.applyString = function (obj, str, value) {
    var i,
        props = str.split('.');
    for (i = 0; i < props.length - 1; i++) {
        obj = obj[props[i]];
    }
    obj[props[i]] = value;
}

/**
 * @class Ge.History
 * Класс Ge.History использует window.history для перехода между виджетами при 
 * изменении состояния истории.
 */
Ext.define('Ge.History', {
    /**
     * @cfg {Boolean} enabled 
     * Доступ к истории переходов.
     * @property
     */
    enabled: true,

    /**
     * Конструктор.
     * @param {Object} config Настройки конфигурации.
     */
    constructor: function (config) {
        var me = this;
        config = Ext.applyIf(config, {
            enabled: true,
            onlyRefreshUrl: false
        });

        me.initConfig(config);

        me.onChange(function (event) {
            if (me.enabled && !me.onlyRefreshUrl)
                if (event.state != null) {
                    Ge.getApp().widget.load(event.state.route);
                }
            me.onlyRefreshUrl = false;
        });
        return me;
    },

    /**
     * Добавляет новое состояние в историю браузера.
     * Добавление возможно если история активна.
     * @param {Object} state Объект, который связан с новой записью в истории браузера, созданной при помощи pushState().
     * @param {String} url URL новой записи в истории браузера.
     */
    add: function (state, url) {
        if (this.enabled) window.history.pushState(state, null, url);
    },

    /**
     * Обновляет последнюю запись в стеке истории содержащий определенные данные, заголовок и, при наличии, URL.
     * Обновление возможно если история активна.
     * @param {Object} state Объект, который связан с записью в истории браузера, созданной при помощи pushState().
     * @param {String} url URL записи в истории браузера.
     */
    replace: function (state, url) {
        if (this.enabled) window.history.replaceState (state, null, url);
    },

    /**
     * Переход к следующей странице в истории сессии.
     */
    forward: function () {
        if (this.enabled) window.history.forward();
    },

    /**
     * Делает вызов предыдущей страницы из истории, если она существует.
     */
    back: function () {
        if (!this.enabled) return;
        window.history.back();
    },

    /**
     * Загружает страницу из истории сессии, определяя ее положение относительно 
     * текущей страницы.
     * Например: -1 для предыдущей страницы или 1 для следующей страницы.
     * Вызов без параметров или с не целочисленным аргументом не имеет никакого эффекта.
     */
    go: function (index) {
        if (this.enabled) window.history.go(index);
    },

    /**
     * Возвращает какое-либо значение, представляющее собой текущее 
     * состояние истории.
     * @return {Object}
     */
    getState: () => { return window.history.state; },

    /**
     * Возвращает количество записей в истории сессии, включая текущую 
     * загруженную страницу.
     * @return {Integer}
     */
    getLength: () => { return window.history.length; },

    /**
     * Событие отсылается объекту window каждый раз, когда активная запись 
     * истории меняется между двумя записями истории для одного и того же документа.
     * @param {Object} event Текущая запись истории.
     */
    onChange: (event) => window.addEventListener('popstate', event)
});
Ge.history = Ext.create('Ge.History', {
    enabled: Ge.settings.urlManager.browserHistory
});


/**
 * @class Ge.ActionRouter
 * Класс Ge.ActionRouter создаёт маршрут виджету при выполнении с ним действий.
 * Созданный маршрут используется для получения URL-адреса с помощью Ge.Url.
 */
Ext.define('Ge.ActionRouter', {
    /**
     * @cfg {Ext.Template[]} tpls 
     * Шаблоны маршрутизации.
     * @property
     */
    tpls: {},

    /**
     * Конструктор.
     * @param {Object} config Настройки конфигурации.
     */
    constructor: function (config) {
        config = Ext.applyIf(config, {
            rules: {}
        });
        this.tpls = {};
        this.initConfig(config);
        return this;
    },

    /**
     * Возвращает маршрут на основе указанных правил.
     * @param  {String} name Имя правила.
     * @param  {Object} data Свойства подставляемые в шаблон маршрута.
     * @return {String} Маршрут.
     */
    build: function (name, data = {}) {
        if (!Ext.isDefined(this.rules[name]))
            Ext.Error.raise('Can\'t define rule name "' + name + '".');
        var tpl = this.getTemplate(name);
        data = Ext.applyIf(data, this.config);
        return tpl.apply(data).trimChar('/');
    },

    /**
     * Возвращает шаблон маршрута. Если не создан, создаёт его.
     * @param  {String} name Имя правила.
     * @return {Ext.Template} Шаблон маршрута.
     */
    getTemplate: function (name) {
        if (!Ext.isDefined(this.tpls[name])) {
            return this.tpls[name] = new Ext.Template(this.rules[name]);
        } else {
            return this.tpls[name];
        }
    },

    /**
     * Проверяет, указан ли идентификатор в маршруте.
     * @return {Boolean}
     */
    hasId: function () {
        if (Ext.isDefined(this.id)) {
            if (Ext.isNumber(this.id))
                return this.id > 0;
            return !Ext.isEmpty(this.id);
        }
        return false;
    }
});


/**
 * @method console
 * @member Ge
 * Вывод сообщений в консоль.
 * Вывод сообщений будет в том случаи, если будет включен режим откладки и `Ge.settings.debug = true`.
 * 
 * @param {Mixed} arg Аргумент вывода в консоль.
 * @param {String} type Способ вывода в консоль: 'info', 'log', 'dir' (по умолчанию 'log').
 */
 Ge.console = (arg, type = 'log') => {
    if (Ge.settings.debug) console[type](arg);
 };


 /**
 * @method fconsole
 * @member Ge
 * Вывод названия функции с аргументами в консоль.
 * Вывод сообщений будет в том случаи, если будет включен режим откладки и `Ge.settings.debug = true`.
 * 
 * @param {Object} func Функция.
 * @param {String} prefix Приставка в имени функции.
 */
Ge.fconsole = (func, prefix = '') => {
    if (Ge.settings.debug) {
        console.info('Function called "' + prefix + func.name + '", arguments: ', func.attr);
    }
};


/**
 * @method download
 * @member Ge
 * Скачивает ресурс.
 * 
 * @param {String} url URL-адрес (маршрут) ресурса.
 */
Ge.download = (url) => {
    if (Ext.isString(url)) {
        let iframe = document.getElementById('loader');
        if (iframe === null) {
            iframe = document.createElement('iframe');
            iframe.id = 'loader';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        iframe.src = Ge.url.build(url);
    }
 };


 /**
 * @method uniqId
 * @member Ge
 * Генерирует уникальный ID
 * 
 * @param {String} prefix Префикс куникальному идентификатору.
 * @param {Boolean} entropy Если равен true, добавляется дополнительная энтропия, 
 * что увеличивает вероятность уникальности результата. 
 */
 Ge.uniqId = function (prefix = '', entropy = false) {
    var result;

    this.seed = function (s, w) {
        s = parseInt(s, 10).toString(16);
        return w < s.length ? s.slice(s.length - w) : 
                  (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
    };
    result = prefix + this.seed(parseInt(new Date().getTime() / 1000, 10), 8) 
                + this.seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);
    if (entropy) result += (Math.random() * 10).toFixed(8).toString();
    return result;
};