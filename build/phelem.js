//// phelem.main.js ////

// namespace
var Phelem = {};

Phelem.VERSION = '0.0.1';

Phelem.DEBUG = true;

//// phelem.event.js ////

// namespace
Phelem.event = {};

// ready
Phelem.event.ready = {};
Phelem.event.ready.listeners = [];

Phelem.event.ready.register = function(callback) {
    Phelem.event.ready.listeners.push(callback);
}

Phelem.event.ready.trigger = function() {
    Phelem.pre.prepare();

    Phelem.event.ready.listeners.forEach(function(callback) {
        callback();
    });
}

// scroll
Phelem.event.scroll = {};
Phelem.event.scroll.listeners = [];

Phelem.event.scroll.register = function(object) {
    Phelem.event.scroll.listeners.push(object);
};

Phelem.event.scroll.trigger = function() {
    var x = (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0);
    var y = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);

    if(Phelem.event.scroll.oldX == undefined || Phelem.event.scroll.oldY == undefined) {
        Phelem.event.scroll.oldX = x;
        Phelem.event.scroll.oldY = y;
        return;
    }

    var deltaX = Phelem.event.scroll.oldX - x;
    var deltaY = Phelem.event.scroll.oldY - y;
    Phelem.event.scroll.oldX = x;
    Phelem.event.scroll.oldY = y;

    var force = new Phelem.vector.Vector(deltaX/10, deltaY/10);
    Phelem.event.scroll.listeners.forEach(function(listener) {
        listener.applyForce(force);
    });

    if(Phelem.DEBUG)
        console.log('Phelem.event.scroll.trigger()', 'deltaX:', deltaX, ', deltaY', deltaY);
};

// mouse
Phelem.event.mouse = {};
Phelem.event.mouse.listeners = [];

Phelem.event.mouse.register = function(object) {
    object.element.addEventListener('mouseover', function(event) {
        object.origX = event.clientX;
        object.origY = event.clientY;
    });
    object.element.addEventListener('mouseout', function(event) {
        Phelem.event.mouse.trigger(object, event);
    });
};

Phelem.event.mouse.trigger = function(object, event) {
    var deltaX = event.clientX - object.origX;
    var deltaY = event.clientY - object.origY;
    console.log('Phelem.event.mouse.trigger()', 'deltaX', deltaX, ', deltaY', deltaY);
    var force = new Phelem.vector.Vector(deltaX/10, deltaY/10);
    object.applyForce(force);
    object.origX = undefined;
    object.origY = undefined;
};

// key
Phelem.event.key = {};
Phelem.event.key.block = false;
Phelem.event.key.register = function(object) {
    object.element.addEventListener('keydown', function(event) {
        if(Phelem.event.key.block) return;
        Phelem.event.key.trigger(object);
        Phelem.event.key.block = true;
    });
    object.element.addEventListener('keyup', function(event) {
        Phelem.event.key.block = false;
    });
};

Phelem.event.key.trigger = function(object) {
    var force = new Phelem.vector.Vector(0, 10);
    object.applyForce(force);
};

// drag
Phelem.event.drag = {};
Phelem.event.drag.listeners = [];

Phelem.event.drag.register = function(object) {
    object.element.addEventListener('dragstart', function(event) {
        var element = document.createElement('img')
        event.dataTransfer.setDragImage(element, 0, 0);
        object.simulation = false;
    });
    object.element.addEventListener('drag', function(event) {
        Phelem.event.drag.trigger(object, event);
    });
    object.element.addEventListener('dragend', function(event) {
        Phelem.event.drag.lastX = undefined;
        Phelem.event.drag.lastY = undefined;
        object.velocity.set(0,0);
        object.acceleration.set(0,0);
        object.simulation = true;
    })
};

Phelem.event.drag.trigger = function(object, event) {
    event = event || window.event;
    var x = event.clientX;
    var y = event.clientY;
    if(Phelem.event.drag.lastX == undefined) {
        Phelem.event.drag.lastX = x;
        Phelem.event.drag.lastY = y;
        return;
    }
    if(x == 0 && y == 0) return;
    var deltaX = x - Phelem.event.drag.lastX;
    var deltaY = y - Phelem.event.drag.lastY;
    if(Phelem.DEBUG)
        console.log('Phelem.event.drag.trigger()', 'deltaX:', deltaX, ', deltaY', deltaY);
    object.position.set(deltaX, deltaY);
};

// register triggers to window and document
document.addEventListener('DOMContentLoaded', Phelem.event.ready.trigger);
window.addEventListener('scroll', Phelem.event.scroll.trigger);
//window.addEventListener('mousemove', Phelem.event.mouse.trigger);

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

//// phelem.preprocessor.js ////

// namespace
Phelem.pre = {};

Phelem.pre.prepare = function() {
    var nodes = Array.prototype.slice.call(document.getElementsByTagName('*'));
    var phelem_nodes = [];

    nodes.forEach(function(node) {
        if(node.dataset.phelem)
            phelem_nodes.push(node);
    });

    if(Phelem.DEBUG)
        console.log('Phelem.pre.prepare()', 'nodes found', '('+phelem_nodes.length+')', phelem_nodes);

    phelem_nodes.forEach(function(node) {
        var object = new Phelem.object.Object();

        object.element = node;

        if(object.element.style.position == '')
            object.element.style.position = 'relative';

        if(node.dataset.phelemMass)
            object.setMass(Number.parseFloat(node.dataset.phelemMass));

        if(node.dataset.phelemFriction)
            object.setFriction(Number.parseFloat(node.dataset.phelemFriction));

        if(node.dataset.phelemEvents)
            object.registerEvents(node.dataset.phelemEvents.split(','));

        Phelem.object.objects.push(object);
    });
};

//// phelem.renderer.js ////

// namespace
Phelem.renderer = {};

Phelem.renderer.init = function() {
    if(Phelem.DEBUG)
        console.log('Phelem.renderer.init()', 'initializing renderer now');

    Phelem.renderer.render();
};

Phelem.renderer.render = function() {
    Phelem.utils.requestAnimationFrame(Phelem.renderer.render);

    Phelem.object.objects.forEach(function(object) {
        object.render();
    });
};

Phelem.event.ready.register(Phelem.renderer.init);

//// phelem.utils.js ////

// namespace
Phelem.utils = {};

Phelem.utils.round = function(number, to) {
    return Math.round(number * to) / to;
};

Phelem.utils.requestAnimationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000/60) }).bind(window);

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
