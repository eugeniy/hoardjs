var Hoard = Hoard || {};
Hoard.models = Hoard.models || {};
Hoard.views = Hoard.views || {};

Hoard.models.Reservation = Backbone.Model.extend({
    defaults: {
        start_at: Date.now(),
        end_at: Date.now() + 3600000
    },

    contains: function(date) {
        return (this.get('start_at') <= date) & (date < this.get('end_at'))
    },

    intersects: function(start_at, end_at) {
        return (this.get('start_at') < end_at) & (this.get('end_at') > start_at)
    }
});

Hoard.views.Reservation = Backbone.View.extend({
    className: 'reservation',
    template: _.template($('#reservation-template').html()),

    render: function() {
        $(this.el).html(this.template);
        return this;
    }
});

Hoard.views.Application = Backbone.View.extend({
    el: $('#hoard'),
    template: _.template($('#application-template').html()),

    events: {'click': 'mouseDown'},

    initialize: function() {
        this.render();
    },

    render: function() {
        this.el.html(this.template);
        return this;
    },

    mouseDown: function() {
        var view = new Hoard.views.Reservation;
        this.el.append(view.render().el);
    }
});
