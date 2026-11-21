/**
 * Пакет турецкой локализации.
 
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
            "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
        ];
        Ext.Date.shortMonthNames = [
            "Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"
        ];
        Ext.Date.getShortMonthName = function(a){return Ext.Date.shortMonthNames[a]};
        Ext.Date.monthNumbers = {"Oca":0,"Şub":1,"Mar":2,"Nis":3,"May":4,"Haz":5,"Tem":6,"Ağu":7,"Eyl":8,"Eki":9,"Kas":10,"Ara":11};
        Ext.Date.getMonthNumber = function(a){return Ext.Date.monthNumbers[a.substring(0,1).toUpperCase()+a.substring(1,3).toLowerCase()]};
        Ext.Date.dayNames = [
            "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
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
    dragText:"{0} seçili satır"
});
Ext.define("Ext.locale.ru.tab.Tab",{
    override:"Ext.tab.Tab",
    closeText:"Bu sekmeyi kapat"
});
Ext.define("Ext.locale.ru.form.field.Base",{
    override:"Ext.form.field.Base",
    invalidText:"Bu alandaki değer yanlış"
});
Ext.define("Ext.locale.ru.view.AbstractView",{
    override:"Ext.view.AbstractView",
    loadingText:"Yükleniyor..."
});
Ext.define("Ext.locale.ru.picker.Date",{
    override:"Ext.picker.Date",
    todayText:"Bugün",
    minText:"Bu tarih minimum tarihten öncedir",
    maxText:"Bu tarih maksimum tarihten sonradır",
    disabledDaysText:"Müsait değil",
    disabledDatesText:"Müsait değil",
    nextText:"Gelecek ay (Kontrol+Sağ)",
    prevText:"Önceki ay (Kontrol+Sol)",
    monthYearText:"Ayı seçin (Yıl seçmek için Kontrol+Yukarı/Aşağı)",
    todayTip:"{0} (Uzay)",
    format:"d.m.y",
    startDay:1
});
Ext.define("Ext.locale.ru.picker.Month",{
    override:"Ext.picker.Month",
    okText:"&#160;OK&#160;",
    cancelText:"İptal etmek"
});
Ext.define("Ext.locale.ru.toolbar.Paging",{
    override:"Ext.PagingToolbar",
    beforePageText:"Sayfa",
    afterPageText:"{0}'dan itibaren",
    firstText:"İlk sayfa",
    prevText:"Önceki sayfa",
    nextText:"Sonraki sayfa",
    lastText:"Son sayfa",
    refreshText:"Güncelleme",
    displayMsg:"{0} ile {1} arasındaki kayıtlar görüntüleniyor, toplam {2}",
    emptyMsg:"Görüntülenecek veri yok"
});
Ext.define("Ext.locale.ru.form.field.Text",{
    override:"Ext.form.field.Text",
    minLengthText:"Bu alanın minimum uzunluğu {0}",
    maxLengthText:"Bu alanın maksimum uzunluğu {0}",
    blankText:"Bu alan zorunludur",
    regexText:"",
    emptyText:null
});
Ext.define("Ext.locale.ru.form.field.Number",{
    override:"Ext.form.field.Number",
    minText:"Bu alanın değeri {0}'dan küçük olamaz",
    maxText:"Bu alanın değeri {0}'dan büyük olamaz",
    nanText:"{0} bir sayı değil",
    negativeText:"Değer negatif olamaz"
});
Ext.define("Ext.locale.ru.form.field.Date",{
    override:"Ext.form.field.Date",
    disabledDaysText:"Müsait değil",
    disabledDatesText:"Müsait değil",
    minText:"Bu alandaki tarih {0} tarihinden sonra olmalıdır",
    maxText:"Bu alandaki tarih {0} tarihinden önce olmalıdır",
    invalidText:"{0} geçerli bir tarih değil; tarih, {1} biçiminde olmalıdır",
    format:"d.m.y",
    altFormats:"d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});
Ext.define("Ext.locale.ru.form.field.ComboBox",{
    override:"Ext.form.field.ComboBox",
    valueNotFoundText:undefined
}, function(){
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig,{
        loadingText:"Yükleniyor..."
    })
});
Ext.define("Ext.locale.ru.form.field.VTypes",{
    override:"Ext.form.field.VTypes",
    emailText:'Bu alan "kullanici@example.com" biçiminde bir e-posta adresi içermelidir',
    urlText:'Bu alan "http://www.example.com" biçiminde bir URL içermelidir."',
    alphaText:'Bu alan yalnızca Latin harfleri ve alt çizgi karakteri "_" içermelidir',
    alphanumText:'Bu alan yalnızca Latin harfleri, rakamları ve alt çizgi karakteri "_" içermelidir'
});
Ext.define("Ext.locale.ru.form.field.HtmlEditor",{
    override:"Ext.form.field.HtmlEditor",
    createLinkText:"Lütfen adresi girin:"
}, function(){
    Ext.apply(Ext.form.field.HtmlEditor.prototype,{
        buttonTips:{
            bold:{
                title:"Gözü pek (Ctrl+B)",
                text:"Seçilen metne kalın uygula.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            italic:{
                title:"İtalik (Ctrl+I)",
                text:"Seçili metne italik stili uygula.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            underline:{
                title:"Altı çizili (Ctrl+U)",
                text:"Seçilen metnin altını çiz.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            increasefontsize:{
                title:"Boyutu artır",
                text:"Yazı tipi boyutunu artır.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            decreasefontsize:{
                title:"Boyutu azalt",
                text:"Yazı tipi boyutunu azalt.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            backcolor:{
                title:"Doldurmak",
                text:"Seçilen metnin veya paragrafın arka plan rengini değiştirme.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            forecolor:{
                title:"Metin rengi",
                text:"Metin rengini değiştir.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyleft:{
                title:"Metni sola hizala",
                text:"Metni sola hizala.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifycenter:{
                title:"Ortalanmış",
                text:"Metni merkeze hizalama.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            justifyright:{
                title:"Metni sağa hizala",
                text:"Metni sağa hizalama.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"
            },
            insertunorderedlist:{
                title:"İşaretleyiciler",
                text:"Madde işaretli listeyi başlat.",
                cls:Ext.baseCSSPrefix+"html-editor-tip"},
                insertorderedlist:{
                    title:"Numaralama",
                    text:"Numaralandırılmış bir liste başlatın.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                createlink:{
                    title:"Köprü ekle",
                    text:"Seçilen metinden bağlantı oluştur.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                },
                sourceedit:{
                    title:"Kaynak kodu",
                    text:"Kaynak koduna geç.",
                    cls:Ext.baseCSSPrefix+"html-editor-tip"
                }
            }
        }
    )
});
Ext.define("Ext.locale.ru.form.Basic",{
    override:"Ext.form.Basic",
    waitTitle:"Lütfen bekleyin..."
});
Ext.define("Ext.locale.ru.grid.header.Container",{
    override:"Ext.grid.header.Container",
    sortAscText:"Artan Sıralama",
    sortDescText:"Azalan sıralama",
    lockText:"Sütunu Dondur",
    unlockText:"Bir sütunu çözme",
    columnsText:"Sütunlar"
});
Ext.define("Ext.locale.ru.grid.GroupingFeature",{
    override:"Ext.grid.feature.Grouping",
    emptyGroupText:"(Boş)",
    groupByText:"Bu alana göre gruplandır",
    showGroupsText:"Gruplara göre görüntüle"
});
Ext.define("Ext.locale.ru.grid.PropertyColumnModel",{
    override:"Ext.grid.PropertyColumnModel",
    nameText:"İsim",
    valueText:"Anlam",
    dateFormat:"d.m.Y"
});
Ext.define("Ext.locale.ru.window.MessageBox",{
    override:"Ext.window.MessageBox",
    buttonText:{
        ok:"OK",
        cancel:"İptal etmek",
        yes:"Evet",
        no:"Hayir"
    }});
Ext.define("Ext.locale.ru.form.field.File",{
    override:"Ext.form.field.File",
    buttonText:"Gözden geçirmek..."
});
Ext.define("Ext.locale.ru.Component",{
    override:"Ext.Component"
});

Ext.Txt = {
    message: 'Mesaj',
    confirmation: 'Onay',
    warning: 'Uyarı',
    error: 'Hata',
    errorConnect: 'Bağlantı hatası',
    loading: 'Yükleniyor...',
    waiting: 'Lütfen bekleyin...',
    sendErrorReport: '<div class="g-message-box__report">Teknik desteğe bir hata gönderin?</div>',
    serverDidNotAnswer: 'İsteğimiz, sunucu yanıt vermedi (sunucu hatası veya istek kaybı).',
    serverErrorConnection: 'Kararsız bir ağ bağlantısı veya sunucuyla iletişim eksikliği nedeniyle sunucuya bağlanırken bir hata meydana gelebilir. Lütfen daha sonra tekrar deneyin.'
};

Ext.define("Ext.locale.ru.grid.locking.Lockable", {
    override: "Ext.grid.locking.Lockable",
    lockText: "Sütunu kilitle",
    unlockText: "Sütunun kilidini aç (kilidini aç)"
});
Ext.define("Ext.locale.ru.grid.filters.Filters", {
    override: "Ext.grid.filters.Filters",
    menuFilterText: "Filtre"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Boolean", {
    override: "Ext.grid.filters.filter.Boolean",
    yesText: "Evet",
    noText: "Hayir"
});
Ext.define("Ext.locale.ru.grid.filters.filter.Date", {
    override: "Ext.grid.filters.filter.Date",
    config: {
        fields: {
            lt: {
                text: 'İle'
            },
            gt: {
                text: 'Sonrasında'
            },
            eq: {
                text: 'Açık'
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
    emptyText: "Numarayı girin"
});
Ext.define("Ext.locale.ru.grid.filters.filter.String", {
    override: "Ext.grid.filters.filter.String",
    emptyText: "Metni girin"
});
Ext.define("Ext.locale.ru.LoadMask", {
    override: "Ext.LoadMask",
    msg: "Yükleniyor..."
});
Ext.define("Ext.locale.ru.grid.RowEditor", {
    override: "Ext.grid.RowEditor",
    saveBtnText: 'Ok',
    cancelBtnText: 'İptal etmek',
    errorsText: 'Hata',
    dirtyText: 'Alan gerekli'
});
Ext.define("Ext.locale.ru.view.grid.button.Filter", {
    override: "Ge.view.grid.button.Filter",
    applyBtnText: 'Uygula',
    resetBtnText: 'Sıfırla',
});
Ext.define("Ext.locale.ru.grid.PageSize", {
    override: "Ge.view.plugin.PageSize",
    displayText: 'Sayfa başına gönderiler'
});
Ext.define("Ext.locale.ru.view.form.Panel", {
    override: "Ge.view.form.Panel",
    msgFillFields: 'Alanları doldurmanız gerekiyor'
});
