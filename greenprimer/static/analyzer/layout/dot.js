var Dot = function() {
    this.position = new Vector();
    this.circle = gp.svg.circle(0, 0, 4);
    this.$ = $(this.circle.node);
    this.$.addClass('guide');
    this.deactivate();
    return this;
};
Dot.prototype.move = function(point) {
    this.position.set(point);
    this.circle.animate({cx: point.x, cy: point.y});
    return this;
};
Dot.prototype.show = function() {
    if(this.active) this.$.show();
};
Dot.prototype.hide = function() {
    if(this.active) this.$.hide();
};
Dot.prototype.activate = function() {
    this.active = true;
};
Dot.prototype.deactivate = function() {
    this.active = false;
    this.$.hide();
};
Dot.prototype.jointsUnder = function() {
    return layout.joints.at(this.position);
};


/* Package
 * Will be initialized to contain a follower dot */
var dot = (function(self) {
    $(function() {
        self.follower = new Dot();
        $('#layout, #key').mouseover(function(e) {
            self.follower.show();
        }).mouseout(function(e) {
            self.follower.hide();
        }).mousemove(function(e) {
            self.follower.move(Vector.from(e).snapToGrid());
        });
    });

    return self;
})(dot || {});
