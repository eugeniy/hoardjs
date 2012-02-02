$(function() {
    module('Util');

    test('parse_date', function() {
        var expected = new Date(1986, 0, 19, 13, 45);
        equal(Hoard.util.parse_date('1/19/1986 1:45pm'), expected);
        equal(Hoard.util.parse_date('1/19/1986 1:45 PM'), expected);
        equal(Hoard.util.parse_date('1/19/1986 13:45'), expected);
        equal(Hoard.util.parse_date('01/19/1986 13:45'), expected);
        var expected = new Date(1986, 5, 5, 1, 45);
        equal(Hoard.util.parse_date('06/05/1986 1:45'), expected);
        equal(Hoard.util.parse_date('6/5/1986 1:45am'), expected);
        equal(Hoard.util.parse_date('6/5/1986 1:45 AM'), expected);
    });
});
