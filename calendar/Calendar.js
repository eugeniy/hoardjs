(function($){

    window.Calendar = Backbone.Model.extend({});

    window.Calendars = Backbone.Collection.extend({
        model: Calendar,
        url: "calendars.json"
    });

    window.CalendarView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);

            this.template = _.template($('#calendar-template').html());
        },
        render: function() {
            console.log(this.model);
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    
    
    //====================== DAY VIEW====================
    window.DayCalendarView = CalendarView.extend({
        
    });

    window.DayView = Backbone.View.extend({
        tagName: "section",
        className: "day",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#day-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $calendars,
                collection = this.collection;

            $(this.el).html(this.template({}));
            $calendars = this.$('.calendars1');
            this.collection.each(function(calendar){
                var view = new DayCalendarView({
                    model: calendar,
                    collection: collection
                });
                $calendars.append(view.render().el);
            });
            return this;
        }

    });
    //====================== WEEK VIEW=======================
    window.WeekCalendarView = DayCalendarView.extend({
        
    });

    window.WeekView = Backbone.View.extend({
        tagName: "section",
        className: "week",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#week-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $calendars,
                collection = this.collection;
            $(this.el).html(this.template({}));
            $calendars = this.$('.calendars2');
            collection.each(function(calendar){
                var view = new WeekCalendarView({
                    model: calendar,
                    collection: collection
                });
                $calendars.append(view.render().el);
            });
            return this;
        }

    });
    //====================== MONTH VIEW =======================
    window.MonthCalendarView = WeekCalendarView.extend({
        
    });

    window.MonthView = Backbone.View.extend({
        tagName: "section",
        className: "month",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#month-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $calendars,
                collection = this.collection;
            $(this.el).html(this.template({}));
            $calendars = this.$('.calendars3');
            collection.each(function(calendar){
                var view = new MonthCalendarView({
                    model: calendar,
                    collection: collection
                });
                $calendars.append(view.render().el);
            });
            return this;
        }

    });
    
    //====================== AGENDA VIEW =======================
    window.AgendaCalendarView = WeekCalendarView.extend({
        
    });

    window.AgendaView = Backbone.View.extend({
        tagName: "section",
        className: "agenda",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#agenda-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
            var $calendars,
                collection = this.collection;
            $(this.el).html(this.template({}));
            $calendars = this.$('.calendars4');
            collection.each(function(calendar){
                var view = new AgendaCalendarView({
                    model: calendar,
                    collection: collection
                });
                $calendars.append(view.render().el);
            });
            return this;
        }

    });


})(jQuery);