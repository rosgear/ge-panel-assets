/**
 * Загрузчик сценариев.
 
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
 * @license Loader.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.Loader
 * Класс загрузчика сценариев приложения.
 */
Ext.define('Ge.Loader', {
    /**
     * @cfg {Ge.Application} app 
     * Приложение.
     */
    app: null,

    include: function (config) {
        // подключение скриптов
        if (Ext.isDefined(config.requires)) {
            if (config.requires.length > 0) {
                for (var i = 0; i < config.requires.length; i++) {
                    Ext.syncRequire(config.requires[i]);
                }
            }
        }
        // подключение css
        if (Ext.isDefined(config.css)) {
            if (config.css.length > 0) {
                this.load(config.css);
            }
        }
    },

    /**
     * Загрузка списка.
     * @param {Array} fileList Массив файлов сценариев.
     * @param {Function} callback Функция обратного вызова.
     * @param {Object} scope
     * @param {Boolean} preserveOrder Сохранить порядок.
     */
    load: function (fileList, callback, scope, preserveOrder) {
        var scope       = scope || this,
            head        = document.getElementsByTagName("head")[0],
            fragment    = document.createDocumentFragment(),
            numFiles    = fileList.length,
            loadedFiles = 0,
            me          = this;
        
        // Загружает определенный файл из списка файлов по индексу
        var loadFileIndex = function (index) {
            head.appendChild(me.buildScriptTag(fileList[index], onFileLoaded));
        };
        /**
        * Функция обратного вызова, которая вызывается после загрузки каждого файла
        */
        var onFileLoaded = function() {
            loadedFiles ++;
            // если это был последний файл, вызовит функцию обратного вызова, в противном случае загрузит следующий файл
            if (numFiles == loadedFiles && typeof callback == 'function') {
                callback.call(scope);
            } else {
                if (preserveOrder === true) {
                    loadFileIndex(loadedFiles);
                }
            }
        };
        if (preserveOrder === true) {
            loadFileIndex.call(this, 0);
        } else {
            // загружать каждый файл (большинство браузеров делают это параллельно)
            Ext.each(fileList, function(file, index) {
                var result = this.buildScriptTag(file, onFileLoaded);
                if (result !== false)
                    fragment.appendChild(result);
            }, this);
            
            head.appendChild(fragment);
        }
    },

    /**
     * Сформировать тег скрипта.
     * @param {String} filename Имя файла сценария.
     * @param {Function} callback Функция обратного вызова.
     * @return {Boolean|String} Если false, тег не сформирован.
     */
    buildScriptTag: function (filename, callback) {
        var exten = filename.substr(filename.lastIndexOf('.')+1);
        if(exten=='js') {
            var script  = document.createElement('script');
            script.type = "text/javascript";
            script.src  = filename;

            // в IE есть другой способ обработки загрузок <script>, поэтому нам нужно проверить это здесь
            if(script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = callback;
            }
            return script;
        }
        if(exten=='css') {
            if (Ext.select('link[href="' + filename + '"]').elements.length == 0) {
                var style = document.createElement('link');
                style.rel  = 'stylesheet';
                style.type = 'text/css';
                style.href = filename;
                callback();
                return style;
            }
        }
        return false;
    }
});