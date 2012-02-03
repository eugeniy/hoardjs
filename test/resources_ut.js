$(function() {
    module('Resource');

    test('validate()', function() {
        var res = create_resource();

        equal(res.validate({ name: 'Panda Blade' }), undefined);
        notEqual(res.validate({ name: '' }), undefined);
        notEqual(res.validate({}), undefined);
    });

    test('unique()', function() {
        Hoard.resources.add({ name: 'Trout Blade' });
        var res = create_resource();

        ok(res.unique('Trout'));
        ok( ! res.unique('Trout Blade'));
    });
});
