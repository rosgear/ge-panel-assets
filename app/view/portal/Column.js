/**
 * @class Portal.view.PortalColumn
 * @extends Ext.container.Container
 */
Ext.define('Ge.view.portal.Column', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',
    requires: [
        'Ext.layout.container.Anchor',
        'Ge.view.portal.Portlet'
    ],
    layout: 'anchor',
    defaultType: 'portlet',
    cls: 'g-portal-column'
});