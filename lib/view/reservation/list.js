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
