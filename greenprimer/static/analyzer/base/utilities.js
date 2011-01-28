var util = (function(self) {

    self.eventCoords = function(e, adjust) {
        var x = 0, y = 0;
        if(e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else if(e.clientX || e.clientY) {
            x = e.clientX + document.body.scrollLeft
                          + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop
                          + document.documentElement.scrollTop;
        }
        if(adjust) {
            x += gp.view.scrollLeft();
            y += gp.view.scrollTop();
        }
        return [x, y];
    };

    self.array = function(args) {
        return Array.prototype.slice.call(args);
    };

    self.noBubble = function(fn) {
        return function(e) {
            fn();
            e.stopPropagation();
        };
    };

    return self;
})(util || {});
