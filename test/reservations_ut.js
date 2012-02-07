$(function() {
    module('Reservation');

    test('contains', function() {
        var reservation = create_reservation({ start_at: 1000, end_at: 2000 });

        ok( ! reservation.contains('500'));
        ok(reservation.contains('1000'));
        ok(reservation.contains('1500'));
        ok( ! reservation.contains('2000'));
        ok( ! reservation.contains('2500'));
    });

    test('intersects', function() {
        var reservation = create_reservation({ start_at: 1000, end_at: 2000 });

        ok(reservation.intersects(1100, 2100));
        ok(reservation.intersects(1100, 1900));
        ok(reservation.intersects(900, 2100));
        ok(reservation.intersects(900, 1900));
        ok(reservation.intersects(1000, 1900));
        ok(reservation.intersects(1100, 2000));
        ok(reservation.intersects(1000, 2000));
        ok( ! reservation.intersects(2000, 2100));
        ok( ! reservation.intersects(900, 1000));

        reservation.set({ start_at: 1000, end_at: 1000 });
        ok( ! reservation.intersects(1000, 1000));
    });

    test('validate', function() {
        var dateValid = function(start_at, end_at) {
            var res = create_reservation();
            res.attributes.start_at = start_at;
            res.attributes.end_at = end_at;
            return res.isValid();
        };

        ok(dateValid(10, 20), 'can use numbers for dates');
        ok(dateValid(new Date(2011), new Date(2012)), 'can use Date object');
        ok(dateValid(10, new Date(2012)), 'can combine Date and numbers');

        Hoard.reservations.add(create_reservation({ start_at: 100, end_at: 200 }));

        ok(dateValid(10, 20));
        ok( ! dateValid(20, 10), 'start_at after end_at');
        ok( ! dateValid(10, undefined), 'end_at unspecified');
        ok( ! dateValid(150, 180), 'time conflict');
        ok( ! dateValid(10, ''), 'invalid format');
        ok( ! dateValid('', 20), 'invalid format');
        ok( ! dateValid('10', '20'), 'number strings are not parsed');
    });

    test('conflict', function() {
        Hoard.reservations.add(create_reservation({ start_at: 100, end_at: 200 }));
        var expected = Hoard.reservations.first();
        var res = create_reservation();

        // FIXME: Those are passing even with a conflict.
        equal(res.conflict(10, 20, res.resource), undefined);
        notDeepEqual(res.conflict(120, 210, res.resource), expected);
        equal(expected.conflict(120, 210, res.resource), undefined);
    });

    test('available', function() {
        Hoard.reservations.add(create_reservation({ start_at: 100, end_at: 200 }));

        var res = create_reservation({ start_at: 10, end_at: 20 });
        ok(res.available());

        res.set({ start_at: 5, end_at: 210 });
        // shouldn't be able to set if invalid
        notEqual(res.get('start_at'), 5);
        notEqual(res.get('end_at'), 210);

        res.attributes.start_at = 5;
        res.attributes.end_at = 210;
        ok( ! res.available(), 'manually set attributes validated');
    });
});
