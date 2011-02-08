var vents = (function(self) {
    return elements(self);
})(vents || {});

var Vent = function(point, direction, id) {
    this.point = point;
    this.circle = gp.svg.circle(this.point.x, this.point.y, 7);
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.circle.node).add($(this.line.node));
    this.direction = direction || new Vector(1, 0);
    this.reorient();

    var self = this;
    this.$.addClass('vent').click(function(e) {
        gp.layout.trigger('vent.click', [e, self]);
    });
    this.init(id);
};
Elem(Vent, vents);

Vent.deserialize = function(object, id) {
    return new Vent(object.point, object.direction, id);
};
Vent.prototype.serialize = function() {
    return {point: this.point, direction: this.direction};
};
Vent.load = function(dump) {
    return Vent.find(dump) || new Vent(dump.point, dump.direction, dump.id);
};
Vent.find = function(dump) {
    return layout.vents.get(dump.id);
};

Vent.prototype.shift = function(delta) {
    this.point.x += delta.x;
    this.point.y += delta.y;
    this.update();
    return this;
};
Vent.prototype.update = function() {
    this.reorient();
    this.circle.animate({cx: this.point.x, cy: this.point.y});
};
Vent.prototype.reorient = function() {
    if(this.direction.x === 0 && this.direction.y === 0) return;
    this.direction = new Vector(this.direction.x, this.direction.y);
    this.direction.normalize();
    this.direction.scale(9);
    var dest = this.direction.plus(this.point);
    this.line.animate({path: [
        ['M', this.point.x, this.point.y],
        ['L', dest.x, dest.y]]});
    return this;
};
Vent.prototype.remove = function() {
    this.circle.remove();
    this.line.remove();
    vents.forget(this);
    return null;
};
