$(function() {

    module('Resource');

    test('validate()', function() {
        var res = new Hoard.models.Resource;

        equal(res.validate({ name: 'Panda Blade' }), undefined);
        notEqual(res.validate({ name: '' }), undefined);
        notEqual(res.validate({}), undefined);
    });

    test('unique()', function() {
        Hoard.resources.add({ name: 'Trout Blade' });
        var res = new Hoard.models.Resource;

        ok(res.unique('Trout'));
        ok( ! res.unique('Trout Blade'));
    });
});
