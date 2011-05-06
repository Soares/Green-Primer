/* This module contains the particle emitters which are created for each vent */
var physics = (function(self) {
    var interval, counter = 0, world, emitters;
    
    var Emitter = function(position, direction, rate, cap) {
        this.position = position;
        this.direction = direction;
        this.rate = rate;
        this.cap = cap;
        this.count = 0;
    };
    Emitter.prototype.step = function() {
        for(var i = 0; i < this.rate; i++) {
            if(this.count >= this.cap) break;
            try { createPoint(this.position, this.direction); }
            catch(e) { break; }
            this.count++;
        };
    };

    self.reset = function() {
        emitters = [];
        world = create();
        /*
        createBox(0, 0, 1, gp.HEIGHT);
        createBox(0, 0, gp.WIDTH, 1);
        createBox(gp.WIDTH - 1, 0, 1, gp.HEIGHT);
        createBox(0, gp.HEIGHT - 1, gp.WIDTH, 1);
        */
    };
    self.start = function() {
        clearInterval(interval);
        interval = setInterval(step, 10);
    };
    self.stop = function() {
        interval = clearInterval(interval);
        world = null;
        emitters = null;
        gp.context.clearRect(0, 0, gp.WIDTH, gp.HEIGHT);
    };

    self.addLine = function(line, width) {
        var box = new b2BoxDef();
        box.extents.Set(line.end.distanceFrom(line.start) / 2, width);
        var body = new b2BodyDef();
        body.AddShape(box);
        var x = (line.start.x + line.end.x) / 2;
        var y = line.y(x);
        if(isNaN(y)) y = (line.start.y + line.end.y) / 2;
        body.position.Set(x, y);
        body.rotation = line.angle;
        world.CreateBody(body);
        return body;
    };
    self.addEmitter = function(position, direction, rate, cap) {
        emitters.push(new Emitter(position, direction, rate, cap));
    };

    var color = function() {
        var h = 100 + (70 * Math.random());
        return 'hsla(' + h + ', 76%, 50%, .8)';
    };

    var step = function() {
        for(var i = 0; i < emitters.length; i++) emitters[i].step();
        world.Step(1.0 / 60, 1);
        gp.context.clearRect(0, 0, gp.WIDTH, gp.HEIGHT);
        draw();
    };

    var create = function() {
        var worldAABB = new b2AABB();
        worldAABB.minVertex.Set(0, 0);
        worldAABB.maxVertex.Set(gp.WIDTH, gp.HEIGHT);
        var world = new b2World(worldAABB, new b2Vec2(0, 0), true);
        return world;
    };

    var createPoint= function(p, v) {
        var circle = new b2CircleDef();
        circle.density = 1.0;
        // Note that rand * rand biases towards the middle
        circle.radius = 4 + (2 * Math.random() * Math.random());
        circle.restitution = 1.0;
        circle.friction = 0;
        var body = new b2BodyDef();
        body.AddShape(circle);
        body.position.Set(p.x, p.y);

        v = new Vector(v.x, v.y);
        var rand = Math.random() * 2 - 1;
        var angle = Math.PI / 16;
        v.rotate(angle * rand);
        v.scale(100 + (50 * Math.random() * Math.random()));
        body.linearVelocity.Set(v.x, v.y);
        world.CreateBody(body);
        return body;
    };

    var createBox = function(x, y, width, height) {
        var box = new b2BoxDef();
        box.extents.Set(width, height);
        var body = new b2BodyDef();
        body.AddShape(box);
        body.position.Set(x, y);
        world.CreateBody(body);
        return body;
    };

    var draw = function() {
        for (var b = world.m_bodyList; b; b = b.m_next) {
            for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
                if(s.m_type === b2Shape.e_circleShape) drawCircle(s);
                //if(s.m_type === b2Shape.e_polyShape) drawPolygon(s);
            }
        }
    };

    var drawCircle = function(shape) {
        if(!shape.color) shape.color = color();
        gp.context.beginPath();
        gp.context.fillStyle = shape.color;
        var x = shape.m_position.x, y = shape.m_position.y;
        gp.context.arc(x, y, shape.m_radius, 0, Math.PI*2, true);
        gp.context.closePath();
        gp.context.fill();
    };

    var drawPolygon = function(shape) {
        gp.context.beginPath();
        gp.context.fillStyle = '#000000';
        var tV = b2Math.AddVV(shape.m_position, b2Math.b2MulMV(shape.m_R, shape.m_vertices[0]));
        gp.context.moveTo(tV.x, tV.y);
        for (var i = 0; i < shape.m_vertexCount; i++) {
            var v = b2Math.AddVV(shape.m_position, b2Math.b2MulMV(shape.m_R, shape.m_vertices[i]));
            gp.context.lineTo(v.x, v.y);
        }
        gp.context.lineTo(tV.x, tV.y);
        gp.context.closePath();
        gp.context.fill();
    };

    return self;
})(physics || {});
