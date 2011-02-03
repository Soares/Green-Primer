var Vent = function(point, direction, id) {
    var handle = this;
    layout.register(layout.VENT, this, id);
    this.position = point;
    this.circle = gp.svg.circle(this.position.x, this.position.y, 7);
    this.line = gp.svg.path('M0 0L1 1');
    this.$c = $(this.circle.node).addClass('vent');
    this.$l = $(this.line.node).addClass('vent');
    this.reorient(direction || new Vector(1, 0));
    this.emitter = new Emitter(this.position, this.direction);

    var onclick = function(e) {
        gp.layout.trigger('vent.click', [e, handle]);
    };
    this.$c.click(onclick);
    this.$l.click(onclick);

    return this;
};
Vent.load = function(dump) {
    return new Vent(dump.point, dump.direction, dump.id);
};
Vent.find = function(dump) {
    return layout.vents.get(dump.id);
};

Vent.prototype.reorient = function(vector) {
    this.direction = vector.normalize().scale(9);
    var dest = this.position.plus(this.direction);
    this.line.animate({path: [
        ['M', this.position.x, this.position.y],
        ['L', dest.x, dest.y]]});
    return this;
};
Vent.prototype.placeholder = function() {
    this.$c.addClass('surreal');
    this.$l.addClass('surreal');
    return this;
};
Vent.prototype.reset = function() {
    this.emitter.reset();
};
Vent.prototype.update = function() {
    this.emitter.update(1);
};
Vent.prototype.draw = function(context) {
    this.emitter.render(context);
};
Vent.prototype.remove = function() {
    this.circle.remove();
    this.line.remove();
    layout.forget(this);
    return undefined;
};
Vent.prototype.dump = function() {
    return {
        maker: Vent,
        point: this.position,
        direction: this.direction,
        id: this.id,
    };
};
