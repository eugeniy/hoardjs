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
