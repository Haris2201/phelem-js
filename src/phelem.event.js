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
