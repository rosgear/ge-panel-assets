/**
 * Пакет испанской локализации.
 
 * Этот файл является частью GePanel.
 *
 * Copyright (c) 2026 RosGear
 * 
 * Contact: https://rosgear.ru/
 *
 * @author    Anton Tivonenko
 * @copyright (c) 2026, by Anton Tivonenko, anton.tivonenko@rosgear.ru
 * @date      Nov 01, 2026
 * @version   $Id: 1.0 $
 *
 * @license panel-locale.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * development library or toolkit without explicit permission.
 */

Ext.onReady(function(){
    if(Ext.Date) {
        Ext.Date.monthNames = [ 
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        Ext.Date.shortMonthNames = [
            "Enero","Feb","Mar","Abr","Mayo","Jun","Jul","Ago","Sep","Oct","Nov","Dic"
        ];
        Ext.Date.getShortMonthName = function(a){return Ext.Date.shortMonthNames[a]};
        Ext.Date.monthNumbers = {"Enero":0,"Feb":1,"Mar":2,"Abr":3,"Mayo":4,"Jun":5,"Jul":6,"Ago":7,"Sep":8,"Oct":9,"Nov":10,"Dic":11};
        Ext.Date.getMonthNumber = function(a){return Ext.Date.monthNumbers[a.substring(0,1).toUpperCase()+a.substring(1,3).toLowerCase()]};
        Ext.Date.dayNames = [
            "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
        ];
        Ext.Date.getShortDayName = function(a){
            return Ext.Date.dayNames[a].substring(0,3)
        }
    }
    if(Ext.util&&Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator:".",
            decimalSeparator:",",
            currencySign:"\u0440\u0443\u0431",
            dateFormat:"d.m.Y"
        });
    }
});

Ext.define("Ext.locale.ru.view.View",{
    override:"Ext.view.View",
    emptyText:""
});
Ext.define("Ext.locale.ru.grid.plugin.DragDrop",{
    override:"Ext.grid.plugin.DragDrop",
    dragText:"{0} filas seleccionadas"
});
Ext.define("Ext.locale.ru.tab.Tab",{
    override:"Ext.tab.Tab",
    closeText:"Cerrar esta pestaña"
});
Ext.define("Ext.locale.ru.form.field.Base",{
    override:"Ext.form.field.Base",
    invalidText:"El valor en este campo es incorrecto"
});
Ext.define("Ext.locale.ru.view.AbstractView",{
    override:"Ext.view.AbstractView",
    loadingText:"Cargando..."
});
Ext.define("Ext.locale.ru.picker.Date",{
    override:"Ext.picker.Date",
    todayText:"Hoy",
    minText:"Esta fecha es anterior a la fecha mínima",
    maxText:"Esta fecha es posterior a la fecha máxima",
    disabledDaysText:"No disponible",
    disabledDatesText:"No disponible",
    nextText:"El próximo mes (Control+Derecha)",
    prevText:"Mes anterior (Control+Izquierda)",
    monthYearText:"Seleccionar mes (Control+Arriba/Abajo para seleccionar el año)",
    todayTip:"{0} (Espacio)",
    format:"d.m.y",
    startDay:1
});
Ext.define("Ext.locale.ru.picker.Month",{
    override:"Ext.picker.Month",
    okText:"&#160;OK&#160;",
    cancelText:"Cancelar"
});
Ext.define("Ext.locale.ru.toolbar.Paging",{
    override:"Ext.PagingToolbar",
    beforePageText:"Página",
    afterPageText:"de {0}",
    firstText:"Primera página",
    prevText:"Pagina anterior",
    nextText:"Página siguiente",
    lastText:"Última página",
    refreshText:"Actualizar",
    displayMsg:"Mostrando registros de {0} a {1}, total {2}",
    emptyMsg:"No hay datos para mostrar"
});
Ext.define("Ext.locale.ru.form.field.Text",{
    override:"Ext.form.field.Text",
    minLengthText:"La longitud mínima de este campo es {0}",
    maxLengthText:"La longitud máxima de este campo es {0}",
    blankText:"Este campo es obligatorio",
    regexText:"",
    emptyText:null
});
Ext.define("Ext.locale.ru.form.field.Number",{
    override:"Ext.form.field.Number",
    minText:"El valor de este campo no puede ser menor que {0}",
    maxText:"El valor de este campo no puede ser mayor que {0}",
    nanText:"{0} no es un número",
    negativeText:"El valor no puede ser negativo"
});
Ext.define("Ext.locale.ru.form.field.Date",{
    override:"Ext.form.field.Date",
    disabledDaysText:"No disponible",
    disabledDatesText:"No disponible",
    minText:"La fecha en este campo debe ser posterior al {0}",
    maxText:"La fecha en este campo debe ser anterior al {0}",
    invalidText:"{0} no es una fecha válida; la fecha debe tener el formato {1}",
    format:"d.m.y",
    altFormats:"d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});
Ext.define("Ext.locale.ru.form.field.ComboBox",{
    override:"Ext.form.field.ComboBox",
    valueNotFoundText:undefined
}, function(){
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig,{
        loadingText:"Cargando..."
    })
});
Ext.define("Ext.locale.ru.form.field.VTypes",{
    override:"Ext.form.field.VTypes",
    emailText:'Este campo debe contener una dirección de correo electrónico con el formato "usuario@ejemplo.com"',
    urlText:'Este campo debe contener una URL en el formato "http://www.example.com"',
    alphaText:'Este campo debe contener únicamente letras latinas y el carácter de subrayado "_"',
    alphanumText:'Este campo debe contener únicamente letras latinas, números y el carácter de subrayado "_"'
});
Ext.define("Ext.locale.ru.form.field.HtmlEditor",{
    override:"Ext.form.field.HtmlEditor",
    createLinkText:"Por favor ingrese la dirección:"
}, function(){
    Ext.apply(Ext.form.field.HtmlEditor.prototype,{
        buttonTips:{
            bold:{
                title:"Atrevido (Ctrl+B)",
                text:"Aplicar negrita al texto seleccionado.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            italic:{
                title:"Cursiva (Ctrl+I)",
                text:"Aplicar estilo en cursiva al texto seleccionado.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            underline:{
                title:"Testado (Ctrl+U)",
                text:"Subrayar texto seleccionado.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            increasefontsize:{
                title:"aumentar tamaño",
                text:"Aumentar el tamaño de fuente.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            decreasefontsize:{
                title:"Reducir tamaño",
                text:"Disminuir el tamaño de fuente.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            backcolor:{
                title:"Llenar",
                text:"Cambiar el color de fondo del texto o párrafo seleccionado.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            forecolor:{
                title:"Color del texto",
                text:"Cambiar color de texto.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyleft:{
                title:"Alinear texto a la izquierda",
                text:"Alinear texto a la izquierda.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifycenter:{
                title:"Centrado",
                text:"Alinear texto al centro.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyright:{
                title:"Alinear el texto a la derecha",
                text:"Alinear texto a la derecha.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            insertunorderedlist:{
                title:"Marcadores",
                text:"Iniciar lista con viñetas.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"},
                insertorderedlist:{
                    title:"Numeración",
                    text:"Iniciar una lista numerada.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                createlink:{
                    title:"Insertar hipervínculo",
                    text:"Crear un enlace a partir del texto seleccionado.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                sourceedit:{
                    title:"Código fuente",
                    text:"Cambiar al código fuente.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                }
            }
        }
    )
});
Ext.define("Ext.locale.ru.form.Basic",{
    override:"Ext.form.Basic",
    waitTitle:"Espere por favor..."
});
Ext.define("Ext.locale.ru.grid.header.Container",{
    override:"Ext.grid.header.Container",
    sortAscText:"Orden ascendente",
    sortDescText:"Orden descendente",
    lockText:"Congelar columna",
    unlockText:"Descongelar una columna",
    columnsText:"columnas"
});
Ext.define("Ext.locale.ru.grid.GroupingFeature",{
    override:"Ext.grid.feature.Grouping",
    emptyGroupText:"(Vacío)",
    groupByText:"Agrupar por este campo",
    showGroupsText:"Mostrar por grupos"
});
Ext.define("Ext.locale.ru.grid.PropertyColumnModel",{
    override:"Ext.grid.PropertyColumnModel",
    nameText:"Nombre",
    valueText:"Significado",
    dateFormat:"d.m.Y"
});
Ext.define("Ext.locale.ru.window.MessageBox",{
    override:"Ext.window.MessageBox",
    buttonText:{
        ok:"OK",
        cancel:"Cancelar",
        yes:"Sí",
        no:"No"
    }});
Ext.define("Ext.locale.ru.form.field.File",{
    override:"Ext.form.field.File",
    buttonText:"Revisar..."
});
Ext.define("Ext.locale.ru.Component",{
    override:"Ext.Component"
});

Ext.Txt = {
    message: 'Mensaje',
    confirmation: 'Confirmación',
    warning: 'Advertencia',
    error: 'Error',
    errorConnect: 'Error de conexión',
    loading: 'Cargando...',
    waiting: 'Espere por favor...',
    sendErrorReport: '<div class="g-message-box__report">Enviar un error al soporte técnico?</div>',
    serverDidNotAnswer: 'Nuestra solicitud, el servidor no respondió (error del servidor o solicitud perdida).',
    serverErrorConnection: 'Puede ocurrir un error al conectarse al servidor debido a una conexión de red inestable o falta de comunicación con el servidor. Por favor inténtalo de nuevo más tarde.'
};

Ext.define("Ext.locale.ru.grid.locking.Lockable", {
    override: "Ext.grid.locking.Lockable",
    lockText: "Bloquear columna",
    unlockText: "Desbloquear columna (desbloquear)"
});
Ext.define("Ext.locale.ru.grid.filters.Filters", {
    override: "Ext.grid.filters.Filters",
    menuFilterText: "Filtrar"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Boolean", {
    override: "Ext.grid.filters.filter.Boolean",
    yesText: "Sí",
    noText: "No"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Date", {
    override: "Ext.grid.filters.filter.Date",
    config: {
        fields: {
            lt: {
                text: 'A'
            },
            gt: {
                text: 'Después'
            },
            eq: {
                text: 'En'
            }
        },
        // Defaults to Ext.Date.defaultFormat
        dateFormat: null
    }
});
Ext.define("Ext.locale.ru.grid.filters.filter.List", {
    override: "Ext.grid.filters.filter.List",
    loadingText: "Lista"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Number", {
    override: "Ext.grid.filters.filter.Number",
    emptyText: "Introduzca el número"
});
Ext.define("Ext.locale.ru.grid.filters.filter.String", {
    override: "Ext.grid.filters.filter.String",
    emptyText: "Introducir texto"
});
Ext.define("Ext.locale.ru.LoadMask", {
    override: "Ext.LoadMask",
    msg: "Cargando..."
});
Ext.define("Ext.locale.ru.grid.RowEditor", {
    override: "Ext.grid.RowEditor",
    saveBtnText: 'Ok',
    cancelBtnText: 'Cancelar',
    errorsText: 'Error',
    dirtyText: 'Campo requerido'
});
Ext.define("Ext.locale.ru.view.grid.button.Filter", {
    override: "Ge.view.grid.button.Filter",
    applyBtnText: 'Aplicar',
    resetBtnText: 'Reiniciar',
});
Ext.define("Ext.locale.ru.grid.PageSize", {
    override: "Ge.view.plugin.PageSize",
    displayText: 'Publicaciones por página'
});
Ext.define("Ext.locale.ru.view.form.Panel", {
    override: "Ge.view.form.Panel",
    msgFillFields: 'Necesitas completar los campos'
});
