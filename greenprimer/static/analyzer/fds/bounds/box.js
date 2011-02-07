var BoxVolume = function() {
    this.init();
    this.extents = new Vector(1, 1);
    this.axis = [new Vector(1, 0), new Vector(0, 1)];
};

BoxVolume.prototype = BoundingVolume.beget();
BoxVolume.prototype.project = function(axis) {
    var pos = this.position.dot(axis);
    var radius = Math.abs(axis.dot(this.axis[0])) * this.extents.x +
                 Math.abs(axis.dot(this.axis[1])) * this.extents.y;
    return [pos - radius, pos + radius];
};
BoxVolume.prototype.rotate = function(angle) {
    this.axis[0] = this.rotateAxis(angle, this.axis[0]);
    this.axis[1] = this.rotateAxis(angle, this.axis[1]);
};
BoxVolume.prototype.rotateAxis = function(angle, axis) {
    var cos = Math.cos(angle), sin = Math.sin(angle);
    return new Vector(axis.x * cos + axis.y * sin,
                      axis.y * cos - axis.x * sin);
    
};
BoxVolume.prototype.draw = function() {
    throw "not sure how to draw";
    /*
    Vector2 exX = new Vector2(this.Axis[0] * this.Extents.X);
    Vector2 exY = new Vector2(this.Axis[1] * this.Extents.Y);
    GL.Begin(BeginMode.Quads);
    GL.Vertex2(this.Position.X + exX.X + exY.X, this.Position.Y + exX.Y + exY.Y);
    GL.Vertex2(this.Position.X - exX.X + exY.X, this.Position.Y - exX.Y + exY.Y);
    GL.Vertex2(this.Position.X - exX.X - exY.X, this.Position.Y - exX.Y - exY.Y);
    GL.Vertex2(this.Position.X + exX.X - exY.X, this.Position.Y + exX.Y - exY.Y);
    GL.End();
    */
};
