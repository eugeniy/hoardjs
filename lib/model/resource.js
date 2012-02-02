Hoard.model.Resource = Backbone.Model.extend({
    initialize: function() {
        this.on('error', function(model, error) {
            console.log(error);
        });
    },

    validate: function(args) {
        if (args.name === undefined || args.name === '') {
            return 'name required';
        }
        if ( ! this.unique(args.name)) {
            return 'name is already used';
        }
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
