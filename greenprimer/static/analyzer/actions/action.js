var actions = (function(self) {
    var stack = [], pointer = -1, max = pointer;
    var undoButton = null, redoButton = null;
    var disable = function(button) { button.attr('disabled', true); };
    var enable = function(button) { button.removeAttr('disabled'); };

    self.redo = function() {
        if(pointer >= max) return;
        var handle = stack[pointer + 1];
        var redo = handle[0], args = handle[1];
        handle[3] = redo.apply(this, args);
        pointer += 1;
        self.update();
    };

    self.undo = function() {
        if(pointer < 0) return;
        var handle = stack[pointer];
        var undo = handle[2], arg = handle[3];
        undo(arg);
        pointer -= 1;
        self.update();
    };

    self.make = function(redo, undo) {
        return function() {
            var handle = [redo, arguments, undo, undefined];
            stack[pointer + 1] = handle;
            max = pointer + 1;
            self.redo();
        };
    };

    self.update = function() {
        pointer < 0? disable(undoButton) : enable(undoButton);
        pointer >= max? disable(redoButton) : enable(redoButton);
    };

    $(function() {
        undoButton = $('#undo').click(util.noBubble(self.undo));
        redoButton = $('#redo').click(util.noBubble(self.redo));
        self.update();
    });

    return self;
})(actions || {});
