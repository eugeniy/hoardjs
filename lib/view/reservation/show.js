Hoard.view.Reservation = Backbone.View.extend({
    tagName: 'tr',
    className: 'reservation',
    events: {
        'click .actions .modify': 'modify',
        'click .actions .delete': 'delete'
    },
    initialize: function() {
        this.template = _.template($('#reservation-template').html());
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    render: function() {
        var resource_id = this.model.get('resource');
        var resource = Hoard.resources.find(function(resource) {
            return resource.id == resource_id;
        });
        // Find the actual resource object and substitute it in the reservation
        var data = _.extend(this.model.toJSON(), { resource: resource.toJSON() });
        $(this.el).html(this.template(data));
        return this;
    },
    remove: function() {
        $(this.el).remove();
    },
    delete: function() {
        this.model.destroy();
    },
    modify: function() {
        var view = new Hoard.view.ReservationForm({ model: this.model });
        console.log(this.model);
        $('#reservation-form').html(view.render().el);
    }
});
