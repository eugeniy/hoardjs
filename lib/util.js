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
    var month = value.getMonth() + 1;
    var day = value.getDate();
    var year = value.getFullYear();
    var hour = value.getHours();
    var minute = value.getMinutes();
    var am_pm = (hour >= 12) ? 'pm' : 'am';
};
