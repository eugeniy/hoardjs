var Hoard = Hoard || {};
Hoard.models = Hoard.models || {};
Hoard.views = Hoard.views || {};
Hoard.collections = Hoard.collections || {};

Hoard.utils = Hoard.utils || {};

Hoard.reservations = Hoard.reservations || {};
Hoard.resources = Hoard.resources || {};


Hoard.utils.parse_date = function(value) {
    var parts = value.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)\s*(pm|am){0,1}/i);
    if (parts[6] !== undefined && parts[6].toLowerCase() === 'pm') {
        var hours = parseInt(parts[4]) + 12;
    } else {
        var hours = parts[4];
    }
    return new Date(parts[3], parts[1]-1, parts[2], hours, parts[5]);
};



