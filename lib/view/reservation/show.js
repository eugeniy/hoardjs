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
        var resource = Hoard.resources.get(this.model.get('resource'));
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
        $('#reservation-form').html(view.render().el);
    }
});
