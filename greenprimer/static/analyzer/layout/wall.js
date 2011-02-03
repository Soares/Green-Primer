var Wall = function(source, dest, id) {
    var handle = this;
    layout.register(layout.WALL, this, id);
    this.source = source.attach(this);
    this.dest = dest.attach(this);
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.line.node);
    this.update();

    this.$.addClass('wall').click(function(e) {
        gp.layout.trigger('wall.click', [e, handle]);
    }).data('id', this.id);

    return this;
};

Wall.find = function(dump) {
    return layout.walls.get(dump.id);
};
Wall.load = function(dump) {
    return new Wall(
        Joint.load(dump.source),
        Joint.load(dump.dest),
        dump.id);
};

Wall.prototype.is = function(elem) {
    return elem.data('id') === this.id;
};
Wall.prototype.update = function() {
    this.line.animate({path: [
        ['M', this.source.position.x, this.source.position.y],
        ['L', this.dest.position.x, this.dest.position.y]]});
    this.line.backward(3);
    return this;
};
Wall.prototype.placeholder = function() {
    this.$.addClass('surreal');
    return this;
};
Wall.prototype.move = function(source, dest) {
    this.source.move(source);
    this.dest.move(dest);
    return this;
};
Wall.prototype.shift = function(delta) {
    this.source.shift(delta);
    this.dest.shift(delta);
    return this;
}
Wall.prototype.remove = function() {
    /* Destroys joints if necessary */
    this.source.detach(this);
    this.dest.detach(this);
    this.line.remove();
    layout.forget(this);
    return null;
};
Wall.prototype.swap = function(current, next) {
    if(current.id === this.source.id) {
        this.source = next;
    } else if(current.id === this.dest.id) {
        this.dest = next;
    } else throw "Bad swap: no such joint.";
    current.detach(this);
    next.attach(this);
    return this;
};
Wall.prototype.not = function(joint) {
    if(this.source.id === joint.id) return this.source;
    if(this.dest.id === joint.id) return this.dest;
    return false;
};
Wall.prototype.cut = function() {
    var x = (this.source.position.x + this.dest.position.x) / 2;
    var y = (this.source.position.y + this.dest.position.y) / 2;
    var mid = new Joint(new Vector(x, y).snapToGrid());
    var child = new Wall(mid, this.dest);
    this.swap(this.dest, mid);
    this.update();
    return this;
};
Wall.prototype.geomLine = function() {
    return new Line(this.source.position, this.dest.position);
};
Wall.prototype.dump = function() {
    return {
        maker: Wall,
        id: this.id,
        source: this.source.dump(),
        dest: this.dest.dump(),
    };
};
