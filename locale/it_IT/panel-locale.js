/**
 * Пакет итальянской локализации.
 
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
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
        ];
        Ext.Date.shortMonthNames = [
            "Gen","Feb","Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dic"
        ];
        Ext.Date.getShortMonthName = function(a){return Ext.Date.shortMonthNames[a]};
        Ext.Date.monthNumbers = {"Gen":0,"Feb":1,"Marzo":2,"Aprile":3,"Maggio":4,"Giugno":5,"Luglio":6,"Agosto":7,"Settembre":8,"Ottobre":9,"Novembre":10,"Dic":11};
        Ext.Date.getMonthNumber = function(a){return Ext.Date.monthNumbers[a.substring(0,1).toUpperCase()+a.substring(1,3).toLowerCase()]};
        Ext.Date.dayNames = [
            "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"
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
    dragText:"{0} righe selezionate"
});
Ext.define("Ext.locale.ru.tab.Tab",{
    override:"Ext.tab.Tab",
    closeText:"Chiudi questa scheda"
});
Ext.define("Ext.locale.ru.form.field.Base",{
    override:"Ext.form.field.Base",
    invalidText:"Il valore in questo campo non è valido"
});
Ext.define("Ext.locale.ru.view.AbstractView",{
    override:"Ext.view.AbstractView",
    loadingText:"Caricamento..."
});
Ext.define("Ext.locale.ru.picker.Date",{
    override:"Ext.picker.Date",
    todayText:"Oggi",
    minText:"Questa data è precedente alla data minima",
    maxText:"Questa data è successiva alla data massima",
    disabledDaysText:"Non disponibile",
    disabledDatesText:"Non disponibile",
    nextText:"Il mese prossimo (Ctrl+Destra)",
    prevText:"Mese precedente (Control+Sinistra)",
    monthYearText:"Seleziona mese (Control+Su/Giù per selezionare l'anno)",
    todayTip:"{0} (Spazio)",
    format:"d.m.y",
    startDay:1
});
Ext.define("Ext.locale.ru.picker.Month",{
    override:"Ext.picker.Month",
    okText:"&#160;OK&#160;",
    cancelText:"Cancellare"
});
Ext.define("Ext.locale.ru.toolbar.Paging",{
    override:"Ext.PagingToolbar",
    beforePageText:"Pagina",
    afterPageText:"da {0}",
    firstText:"Prima pagina",
    prevText:"Pagina precedente",
    nextText:"Pagina successiva",
    lastText:"Ultima pagina",
    refreshText:"Aggiornamento",
    displayMsg:"Visualizzazione dei record da {0} a {1}, totale {2}",
    emptyMsg:"Nessun dato da visualizzare"
});
Ext.define("Ext.locale.ru.form.field.Text",{
    override:"Ext.form.field.Text",
    minLengthText:"La lunghezza minima di questo campo è {0}",
    maxLengthText:"La lunghezza massima di questo campo è {0}",
    blankText:"Questo campo è obbligatorio",
    regexText:"",
    emptyText:null
});
Ext.define("Ext.locale.ru.form.field.Number",{
    override:"Ext.form.field.Number",
    minText:"Il valore di questo campo non può essere inferiore a {0}",
    maxText:"Il valore di questo campo non può essere maggiore di {0}",
    nanText:"{0} non è un numero",
    negativeText:"Il valore non può essere negativo"
});
Ext.define("Ext.locale.ru.form.field.Date",{
    override:"Ext.form.field.Date",
    disabledDaysText:"Non disponibile",
    disabledDatesText:"Non disponibile",
    minText:"La data in questo campo deve essere successiva a {0}",
    maxText:"La data in questo campo deve essere precedente a {0}",
    invalidText:"{0} non è una data valida: la data deve essere nel formato {1}",
    format:"d.m.y",
    altFormats:"d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});
Ext.define("Ext.locale.ru.form.field.ComboBox",{
    override:"Ext.form.field.ComboBox",
    valueNotFoundText:undefined
}, function(){
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig,{
        loadingText:"Caricamento..."
    })
});
Ext.define("Ext.locale.ru.form.field.VTypes",{
    override:"Ext.form.field.VTypes",
    emailText:'Questo campo deve contenere un indirizzo email nel formato "utente@esempio.com"',
    urlText:'Questo campo deve contenere un URL nel formato "http://www.example.com"',
    alphaText:'Questo campo deve contenere solo lettere latine e il carattere di sottolineatura "_"',
    alphanumText:'Questo campo deve contenere solo lettere latine, numeri e il carattere di sottolineatura "_"'
});
Ext.define("Ext.locale.ru.form.field.HtmlEditor",{
    override:"Ext.form.field.HtmlEditor",
    createLinkText:"Inserisci l'indirizzo:"
}, function(){
    Ext.apply(Ext.form.field.HtmlEditor.prototype,{
        buttonTips:{
            bold:{
                title:"Grassetto (Ctrl+B)",
                text:"Applica il grassetto al testo selezionato.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            italic:{
                title:"Corsivo (Ctrl+I)",
                text:"Applica lo stile corsivo al testo selezionato.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            underline:{
                title:"Sottolineato (Ctrl+U)",
                text:"Sottolinea il testo selezionato.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            increasefontsize:{
                title:"Aumenta le dimensioni",
                text:"Aumenta la dimensione del carattere.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            decreasefontsize:{
                title:"Ridurre le dimensioni",
                text:"Diminuisci la dimensione del carattere.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            backcolor:{
                title:"Riempire",
                text:"Cambia il colore di sfondo del testo o del paragrafo selezionato.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            forecolor:{
                title:"Colore del testo",
                text:"Cambia il colore del testo.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyleft:{
                title:"Allinea il testo a sinistra",
                text:"Allinea il testo a sinistra.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifycenter:{
                title:"Centrato",
                text:"Allineamento del testo al centro.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyright:{
                title:"Allinea il testo a destra",
                text:"Allineamento del testo a destra.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            insertunorderedlist:{
                title:"Marcatori",
                text:"Inizia l'elenco puntato.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"},
                insertorderedlist:{
                    title:"Numerazione",
                    text:"Inizia un elenco numerato.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                createlink:{
                    title:"Inserisci collegamento ipertestuale",
                    text:"Crea un collegamento dal testo selezionato.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                sourceedit:{
                    title:"Codice sorgente",
                    text:"Passa al codice sorgente.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                }
            }
        }
    )
});
Ext.define("Ext.locale.ru.form.Basic",{
    override:"Ext.form.Basic",
    waitTitle:"attendere prego..."
});
Ext.define("Ext.locale.ru.grid.header.Container",{
    override:"Ext.grid.header.Container",
    sortAscText:"Ordinamento crescente",
    sortDescText:"Ordina discendente",
    lockText:"Blocca colonna",
    unlockText:"Sblocca una colonna",
    columnsText:"Colonne"
});
Ext.define("Ext.locale.ru.grid.GroupingFeature",{
    override:"Ext.grid.feature.Grouping",
    emptyGroupText:"(Vuoto)",
    groupByText:"Raggruppa per questo campo",
    showGroupsText:"Visualizzazione per gruppi"
});
Ext.define("Ext.locale.ru.grid.PropertyColumnModel",{
    override:"Ext.grid.PropertyColumnModel",
    nameText:"Nome",
    valueText:"Senso",
    dateFormat:"d.m.Y"
});
Ext.define("Ext.locale.ru.window.MessageBox",{
    override:"Ext.window.MessageBox",
    buttonText:{
        ok:"OK",
        cancel:"Cancellare",
        yes:"SÌ",
        no:"NO"
    }});
Ext.define("Ext.locale.ru.form.field.File",{
    override:"Ext.form.field.File",
    buttonText:"Revisione..."
});
Ext.define("Ext.locale.ru.Component",{
    override:"Ext.Component"
});

Ext.Txt = {
    message: 'Messaggio',
    confirmation: 'Conferma',
    warning: 'Avvertimento',
    error: 'Errore',
    errorConnect: 'Errore di connessione',
    loading: 'Caricamento...',
    waiting: 'attendere prego...',
    sendErrorReport: '<div class="g-message-box__report">Inviare un bug al supporto tecnico?</div>',
    serverDidNotAnswer: 'Alla nostra richiesta, il server non ha risposto (errore del server o richiesta persa).',
    serverErrorConnection: 'Potrebbe verificarsi un errore di connessione al server a causa di una connessione di rete instabile o della mancanza di comunicazione con il server. Per favore riprova più tardi.'
};

Ext.define("Ext.locale.ru.grid.locking.Lockable", {
    override: "Ext.grid.locking.Lockable",
    lockText: "Blocca colonna",
    unlockText: "Sblocca colonna (sblocca)"
});
Ext.define("Ext.locale.ru.grid.filters.Filters", {
    override: "Ext.grid.filters.Filters",
    menuFilterText: "Filtro"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Boolean", {
    override: "Ext.grid.filters.filter.Boolean",
    yesText: "SÌ",
    noText: "NO"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Date", {
    override: "Ext.grid.filters.filter.Date",
    config: {
        fields: {
            lt: {
                text: 'A'
            },
            gt: {
                text: 'Dopo'
            },
            eq: {
                text: 'SU'
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
    emptyText: "Inserisci il numero"
});
Ext.define("Ext.locale.ru.grid.filters.filter.String", {
    override: "Ext.grid.filters.filter.String",
    emptyText: "Inserisci il testo"
});
Ext.define("Ext.locale.ru.LoadMask", {
    override: "Ext.LoadMask",
    msg: "Caricamento..."
});
Ext.define("Ext.locale.ru.grid.RowEditor", {
    override: "Ext.grid.RowEditor",
    saveBtnText: 'Ok',
    cancelBtnText: 'Cancellare',
    errorsText: 'Errore',
    dirtyText: 'Campo obbligatorio'
});
Ext.define("Ext.locale.ru.view.grid.button.Filter", {
    override: "Ge.view.grid.button.Filter",
    applyBtnText: 'Fare domanda a',
    resetBtnText: 'Reset',
});
Ext.define("Ext.locale.ru.grid.PageSize", {
    override: "Ge.view.plugin.PageSize",
    displayText: 'Post per pagina'
});
Ext.define("Ext.locale.ru.view.form.Panel", {
    override: "Ge.view.form.Panel",
    msgFillFields: 'È necessario compilare i campi'
});
