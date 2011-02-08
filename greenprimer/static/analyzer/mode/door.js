modes.door = (function(self) {
    self.button = '#door';
    
    var makeDoor = actions.make(function(dump) {
        Elem.load(dump);
    }, function(dump) {
        Elem.load(dump).remove();
    });
    var delDoor = actions.make(function(dump) {
        Elem.load(dump).remove();
    }, function(dump) {
        Elem.load(dump);
    });

    self.wallClick = function(e, click, wall) {
        var coords = util.eventCoords(click, true);
        var vector = new Vector(coords[0], coords[1]);
        var offset = vector.distanceFrom(wall.source.point);
        var door = new Door(wall, offset - 10, 20);
        makeDoor(door.dump());
    };
    self.doorClick = function(e, click, door) {
        delDoor(door.dump());
        door.remove();
    };

    return mode(self);
})({});
