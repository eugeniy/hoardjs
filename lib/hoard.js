var Hoard = Hoard || {};
Hoard.models = Hoard.models || {};
Hoard.views = Hoard.views || {};
Hoard.collections = Hoard.collections || {};

Hoard.reservations = Hoard.reservations || {};


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
Hoard.collections.Reservations = Backbone.Collection.extend({
    model: Hoard.models.Reservation
});

Hoard.views.Reservation = Backbone.View.extend({
    className: 'reservation',
    template: _.template($('#reservation-template').html()),

    initialize: function() {
        this.model.bind('change', this.render, this);
    },

    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

Hoard.views.Application = Backbone.View.extend({
    el: $('#hoard'),
    template: _.template($('#application-template').html()),

    events: {
        'submit #reservation-form': 'reserve'
    },

    initialize: function() {
        this.render();
        Hoard.reservations = new Hoard.collections.Reservations();

        Hoard.reservations.bind('add', this.addOne, this);
        Hoard.reservations.bind('reset', this.addAll, this);
    },

    render: function() {
        this.el.html(this.template);
        return this;
    },

    reserve: function(e) {
        e.preventDefault();

        Hoard.reservations.add({
            start_at: $('#start_at').val(),
            end_at: $('#end_at').val()
        });
    },

    addOne: function(reservation) {
        console.dir(reservation);
        console.dir(Hoard.reservations);
        var view = new Hoard.views.Reservation({ model: reservation });
        this.el.append(view.render().el);
    },

    addAll: function() {
        Hoard.reservations.each(this.addOne);
    }
});
