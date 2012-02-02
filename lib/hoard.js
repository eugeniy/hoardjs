var Hoard = Hoard || {};
Hoard.models = Hoard.models || {};
Hoard.views = Hoard.views || {};
Hoard.collections = Hoard.collections || {};

Hoard.utils = Hoard.utils || {};

Hoard.reservations = Hoard.reservations || {};
Hoard.resources = Hoard.resources || {};


// TODO: Possible to add this to a model setter?
Hoard.utils.parse_date = function(value) {
    var parts = value.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)\s*(pm|am){0,1}/i);
    if (parts[6] !== undefined && parts[6].toLowerCase() === 'pm') {
        var hours = parseInt(parts[4]) + 12;
    } else {
        var hours = parts[4];
    }
    return new Date(parts[3], parts[1]-1, parts[2], hours, parts[5]);
};


Hoard.models.Calendar = Backbone.Model.extend({
    defaults: {
        interval: 1800
    },

    duration_in_seconds: function() {
        return (this.get('end_at') - this.get('start_at')) / 1000;
    },

    num_columns: function() {
        return this.duration_in_seconds() / this.get('interval');
    },

    intervalLengthInPixels: function(width, segment_count) {
        return width / segment_count;
    },

    reservationWidth: function(start_at, end_at, el, interval) {
        if (typeof(interval) === 'undefined')
            var interval = 1800;
        var width = el.width();
        var segment_count = reservationDurationInSeconds(start_at, end_at) / interval;
        var cell_width = intervalLengthInPixels(width, segment_count);
        el.find('td').width(cell_width);
        return segment_count * cell_width;
    }
});

Hoard.views.Calendar = Backbone.View.extend({
    tagName: 'table',
    className: 'calendar',
    render: function() {},
    column_width: function() {
        $(this.el).width() / this.model.num_columns();
    }
});



Hoard.models.Resource = Backbone.Model.extend({
    initialize: function() {
        this.on('error', function(model, error) {
            console.log(error);
        });
    },

    validate: function(args) {
        if (args.name === undefined || args.name === '') {
            return 'name required';
        }
        if ( ! this.unique(args.name)) {
            return 'name is already used';
        }
    },

    unique: function(name) {
        return Hoard.resources.find(function(resource) {
            return name === resource.get('name');
        }) ? false : true;
    }
});
Hoard.collections.Resources = Backbone.Collection.extend({
    model: Hoard.models.Resource,
    url: 'resources.json'
});
Hoard.resources = new Hoard.collections.Resources();


Hoard.models.Reservation = Backbone.Model.extend({
    defaults: {
        start_at: new Date(),
        end_at: (new Date()).addMinutes(30)
    },

    initialize: function() {
        this.on('error', function(model, error) {
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
        if (args.resource === undefined || args.resource === '' ||
            args.resource === null) {
            return 'resource required';
        }
        /*
        if (typeof args.start_at !== 'number') {
            return 'start_at invalid format'
        }
        if (typeof args.end_at !== 'number') {
            return 'end_at invalid format'
        }
        */
        if (args.start_at > args.end_at) {
            return 'start_at is greater than end_at';
        }
        if (this.conflict(args.start_at, args.end_at, args.resource)) {
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

    conflict: function(start_at, end_at, resource) {
        return Hoard.reservations.find(function(reservation) {
            return resource === reservation.get('resource') &&
                   reservation.intersects(start_at, end_at);
        });
    },

    available: function() {
        return (this.conflict(this.get('start_at'),
                              this.get('end_at'),
                              this.get('resource'))) ? false : true;
    }
});
Hoard.collections.Reservations = Backbone.Collection.extend({
    model: Hoard.models.Reservation,
    url: 'reservations.json',
    parse: function(response) {
        var parser = function(reservation) {
            return {
                start_at: new Date(Date.parse(reservation.start_at)),
                end_at: new Date(Date.parse(reservation.end_at)),
                resource: reservation.resource
            }
        };
        return response.map(parser);
    }
});
Hoard.reservations = new Hoard.collections.Reservations();
Hoard.reservations.comparator = function(reservation) {
    // Keep this collection sorted by the start date.
    return reservation.get('start_at');
};





Hoard.views.ReservationList = Backbone.View.extend({
    className: 'reservations',
    initialize: function() {
        this.template = _.template($('#reservations-template').html());
        _.bindAll(this, 'render', 'addOne');
        Hoard.reservations.on('add', this.render);
        Hoard.reservations.on('reset', this.render);
    },
    addOne: function(reservation) {
        var view = new Hoard.views.Reservation({ model: reservation });
        $(this.el).find('tbody').append(view.render().el);
    },
    render: function() {
        $(this.el).html(this.template());
        Hoard.reservations.each(this.addOne);
        return this;
    }
});

Hoard.views.Reservation = Backbone.View.extend({
    tagName: 'tr',
    className: 'reservation',
    initialize: function() {
        this.template = _.template($('#reservation-template').html());
        this.model.on('change', this.render, this);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

Hoard.views.ReservationForm = Backbone.View.extend({
    tagName: 'form',
    className: 'modal form-horizontal',
    events: { 'submit': 'reserve' },
    initialize: function() {
        this.template = _.template($('#reservation-form-template').html());
        $(this.el).modal({backdrop: true, keyboard: true});
    },
    render: function() {
        $(this.el).html(this.template({
            reservation: this.options.reservation,
            resource: this.options.resource.toJSON()
        }));
        return this;
    },
    reserve: function(e) {
        e.preventDefault();

        var start_at = this.$(':input[name="start_at_date"]').val() + ' '
                     + this.$(':input[name="start_at_time"]').val();
        var end_at = this.$(':input[name="end_at_date"]').val() + ' '
                   + this.$(':input[name="end_at_time"]').val();

        Hoard.reservations.add({
            start_at: Hoard.utils.parse_date(start_at),
            end_at: Hoard.utils.parse_date(end_at),
            resource: this.$('input[name="resource"]').val()
        });
    },
    show: function() {
        $(this.el).modal('show');
    }
});

Hoard.views.ResourceList = Backbone.View.extend({
    className: 'resources',
    initialize: function() {
        this.template = _.template($('#resources-template').html());
        _.bindAll(this, 'render', 'addOne');
        Hoard.resources.on('reset', this.render);
    },
    addOne: function(resource) {
        var view = new Hoard.views.Resource({ model: resource });
        $(this.el).find('tbody').append(view.render().el);
    },
    render: function() {
        $(this.el).html(this.template());
        Hoard.resources.each(this.addOne);
        return this;
    }
});

Hoard.views.Resource = Backbone.View.extend({
    tagName: 'tr',
    className: 'resource',
    events: { 'click .name': 'showReservationForm' },
    initialize: function() {
        this.template = _.template($('#resource-template').html());
        _.bindAll(this, 'render', 'showReservationForm');
        this.model.on('change', this.render);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    showReservationForm: function() {
        var reservation = new Hoard.models.Reservation({ resource: this.model });
        var view = new Hoard.views.ReservationForm({
            reservation: reservation,
            resource: this.model
        });
        $('#reservation-form').html(view.render().el);
        view.show();
    }
});


Hoard.views.Application = Backbone.View.extend({
    initialize: function() {
        this.template = _.template($('#application-template').html());
        this.render();
    },

    render: function() {
        $(this.el).html(this.template());
        var reservations = new Hoard.views.ReservationList();
        this.$('#reservations').html(reservations.render().el);
        var resources = new Hoard.views.ResourceList();
        this.$('#resources').html(resources.render().el);
        return this;
    }
});
