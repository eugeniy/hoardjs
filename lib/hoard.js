var Hoard = Hoard || {};
Hoard.models = Hoard.models || {};
Hoard.views = Hoard.views || {};

Hoard.models.Reservation = Backbone.Model.extend({});

Hoard.views.Application = Backbone.View.extend({
    el: 'div',
    id: 'hoard',

    events: {'click': 'mouseDown'},

    initialize: function() {
        this.template = _.template($('#application-template').html());
        this.render();
    },

    render: function() {
        $(this.el).html(this.template);
        return this;
    },

    mouseDown: function() {
        window.alert('hello world!');
    }
});
