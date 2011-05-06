/* This is the file that handles undo and redo.
 * It provides a "make" function, which takes the undo/redo functions and
 * returns a action function that should be called any time the undo/redoable
 * action occurs. After calling actions.make with your undo/redo function,
 * just call the result any time you do the action and this module will
 * handle the rest. */
var actions = (function(self) {
    var stack = [], pointer = -1, max = pointer;
    var undoButton = null, redoButton = null;
    var disable = function(button) { button.attr('disabled', true).addClass('disabled'); };
    var enable = function(button) { button.removeAttr('disabled').removeClass('disabled'); };

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

    self.make = function(redo, undo) {
        return function(arg) {
            var handle = [redo, undo, arg];
            stack[pointer + 1] = handle;
            max = pointer + 1;
            self.redo(true);
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
