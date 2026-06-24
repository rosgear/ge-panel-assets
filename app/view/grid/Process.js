/**
 * Компонент "Панель списка выполнения задач".
 
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
 * @license Process.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.Process
 * @extends Ext.grid.Panel
 * Компонент "Панель списка выполнения задач".
 */
Ext.define('Ge.view.grid.Process', {
    extend: 'Ext.grid.Panel',
    xtype: 'g-gridprocess',
    cls: 'g-grid g-grid-process',
    name: 'myProcess',
    enableColumnMove: false,
    enableColumnResize: false,
    selModel: {},
    store: {
        fields: ['title', 'comment', 'progress']
    },
    columns: [
        {
            text: '№',
            xtype: 'rownumberer'
        }, {
            text: 'Шаг выполнения',
            tdCls: 'g-cell-text',
            flex: 1,
            sortable: false,
            hideable: false,
            dataIndex: 'title',
            renderer: function (value, metaData, record) {
                if (record.data.comment.length > 0) {
                    return '<div>' + value + '</div><div class="g-cell-comment">' + record.data.comment + '</div>';
                }
                return value;
            }
        }, {
            text: '',
            tdCls: 'g-cell-progress',
            width: 120,
            sortable: false,
            hideable: false,
            dataIndex: 'progress',
            renderer: function (value, metaData, record) {
                switch (value) {
                    case 'error': return '<i class="far fa-times"></i>';
                    case 'done': return '<i class="far fa-check"></i>';
                    case 'wait': return '<div class="fa-3x"><i class="far fa-cog fa-spin"></i></div>';
                    default:
                        return '';
                }
            }
        }
    ],
    /**
     * @cfg {Boolean} [hasError=false]
     * @private
     * Определяет, была ли ошибка при выполнении задачи.
     */
    hasError: false,

    /**
     * @cfg {Boolean} [inProgress=false]
     * @private
     * Определяет, выполняется ли задача.
     */
    inProgress: false,

    /**
     * @cfg {Object} 
     * Обработчик событий компонента.
     */
    listeners: {
        /**
         * Выполняется после завершения рендеринга компонента.
         * @param {Ge.view.grid.Process} me
         * @param {Object} eOpts Параметры слушателя.
         */
        afterRender: function (me, eOpts ) {
            this.start();
        }
    },

    /**
     * Выполнение задачи на указанном этапе.
     * @param {Number} stage Порядковый номер (этап) задачи.
     */
    stageRequest: function (stage) {
        var me = this;
        if (!me.inProgress || me.hasError) return;

        me.setProgress(stage, 'wait');
        Ext.Ajax.request({
            url: Ge.url.build(me.router.build('stage', { stage: stage })),
            method: 'post',
            params: {
                stage: stage,
                name: me.name
            },
            /**
             * Успешное выполнение запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            success: function (response, opts) {
                var response = Ge.response.normalize(response);
                me.hasError = !response.success;
                if (!response.success) {
                    me.setProgress(stage, 'error');
                    Ext.Msg.exception(response);
                }
            },
            /**
             * Ошибка запроса.
             * @param {XMLHttpRequest} response Ответ.
             * @param {Object} opts Параметр запроса вызова.
             */
            failure: function (response, opts) {
                me.unmask();
                Ext.Msg.exception(response, true, true);
            }
        });
    },

    /**
     * Начать выполнение задач.
     * @return {Ge.view.grid.Process}
     */
    start: function () {
        this.reset();
        this.stageRequest(1);
        return this;
    },

    /**
     * Остановить выполнение задач.
     * @return {Ge.view.grid.Process}
     */
    stop: function () {
        this.inProgress = false;
        return this;
    },

    /**
     * Возвращение списка к первоначальному виду.
     * @return {Ge.view.grid.Process}
     */
    reset: function () {
        var r, c = this.getStore().count();
        this.inProgress = true;
        this.hasError = false;
        for (var i = 1; i <= c; i++) {
           this.setProgress(i, '');
        }
        return this;
    },

    /**
     * Устанавливает атрибуты задачи на указанном этапе.
     * @param {Number} stage Порядковый номер (этап) задачи.
     * @param {Object} attr Атрибуты задачи.
     * @return {Ge.view.grid.Process}
     */
    setStage: function(stage, attr) {
        var r = this.getStore().getAt(stage - 1);
        if (r !== null)
            r.set(attr);
        this.updateLayout();
        return this;
    },

    /**
     * Возвращает задачу на указанном этапе.
     * @param {Number} stage Порядковый номер (этап) задачи.
     * @return {Object}
     */
    getStage: function (stage) {
        return this.getStore().getAt(stage - 1);
    },

    /**
     * Добавляет задачу в список.
     * @param {String} title Название задачи.
     * @param {String} comment Описание задачи.
     * @param {String} progress Ход выполнения задачи.
     * @return {Ge.view.grid.Process}
     */
    addStage: function(title, comment, progress) {
        this.getStore().add({ title: title, comment: comment, progress: progress });
        return this;
    },

    /**
     * Добавляет комментарий в задачу на указанном этапе.
     * @param {Number} stage Порядковый номер (этап) задачи.
     * @param {String} text Комментарий.
     * @return {Ge.view.grid.Process}
     */
    addComment: function (stage, text) {
        var r = this.getStore().getAt(stage - 1);
        if (r !== null) {
            r.set({ comment: r.data.comment + '<div>' + text + '<div>' });
            this.updateLayout();
        }
        return this;
    },

    /**
     * Устанавливает комментарий задаче на указанном этапе.
     * @param {Number} stage Порядковый номер (этап) задачи.
     * @param {String} text Комментарий.
     * @return {Ge.view.grid.Process}
     */
    setComment: function(stage, comment) {
        var r = this.getStore().getAt(stage - 1);
        if (r !== null)
            r.set({ comment: comment });
        this.updateLayout();
        return this;
    },

    /**
     * Удаляет задачу из списка.
     * @param {Number} stage Порядковый номер (этап) задачи.
     * @return {Ge.view.grid.Process}
     */
    removeStage: function (stage) {
        this.getStore().removeAt(stage - 1);
        return this;
    },

    /**
     * Устанавливает ход выполнения задачи на указанном этапе.
     * @param {Number} stage Порядковый номер (этап) задачи.
     * @param {String} value Ход выполнения задачи.
     * @return {Ge.view.grid.Process}
     */
    setProgress: function (stage, value) {
        var r = this.getStore().getAt(stage - 1);
        if (r !== null)
            r.set({ progress: value });
        return this;
    }
});
