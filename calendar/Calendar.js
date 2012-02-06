(function($){

	window.Calendar = Backbone.Model.extend({});

	window.CalendarView = Backbone.View.extend({
	    initialize: function() {
	    	_.bindAll(this, 'render');
	    	this.model.bind('change', this.render);
	        this.template = _.template($('#calendar-template').html());
	    },
	    render: function() {
	        $(this.el).html(this.template(this.model.toJSON()));
	        return this;
	    }
	});


})(jQuery);