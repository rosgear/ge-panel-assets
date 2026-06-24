/**
 * Загрузчик.
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
 * @license bootstrap.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */
 
(function() {
    Ext = window.Ext || {};

    let _st = Ge.settings;
    let extPrefix = _st.debug ? 'ext-all-debug' : 'ext-all';
    // загрузка стилей
    if (_st.theme.includeCSS) {
        document.write('<link rel="stylesheet" type="text/css" href="' + _st.theme.backendPath + '/resources/theme-green' + (_st.locale.rtl ? '-all-rtl' : '-all') + (_st.debug ? '-debug' : '') + '.css"/>');
        document.write('<link rel="stylesheet" type="text/css" href="' + _st.theme.path + '/assets/icons/icons' + (_st.debug ? '' : '.min') + '.css"/>');
        document.write('<link rel="stylesheet" type="text/css" href="' + _st.theme.path + '/widgets/widgets' + (_st.debug ? '' : '.min') + '.css"/>');
    }
    // загрузка скриптов
    document.write('<script type="text/javascript" src="' + _st.path + '/ext/' + extPrefix  + (_st.locale.rtl ? '-rtl' : '') + '.js"></script>');
    document.write('<script type="text/javascript" src="' + _st.locale.path + '/panel-locale' + (_st.debug ? '' : '.min') + '.js"></script>');
    if (_st.theme.hasOverrides) {
        // Поскольку document.write ("<script>") не блокирует выполнение в IE, нужно 
        // убедиться, что предотвращается выполнение <theme>.js до вызова ext-all.js.
        // Обычно это можно сделать с помощью атрибута defer тега script, однако этот 
        // метод не работает в IE, в режиме отладки. Это скорей всего из-за того, что 
        // ext-all.js, который загружает другие сценарии еще сам не загружен и Ext еще 
        // не определен, когда выполняется переопределение темы. Чтобы обойти это, 
        // используется хук _beforereadyhandler для загрузки темы, которая переопределяется
        // динамически после определения Ext.
        let overridePath = _st.theme.backendPath + '/theme' + (_st.debug ? '-debug' : '') + '.js';
        if (_st.debug && window.ActiveXObject) {
            Ext = {
                _beforereadyhandler: function() { Ext.Loader.loadScript({ url: overridePath }); }
            };
        } else
            document.write('<script type="text/javascript" src="' + overridePath + '" defer></script>');
    }
})();
