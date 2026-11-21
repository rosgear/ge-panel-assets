/**
 * Пакет немецкой локализации.
 
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
            "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        Ext.Date.shortMonthNames = [
            "Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"
        ];
        Ext.Date.getShortMonthName = function(a){return Ext.Date.shortMonthNames[a]};
        Ext.Date.monthNumbers = {"Jan":0,"Feb":1,"Mär":2,"Apr":3,"Mai":4,"Jun":5,"Jul":6,"Aug":7,"Sep":8,"Okt":9,"Nov":10,"Dez":11};
        Ext.Date.getMonthNumber = function(a){return Ext.Date.monthNumbers[a.substring(0,1).toUpperCase()+a.substring(1,3).toLowerCase()]};
        Ext.Date.dayNames = [
            "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
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
    dragText:"{0} ausgewählte Zeilen"
});
Ext.define("Ext.locale.ru.tab.Tab",{
    override:"Ext.tab.Tab",
    closeText:"Schließen Sie diese Registerkarte"
});
Ext.define("Ext.locale.ru.form.field.Base",{
    override:"Ext.form.field.Base",
    invalidText:"Der Wert in diesem Feld ist falsch"
});
Ext.define("Ext.locale.ru.view.AbstractView",{
    override:"Ext.view.AbstractView",
    loadingText:"Laden..."
});
Ext.define("Ext.locale.ru.picker.Date",{
    override:"Ext.picker.Date",
    todayText:"Heute",
    minText:"Dieses Datum liegt vor dem Mindestdatum",
    maxText:"Dieses Datum liegt nach dem Höchstdatum",
    disabledDaysText:"Nicht verfügbar",
    disabledDatesText:"Nicht verfügbar",
    nextText:"Nächster Monat (Strg+Rechts)",
    prevText:"Vorheriger Monat (Strg+Links)",
    monthYearText:"Monat auswählen (Strg+Auf/Ab, um Jahr auszuwählen)",
    todayTip:"{0} (Raum)",
    format:"d.m.y",
    startDay:1
});
Ext.define("Ext.locale.ru.picker.Month",{
    override:"Ext.picker.Month",
    okText:"&#160;OK&#160;",
    cancelText:"Stornieren"
});
Ext.define("Ext.locale.ru.toolbar.Paging",{
    override:"Ext.PagingToolbar",
    beforePageText:"Seite",
    afterPageText:"von {0}",
    firstText:"Erste Seite",
    prevText:"Vorherige Seite",
    nextText:"Nächste Seite",
    lastText:"Letzte Seite",
    refreshText:"Aktualisieren",
    displayMsg:"Es werden Datensätze von {0} bis {1} angezeigt, insgesamt {2}",
    emptyMsg:"Keine Daten zum Anzeigen"
});
Ext.define("Ext.locale.ru.form.field.Text",{
    override:"Ext.form.field.Text",
    minLengthText:"Die Mindestlänge dieses Feldes beträgt {0}",
    maxLengthText:"Die maximale Länge dieses Feldes beträgt {0}",
    blankText:"Dieses Feld ist erforderlich",
    regexText:"",
    emptyText:null
});
Ext.define("Ext.locale.ru.form.field.Number",{
    override:"Ext.form.field.Number",
    minText:"Der Wert dieses Feldes darf nicht kleiner als {0} sein",
    maxText:"Der Wert dieses Feldes darf nicht größer als {0} sein",
    nanText:"{0} ist keine Zahl",
    negativeText:"Der Wert darf nicht negativ sein"
});
Ext.define("Ext.locale.ru.form.field.Date",{
    override:"Ext.form.field.Date",
    disabledDaysText:"Nicht verfügbar",
    disabledDatesText:"Nicht verfügbar",
    minText:"Das Datum in diesem Feld muss nach {0} liegen",
    maxText:"Das Datum in diesem Feld muss vor {0} liegen",
    invalidText:"{0} ist kein gültiges Datum. Das Datum muss im Format {1} vorliegen",
    format:"d.m.y",
    altFormats:"d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});
Ext.define("Ext.locale.ru.form.field.ComboBox",{
    override:"Ext.form.field.ComboBox",
    valueNotFoundText:undefined
}, function(){
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig,{
        loadingText:"Laden..."
    })
});
Ext.define("Ext.locale.ru.form.field.VTypes",{
    override:"Ext.form.field.VTypes",
    emailText:'Dieses Feld muss eine E-Mail-Adresse im Format „user@example.com“ enthalten',
    urlText:'Dieses Feld muss eine URL im Format enthalten "http://www.example.com"',
    alphaText:'Dieses Feld darf nur lateinische Buchstaben und den Unterstrich "_" enthalten',
    alphanumText:'Dieses Feld darf nur lateinische Buchstaben, Zahlen und den Unterstrich "_" enthalten'
});
Ext.define("Ext.locale.ru.form.field.HtmlEditor",{
    override:"Ext.form.field.HtmlEditor",
    createLinkText:"Bitte geben Sie Ihre Adresse ein:"
}, function(){
    Ext.apply(Ext.form.field.HtmlEditor.prototype,{
        buttonTips:{
            bold:{
                title:"Deutlich (Ctrl+B)",
                text:"Wenden Sie Fettschrift auf den ausgewählten Text an.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            italic:{
                title:"Kursivschrift (Ctrl+I)",
                text:"Wenden Sie Kursivschrift auf den ausgewählten Text an.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            underline:{
                title:"Unterstrichen (Ctrl+U)",
                text:"Markierten Text unterstreichen.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            increasefontsize:{
                title:"Größe vergrößern",
                text:"Schriftgröße erhöhen.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            decreasefontsize:{
                title:"Größe reduzieren",
                text:"Schriftgröße verringern.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            backcolor:{
                title:"Füllen",
                text:"Ändern Sie die Hintergrundfarbe des ausgewählten Texts oder Absatzes.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            forecolor:{
                title:"Textfarbe",
                text:"Textfarbe ändern.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyleft:{
                title:"Text linksbündig ausrichten",
                text:"Text linksbündig ausrichten.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifycenter:{
                title:"Zentriert",
                text:"Text zentriert ausrichten.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyright:{
                title:"Text richtig ausrichten",
                text:"Text rechtsbündig ausrichten.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            insertunorderedlist:{
                title:"Markierungen",
                text:"Beginnen Sie mit der Aufzählungsliste.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"},
                insertorderedlist:{
                    title:"Nummerierung",
                    text:"Starten Sie eine nummerierte Liste.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                createlink:{
                    title:"Hyperlink einfügen",
                    text:"Erstellen Sie einen Link aus ausgewähltem Text.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                sourceedit:{
                    title:"Quellcode",
                    text:"Wechseln Sie zum Quellcode.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                }
            }
        }
    )
});
Ext.define("Ext.locale.ru.form.Basic",{
    override:"Ext.form.Basic",
    waitTitle:"Bitte warten..."
});
Ext.define("Ext.locale.ru.grid.header.Container",{
    override:"Ext.grid.header.Container",
    sortAscText:"Aufsteigend sortieren",
    sortDescText:"Absteigend sortieren",
    lockText:"Spalte einfrieren",
    unlockText:"Eine spalte freigeben",
    columnsText:"Spalten"
});
Ext.define("Ext.locale.ru.grid.GroupingFeature",{
    override:"Ext.grid.feature.Grouping",
    emptyGroupText:"(Leer)",
    groupByText:"Nach diesem feld gruppieren",
    showGroupsText:"Anzeige nach gruppen"
});
Ext.define("Ext.locale.ru.grid.PropertyColumnModel",{
    override:"Ext.grid.PropertyColumnModel",
    nameText:"Name",
    valueText:"Bedeutung",
    dateFormat:"d.m.Y"
});
Ext.define("Ext.locale.ru.window.MessageBox",{
    override:"Ext.window.MessageBox",
    buttonText:{
        ok:"OK",
        cancel:"Stornieren",
        yes:"Ja",
        no:"NEIN"
    }});
Ext.define("Ext.locale.ru.form.field.File",{
    override:"Ext.form.field.File",
    buttonText:"Rezension..."
});
Ext.define("Ext.locale.ru.Component",{
    override:"Ext.Component"
});

Ext.Txt = {
    message: 'Nachricht',
    confirmation: 'Bestätigung',
    warning: 'Warnung',
    error: 'Fehler',
    errorConnect: 'Verbindungsfehler',
    loading: 'Laden...',
    waiting: 'Bitte warten...',
    sendErrorReport: '<div class="g-message-box__report">Senden Sie einen Fehler an den technischen Support?</div>',
    serverDidNotAnswer: 'Auf unsere anfrage hat der server nicht geantwortet (serverfehler oder anfrage verloren).',
    serverErrorConnection: 'Aufgrund einer instabilen netzwerkverbindung oder mangelnder kommunikation mit dem server kann ein Fehler beim herstellen der verbindung zum server auftreten. Bitte versuchen Sie es später noch einmal.'
};

Ext.define("Ext.locale.ru.grid.locking.Lockable", {
    override: "Ext.grid.locking.Lockable",
    lockText: "Spalte sperren",
    unlockText: "Spalte entsperren (unlock)"
});
Ext.define("Ext.locale.ru.grid.filters.Filters", {
    override: "Ext.grid.filters.Filters",
    menuFilterText: "Filter"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Boolean", {
    override: "Ext.grid.filters.filter.Boolean",
    yesText: "Ja",
    noText: "NEIN"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Date", {
    override: "Ext.grid.filters.filter.Date",
    config: {
        fields: {
            lt: {
                text: 'Zu'
            },
            gt: {
                text: 'Nach'
            },
            eq: {
                text: 'An'
            }
        },
        // Defaults to Ext.Date.defaultFormat
        dateFormat: null
    }
});
Ext.define("Ext.locale.ru.grid.filters.filter.List", {
    override: "Ext.grid.filters.filter.List",
    loadingText: "Liste"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Number", {
    override: "Ext.grid.filters.filter.Number",
    emptyText: "Nummer eingeben"
});
Ext.define("Ext.locale.ru.grid.filters.filter.String", {
    override: "Ext.grid.filters.filter.String",
    emptyText: "Geben Sie Text ein"
});
Ext.define("Ext.locale.ru.LoadMask", {
    override: "Ext.LoadMask",
    msg: "Laden..."
});
Ext.define("Ext.locale.ru.grid.RowEditor", {
    override: "Ext.grid.RowEditor",
    saveBtnText: 'Ok',
    cancelBtnText: 'Stornieren',
    errorsText: 'Fehler',
    dirtyText: 'Feld erforderlich'
});
Ext.define("Ext.locale.ru.view.grid.button.Filter", {
    override: "Ge.view.grid.button.Filter",
    applyBtnText: 'Anwenden',
    resetBtnText: 'Zurücksetzen',
});
Ext.define("Ext.locale.ru.grid.PageSize", {
    override: "Ge.view.plugin.PageSize",
    displayText: 'Beiträge pro Seite'
});
Ext.define("Ext.locale.ru.view.form.Panel", {
    override: "Ge.view.form.Panel",
    msgFillFields: 'Sie müssen die Felder ausfüllen'
});
