var CollisionResolver = function() {
    this.volumes = [];
    this.bounciness = 1;
    this.friction = 0;
};
CollisionResolver.prototype.solveVolumes = function() {
    var collided = false;
    var pen;
    var penetration = {normal: new Vector(), length: 0};
    for(var i = 0; i < this.volumes.length; i++) {
        for(var j = 0; j < this.volumes.length; j++) {
            if(i === j) continue;
            var v1 = this.volumes[i], v2 = this.volumes[j];
            if(v1.intersects(v2, penetration)) {
                collided = true;
                penetration.normal = penetration.normal.scale(penetration.length);
                if(v2.fixed) {
                    v1.position.x += penetration.normal.x;
                    v1.position.y += penetration.normal.y;
                } else {
                    v2.position.x -= penetration.normal.x;
                    v2.position.y -= penetration.normal.y;
                }
            }
        }
    }
    return collided;
};
CollisionResolver.prototype.solveParticles = function(particles) {
    var collided = false;
    var penetration = {normal: new Vector(), length: 0};
    var v, vn, vt, dp;
    for(var i = 0; i < this.volumes.length; i++) {
        for(var j = 0; j < particles.length; j++) {
            var v = this.volumes[i], p = particles[j];
            if(v.intersects(p.volume, penetration)) {
                collided = true;
                pen = penetration.normal.scale(penetration.length);
                if(particle.volume.fixed) {
                    volume.position.x += pen.x;
                    volume.position.y += pen.y;
                } else {
                    particle.volume.x -= pen.x;
                    particle.volume.y -= pen.y;

                    // Calc new velocity using elastic collision with friction
                    // -> Split oldVelocity in normal and tangential component, revert normal component and add it afterwards
                    // v = pos - oldPos;
                    //vn = n * Vector2.Dot(v, n) * -Bounciness;
                    //vt = t * Vector2.Dot(v, t) * (1.0f - Friction);
                    //v = vn + vt;
                    //oldPos = pos - v;

                    v = particle.position.minus(particle.oldpos);
                    var tangent = penetration.normal.perpindicular();
                    dp = v.dot(penetration.normal);
                    vn = penetration.normal.scale(dp * -this.bounciness);
                    dp = v.dot(tangent);
                    vt = tangent.scale(dp * (1 - this.friction));
                    v = vn.plus(vt);
                    particle.position.x -= pen.x;
                    particle.position.y -= pen.y;
                    particle.oldpos = particle.position.minus(v);
                }
            }
        }
    }
    return collided;
};
