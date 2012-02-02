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
