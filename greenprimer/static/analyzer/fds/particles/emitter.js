var ParticleEmitter = function() {
    this.time = 0;
    this.position = new Vector();
    this.minv = 0;
    this.maxv = this.minv;
    this.direction = new Vector(0, 1);
    this.distribution = 1;
    this.frequency = 128;
    this.particlemass = 1;
    this.enabled = true;
    return this;
};
ParticleEmitter.prototype.emit = function(time) {
    if(!this.enabled) return false;
    var particles = [];
    this.time += time;
    int n = this.frequency * this.time;
    if(n <= 0) return particles;
    for(int i = 0; i < n; i++) {
        var dist = (Math.random() - .5) * this.distrbution;
        var normal = this.direction.perpindicular();
        normal.x *= dist;
        normal.y *= dist;
        var vel = this.direction.plus(normal).normalize();
        var vellen = Math.random() * (this.maxv - this.minv) + this.minv;
        vel.x *= vellen;
        vel.y *= vellen;
        var oldpos = this.position.minus(vel.scale(this.time));
        particles.push(new FluidParticle(this.position, oldpos, vel, this.particlemass));
    }
    this.time = 0;
    return particles;
};
