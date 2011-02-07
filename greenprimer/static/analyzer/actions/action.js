var actions = (function(self) {
    var stack = [], pointer = -1, max = pointer;
    var undoButton = null, redoButton = null;
    var disable = function(button) { button.attr('disabled', true); };
    var enable = function(button) { button.removeAttr('disabled'); };

    self.redo = function(done) {
        if(pointer >= max) return;
        var handle = stack[pointer + 1];
        if(!done) handle[0](handle[2]);
        pointer += 1;
        self.update();
    };

    self.undo = function() {
        if(pointer < 0) return;
        var handle = stack[pointer];
        handle[1](handle[2]);
        pointer -= 1;
        self.update();
    };

    self.make = function(redo, undo, done) {
        return function(arg) {
            var handle = [redo, undo, arg];
            stack[pointer + 1] = handle;
            max = pointer + 1;
            self.redo(done);
        };
    };

    self.update = function() {
        pointer < 0? disable(undoButton) : enable(undoButton);
        pointer >= max? disable(redoButton) : enable(redoButton);
    };

    $(function() {
        undoButton = $('#undo').click(util.noBubble(self.undo));
        redoButton = $('#redo').click(util.noBubble(self.redo));
        $('#undo, #redo').click(function(e) {
            gp.body.trigger('off.click', [e]);
        });
        self.update();
    });

    return self;
})(actions || {});
