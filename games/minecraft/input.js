var MOVEMENT_SPEED = 4;
var MOVEMENT_FLY = false;

var MOUSE_LEFT = 1;
var MOUSE_RIGHT = 3;

var K_UP = 87; //w
var K_DOWN = 83; //s
var K_LEFT = 65; //a
var K_RIGHT = 68; //d
var K_VUP = 32; //space
var K_JUMP = K_VUP;
var K_VDOWN = 16; //shift
var K_SHIFT = 16; //shift

var K_HUD_1 = 49; //1
var K_HUD_2 = 50; //2
var K_HUD_3 = 51; //3
var K_HUD_4 = 52; //4
var K_HUD_5 = 53; //5
var K_HUD_6 = 54; //6
var K_HUD_7 = 55; //7
var K_HUD_8 = 56; //8
var K_HUD_9 = 57; //9

//---General input code---
var e_click = function(e) {};
var e_mousedown = function(e) {};
var e_mouseup = function(e) {};
var e_keydown = function(e) {};
var e_keyup = function(e) {};

var eventHandlers = {
  click: [],
  mousedown: [],
  mouseup: [],
  keydown: [],
  keyup: []
};

function initInput() {
  document.addEventListener("keydown", function(e) {
    e_keydown(e);
    if(document.pointerLockElement == renderer.domElement && !e.repeat) {
      for(var i = 0; i < eventHandlers.keydown.length; i++) {
        eventHandlers.keydown[i](e);
      }
    }
  });
  document.addEventListener("keyup", function(e) {
    e_keyup(e);
    if(document.pointerLockElement == renderer.domElement) {
      for(var i = 0; i < eventHandlers.keyup.length; i++) {
        eventHandlers.keyup[i](e);
      }
    }
  });
  
  document.addEventListener("click", function(e) {
    if(document.pointerLockElement == renderer.domElement) {
      e_click(e);
      for(var i = 0; i < eventHandlers.click.length; i++) {
        eventHandlers.click[i](e);
      }
    }
  });
  document.addEventListener("contextmenu", function(e) {
    //if(document.pointerLockElement == renderer.domElement) {
    //  e.stopImmediatePropagation();
      e.preventDefault();
    //  return false;
    //}
  });
  document.addEventListener("mousedown", function(e) {
    if(document.pointerLockElement == renderer.domElement) {
      e_mousedown(e);
      for(var i = 0; i < eventHandlers.mousedown.length; i++) {
        eventHandlers.mousedown[i](e);
      }
    }
  });
  document.addEventListener("mouseup", function(e) {
    if(document.pointerLockElement == renderer.domElement) {
      e_mouseup(e);
      for(var i = 0; i < eventHandlers.mouseup.length; i++) {
        eventHandlers.mouseup[i](e);
      }
    }
  });
  
  //document.addEventListener("mousemove", showInventoryItemInHand);
}

function registerInputHandler(eventName, callback) {
  eventHandlers[eventName].push(callback);
}

//---Movement---
var keysPressed = [];
var movement = new THREE.Vector3(0, 0, 0);
e_keydown = function(e) {
  keysPressed.push(e.keyCode);
  updateMovement();
};
e_keyup = function(e) {
  for(var i = 0; i < keysPressed.length; i++) {
    if(keysPressed[i] == e.keyCode) {
      keysPressed.splice(i, 1);
      i--;
    }
  }
  updateMovement();
};
function updateMovement() {
  if(controls.enabled) {
    movement.x = 0;
    if(MOVEMENT_FLY) {
      movement.y = 0;
    }
    movement.z = 0;
    
    for(var i = 0; i < keysPressed.length; i++) {
      var keyCode = keysPressed[i];
      switch(keyCode) {
        case K_UP:
          movement.z = -MOVEMENT_SPEED;
          break;
        case K_DOWN:
          movement.z = MOVEMENT_SPEED;
          break;
        case K_LEFT:
          movement.x = -MOVEMENT_SPEED;
          break;
        case K_RIGHT:
          movement.x = MOVEMENT_SPEED;
          break;
        case K_VUP:
          if(MOVEMENT_FLY) {
            movement.y = MOVEMENT_SPEED;
          }
          break;
        case K_VDOWN:
          if(MOVEMENT_FLY) {
            movement.y = -MOVEMENT_SPEED;
          }
          break;
      }
    }
  }
}
function queryKey(keyCode) {
  for(var i = 0; i < keysPressed.length; i++) {
    if(keysPressed[i] == keyCode) {
      return true;
    }
  }
  
  return false;
}
