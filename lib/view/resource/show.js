Hoard.view.Resource = Backbone.View.extend({
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
        var reservation = new Hoard.model.Reservation({ resource: this.model.id });
        var view = new Hoard.view.ReservationForm({ model: reservation });
        $('#reservation-form').html(view.render().el);
    }
});
