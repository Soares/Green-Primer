var util = (function(self) {

    self.eventCoords = function(e) {
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
        return [x, y];
    };

    self.coords = function(a, b) {
        if(a instanceof Point) {
            return [a.x, a.y];
        } else if(b === undefined) {
            var coords = self.eventCoords(a);
            return [coords[0] + gp.view.scrollLeft(),
                    coords[1] + gp.view.scrollTop()];
        }
        return [a, b];
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
