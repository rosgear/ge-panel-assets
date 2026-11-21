/**
 * Пакет польской локализации.
 
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
            "Styczeń","Luty","Marzec","Kwiecień","Móc","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"
        ];
        Ext.Date.shortMonthNames = [
            "Sty","Lut","Mar","Kwi","Móc","Cze","Lip","Sie","Wrz","Paź","Lis","Grud"
        ];
        Ext.Date.getShortMonthName = function(a){return Ext.Date.shortMonthNames[a]};
        Ext.Date.monthNumbers = {"Sty":0,"Lut":1,"Mar":2,"Kwi":3,"Móc":4,"Cze":5,"Lip":6,"Sie":7,"Wrz":8,"Paź":9,"Lis":10,"Grud":11};
        Ext.Date.getMonthNumber = function(a){return Ext.Date.monthNumbers[a.substring(0,1).toUpperCase()+a.substring(1,3).toLowerCase()]};
        Ext.Date.dayNames = [
            "Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"
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
    dragText:"Wybrane wiersze: {0}"
});
Ext.define("Ext.locale.ru.tab.Tab",{
    override:"Ext.tab.Tab",
    closeText:"Zamknij tę kartę"
});
Ext.define("Ext.locale.ru.form.field.Base",{
    override:"Ext.form.field.Base",
    invalidText:"Wartość w tym polu jest nieprawidłowa"
});
Ext.define("Ext.locale.ru.view.AbstractView",{
    override:"Ext.view.AbstractView",
    loadingText:"Załadunek..."
});
Ext.define("Ext.locale.ru.picker.Date",{
    override:"Ext.picker.Date",
    todayText:"Dzisiaj",
    minText:"Data ta jest wcześniejsza niż data minimalna",
    maxText:"Data ta jest późniejsza niż data maksymalna",
    disabledDaysText:"Niedostępne",
    disabledDatesText:"Niedostępne",
    nextText:"Następny miesiąc (Control+Prawo)",
    prevText:"Poprzedni miesiąc (Control+Lewy)",
    monthYearText:"Wybierz miesiąc (Control+Góra/Dół, aby wybrać rok)",
    todayTip:"{0} (Przestrzeń)",
    format:"d.m.y",
    startDay:1
});
Ext.define("Ext.locale.ru.picker.Month",{
    override:"Ext.picker.Month",
    okText:"&#160;OK&#160;",
    cancelText:"Anulować"
});
Ext.define("Ext.locale.ru.toolbar.Paging",{
    override:"Ext.PagingToolbar",
    beforePageText:"Strona",
    afterPageText:"od {0}",
    firstText:"Pierwsza strona",
    prevText:"Poprzednia strona",
    nextText:"Następna strona",
    lastText:"Ostatnia strona",
    refreshText:"Aktualizacja",
    displayMsg:"Wyświetlanie rekordów od {0} do {1}, łącznie {2}",
    emptyMsg:"Brak danych do wyświetlenia"
});
Ext.define("Ext.locale.ru.form.field.Text",{
    override:"Ext.form.field.Text",
    minLengthText:"Minimalna długość tego pola to {0}",
    maxLengthText:"Maksymalna długość tego pola to {0}",
    blankText:"To pole jest wymagane",
    regexText:"",
    emptyText:null
});
Ext.define("Ext.locale.ru.form.field.Number",{
    override:"Ext.form.field.Number",
    minText:"Wartość tego pola nie może być mniejsza niż {0}",
    maxText:"Wartość tego pola nie może być większa niż {0}",
    nanText:"{0} nie jest liczbą",
    negativeText:"Wartość nie może być ujemna"
});
Ext.define("Ext.locale.ru.form.field.Date",{
    override:"Ext.form.field.Date",
    disabledDaysText:"Niedostępne",
    disabledDatesText:"Niedostępne",
    minText:"Data w tym polu musi być późniejsza niż {0}",
    maxText:"Data w tym polu musi być wcześniejsza niż {0}",
    invalidText:"{0} nie jest prawidłową datą - data musi być w formacie {1}",
    format:"d.m.y",
    altFormats:"d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});
Ext.define("Ext.locale.ru.form.field.ComboBox",{
    override:"Ext.form.field.ComboBox",
    valueNotFoundText:undefined
}, function(){
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig,{
        loadingText:"Załadunek..."
    })
});
Ext.define("Ext.locale.ru.form.field.VTypes",{
    override:"Ext.form.field.VTypes",
    emailText:'To pole musi zawierać adres e-mail w formacie "użytkownik@example.com"',
    urlText:'To pole musi zawierać adres URL w formacie "http://www.example.com"',
    alphaText:'To pole może zawierać tylko litery łacińskie i znak podkreślenia "_"',
    alphanumText:'To pole może zawierać tylko litery łacińskie, cyfry i znak podkreślenia "_"'
});
Ext.define("Ext.locale.ru.form.field.HtmlEditor",{
    override:"Ext.form.field.HtmlEditor",
    createLinkText:"Proszę wpisać swój adres:"
}, function(){
    Ext.apply(Ext.form.field.HtmlEditor.prototype,{
        buttonTips:{
            bold:{
                title:"Pogrubiony (Ctrl+B)",
                text:"Zastosuj pogrubienie do zaznaczonego tekstu.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            italic:{
                title:"Kursywa (Ctrl+I)",
                text:"Zastosuj styl kursywy do zaznaczonego tekstu.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            underline:{
                title:"Podkreślone (Ctrl+U)",
                text:"Podkreśl zaznaczony tekst.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            increasefontsize:{
                title:"Zwiększ rozmiar",
                text:"Zwiększ rozmiar czcionki.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            decreasefontsize:{
                title:"Zmniejsz rozmiar",
                text:"Zmniejsz rozmiar czcionki.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            backcolor:{
                title:"Wypełnić",
                text:"Zmień kolor tła zaznaczonego tekstu lub akapitu.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            forecolor:{
                title:"Kolor tekstu",
                text:"Zmień kolor tekstu.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyleft:{
                title:"Wyrównaj tekst do lewej",
                text:"Wyrównaj tekst do lewej.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifycenter:{
                title:"Wyśrodkowany",
                text:"Wyrównanie tekstu do środka.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyright:{
                title:"Wyrównaj tekst do prawej",
                text:"Wyrównanie tekstu do prawej.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            insertunorderedlist:{
                title:"Markery",
                text:"Rozpocznij listę punktowaną.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"},
                insertorderedlist:{
                    title:"Numeracja",
                    text:"Rozpocznij listę numerowaną.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                createlink:{
                    title:"Wstaw hiperłącze",
                    text:"Utwórz link z zaznaczonego tekstu.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                sourceedit:{
                    title:"Kod źródłowy",
                    text:"Przełącz na kod źródłowy.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                }
            }
        }
    )
});
Ext.define("Ext.locale.ru.form.Basic",{
    override:"Ext.form.Basic",
    waitTitle:"Proszę czekać..."
});
Ext.define("Ext.locale.ru.grid.header.Container",{
    override:"Ext.grid.header.Container",
    sortAscText:"Sortuj rosnąco",
    sortDescText:"Sortuj malejąco",
    lockText:"Zamroź kolumnę",
    unlockText:"Odblokuj kolumnę",
    columnsText:"Kolumny"
});
Ext.define("Ext.locale.ru.grid.GroupingFeature",{
    override:"Ext.grid.feature.Grouping",
    emptyGroupText:"(Pusty)",
    groupByText:"Grupuj według tego pola",
    showGroupsText:"Wyświetlanie według grup"
});
Ext.define("Ext.locale.ru.grid.PropertyColumnModel",{
    override:"Ext.grid.PropertyColumnModel",
    nameText:"Nazwa",
    valueText:"Oznaczający",
    dateFormat:"d.m.Y"
});
Ext.define("Ext.locale.ru.window.MessageBox",{
    override:"Ext.window.MessageBox",
    buttonText:{
        ok:"OK",
        cancel:"Anulować",
        yes:"Tak",
        no:"Nie"
    }});
Ext.define("Ext.locale.ru.form.field.File",{
    override:"Ext.form.field.File",
    buttonText:"Recenzja..."
});
Ext.define("Ext.locale.ru.Component",{
    override:"Ext.Component"
});

Ext.Txt = {
    message: 'Wiadomość',
    confirmation: 'Potwierdzenie',
    warning: 'Ostrzeżenie',
    error: 'Błąd',
    errorConnect: 'Błąd połączenia',
    loading: 'Załadunek...',
    waiting: 'Proszę czekać...',
    sendErrorReport: '<div class="g-message-box__report">Wysłać błąd do pomocy technicznej?</div>',
    serverDidNotAnswer: 'Nasze żądanie, serwer nie odpowiedział (błąd serwera lub żądanie utracone).',
    serverErrorConnection: 'Błąd połączenia z serwerem może wystąpić z powodu niestabilnego połączenia sieciowego lub braku komunikacji z serwerem. Spróbuj ponownie później.'
};

Ext.define("Ext.locale.ru.grid.locking.Lockable", {
    override: "Ext.grid.locking.Lockable",
    lockText: "Zablokuj kolumnę",
    unlockText: "Odblokuj kolumnę (odblokuj)"
});
Ext.define("Ext.locale.ru.grid.filters.Filters", {
    override: "Ext.grid.filters.Filters",
    menuFilterText: "Filtr"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Boolean", {
    override: "Ext.grid.filters.filter.Boolean",
    yesText: "Tak",
    noText: "Nie"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Date", {
    override: "Ext.grid.filters.filter.Date",
    config: {
        fields: {
            lt: {
                text: 'Do'
            },
            gt: {
                text: 'Po'
            },
            eq: {
                text: 'Na'
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
    emptyText: "Wpisz numer"
});
Ext.define("Ext.locale.ru.grid.filters.filter.String", {
    override: "Ext.grid.filters.filter.String",
    emptyText: "Wpisz tekst"
});
Ext.define("Ext.locale.ru.LoadMask", {
    override: "Ext.LoadMask",
    msg: "Załadunek..."
});
Ext.define("Ext.locale.ru.grid.RowEditor", {
    override: "Ext.grid.RowEditor",
    saveBtnText: 'Ok',
    cancelBtnText: 'Anulować',
    errorsText: 'Błąd',
    dirtyText: 'Pole wymagane'
});
Ext.define("Ext.locale.ru.view.grid.button.Filter", {
    override: "Ge.view.grid.button.Filter",
    applyBtnText: 'Stosować',
    resetBtnText: 'Nastawić',
});
Ext.define("Ext.locale.ru.grid.PageSize", {
    override: "Ge.view.plugin.PageSize",
    displayText: 'Posty na stronę'
});
Ext.define("Ext.locale.ru.view.form.Panel", {
    override: "Ge.view.form.Panel",
    msgFillFields: 'Musisz wypełnić pola'
});
