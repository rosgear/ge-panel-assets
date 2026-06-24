/**
 * This componet handles icon upload along with preview and drag drop.
 * Usage: include it as xtype: 'imageuploadfield', including this field in a form requires us to submit it via a method submitWithImage instead of submit.
 */

Ext.define('Ge.view.form.field.Image', {
    alias: 'widget.imageuploadfield',
    extend: 'Ext.form.FieldContainer',
    xtype: 'g-field-image',

    /**
     * @cfg {Sting} title of the fieldset which includes this field
     */

    title: 'Choose an image',

    /**
     * @cfg {String} text of the button, which is one of the ways to choose image
     */
    buttonText: 'Choose image',

    /**
     * @cfg {String} name of the params which contained the image. This is will be used to process the image in the server side
     */
    name: 'image',

    /**
     * @cfg {String} src of preview image
     */
    previewImageSrc: null,

    /**
     * @cfg {Boolean} width of image
     */
    imageWidth: 64,

    /**
     * @cfg {Boolean} height of image
     */
    imageHeight: 64,

    /**
     * text to be displayed in the drag area
     */
    dragAreaText: 'Drop an image here',

    initComponent: function () {
        var me = this;

        var upLoadButton = {
            xtype: 'fileuploadfield',
            //ui: 'button-red',
            inputId: 'fileuploadfield_' + me.id,
            layout: me.layout,
            allowBlank: me.allowBlank,
            buttonText: me.buttonText,
            buttonOnly: true,
            listeners: {
                change: (input, value, opts) => {
                    let canvas = Ext.ComponentQuery.query('image[canvas="' + input.inputId + '"]')[0],
                        file = input.getEl().down('input[type=file]').dom.files[0];
                    me.attachImage(file, canvas);
                }
            }
        };

        var previewImage = { 
            xtype: 'image',
            frame: true,
            canvas: upLoadButton.inputId,
            width: me.imageWidth,
            height: me.imageHeight,
            animate: 2000,
            hidden: true, // initially hidden
            scope: this
        };

        if (!Ext.isEmpty(me.previewImageSrc)) {
            // if an existing value
            previewImage.src = me.previewImageSrc;
            previewImage.hidden = false;
        }

        me.dropTargetId = 'droptaget-' + (me.itemId || Math.random().toString());

        var dropTarget = {
            xtype: 'label',
            html: '<div class="drop-target"' + 'id=' + '\'' + me.dropTargetId + '\'' + ' style="disblay:block;height:100%;">' + me.dragAreaText + '</div>'
        };

        me.on('afterrender', function (e) {
            var previewImage = me.down('image');
            if (!me.previewImageSrc){
                previewImage.setSrc('');
            }
                
            var dropWindow = document.getElementById(me.dropTargetId),
                form = me.up('form');
            dropWindow.addEventListener('dragenter', function (e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'none';
            }, false);

            dropWindow.addEventListener('dragover', function (e) {
                e.preventDefault();
                dropWindow.classList.add('drop-target-hover');
            });

            dropWindow.addEventListener('drop', function (e) {
                e.preventDefault();
                dropWindow.classList.remove('drop-target-hover');
                var file = e.dataTransfer.files[0],
                    canvas = Ext.ComponentQuery.query('image[canvas="' + previewImage.canvas + '"]')[0];
                me.attachImage(file, canvas);
            }, false);


            dropWindow.addEventListener('dragleave', (e) => { dropWindow.classList.remove('drop-target-hover'); }, false);
        });


        var fileUploadFieldSet = {
            xtype: 'fieldset',
            layout: 'column',
            title: me.title,
            style: {
                marginRight: '10px'
            },
            items: [
                {
                    columnWidth: 0.5,
                    items: [dropTarget, upLoadButton]
                },
                {
                    columnWidth: 0.5,
                    items: [previewImage]
                }
            ]
        };


        me.items = [fileUploadFieldSet];
        me.callParent(arguments);
    },

    attachImage: function (file, canvas) {
        let me = this, form = me.up('form');

        if (file.type == "image/jpeg" ||
            file.type == "image/jpg" ||
            file.type == "image/png" ||
            file.type == "image/gif" ||
            file.type == "image/ico") {

            if (!form.uploadableImages) form.uploadableImages = [];
            form.uploadableImages.push({imageKey: me.name, imageFile: file});

            let reader = new FileReader();
            reader.onload = (e) => canvas.setSrc(e.target.result);
            reader.readAsDataURL(file);
            canvas.show();
        } else
            Ext.Msg.alert('Error', 'Only images please, supported files are jpeg,jpg,png,gif,ico');
    }
});



