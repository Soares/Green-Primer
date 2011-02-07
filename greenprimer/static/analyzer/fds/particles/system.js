var ParticleSystem = new function() {
    this.emitters = [];
    this.consumers = [];
    this.maxlife = 1024;
    this.maxparticles = 4096;
    this.regen = true;
    this.testlife = true;
    this.reset();

    this._hitmax = false;
};
ParticleSystem.prototype.reset = function() {
    this.particles = [];
    this._hitmax = false;
};
ParticleSystem.prototype.update = function(time) {
    var particles = this.particles;
    var emitted = null;
    $.each(this.consumers, function(key, consumer) {
        consumer.consume(particles);
    });
    if(this.testlife) {
        for(var i = this.particles.length - 1; i >= 0; i--) {
            if(this.particles[i].life >= this.maxlife) {
                this.particles.splice(i, 1);
            }
        }
    }
    if(this._hitmax && !this.regen) {}
    else if(this.particles.length < this.maxparticles) {
        $.each(this.emitters, function(key, emitter) {
            emitted = emitter.emit(time);
            $.merge(particles, emitted);
        });
    } else this._hitmax = true;
    return emitted;
};
