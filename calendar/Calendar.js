(function($){

    window.CalendarEvent = Backbone.Model.extend({});

    window.CalendarEvents = Backbone.Collection.extend({
        model: CalendarEvent,
        url: "calendars.json"
    });

    window.CalendarEventView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);

            this.template = _.template($('#calendar-event-template').html());
        },
        render: function() {
            console.log(this.model);
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    
    
    //====================== DAY VIEW====================
    window.DayCalendarEventView = CalendarEventView.extend({
        
    });

    window.DayView = Backbone.View.extend({
        tagName: "section",
        className: "day",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#day-event-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $events,
                collection = this.collection;

            $(this.el).html(this.template({}));
            $events = this.$('.day-events');
            collection.each(function(cEvent){
                var view = new DayCalendarEventView({
                    model: cEvent,
                    collection: collection
                });
                $events.append(view.render().el);
            });
            return this;
        }

    });
    //====================== WEEK VIEW=======================
    window.WeekCalendarEventView = DayCalendarEventView.extend({
        
    });

    window.WeekView = Backbone.View.extend({
        tagName: "section",
        className: "week",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#week-events-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $events,
                collection = this.collection;
            $(this.el).html(this.template({}));
            $events = this.$('.week-events');
            collection.each(function(cEvent){
                var view = new WeekCalendarEventView({
                    model: cEvent,
                    collection: collection
                });
                $events.append(view.render().el);
            });
            return this;
        }

    });
    //====================== MONTH VIEW =======================
    window.MonthCalendarEventView = WeekCalendarEventView.extend({
        
    });

    window.MonthView = Backbone.View.extend({
        tagName: "section",
        className: "month",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#month-events-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $events,
                collection = this.collection;
            $(this.el).html(this.template({}));
            $events = this.$('.month-events');
            collection.each(function(cEvent){
                var view = new MonthCalendarEventView({
                    model: cEvent,
                    collection: collection
                });
                $events.append(view.render().el);
            });
            return this;
        }

    });
    
    //====================== AGENDA VIEW =======================
    window.AgendaCalendarEventView = WeekCalendarEventView.extend({
        
    });

    window.AgendaView = Backbone.View.extend({
        tagName: "section",
        className: "agenda",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#agenda-events-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $events,
                collection = this.collection;
            $(this.el).html(this.template({}));
            $events = this.$('.agenda-events');
            collection.each(function(cEvent){
                var view = new AgendaCalendarEventView({
                    model: cEvent,
                    collection: collection
                });
                $events.append(view.render().el);
            });
            return this;
        }

    });


})(jQuery);