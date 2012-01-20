var Hoard = Hoard || {};
Hoard.models = Hoard.models || {};
Hoard.views = Hoard.views || {};
Hoard.collections = Hoard.collections || {};

Hoard.reservations = Hoard.reservations || {};
Hoard.resources = Hoard.resources || {};


Hoard.models.Resource = Backbone.Model.extend({
    initialize: function() {
        this.bind('error', function(model, error) {
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
    model: Hoard.models.Resource
});
Hoard.resources = new Hoard.collections.Resources();


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
        if (args.resource === undefined || args.resource === '' ||
            args.resource === null) {
            return 'resource required';
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
    model: Hoard.models.Reservation
});
Hoard.reservations = new Hoard.collections.Reservations();
Hoard.reservations.comparator = function(reservation) {
    // Keep this collection sorted by the start date.
    return reservation.get('start_at');
};


Hoard.views.Resource = Backbone.View.extend({
    tagName: 'tr',
    className: 'resource',

    events: {'click': 'showReservationForm'},

    initialize: function() {
        this.template = _.template($('#resource-template').html());
        _.bindAll(this, 'render', 'showReservationForm');
        this.model.bind('change', this.render);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    showReservationForm: function() {
        var view = new Hoard.views.ReservationForm();
        $('#reservation-form').html(view.render().el);
        view.show();
    }
});

Hoard.views.Reservation = Backbone.View.extend({
    tagName: 'tr',
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

Hoard.views.ReservationList = Backbone.View.extend({
    tagName: 'table',
    className: 'reservations span8',

    initialize: function() {
        _.bindAll(this, 'render', 'addOne');
        Hoard.reservations.bind('add', this.render);
    },
    addOne: function(reservation) {
        var view = new Hoard.views.Reservation({ model: reservation });
        $(this.el).append(view.render().el);
    },
    render: function() {
        $(this.el).empty();
        Hoard.reservations.each(this.addOne);
        return this;
    }
});

Hoard.views.ReservationForm = Backbone.View.extend({
    tagName: 'form',
    className: 'modal',
    events: {
        'submit': 'reserve',
        'click .discard': 'hide'
    },

    initialize: function() {
        this.template = _.template($('#reservation-form-template').html());
        $(this.el).modal({backdrop: true, keyboard: true});
        _.bindAll(this, 'render', 'show', 'hide');
        Hoard.resources.bind('add', this.render);
    },
    render: function() {
        $(this.el).html(this.template({ resources: Hoard.resources.toJSON() }));
        return this;
    },
    reserve: function(e) {
        e.preventDefault();
        Hoard.reservations.add({
            start_at: parseInt(this.$('input[name="start_at"]').val()),
            end_at: parseInt(this.$('input[name="end_at"]').val()),
            resource: this.$('select[name="resource"]').val()
        });
    },
    show: function() {
        $(this.el).modal('show');
    },
    hide: function(e) {
        if (e !== undefined) e.preventDefault();
        $(this.el).modal('hide');
    }
});

Hoard.views.ResourceList = Backbone.View.extend({
    tagName: 'table',
    className: 'resources zebra-striped span8',

    initialize: function() {
        this.template = _.template($('#resource-list-template').html());
        _.bindAll(this, 'render', 'addOne');
        Hoard.resources.bind('add', this.addOne);
    },
    addOne: function(resource) {
        var view = new Hoard.views.Resource({ model: resource });
        $(this.el).append(view.render().el);
    },
    render: function() {
        $(this.el).html(this.template());
        Hoard.resources.each(this.addOne);
        return this;
    }
});

Hoard.views.ResourceForm = Backbone.View.extend({
    className: 'resource-form',
    events: {'submit': 'create'},

    initialize: function() {
        this.template = _.template($('#resource-form-template').html());
    },
    render: function() {
        $(this.el).html(this.template());
        return this;
    },
    create: function(e) {
        e.preventDefault();
        Hoard.resources.add({
            name: $.trim(this.$('input[name="name"]').val())
        });
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
        this.$('.row').append(reservations.render().el);
        var resources = new Hoard.views.ResourceList();
        this.$('.row').append(resources.render().el);
        var resource_form = new Hoard.views.ResourceForm();
        $(this.el).append(resource_form.render().el);

        return this;
    }
});
