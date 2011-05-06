/* Remember the physics demo at 70%? This is it. */
var physics = (function(self) {
    var interval, counter = 0, world;

    $(function() { step(); });
    $('body').click(function() {
        if(interval) interval = clearInterval(interval);
        else interval = setInterval(step, 10);
    });

    var color = function() {
        var h = 100 + (70 * Math.random());
        return 'hsla(' + h + ', 76%, 67%, .5)';
    };

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
        var gravity = new b2Vec2(0, 100);
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
        context.strokeWidth = 2;
        context.beginPath();
        switch (shape.m_type) {
        case b2Shape.e_circleShape:
            {
                if(!shape.color) shape.color = color();
                context.fillStyle = shape.color;
                var pos = shape.m_position;
                var r = shape.m_radius;
                context.arc(pos.x, pos.y, r, 0, Math.PI*2, true);
            }
            break;
        case b2Shape.e_polyShape:
            {
                context.fillStyle = '#000000';
                var tV = b2Math.AddVV(shape.m_position, b2Math.b2MulMV(shape.m_R, shape.m_vertices[0]));
                context.moveTo(tV.x, tV.y);
                for (var i = 0; i < shape.m_vertexCount; i++) {
                    var v = b2Math.AddVV(shape.m_position, b2Math.b2MulMV(shape.m_R, shape.m_vertices[i]));
                    context.lineTo(v.x, v.y);
                }
                context.lineTo(tV.x, tV.y);
            }
            break;
        }
        context.closePath();
        context.fill();
        context.stroke();
    }

    world = createWorld();
    createBox(world, 0, 0, 10, 512);
    createBox(world, 0, 0, 1024, 10);
    createBox(world, 1014, 0, 10, 512);
    createBox(world, 0, 502, 1024, 10);
    createBox(world, 0, 0, 512, 10, 45);

    for(var i = 0; i < 1000; i += 25)
        for(var j = 0; j < 500; j += 25)
            createBall(world, i, j, 8);

    return self;
})(physics || {});
