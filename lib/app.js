var Hoard = Em.Application.create();

Hoard.ResourceView = Em.View.extend({
    mouseDown: function() {
        window.alert("hello world!");
    }
});
