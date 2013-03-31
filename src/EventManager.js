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
/*function EventManager (engine) {
  var events = {
  'mouseover': {},
  'mouseout': {},
  'click': {}
  };
  var callers = {};
  var features = {};

  var r = 0;
  var g = 0;
  var b = 0;
  var set_id_color = function () {
  b ++;
  if (b > 255) {
  b = 0;
  g ++;
  }
  if (g > 255) {
  g = 0;
  r ++;
  }
  if (r > 255)
  throw "Too many elements to assign unique id";
  return {
  r: r, 
  g: g,
  b: b
  };
  };

  this.register = function (layer, f) {
  var c = set_id_color ();
  var key = c.r + ',' + c.g + ',' + c.b;
  
  callers[key] = layer;
  features[key] = f;

  if (!(layer.id in events['click'])) {
  for (key in events) {
  events[key][layer.id] = [];
  }
  }
  return c;
  };
  
  this.bind = function (type, caller, func) {
  if (!(type in events))
  throw "Event type " + type + " does not exist";
  events[type][caller.id].push (func);
  };

  var cx = -1;
  var cy = -1;
  var current = new Uint8Array (4);

  var is_zero = function (pixel) {
  return (pixel[0] == 0 && pixel[1] == 0 && pixel[2] == 0);
  }

  var trigger_event = function (type, pixel) {
  var key = pixel[0] + ',' + pixel[1] + ',' + pixel[2];
  var layer = callers[key];
  var feature = features[key];
  for (var i = 0; i < events[type][layer.id].length; i ++) {
  events[type][layer.id][i] (new LayerSelector ([feature]));
  }
  }

  var click = false;
  var click_queue = [];
  this.click = function (x, y) {
  click = true;
  click_queue.push ({
  x: x,
  y: y
  });
  };

  this.update = function (dt) {
  if (cx != Mouse.x || cy != Mouse.y) {
  var pixel = engine.read_pixel (Mouse.x, Mouse.y);
  cx = Mouse.x;
  cy = Mouse.y;
  var same = true;
  for (var i = 0; i < 4; i ++) {
  if (current[i] != pixel[i])
  same = false;
  }
  if (same) {
  return null;
  }
  if (!is_zero (current)) {
  trigger_event ('mouseout', current);
  //console.log ('out');
  }
  //console.log (pixel);
  for (var i = 0; i < 4; i ++) {
  current[i] = pixel[i];
  }
  if (is_zero (pixel))
  return null;
  trigger_event ('mouseover', pixel);
  }
  if (click) {
  click = false;
  while (click_queue.length > 0) {
  var pos = click_queue.splice (0, 1)[0];
  var px = engine.read_pixel (pos.x, pos.y);
  if (!is_zero (px)) {                  
  trigger_event ('click', px);                                      
  }
  }
  }
  };
  };
*/
