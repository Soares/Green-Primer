$(function() {
    layout.load(global.outline);
    gp.body.trigger('engage.mode', modes.outerwall);
});

var graph = (function(self) {
    self.update = function() {};
    return self;
})(graph || {});
