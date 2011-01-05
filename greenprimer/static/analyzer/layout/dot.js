/* Dot Object
 * A dot represented on the green primer paper
 * can be moved around the page */
var Dot = function() {
    // Private
    this.circle = gp.paper.circle(0, 0, 4);
    return this;
};
Dot.prototype.move = function(point) {
    this.circle.animate({cx: point.x, cy: point.y});
    return this;
};


/* Package
 * Will be initialized to contain a follower dot */
var dot = (function(self) {
    $(document).ready(function() {
        self.follower = new Dot();
        gp.canvas.mousemove(function(e) {
            self.follower.move(new Vector(e));
        });
    });

    return self;
})(dot || {});
