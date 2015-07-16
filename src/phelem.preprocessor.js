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
