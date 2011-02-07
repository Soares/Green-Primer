var FluidParticle = function(position, oldpos, velocity, mass) {
    this.life = 0;
    this.mass = mass || 1;
    this.position = position || new Vector();
    this.oldpos = oldpos || this.position;
    this.velocity = velocity || new Vector();
    this.force = new Vector();
    this.density = fluids.DENSITY_OFFSET;
    this.solver = new Verlet(0.01);
    this.volume = new PointVolume(this.position, fluids.CELL_SPACE * 0.25);
    this.updatePressure();
    return this;
};
FluidParticle.prototype.updatePressure = function() {
    this.pressure = fluids.GAS_K * (this.density - fluids.DENSITY_OFFSET);
    return this;
};
FluidParticle.prototype.update = function(time) {
    this.life++;
    this.solver.solve(this.position, this.oldpos, this.velocity, this.force, this.mass, time);
    this.volume.position = this.position;
    return this;
};
FluidParticle.prototype.hash = function() {
    var x = ~~(this.position.x * fluids.PRIME_1);
    var y = ~~(this.position.y * fluids.PRIME_2);
    return x ^ y;
};
FluidParticle.prototype.equals = function(other) {
    if(other instanceof FluidParticle) return other.hash() === this.hash();
    return other === this;
};

FluidParticle.generate = function(n, cellspace, domain, mass) {
    var particles = [];
    var x0 = domain.x + cellspace;
    var x = x0;
    var y = domain.y;
    for(int i = 0; i < n; i++) {
        if(x === x0) y += cellspace;
        var pos = new Vector(x, y);
        particles.push(new FluidParticle(pos, pos, mass));
        x = x + cellspace < domain.width? x + cellspace : x0;
    }
    return particles;
};
