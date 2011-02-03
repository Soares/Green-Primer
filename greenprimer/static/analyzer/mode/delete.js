modes['delete'] = (function(self) {
    self.type = modes.SELECT;

    self.button = '#delete';

    var remove = actions.make(function(dump) {
        dump.maker.find(dump).remove();
    }, function(dump) {
        dump.maker.load(dump);
    });

    /*
    self.jointClick = function(e, click, joints) {
        $.each(joints, function(key, joint) {
            joint.remove();
        });
    };
    */

    self.wallClick = self.ventClick = function(e, click, elem) {
        remove(elem.dump());
    };

    return mode(self);
})({});

