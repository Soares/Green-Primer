/* This module handles scrolling the screen when the joystick is used.
 * Jquery UI had to be patched to make this work. */
var scroll = (function(self) {
    self.MAX_DIST = 35; // pixels to edge of circle

    var SCALE_THRESHOLD = 20; // pixels before scrolling begins
    var SCALE_RANGE = self.MAX_DIST - SCALE_THRESHOLD;
    var ANGLE_THRESHOLD = .3; // Radians off axis before scrolling diagonally
    var SCROLL_AMOUNT = 10; // How much to scroll each time
    var MAX_SPEED = 100; // Miliseconds between max speed scroll
    var left, up, speed, interval;
    var origin = new Vector(0, 0);

    self.drag = function(e, ui) {
        var pos = new Vector(
            ui.position.left - ui.originalPosition.left,
            ui.position.top - ui.originalPosition.top);
        var direction = getDirection(pos);
        left = direction[0] * SCROLL_AMOUNT;
        up = direction[1] * SCROLL_AMOUNT;
        setSpeed(getSpeed(pos));
    };

    self.stop = function(e, ui) {
        if(interval) interval = clearInterval(interval);
    };

    var theta = function(x, y) {
        if(x > 0) return Math.atan(y/x);
        if(x < 0 && y >= 0) return Math.atan(y/x) + Math.PI;
        if(x < 0) return Math.atan(y/x) - Math.PI;
        if(x === 0) return y > 0? Math.PI / 2 : -Math.PI / 2;
        return 0;
    };

    var getSpeed = function(pos) {
        var distance = Math.round(pos.distanceFrom(origin));
        if(distance < SCALE_THRESHOLD) return 0;
        var lowToHigh = (distance - SCALE_THRESHOLD);
        var highToLow = SCALE_RANGE - lowToHigh;
        var ratio = highToLow / SCALE_RANGE;
        var scale = ((ratio * ratio * 4) + 1);
        var speed = MAX_SPEED * scale;
        return parseInt(speed);
    };

    var getDirection = function(unit) {
        var o = theta(unit.x, unit.y);
        var octant = Math.round(4*o/Math.PI);
        switch(octant) {
            case 0: return [1, 0];
            case 1: return [1, 1];
            case 2: return [0, 1];
            case 3: return [-1, 1];
            case 4:
            case -4: return [-1, 0];
            case -3: return [-1, -1];
            case -2: return [0, -1];
            case -1: return [1, -1];
        }
    };

    var setSpeed = function(s) {
        if(interval && speed === s) return;
        speed = s;
        if(interval) interval = clearInterval(interval);
        if(speed) interval = setInterval("scroll.scroll()", speed);
    };

    self.scroll = function() {
        $('#view').scrollTo({top: '+=' + up + 'px', left: '+=' + left + 'px'});
    };

    return self;
})(scroll || {});
