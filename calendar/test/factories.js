var merge_args = function(target, source) {
    return typeof(source) === 'undefined' ? target : $.extend(target, source);
};

var create_calendar = function(input) {
    var args = merge_args({title:'Week', selection:'Feb 5 - 11, 2012', days: [{title:'Sun 2/5'},{title:'Mon 2/6'},{title:'Tue 2/7'},{title:'Wed 2/8'},{title:'Thu 2/9'},{title:'Fri 2/10'},{title:'Sat 2/11'}] }, input);
    return new Calendar(args);
};