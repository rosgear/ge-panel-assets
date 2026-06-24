/**
 * Компонент "Панель загрузки файлов".
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
 * @license Panel.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

/**
 * @class Ge.view.grid.Upload
 * @extends Ext.grid.Panel
 * Панель загрузки файлов.
 */
Ext.define('Ge.view.grid.Upload', {
    extend: 'Ext.grid.Panel',
    xtype: 'g-uploadgrid',
    ui: 'upload',

    btnUpload: {},

    btnClear: {},

    btnRemoveUploaded: {},

    btnRemoveSelected: {},

    hdColumnName: 'Name',

    hdColumnSize: 'Size',

    hdColumnStatus: 'Status',

    statuses: {
        uploaded: 'Uploaded',
        uploading: 'Uploading',
        error: 'Error',
        ready: 'Ready'
    },

   /**
    * Инициализация компонента.
    * @param {Object} config Параметры инициализации.
    */
    initComponent: function (config) {
        var me = this;

        me.nextUpload = function () {
            var me    = this,
                form  = me.up('form'),
                store = me.getStore(),
                index = -1;
            for (var i = 0; i < store.data.items.length; i++) {
                if (!(store.getData().getAt(i).data.status === me.statuses.uploaded)) {
                    store.getData().getAt(i).data.status = me.statuses.uploading;
                    store.getData().getAt(i).commit();
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                me.upload(Ge.url.build(form.router.build('upload')), index);
            }
        };

        me.upload = function (url, i) {
            var me    = this,
                store = me.getStore();
                xhr   = new XMLHttpRequest(),
                fd    = new FormData();
            fd.append("serverTimeDiff", 0);
            xhr.open("POST", url, true);
            fd.append('index', i);
            fd.append('file', store.getData().getAt(i).data.file);
            //xhr.setRequestHeader("Content-Type","multipart/form-data");
            xhr.setRequestHeader('serverTimeDiff', 0);
            var headers = Ge.settings.request.headers;
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            };
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = Ext.decode(xhr.responseText);
                        response = Ge.response.normalize(response);
                    //handle the answer, in order to detect any server side error
                    if (response.success) {
                        store.getData().getAt(i).data.status = me.statuses.uploaded;
                        me.nextUpload();
                    } else {
                        store.getData().getAt(i).data.status = me.statuses.error;
                        Ext.Msg.exception(response, true);
                    }
                    store.getData().getAt(i).commit();
                } else if (xhr.readyState == 4 && xhr.status == 404) {
                    var response = Ext.decode(xhr.responseText);
                    store.getData().getAt(i).data.status = me.statuses.error;
                    store.getData().getAt(i).commit();
                    response = Ge.response.normalize(response);
                    Ext.Msg.exception(response, true);
                }
            };
            // Initiate a multipart/form-data upload
            xhr.send(fd);
        };

        me.addDropZone = function (e) {
            if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                return;
            }
            e.stopEvent();
            me.addCls('drag-over');
        };

        me.removeDropZone = function (e) {
            var el     = e.getTarget(),
                thisEl = me.getEl();
            e.stopEvent();
            if (el === thisEl.dom) {
                me.removeCls('drag-over');
                return;
            }
            while (el !== thisEl.dom && el && el.parentNode) {
                el = el.parentNode;
            }
            if (el === thisEl.dom) {
                me.removeCls('drag-over');
            }
        };

        me.drop = function(e) {
            e.stopEvent();
            Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
                me.getStore().add({
                    file: file,
                    name: file.name,
                    size: file.size,
                    status: me.statuses.ready
                });
            });
            me.removeCls('drag-over');
        };

        /**
         * Обработчик событий списка.
         * @cfg {Object}
         */
         me.listeners = {
            drop: {
                element: 'el',
                fn: me.drop
            },

            dragstart: {
                element: 'el',
                fn: me.addDropZone
            },
    
            dragenter: {
                element: 'el',
                fn: me.addDropZone
            },

            dragover: {
                element: 'el',
                fn: me.addDropZone
            },

            dragleave: {
                element: 'el',
                fn: me.removeDropZone
            },
    
            dragexit: {
                element: 'el',
                fn: me.removeDropZone
            }
         };

        /**
         * Столбцы списка.
         * @cfg {Array}
         */
         me.columns = [{
            header: me.hdColumnName,
            dataIndex: 'name',
            flex: 2
        }, {
            header: me.hdColumnSize,
            dataIndex: 'size',
            flex: 1,
            renderer: Ext.util.Format.fileSize
        }, {
            header: me.hdColumnStatus,
            dataIndex: 'status',
            flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                var color = '#797979';
                if (value === me.statuses.ready) {
                    color = '#3e79b4';
                } else if (value === me.statuses.uploading) {
                    color = '#eab765';
                } else if (value === me.statuses.uploaded) {
                    color = '#217346';
                } else if (value === me.statuses.error) {
                    color = '#cd4c32';
                }
                metaData.tdStyle = 'color:' + color + ";";
                return value;
            }
        }];

        this.tbar = {
            padding: 3,
            ui: 'tools',
            items: []
        };
        this.addBtnUpload();
        this.addBtnClear();

        me.callParent(arguments);
    },

    viewConfig: {
        emptyText: 'Drop Files Here',
        deferEmptyText: false
    },

    store: {
        fields: ['name', 'size', 'file', 'status']
    },

    noop: function(e) {
        e.stopEvent();
    },

    addBtnClear: function () {
        let btn = Ext.applyIf(this.btnClear, {
            text: 'Clear',
            iconCls: 'g-icon-svg g-icon_grid-cleanup_small g-icon_size_button_small',
            ui: 'form-tool',
            margin: '0 1 0 1',
            iconAlign: 'left'
        });
        btn.handler = function () {
            var grid  = this.up('gridpanel');
            grid.getStore().reload();
        }
        this.tbar.items.push(btn);
    },

    addBtnUpload: function () {
        let btn = Ext.applyIf(this.btnUpload, {
            text: 'Upload',
            iconCls: 'g-icon-svg g-icon_grid-add_small g-icon_size_button_small',
            ui: 'form-tool',
            margin: '0 1 0 1',
            iconAlign: 'left'
        });
        btn.handler = function () {
            var grid = this.up('gridpanel');
            grid.nextUpload();
        };
        this.tbar.items.push(btn);
    },

    addBtnRemoveUploaded: function () {
        let btn = Ext.applyIf(this.btnRemoveUploaded, {
            text: 'Remove uploaded',
            iconCls: 'g-icon-svg g-icon_grid-add_small g-icon_size_button_small',
            ui: 'form-tool',
            margin: '0 1 0 1',
            iconAlign: 'left'
        });
        btn.handler = function () {
            var grid  = this.up('gridpanel'),
                store = grid.getStore();
            for (var i = 0; i < store.data.items.length; i++) {
                var record = store.getData().getAt(i);
                if ((record.data.status === grid.statuses.uploaded)) {
                    store.remove(record);
                    i--;
                }
            }
        };
        this.tbar.items.push(btn);
    },

    addBtnRemoveSelected: function () {
        let btn = Ext.applyIf(this.btnRemoveSelected, {
            text: 'Remove uploaded',
            iconCls: 'g-icon-svg g-icon_grid-add_small g-icon_size_button_small',
            ui: 'form-tool',
            margin: '0 1 0 1',
            iconAlign: 'left'
        });
        btn.handler = function () {
            var grid  = this.up('gridpanel'),
                store = grid.getStore();
            store.remove(grid.getSelection());
        };
        this.tbar.items.push(btn);
    }
});
