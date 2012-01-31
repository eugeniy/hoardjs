$(function() {
    module('Calendar');

    test('duration_in_seconds', function() {
        var cal = new Hoard.models.Calendar;
        cal.set({ start_at: new Date(1986, 0, 19, 13, 45),
                  end_at: new Date(1986, 0, 19, 15) });
        equal(cal.duration_in_seconds(), 4500);
    });

    test('num_columns', function() {
        var cal = new Hoard.models.Calendar;
        cal.set({ interval: 1800,
                  start_at: new Date(1986, 0, 19, 14),
                  end_at: new Date(1986, 0, 19, 17) });
        equal(cal.num_columns(), 6);
    });
});
