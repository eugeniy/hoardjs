Hoard.view.Reservation = Backbone.View.extend({
    tagName: 'tr',
    className: 'reservation',
    events: { 'click .actions .delete': 'delete' },
    initialize: function() {
        this.template = _.template($('#reservation-template').html());
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    remove: function() {
        $(this.el).remove();
    },
    delete: function() {
        this.model.destroy();
    }
});
