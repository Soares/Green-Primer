var physics = (function(self) {
    var interval, counter = 0, world;

    $(function() { interval = setInterval(step, 10); });

    var step = function(count) {
        var stepping = false;
        var timestep = 1.0 / 60;
        var iteration = 1;
        world.Step(timestep, iteration);
        gp.context.clearRect(0, 0, 1024, 512);
        drawWorld(world, gp.context);
    };

    var createWorld = function() {
        var worldAABB = new b2AABB();
        worldAABB.minVertex.Set(0, 0);
        worldAABB.maxVertex.Set(1024, 512);
        var gravity = new b2Vec2(0, 0);
        var doSleep = true;
        var world = new b2World(worldAABB, gravity, doSleep);
        createBorders(world);
        return world;
    };

    var createBorders = function(world) {
        var groundSd = new b2BoxDef();
        groundSd.extents.Set(1000, 50);
        groundSd.restitution = .2;
        var groundBd = new b2BodyDef();
        groundBd.AddShape(groundSd);
        groundBd.position.Set(-500, 340);
    };

    var createBall = function(world, x, y, r) {
        var ballSd = new b2CircleDef();
        ballSd.density = 1.0;
        ballSd.radius = r || 20;
        ballSd.restitution = 1.0;
        ballSd.friction = 0;
        var ballBd = new b2BodyDef();
        ballBd.AddShape(ballSd);
        ballBd.position.Set(x,y);
        ballBd.linearVelocity.Set(x, y);
        console.log(ballSd, ballBd);
        return world.CreateBody(ballBd);
    }

    var createBox = function(world, x, y, width, height, r) {
        var boxSd = new b2BoxDef();
        boxSd.extents.Set(width, height);
        var boxBd = new b2BodyDef();
        boxBd.AddShape(boxSd);
        boxBd.position.Set(x,y);
        if(r) boxBd.rotation = r;
        return world.CreateBody(boxBd)
    }

    var createPoly = function(world, vertices) {
        var polySd = new b2PolyDef();
        console.log(polySd.vertices);
        var polyBd = new b2BodyDef();
        polyBd.AddShape(polySd);
        polyBd.position.Set(0, 0);
        return world.CreateBody(polyBd);
    };

    var drawWorld = function(world, context) {
        for (var b = world.m_bodyList; b; b = b.m_next) {
            for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
                drawShape(s, context);
            }
        }
    };

    var drawShape = function(shape, context) {
        context.strokeStyle = '#00ff00';
        context.beginPath();
        switch (shape.m_type) {
        case b2Shape.e_circleShape:
            {
                var circle = shape;
                var pos = circle.m_position;
                var r = circle.m_radius;
                var segments = 16.0;
                var theta = 0.0;
                var dtheta = 2.0 * Math.PI / segments;
                // draw circle
                context.moveTo(pos.x + r, pos.y);
                for (var i = 0; i < segments; i++) {
                    var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                    var v = b2Math.AddVV(pos, d);
                    context.lineTo(v.x, v.y);
                    theta += dtheta;
                }
                context.lineTo(pos.x + r, pos.y);
        
                // draw radius
                context.moveTo(pos.x, pos.y);
                var ax = circle.m_R.col1;
                var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
                context.lineTo(pos2.x, pos2.y);
            }
            break;
        case b2Shape.e_polyShape:
            {
                var poly = shape;
                var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                context.moveTo(tV.x, tV.y);
                for (var i = 0; i < poly.m_vertexCount; i++) {
                    var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                    context.lineTo(v.x, v.y);
                }
                context.lineTo(tV.x, tV.y);
            }
            break;
        }
        context.stroke();
    }

    world = createWorld();
    createBox(world, 0, 0, 10, 512);
    createBox(world, 0, 0, 1024, 10);
    createBox(world, 1014, 0, 10, 512);
    createBox(world, 0, 502, 1024, 10);
    createBox(world, 0, 0, 512, 10, 45);

    return self;
})(physics || {});
