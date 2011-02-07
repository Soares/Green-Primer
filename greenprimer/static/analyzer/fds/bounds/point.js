var PointVolume = function() {
    this.init();
    this.axis = [];
};
PointVolume.prototype = BoundingVolume.beget();
PointVolume.prototype.project = function(axis) {
    var m = this.position.dot(axis);
    return [m, m];
};
PointVolume.prototype.draw = function(axis) {
    throw "Don't know how to draw"
    /*
    GL.Begin(BeginMode.Points);
        GL.Vertex2(this.Position.X, this.Position.Y);
    GL.End();
    */
};
