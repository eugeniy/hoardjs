(function($){

    window.CalendarEvent = Backbone.Model.extend({
      defaults: {
        "owner"      : 0,
        "start_at"   : "0",
        "end_at"     : "1",
        "resource"   : 0,
        "title"      : "",
        "description": "",
        "show"       : true
      },
      isValid: function(){
        return (this.model.has("resource") && 
                this.model.has("start_at") && 
                this.model.has("end_at") && 
                this.model.has("owner"));
      },
      toggle: function(){
        this.save({"show":!this.get("show")});
      }

    });

    window.CalendarEvents = Backbone.Collection.extend({
        model: CalendarEvent,
        url: "calendars.json",
        //functions that filter and return day, week, agenda, month items
        day: function(selectedDate){
          return this.filter(function(cEvent){
           var e = new Date(Date.parse(cEvent.get("start_at")));
           var s = new Date(Date.parse(selectedDate));
           return e.getDate()     === s.getDate()  &&
                  e.getMonth()    === s.getMonth() &&
                  e.getFullYear() === s.getFullYear()
                  ? true : false ;
         });
        },
        week: function(selectedDate){
          return this.filter(function(cEvent){
           var e = new Date(Date.parse(cEvent.get("start_at")));
           var s = new Date(Date.parse(selectedDate));
           return e.getUTCDate()           === s.getUTCDate()  ||
                  //offset?
                  //e.getTime()/604800000    === s.getTime()/604800000 &&
                  e.getUTCFullYear()       === s.getUTCFullYear()
                  ? true : false ;
         });
        },
        agenda: function(selectedDate){
          return this.filter(function(cEvent){
           var e = new Date(Date.parse(cEvent.get("start_at")));
           var s = new Date(Date.parse(selectedDate));
           return e.getUTCDate()           === s.getUTCDate()  ||
                  //offset?
                  //e.getTime()/604800000    === s.getTime()/604800000 &&
                  e.getMonth()    === s.getMonth()
                  ? true : false ;
         });
        },
        month: function(selectedDate){
          return this.filter(function(cEvent){
           var e = new Date(Date.parse(cEvent.get("start_at")));
           var s = new Date(Date.parse(selectedDate));
           return e.getUTCMonth()    === s.getUTCMonth() && 
                  e.getDate()         >= s.getDate() && 
                  e.getUTCFullYear() === s.getUTCFullYear() ||
                  (e.getUTCMonth()+0)    === (s.getUTCMonth()+1) && 
                  e.getDate()         <= s.getDate() && 
                  e.getUTCFullYear() === s.getUTCFullYear()

                  ? true : false ;
         });
        },
        year: function(selectedDate){
          return this.filter(function(cEvent){
           var e = new Date(Date.parse(cEvent.get("start_at")));
           var s = new Date(Date.parse(selectedDate));
           return e.getUTCFullYear() === s.getUTCFullYear()
                  ? true : false ;
         });
        }
    });

    window.CalendarEventView = Backbone.View.extend({
      tagName: "li",
      template: _.template($('#calendar-event-template').html()),
      events: {
                "click .calendar-event":"toggleInfo",
                "click .edit"          :"edit",
                "click .destroy"       :"clear",
                "click .hide"          :"toggleHide"
              },
      initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
      },
      render: function() {
          $(this.el).html(this.template(this.model.toJSON()));
          this.setText();
          return this;
      },
      setText: function(){
        var text = this.model.get("text");
        this.$('.event-text').text(text);
      },
      toggleInfo: function(){
        //show info on event
      },
      toggleHide: function(){
        this.model.toggle();
      },
      edit: function(){
        //eddit event
      },
      clear: function(){
        this.model.destroy();
      }
      
    });

    
    
    //====================== APP VIEW====================
    window.CEvents = new CalendarEvents();
    window.AppView = Backbone.View.extend({
      el: $("#container"),
      template: _.template($('#app-template').html()),
      events:{
        "click #day-btn"   :"showDay",
        "click #week-btn"  :"showWeek",
        "click #month-btn" :"showMonth",
        "click #agenda-btn":"showAgenda"
      },
      initialize:function(){
        CEvents.bind('all', this.render, this);

        CEvents.fetch();
      },
      render: function(){
        $(this.el).html(this.template());
        return this;
      },
       //window.showDay = function(){
      showDay : function(){
        var CEvents = new CalendarEvents();
        var dayView = new DayView({collection: CEvents});
        var $container = $('#container');
          $container.empty();
        $('#container').append(dayView.render().el);
        CEvents.fetch();
      //};
        },

       //window.showWeek = function(){
        showWeek : function(){
        var CEvents = new CalendarEvents();
        var weekView = new WeekView({collection: CEvents});
        var $container = $('#container');
          $container.empty();
        $('#container').append(weekView.render().el);
        CEvents.fetch();
      },
      //};

      //window.showMonth = function(){
        showMonth : function(){
        var CEvents = new CalendarEvents();
        var monthView = new MonthView({collection: CEvents});
        var $container = $('#container');
          $container.empty();
        $('#container').append(monthView.render().el);
        CEvents.fetch();
      },
      //};

       //window.showAgenda = function(){
        showAgenda : function(){
        var CEvents = new CalendarEvents();
        var agendaView = new AgendaView({collection: CEvents});
        var $container = $('#container');
          $container.empty();
        $('#container').append(agendaView.render().el);
        CEvents.fetch();
      }//;
      
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
          var $today = "2012-01-27 00:00:00.00000";//getIndexLoc
          var $events,
              collection = this.collection;//.day($today);
                

          $(this.el).html(this.template({}));
          $events = this.$('.day-events');


          _.each( collection.day($today), function(cEvent){
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
    window.WeekCalendarEventView = CalendarEventView.extend({
        
    });

    window.WeekView = Backbone.View.extend({
        tagName: "section",
        className: "week",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#week-event-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
          var $today = "2012-01-27 00:00:00.00000";//getIndexLoc
            var $events,
                collection = this.collection;

            $(this.el).html(this.template({}));
            $events = this.$('.week-events');

            _.each( collection.week($today), function(cEvent){
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
    window.MonthCalendarEventView = CalendarEventView.extend({
        
    });

    window.MonthView = Backbone.View.extend({
        tagName: "section",
        className: "month",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#month-event-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
          var $today = "2012-01-27 00:00:00.00000";//getIndexLoc
            var $events,
                collection = this.collection;

            $(this.el).html(this.template({}));
            $events = this.$('.month-events');

            _.each( collection.month($today), function(cEvent){
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
    window.AgendaCalendarEventView = CalendarEventView.extend({
        
    });

    window.AgendaView = Backbone.View.extend({
        tagName: "section",
        className: "agenda",

        initialize: function(){
            _.bindAll(this, 'render');
            this.template = _.template($('#agenda-event-template').html());
            this.collection.bind('reset', this.render);
        },

        render: function(){
          var $today = "2012-01-27 00:00:00.00000";//getIndexLoc
            var $events,
                collection = this.collection;

            $(this.el).html(this.template({}));
            $events = this.$('.agenda-events');

            _.each( collection.agenda($today), function(cEvent){
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