/**
 * Ge.plugin.TabReorderer.
 * Плагин позволяет изменять порядок вкладок в TabPanel.
 */
Ext.define('Ge.plugin.TabReorderer', {

    extend: 'Ge.plugin.BoxReorderer',
    alias: 'plugin.tabreorderer',

    itemSelector: '.' + Ext.baseCSSPrefix + 'tab',

    init: function(tabPanel) {
        var me = this;
        
        me.callParent([tabPanel.getTabBar()]);

        // убедитесь, что свойство "reorderable" копируется в динамически добавляемые вкладки
        tabPanel.onAdd = Ext.Function.createSequence(tabPanel.onAdd, me.onAdd);
    },

    onBoxReady: function() {
        var tabs,
            len,
            i = 0,
            tab;

        this.callParent(arguments);

        // скопировать свойство, подлежащее переупорядочиванию, из карточки во вкладку
        for (tabs = this.container.items.items, len = tabs.length; i < len; i++) {
            tab = tabs[i];
            if (tab.card) {
                tab.reorderable = tab.card.reorderable;
            }
        }
    },

    onAdd: function(card, index) {
        card.tab.reorderable = card.reorderable;
    },

    afterBoxReflow: function() {
        var me = this;

        // невозможно использовать callParent, эта функция вызывается не в рамках данного плагина, а в рамках его объекта Ext.dd.DD
        Ge.plugin.BoxReorderer.prototype.afterBoxReflow.apply(me, arguments);

        // переместите соответствующую карточку в соответствии с порядком вкладок
        if (me.dragCmp) {
            me.container.tabPanel.setActiveTab(me.dragCmp.card);
            me.container.tabPanel.move(me.dragCmp.card, me.curIndex);
        }
    }
});