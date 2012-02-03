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

    /*
    test('validate', function() {
        Hoard.reservations.add(create_reservation({ start_at: 100, end_at: 200 }));
        var res = create_reservation();

        var validateDate = function(input) {
            var valid = create_reservation().toJSON();
            return res.validate($.extend(valid, input));
        };

        equal(validateDate({ start_at: 10, end_at: 20 }), undefined);
        notEqual(validateDate({ start_at: 20, end_at: 10 }), undefined);
        notEqual(validateDate({ start_at: 10 }), undefined);
        notEqual(validateDate({ start_at: 150, end_at: 180 }), undefined);
        notEqual(validateDate({ start_at: 10, end_at: '' }), undefined);
        notEqual(validateDate({ start_at: '', end_at: 20 }), undefined);
        notEqual(validateDate({ start_at: '', end_at: 20 }), undefined);
        notEqual(validateDate({ start_at: '10', end_at: '20' }), undefined);
    });
    */

    test('conflict', function() {
        Hoard.reservations.add(create_reservation({ start_at: 100, end_at: 200 }));
        var expected = Hoard.reservations.first();
        var res = create_reservation();

        equal(res.conflict(10, 20), undefined);
        notDeepEqual(res.conflict(120, 210), expected);
    });

    test('available', function() {
        Hoard.reservations.add(create_reservation({ start_at: 100, end_at: 200 }));

        var res = create_reservation({ start_at: 10, end_at: 20 });
        equal(res.available(), true);

        res.set({ start_at: 10, end_at: 210 });
        equal(res.available(), false);
    });
});
