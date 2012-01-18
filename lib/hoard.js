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


Hoard.views.Resource = Backbone.View.extend({
    tagName: 'li',
    className: 'resource',

    initialize: function() {
        this.template = _.template($('#resource-template').html());
        this.model.bind('change', this.render, this);
    },

    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

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
        'submit .reservations form': 'reserve',
        'submit .resources form': 'createResource'
    },

    initialize: function() {
        this.template = _.template($('#application-template').html());
        this.render();

        _.bindAll(this, 'render', 'reserve', 'createResource');
        Hoard.reservations.bind('add', this.render);
        Hoard.reservations.bind('reset', this.render);
        Hoard.resources.bind('add', this.render);
        Hoard.resources.bind('reset', this.render);
        Hoard.resources.bind('add', this.updateResourceOptions);
        Hoard.resources.bind('reset', this.updateResourceOptions);
    },

    render: function() {
        $(this.el).html(this.template());
        Hoard.reservations.each(function(reservation) {
            var view = new Hoard.views.Reservation({ model: reservation });
            this.$('.reservations ul').append(view.render().el);
        });
        Hoard.resources.each(function(resource) {
            var view = new Hoard.views.Resource({ model: resource });
            this.$('.resources ul').append(view.render().el);
        });
        return this;
    },

    reserve: function(e) {
        e.preventDefault();
        Hoard.reservations.add({
            start_at: parseInt(this.$('input[name="start_at"]').val()),
            end_at: parseInt(this.$('input[name="end_at"]').val()),
            resource: this.$('select[name="resource"]').val()
        });
        // TODO: Add an event to call this?
        this.updateResourceOptions();
    },

    createResource: function(e) {
        e.preventDefault();
        Hoard.resources.add({
            name: $.trim(this.$('input[name="name"]').val())
        });
    },

    updateResourceOptions: function(e) {
        // TODO: Precompile and move template to resource view?
        var template = _.template($('#resource-options-template').html());
        $('.reservations select[name="resource"]').append(template({
            resources: Hoard.resources.toJSON()
        }));
    }
});
