Hoard.model.Reservation = Backbone.Model.extend({
    defaults: {
        start_at: new Date(),
        end_at: new Date(Date.now() + 1800000)
    },

    initialize: function() {
        this.on('error', function(model, error) {
            console.log(error.toJSON());
        });
    },

    parse: function(response) {
        return {
            start_at: new Date(Date.parse(response.start_at)),
            end_at: new Date(Date.parse(response.end_at)),
            resource: response.resource
        }
    },

    validate: function(args) {
        var errors = new Hoard.collection.Errors();

        if (args.start_at === undefined || isNaN(args.start_at))
            errors.add({ message: 'start_at required' });

        if (args.end_at === undefined || isNaN(args.end_at))
            errors.add({ message: 'end_at required' });

        if (typeof(args.resource) !== 'number')
            errors.add({ message: 'resource required' });

        // TODO: Only allow instances of the Date object.
        if (typeof args.start_at !== 'number' && !(args.start_at instanceof Date))
            errors.add({ message: 'start_at invalid format' });

        if (typeof args.end_at !== 'number' && !(args.end_at instanceof Date))
            errors.add({ message: 'end_at invalid format' });

        if (args.start_at > args.end_at)
            errors.add({ message: 'start_at is greater than end_at' });

        // FIXME: Make sure can change time if an existing reservation.
        if (this.conflict(args.start_at, args.end_at, args.resource))
            errors.add({ message: 'time conflict' });

        if (errors.length > 0) return errors;
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
Hoard.collection.Reservations = Backbone.Collection.extend({
    model: Hoard.model.Reservation,
    url: 'reservations.json',
    comparator: function(reservation) {
        // Keep collections sorted by the start date.
        return reservation.get('start_at');
    }
});
Hoard.reservations = new Hoard.collection.Reservations();
