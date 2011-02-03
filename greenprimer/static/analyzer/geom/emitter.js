/* 
	Parcycle: by Mr Speaker - www.mrspeaker.net
	v: 1.0
	license: MIT
	
	Particle Emitter classes based on the code from 71squared.com iPhone tutorials
	
	includes:
		Particle : class for individual particles
		ParticleSystem : the controller for the particles

    Parcycle is licensed under the MIT License. By using this software,
    you agree with the terms specified below. The license agreement extends to all
    the files within this installation.
*/

var Emitter = function(position, direction) {
    this.particles = [];
    this.active = true;
    this.maxParticles = 500;
    this.position = position;
    this.gravity = direction;

    // Tweak these
    this.positionRandom = new Vector();
    this.size = 15;
    this.sizeRandom = 3;
    this.speed = 4;
    this.speedRandom = .005;
    this.lifeSpan = 300;
    this.lifeSpanRandom = 100;
    this.angle = 0;
    this.angleRandom = 360;
    this.startColour = [ 20, 200, 50, 1 ];
    this.startColourRandom = [ 0, 0, 60, .1 ];
    this.endColour = [ 128, 255, 200, 0 ];  
    this.endColourRandom = [ 60, 60, 60, 0 ];
    this.sharpness = 40;
    this.sharpnessRandom = 10;

    this.particleCount = 0;
    this.elapsedTime = 0;
    this.duration = -1;
    this.emissionRate = 0;
    this.emitCounter = 0;
    this.particleIndex = 0;

    this.init = function(){
        this.emissionRate = this.maxParticles / this.lifeSpan;
        this.emitCounter = 0;
    };

    this.addParticle = function(){
        if(this.particleCount == this.maxParticles) {
            return false;
        }

        // Take the next particle out of the particle pool we have created and initialize it	
        var particle = new Particle();
        this.initParticle( particle );
        this.particles[ this.particleCount ] = particle;
        // Increment the particle count
        this.particleCount++;

        return true;
    };

    this.initParticle = function( particle ){
        var RANDM1TO1 = function(){ return Math.random() * 2 - 1; };

        particle.position.x = this.position.x + this.positionRandom.x * RANDM1TO1();
        particle.position.y = this.position.y + this.positionRandom.y * RANDM1TO1();

        var newAngle = (this.angle + this.angleRandom * RANDM1TO1() ) * ( Math.PI / 180 ); // convert to radians
        var vector = new Vector(Math.cos( newAngle ), Math.sin( newAngle )); // Could move to lookup for speed
        var vectorSpeed = this.speed + this.speedRandom * RANDM1TO1();
        particle.direction = vector.scale(vectorSpeed);

        particle.size = this.size + this.sizeRandom * RANDM1TO1();
        particle.size = particle.size < 0 ? 0 : ~~particle.size;
        particle.timeToLive = this.lifeSpan + this.lifeSpanRandom * RANDM1TO1();

        particle.sharpness = this.sharpness + this.sharpnessRandom * RANDM1TO1();
        particle.sharpness = particle.sharpness > 100 ? 100 : particle.sharpness < 0 ? 0 : particle.sharpness;
        // internal circle gradient size - affects the sharpness of the radial gradient
        particle.sizeSmall = ~~( ( particle.size / 200 ) * particle.sharpness ); //(size/2/100)

        var start = [
            this.startColour[ 0 ] + this.startColourRandom[ 0 ] * RANDM1TO1(),
            this.startColour[ 1 ] + this.startColourRandom[ 1 ] * RANDM1TO1(),
            this.startColour[ 2 ] + this.startColourRandom[ 2 ] * RANDM1TO1(),
            this.startColour[ 3 ] + this.startColourRandom[ 3 ] * RANDM1TO1()
                ];

        var end = [
            this.endColour[ 0 ] + this.endColourRandom[ 0 ] * RANDM1TO1(),
            this.endColour[ 1 ] + this.endColourRandom[ 1 ] * RANDM1TO1(),
            this.endColour[ 2 ] + this.endColourRandom[ 2 ] * RANDM1TO1(),
            this.endColour[ 3 ] + this.endColourRandom[ 3 ] * RANDM1TO1()
                ];

        particle.colour = start;
        particle.deltaColour[ 0 ] = ( end[ 0 ] - start[ 0 ] ) / particle.timeToLive;
        particle.deltaColour[ 1 ] = ( end[ 1 ] - start[ 1 ] ) / particle.timeToLive;
        particle.deltaColour[ 2 ] = ( end[ 2 ] - start[ 2 ] ) / particle.timeToLive;
        particle.deltaColour[ 3 ] = ( end[ 3 ] - start[ 3 ] ) / particle.timeToLive;
    };

    this.update = function( delta ){
        if( this.active && this.emissionRate > 0 ){
            var rate = 1 / this.emissionRate;
            this.emitCounter += delta;
            while( this.particleCount < this.maxParticles && this.emitCounter > rate ){
                this.addParticle();
                this.emitCounter -= rate;
            }
            this.elapsedTime += delta;
            if( this.duration != -1 && this.duration < this.elapsedTime ){
                this.stop();
            }
        }

        this.particleIndex = 0;
        while( this.particleIndex < this.particleCount ) {

            var currentParticle = this.particles[ this.particleIndex ];

            // If the current particle is alive then update it
            if( currentParticle.timeToLive > 0 ){

                // Calculate the new direction based on gravity
                currentParticle.update(delta, this.gravity);

                // Update colours based on delta
                var r = currentParticle.colour[ 0 ] += ( currentParticle.deltaColour[ 0 ] * delta );
                var g = currentParticle.colour[ 1 ] += ( currentParticle.deltaColour[ 1 ] * delta );
                var b = currentParticle.colour[ 2 ] += ( currentParticle.deltaColour[ 2 ] * delta );
                var a = currentParticle.colour[ 3 ] += ( currentParticle.deltaColour[ 3 ] * delta );

                // Calculate the rgba string to draw.
                var draw = [];
                draw.push("rgba(" + ( r > 255 ? 255 : r < 0 ? 0 : ~~r ) );
                draw.push( g > 255 ? 255 : g < 0 ? 0 : ~~g );
                draw.push( b > 255 ? 255 : b < 0 ? 0 : ~~b );
                draw.push( (a > 1 ? 1 : a < 0 ? 0 : a.toFixed( 2 ) ) + ")");
                currentParticle.drawColour = draw.join( "," );

                this.particleIndex++;
            } else {
                // Replace particle with the last active 
                if( this.particleIndex != this.particleCount - 1 ){
                    this.particles[ this.particleIndex ] = this.particles[ this.particleCount-1 ];
                }
                this.particleCount--;
            }
        }
    };

    this.stop = function(){
        this.active = false;
        this.elapsedTime = 0;
        this.emitCounter = 0;
    };

    this.render = function( context ){
        for( var i = 0, j = this.particleCount; i < j; i++ ){
            var particle = this.particles[ i ];
            var size = particle.size;
            var halfSize = size >> 1;
            var x = ~~particle.position.x;
            var y = ~~particle.position.y;

            var radgrad = context.createRadialGradient( x + halfSize, y + halfSize, particle.sizeSmall, x + halfSize, y + halfSize, halfSize);  
            radgrad.addColorStop( 0, particle.drawColour );   
            radgrad.addColorStop( 1, 'rgba(0,0,0,0)' ); //Super cool if you change these values (and add more colour stops)
            context.fillStyle = radgrad;
            context.fillRect( x, y, size, size );
        }
    };	
};
