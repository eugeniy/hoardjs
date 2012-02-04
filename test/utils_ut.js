$(function() {
    module('Util');

    test('parse_date', function() {
        var parseDateEqual = function(input, expected) {
            equal(Hoard.util.parse_date(input).toString(),
                  expected.toString());
        };

        var expected = new Date(1986, 0, 19, 13, 45);
        parseDateEqual('1/19/1986 1:45pm', expected);
        parseDateEqual('1/19/1986 1:45 PM', expected);
        parseDateEqual('1/19/1986 13:45', expected);
        parseDateEqual('01/19/1986 13:45', expected);

        var expected = new Date(1986, 5, 5, 1, 5);
        parseDateEqual('6/5/1986 1:05am', expected);
        parseDateEqual('6/5/1986 1:05 AM', expected);
        parseDateEqual('06/05/1986 1:05', expected);
        parseDateEqual('6/05/1986 01:05', expected);
    });

    test('format_date', function() {
        var formatDateEqual = function(actual, expected) {
            equal(Hoard.util.format_date(actual), expected);
        };

        formatDateEqual(new Date(1986, 0, 19, 13, 45), '1/19/1986 1:45pm');
        formatDateEqual(new Date(1986, 0, 19, 12), '1/19/1986 12:00pm');
        formatDateEqual(new Date(1986, 0, 19, 12, 1), '1/19/1986 12:01pm');
        formatDateEqual(new Date(1986, 0, 19), '1/19/1986 0:00am');
        formatDateEqual(new Date(1986, 0, 19, 0, 1), '1/19/1986 0:01am');
    });
});
