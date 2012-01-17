$(function() {

    module('Reservation');

    test('contains()', function() {
        var reservation = new Hoard.models.Reservation;
        reservation.set({start_at: 1000, end_at: 2000});

        ok( ! reservation.contains('500'));
        ok(reservation.contains('1000'));
        ok(reservation.contains('1500'));
        ok( ! reservation.contains('2000'));
        ok( ! reservation.contains('2500'));
    });

    test('intersects()', function() {
        var reservation = new Hoard.models.Reservation;
        reservation.set({start_at: 1000, end_at: 2000});

        ok(reservation.intersects(1100, 2100));
        ok(reservation.intersects(1100, 1900));
        ok(reservation.intersects(900, 2100));
        ok(reservation.intersects(900, 1900));
        ok(reservation.intersects(1000, 1900));
        ok(reservation.intersects(1100, 2000));
        ok(reservation.intersects(1000, 2000));
        ok( ! reservation.intersects(2000, 2100));
        ok( ! reservation.intersects(900, 1000));

        reservation.set({start_at: 1000, end_at: 1000});
        ok( ! reservation.intersects(1000, 1000));
    });

    test('validate()', function() {
        Hoard.reservations.add({ start_at: 100, end_at: 200 });
        var res = new Hoard.models.Reservation;

        equal(res.validate({ start_at: 10, end_at: 20 }), undefined);
        notEqual(res.validate({ start_at: 20, end_at: 10 }), undefined);
        notEqual(res.validate({ start_at: 10 }), undefined);
        notEqual(res.validate({ start_at: 150, end_at: 180 }), undefined);

    });

});
