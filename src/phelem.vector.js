//// phelem.vector.js ////

// namespace
Phelem.vector = {};

// Vector class
Phelem.vector.Vector = function(x, y) {
    this.set(x, y);
    this.angle;
    this.magnitude;
};

Phelem.vector.Vector.prototype.set = function(x, y) {
    this.x = (x) ? x : 0;
    this.y = (y) ? y : 0;
};

Phelem.vector.Vector.prototype.add = function(vector) {
    //this.x = Phelem.utils.round(this.x + vector.x, 1000);
    //this.y = Phelem.utils.round(this.y + vector.y, 1000);
    this.x += vector.x;
    this.y += vector.y;
};

Phelem.vector.Vector.prototype.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
};

Phelem.vector.Vector.prototype.scale =
Phelem.vector.Vector.prototype.multiply = function(by) {
    //this.x = Phelem.utils.round(this.x * by, 1000);
    //this.y = Phelem.utils.round(this.y * by, 1000);
    this.x *= by;
    this.y *= by;
};

Phelem.vector.Vector.prototype.divide = function(by) {
    if(by == 0) {
        this.x = 0;
        this.y = 0;
    }
    else {
        this.x /= by;
        this.y /= by;
    }
}

// vector namespace functions
Phelem.vector.copy = function(vector) {
    return new Phelem.vector.Vector(vector.x, vector.y);
}

Phelem.vector.add = function(vectorA, vectorB) {
    return new Phelem.vector.Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
};

Phelem.vector.subtract = function(vectorA, vectorB) {
    return new Phelem.vector.Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
};

Phelem.vector.scale =
Phelem.vector.multiply = function(vector, by) {
    return new Phelem.vector.Vector(vector.x * by, vector.y * by);
};

Phelem.vector.divide = function(vector, by) {
    if(by == 0) {
        return new Phelem.vector.Vector();
    }
    else {
        return new Phelem.vector.Vector(vector.x / by, vector.y / by);
    }
};

Phelem.vector.ZERO = new Phelem.vector.Vector(0, 0);
Phelem.vector.GRAVITY = new Phelem.vector.Vector(0, 0.00981);
