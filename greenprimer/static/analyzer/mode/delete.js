modes['delete'] = (function(self) {
    self.button = '#delete';

    var recordRemove = actions.make(function(dump) {
        Elem.load(dump).remove();
        graph.update();
    }, function(dump) {
        Elem.load(dump);
        graph.update();
    });

    self.wallClick = function(e, click, wall) {
        if(global.inner && wall.outer) return;
        recordRemove(wall.dump());
        wall.remove();
        graph.update();
    };
    self.windowClick = function(e, click, win) {
        if(global.inner) return;
        recordRemove(win.dump());
        win.remove();
    };
    self.doorClick = function(e, click, door) {
        if(global.inner && door.wall.outer) return;
        recordRemove(door.dump());
        door.remove();
        graph.update();
    };

    self.jointClick = function(e, click, joints) {
        if(global.inner) return;
        $.each(joints, function(key, joint) {
            recordRemove(joint.dump());
            joint.remove();
            graph.update();
        });
    };

    return mode(self);
})({});

