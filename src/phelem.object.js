//// phelem.object.js ////

// namespace
Phelem.object = {};

// reference to all objects
Phelem.object.objects = [];

// Object class
Phelem.object.Object = function() {
    this.position = new Phelem.vector.Vector();
    this.mass = 1;
    this.friction = .9;
    this.velocity = new Phelem.vector.Vector();
    this.acceleration = new Phelem.vector.Vector();
    this.element = null;
    this.force = new Phelem.vector.Vector();
    this.simulation = true;
};

Phelem.object.Object.prototype.registerEvents = function(events) {
    if(events.indexOf('scroll') != -1) {
        Phelem.event.scroll.register(this);
    }
    if(events.indexOf('mouse') != -1) {
        Phelem.event.mouse.register(this);
    }
    if(events.indexOf('key') != -1) {
        Phelem.event.key.register(this);
    }
    if(events.indexOf('drag') != -1) {
        this.element.draggable = true;
        Phelem.event.drag.register(this);
    }
};

Phelem.object.Object.prototype.setMass = function(mass) {
    this.mass = mass || 1;
};

Phelem.object.Object.prototype.setFriction = function(friction) {
    this.friction = friction || 1;
};

Phelem.object.Object.prototype.applyForce = function(vector) {
    this.force.add(vector);
};

Phelem.object.Object.prototype.simulate = function() {
    if(!this.simulation) return;

    if(Math.abs(this.position.x) < 1 && Math.abs(this.position.y) < 1 &&
        Math.abs(this.velocity.x) < 1 && Math.abs(this.velocity.y) < 1 &&
        Math.abs(this.acceleration.x) < 1 && Math.abs(this.acceleration.x) < 1 &&
        Math.abs(this.force.x) < 1 && Math.abs(this.force.y) < 1) return;

    var distance = Phelem.vector.subtract(Phelem.vector.ZERO, this.position);
    distance.multiply(.1);

    this.velocity.add(distance);
    this.velocity.scale(this.friction);
    this.velocity.add(this.acceleration);
    this.velocity.add(distance);
    this.velocity.add(Phelem.vector.divide(this.force, this.mass));
    this.force.scale(this.friction * .5);
    this.position.add(this.velocity);

    if(Math.abs(this.force.x) < 1 && Math.abs(this.force.y) < 1) {
        this.force.set(0, 0);
    }
    if(Math.abs(this.acceleration.x) < 1 && Math.abs(this.acceleration.y) < 1) {
        this.acceleration.set(0, 0);
    }
    if(Math.abs(this.velocity.x) < 1 && Math.abs(this.velocity.y) < 1) {
        this.velocity.set(0, 0);
    }
    if(Math.abs(this.position.x) < 1 && Math.abs(this.position.y) < 1) {
        this.position.set(0, 0);
    }

    console.log('Phelem.object.Object.simulate()', 'position', this.position.x, this.position.y, 'velocity', this.velocity.x, this.velocity.y, 'acceleration', this.acceleration.x, this.acceleration.y);
}

Phelem.object.Object.prototype.render = function() {
    this.simulate();

    this.element.style.left = this.position.x + 'px';
    this.element.style.top = this.position.y + 'px';
}
