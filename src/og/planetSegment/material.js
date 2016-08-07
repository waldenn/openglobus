goog.provide('og.planetSegment.Material');

og.planetSegment.Material = function (segment, layer) {
    this.segment = segment;
    this.layer = layer;
    this.imageReady = false;
    this.imageIsLoading = false;
    //this.texBias = [0, 0, 1];
    this.texture = null;
    this.image = null;
    this.textureExists = false;
};

og.planetSegment.Material.prototype.assignLayer = function (layer) {
    this.layer = layer;
};

og.planetSegment.Material.prototype.loadTileImage = function () {
    var seg = this.segment;
    if (seg.tileZoom >= this.layer.minZoom &&
        seg.tileZoom <= this.layer.maxZoom) {
        if (this.layer._isBaseLayer) {
            this.texture = seg._isNorth ? seg.planet.solidTextureOne : seg.planet.solidTextureTwo;
        } else {
            this.texture = seg.planet.transparentTexture;
        }

        if (!this.imageIsLoading) {
            this.layer.handleSegmentTile(this);
        }
    }
};

og.planetSegment.Material.prototype.abortLoading = function () {
    this.layer.abortMaterialLoading(this);
};

og.planetSegment.Material.prototype.applyTexture = function (img) {
    if (!this.imageReady && this.imageIsLoading) {
        this.image = img;
        this.texture = this.segment.handler.createTexture(img);
        //this.texBias = [0, 0, 1];
        //this.segment.node.appliedTextureNodeId = this.segment.node.nodeId;
        this.imageReady = true;
        this.textureExists = true;
        this.imageIsLoading = false;
    }
};

og.planetSegment.Material.prototype.textureNotExists = function () {
    //TODO: texture have to stop loading
    //This is a bug
    this.imageIsLoading = true;
    this.textureExists = false;
};

og.planetSegment.Material.prototype.clear = function () {

    if (this.imageReady) {
        this.imageReady = false;

        if (!this.texture.default)
            this.segment.handler.gl.deleteTexture(this.texture);
        this.texture = null;

        //this.segment = null;
        //this.layer = null;
        //this.texBias = [0, 0, 1];
    }

    this.layer.abortMaterialLoading(this);

    this.imageIsLoading = false;
    this.textureExists = false;

    if (this.image) {
        this.image.src = '';
        this.image = null;
    }
};