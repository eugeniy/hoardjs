(function($){

	window.Calendar = Backbone.Model.extend({});

	window.CalendarView = Backbone.View.extend({
	    initialize: function() {
	        this.template = _.template($('#calendar-template').html());
	    },
	    render: function() {
	        $(this.el).html(this.template(this.model.toJSON()));
	        return this;
	    }
	});


})(jQuery);