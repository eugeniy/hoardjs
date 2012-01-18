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

    initialize: function() {
        this.bind('error', function(model, error) {
            console.log(error);
        });
    },

    validate: function(args) {
        if (args.start_at === undefined || isNaN(args.start_at)) {
            return 'start_at required';
        }
        if (args.end_at === undefined || isNaN(args.end_at)) {
            return 'end_at required';
        }
        if (typeof args.start_at !== 'number') {
            return 'start_at invalid format'
        }
        if (typeof args.end_at !== 'number') {
            return 'end_at invalid format'
        }
        if (args.start_at > args.end_at) {
            return 'start_at is greater than end_at';
        }
        if (this.conflict(args.start_at, args.end_at)) {
            return 'time conflict';
        }
    },

    contains: function(date) {
        return (this.get('start_at') <= date) & (date < this.get('end_at'))
    },

    intersects: function(start_at, end_at) {
        return (this.get('start_at') < end_at) &
               (this.get('end_at') > start_at)
    },

    conflict: function(start_at, end_at) {
        return Hoard.reservations.find(function(reservation) {
            return reservation.intersects(start_at, end_at);
        });
    },

    available: function() {
        return (this.conflict(this.get('start_at'),
                              this.get('end_at'))) ? false : true;
    }
});
Hoard.collections.Reservations = Backbone.Collection.extend({
    model: Hoard.models.Reservation
});
Hoard.reservations = new Hoard.collections.Reservations();

Hoard.views.Reservation = Backbone.View.extend({
    tagName: 'li',
    className: 'reservation',

    initialize: function() {
        this.template = _.template($('#reservation-template').html());
        this.model.bind('change', this.render, this);
    },

    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

Hoard.views.Application = Backbone.View.extend({
    events: {
        'submit .reservation-form': 'reserve'
    },

    initialize: function() {
        this.template = _.template($('#application-template').html());
        this.render();

        _.bindAll(this, 'render', 'reserve');
        Hoard.reservations.bind('add', this.render);
        Hoard.reservations.bind('reset', this.render);
    },

    render: function() {
        $(this.el).html(this.template());
        Hoard.reservations.each(function(reservation) {
            var view = new Hoard.views.Reservation({ model: reservation });
            this.$('.reservations').append(view.render().el);
        });
        return this;
    },

    reserve: function(e) {
        e.preventDefault();
        Hoard.reservations.add({
            start_at: parseInt(this.$('input[name="start_at"]').val()),
            end_at: parseInt(this.$('input[name="end_at"]').val())
        });
    }
});
