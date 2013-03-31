var EventManager = new function () {
    this.listeners = {};

    this.manage = function (object) {
        if (!(object.id in this.listeners)) {
            this.listeners[object.id] = {
                parents: [],
                callbacks: {}
            };
        }
    };

    this.linkParent = function (parent, object) {
        this.manage (parent);
        this.manage (object);
        this.listeners[object.id].parents.push (parent);
    };

    this.addEventHandler = function (object, eventType, handler) {
        this.manage (object);        
        if (!(this.listeners[object.id].callbacks[eventType]))
            this.listeners[object.id].callbacks[eventType] = [];
        this.listeners[object.id].callbacks[eventType].push (handler);
    };

    // The object (feature/layer/map) that the mouse is currently over
    var currentOver = null;

    this.moveMouse = function (engine) {

    };
    this.clickMouse = function (engine) {

    };
    this.mouseDown = function (engine) {

    };

    this.mouseOver = function (object) {
        if (currentOver !== null && object != currentOver) {
            this.trigger (currentOver, 'mouseout', [currentOver]);
        }
        if (object !== null && object != currentOver) {
            this.trigger (object, 'mouseover', [object]);
        }
        currentOver = object;
    };

    this.trigger = function (object, eventType, args) {
        if (object.id in this.listeners) {
            if (eventType in this.listeners[object.id].callbacks) {
                $.each (this.listeners[object.id].callbacks[eventType], function (i, handler) {
                    handler.apply (object, args);
                });
            }
            $.each (this.listeners[object.id].parents, function (i, parent) {
                EventManager.trigger (parent, eventType, args);
            });
        }
    };

} ();
