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
    },
    comparator: function(reservation) {
        // Keep collections sorted by the start date.
        return reservation.get('start_at');
    }
});
Hoard.reservations = new Hoard.collections.Reservations();
