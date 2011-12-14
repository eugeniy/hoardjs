(function() {

    window.Hoard = {};
    Hoard.models = {};
    Hoard.views = {};
    Hoard.controllers = {};
    Hoard.app = {};

    Hoard.controllers.Workspace = Backbone.Router.extend({
        initialize: function() {
            this.app = new Hoard.views.Application();
        }
    });

    Hoard.views.Application = Backbone.View.extend({
        el: 'div',
        id: 'hoard',

        events: {'click': 'mouseDown'},

        initialize: function() {
            this.template = _.template($('#application-template').html());
            this.render();
        },

        render: function() {
            $(this.el).html(this.template);
            return this;
        },

        mouseDown: function() {
            window.alert('hello world!');
        }
    });

})();
