modes['delete'] = (function(self) {
    self.button = '#delete';

    var recordRemove = actions.make(function(dump) {
        Elem.load(dump).remove();
    }, function(dump) {
        Elem.load(dump);
    });

    self.wallClick = self.windowClick = self.doorClick = function(e, click, elem) {
        recordRemove(elem.dump());
        elem.remove();
    };
    self.jointClick = function(e, click, joints) {
        $.each(joints, function(key, joint) {
            recordRemove(joint.dump());
            joint.remove();
        });
    };

    return mode(self);
})({});

