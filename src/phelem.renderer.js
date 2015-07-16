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
