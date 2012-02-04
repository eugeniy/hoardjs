String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};

Hoard.util.parse_date = function(value) {
    var parts = value.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)\s*(pm|am){0,1}/i);
    if (parts[6] !== undefined && parts[6].toLowerCase() === 'pm') {
        var hours = parseInt(parts[4]) + 12;
    } else {
        var hours = parts[4];
    }
    return new Date(parts[3], parts[1]-1, parts[2], hours, parts[5]);
};

Hoard.util.format_date = function(value) {
    var pad = function(n) { return (n < 2) ? '0' + n : n };

    var month = value.getMonth() + 1;
    var day = value.getDate();
    var year = value.getFullYear();
    var hour24 = value.getHours();
    var minute = value.getMinutes();
    var am_pm = (hour24 >= 12) ? 'pm' : 'am';
    var hour = (hour24 > 12) ? hour24-12 : hour24;

    return '{0}/{1}/{2} {3}:{4}{5}'.format(month, day, year,
                                           hour, pad(minute), am_pm);
};
