var merge_args = function(target, source) {
    return typeof(source) === 'undefined' ? target : $.extend(target, source);
};

var create_resource = function(input) {
    var args = merge_args({ id: 42, name: 'Panda Blade' }, input);
    return new Hoard.model.Resource(args);
};

var create_reservation = function(input) {
    var args = merge_args({ resource: create_resource().id }, input);
    return new Hoard.model.Reservation(args);
};
