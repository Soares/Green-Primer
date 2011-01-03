var scroll = (function(self) {
    self.MAX_DIST = 35; // pixels to edge of circle

    var SCALE_THRESHOLD = 20; // pixels before scrolling begins
    var SCALE_RANGE = self.MAX_DIST - SCALE_THRESHOLD
    var ANGLE_THRESHOLD = .3 // Radians off axis before scrolling diagonally
    var SCROLL_THRESHOLD = 200; // Milliseconds between scrolls
    var lastscroll = (new Date()).getTime();

    self.drag = function(e, ui) {
        if(!okToScroll()) return;
        var pos = $V([
            ui.position.left - ui.originalPosition.left,
            ui.position.top - ui.originalPosition.top]);
        var dist = pos.distanceFrom([0, 0]);
        if(dist > SCALE_THRESHOLD) {
            scroll(getWhich(pos.toUnitVector()), getScale(dist));
        }
    };

    var theta = function(x, y) {
        if(x > 0) return Math.atan(y/x);
        if(x < 0 && y >= 0) return Math.atan(y/x) + Math.PI;
        if(x < 0) return Math.atan(y/x) - Math.PI;
        if(x === 0) return y > 0? Math.PI / 2 : -Math.PI / 2;
        return 0;
    };

    var okToScroll = function() {
        var now = (new Date()).getTime(), delta = now - lastscroll;
        if(delta < SCROLL_THRESHOLD) return false;
        lastscroll = now;
        return true;
    };

    var getWhich = function(unit) {
        var x = unit.elements[0], y = unit.elements[1], o = theta(x, y);
        switch(Math.round(4*o/Math.PI)) {
            case 0: return 'E';
            case 1: return 'SE';
            case 2: return 'S';
            case 3: return 'SW';
            case 4:
            case -4: return 'W';
            case -3: return 'NW';
            case -2: return 'N';
            case -1: return 'NE';
        }
    };

    var getScale = function(dist) {
        return (dist - SCALE_THRESHOLD) / SCALE_RANGE;
    };

    var scroll = function(which, scale) {
      var x = 0, y = 0;
      if(which.indexOf('N') != -1) y = -1;
      if(which.indexOf('S') != -1) y = 1;
      if(which.indexOf('W') != -1) x = -1;
      if(which.indexOf('E') != -1) x = 1;
      var scroll = parseInt(scale * scale * (gp.GRID / 2));
      $('#view').scrollTo({
          top: '+='+(scroll * y) + 'px',
          left: '+=' + (scroll * x) + 'px'
      });
    };

    return self;
})(scroll || {});
