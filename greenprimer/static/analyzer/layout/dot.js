var Dot = function() {
    this.point = new Point();
    this.circle = gp.svg.circle(0, 0, 4);
    this.$ = $(this.circle.node);
    this.$.addClass('guide');
    this.deactivate();
    return this;
};
Dot.prototype.move = function(point) {
    this.point.move(point);
    this.circle.animate({cx: this.point.x, cy: this.point.y});
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
    return joints.at(this.point);
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
            self.follower.move(layout.point(e));
        });
    });

    return self;
})(dot || {});
