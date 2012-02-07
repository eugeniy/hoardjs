Hoard.model.Resource = Backbone.Model.extend({
    initialize: function() {
        this.on('error', function(model, error) {
            console.log(error.toJSON());
        });
    },

    validate: function(args) {
        var errors = new Hoard.collection.Errors();

        if (args.name === undefined || args.name === '')
            errors.add({ message: 'name required' });

        if ( ! this.unique(args.name))
            errors.add({ message: 'name is already used' });

        if (errors.length > 0) return errors;
    },

    unique: function(name) {
        return Hoard.resources.find(function(resource) {
            return name === resource.get('name');
        }) ? false : true;
    }
});
Hoard.collection.Resources = Backbone.Collection.extend({
    model: Hoard.model.Resource,
    url: 'resources.json'
});
Hoard.resources = new Hoard.collection.Resources();
