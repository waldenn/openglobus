goog.provide('my.Heatmap');

goog.require('og.node.RenderNode');

my.Heatmap = function () {
    og.inheritance.base(this);

    this._verticesBuffer;

    this.position = [0, 0, 0.3, 0.7];
    this.resolution = [800, 800];
    this.points = [0.6, 0.6, 0.3, 0.7, 0.8, 0.3, 0.2, 0.3, 0.3, 0.1, 0.2, 0.4];
};

og.inheritance.extend(my.Heatmap, og.node.RenderNode);

my.Heatmap.prototype.initialization = function () {
    this.drawMode = this.renderer.handler.gl.TRIANGLES;

    var vertices = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0, 1.0,
      -1.0, 1.0,
       1.0, -1.0,
       1.0, 1.0];

    this._verticesBuffer = this.renderer.handler.createArrayBuffer(new Float32Array(vertices), 2, vertices.length / 2);

    this.renderer.events.on("onmousemove", this, this.onMouseMove);
    this.renderer.events.on("onmouselbuttondown", this, this.onMouseLeftButtonClick);
};

my.Heatmap.prototype.onMouseMove = function (e) {
    this.position[0] = e.x / this.resolution[0];
    this.position[1] = this.renderer.getHeight() / this.resolution[1] - e.y / this.resolution[1];
};

my.Heatmap.prototype.onMouseLeftButtonClick = function () {
    this.points.push.apply(this.points, this.position);
};

my.Heatmap.prototype.frame = function () {

    this.renderer.handler.shaderPrograms.heatmap.activate();

    this.renderer.handler.shaderPrograms.heatmap.set({
        a_position: this._verticesBuffer,
        resolution: this.resolution,
        pointsLength: this.points.length / 4 + 1,
        points: this.position.concat(this.points)
    });

    this.renderer.handler.shaderPrograms.heatmap.drawArray(this.drawMode, this._verticesBuffer.numItems);
};