Hoard.views.ResourceList = Backbone.View.extend({
    className: 'resources',
    initialize: function() {
        this.template = _.template($('#resources-template').html());
        _.bindAll(this, 'render', 'addOne');
        Hoard.resources.on('reset', this.render);
    },
    addOne: function(resource) {
        var view = new Hoard.views.Resource({ model: resource });
        $(this.el).find('tbody').append(view.render().el);
    },
    render: function() {
        $(this.el).html(this.template());
        Hoard.resources.each(this.addOne);
        return this;
    }
});
