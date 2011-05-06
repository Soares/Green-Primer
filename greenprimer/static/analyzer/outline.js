/* The code for the outline editor and floor editor are mostly the same,
 * with minor differences. This is the code that is only loaded on the
 * outline side, and kicks off all of the outline mode stuff. */
$(function() {
    layout.load(global.outline);
    gp.body.trigger('engage.mode', modes.outerwall);
});

var graph = (function(self) {
    self.update = function() {};
    return self;
})(graph || {});
