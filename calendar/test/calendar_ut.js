$(function() {
    module('Calendar');

    test('new',function(){
       ok(!! new Calendar({title:'Week', selection:'Feb 5 - 11, 2012', days: [{title:'Sun 2/5'},{title:'Mon 2/6'},{title:'Tue 2/7'},{title:'Wed 2/8'},{title:'Thu 2/9'},{title:'Fri 2/10'},{title:'Sat 2/11'}] })); 
    });
    
    test('get', function() {
        equal((new Calendar({title:'Week', selection:'Feb 5 - 11, 2012', days: [{title:'Sun 2/5'},{title:'Mon 2/6'},{title:'Tue 2/7'},{title:'Wed 2/8'},{title:'Thu 2/9'},{title:'Fri 2/10'},{title:'Sat 2/11'}] })).get('title'),
              'Week');
        equal((new Calendar({title:'Week', selection:'Feb 5 - 11, 2012', days: [{title:'Sun 2/5'},{title:'Mon 2/6'},{title:'Tue 2/7'},{title:'Wed 2/8'},{title:'Thu 2/9'},{title:'Fri 2/10'},{title:'Sat 2/11'}] })).get('selection'),
              'Feb 5 - 11, 2012');
        equal((new Calendar({title:'Week', selection:'Feb 5 - 11, 2012', days: [{title:'Sun 2/5'},{title:'Mon 2/6'},{title:'Tue 2/7'},{title:'Wed 2/8'},{title:'Thu 2/9'},{title:'Fri 2/10'},{title:'Sat 2/11'}] })).get('days')[0].title,
              'Sun 2/5');
    });

});
