Hoard.view.ReservationForm = Backbone.View.extend({
    tagName: 'form',
    className: 'modal form-horizontal',
    events: { 'submit': 'reserve' },
    initialize: function() {
        this.template = _.template($('#reservation-form-template').html());
        $(this.el).modal({backdrop: true, keyboard: true});
        this.model.on('change', this.addToList, this);
    },
    render: function() {
        $(this.el).html(this.template({
            reservation: this.model,
            resource: Hoard.resources.get(this.model.get('resource')).toJSON()
        }));
        $(this.el).modal('show');
        return this;
    },
    reserve: function(e) {
        e.preventDefault();

        var start_at = this.$(':input[name="start_at_date"]').val() + ' '
                     + this.$(':input[name="start_at_time"]').val();
        var end_at = this.$(':input[name="end_at_date"]').val() + ' '
                   + this.$(':input[name="end_at_time"]').val();
        var resource = parseInt(this.$('input[name="resource"]').val());

        // TODO: Properly handle error events.
        this.model.set({
            start_at: Hoard.util.parse_date(start_at),
            end_at: Hoard.util.parse_date(end_at),
            resource: resource
        });
    },
    addToList: function() {
        if (Hoard.reservations.getByCid(this.model.cid) === undefined) {
            Hoard.reservations.add(this.model);
        }
        $(this.el).modal('hide');
    }
});
