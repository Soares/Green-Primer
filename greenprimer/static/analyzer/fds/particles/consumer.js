var ParticleConsumer = function() {
    this.position = new Vector();
    this.r2 = 1;
    this.enabled = true;
    return this;
};
ParticleConsumer.prototype.radius = function(val) {
    if(val) this.r2 = val * val;
    else return Math.sqrt(this.r2);
};
ParticleConsumer.prototype.consume = function(particles) {
    if(!this.enabled) return false;
    for(var i = particles.length - 1; i >= 0; i--) {
        var distsq = (particles[i].position.minus(this.position)).magSq();
        if(distsq < this.r2) particles.splice(i, 1);
    }
    return this;
};
