var navigate = (function() {
  $('.dd').toggle();
  $('.dd_btn').click(function() {
    var dataName = $(this).attr('data-name');
    $('.dd').hide();
    $('.' + dataName).toggle();
  });
})();

(function() {
  function Car(el, x, y, dir) {
    this.element = el;
    this.x = x;
    this.y = y;
    this.turn = 0;
    this.dir = dir;
    this.speed = 0;
    this.model = {
      maxSpeed: 6,
      maxReverseSpeed: -2,
      acceleration: 0.3,
      friction: 0.99,
      turnMax: 1
    }
  }

  Car.prototype.render = function(transformProperty) {
    var t = 'translateX(' + this.x + '%) translateY(' + this.y + '%)';
    t += ' rotate(-' + this.dir + 'deg)';
    t += ' translateZ(.5vmin)';
    this.element.style[transformProperty] = t;
  };

  var state = {
    keypress: {
      up: false,
      right: false,
      left: false,
      down: false
    },
    car: null,
    fps: 15,
    transformProperty: "transform"
  }

  function init(carId) {
    crossBrowserFixes();
    var carElement = document.getElementById(carId);
    state.car = new Car(carElement, 470, 795, 90);
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("keyup", keyUp, false);
    animLoop();
  }

  function crossBrowserFixes() {
    if (!('transform' in document.body.style)) {
      state.transformProperty = "webkitTransform";
    }
  }

  function calcMovement() {
    if (state.keypress.up) {
      if (state.car.speed === 0) {
        state.car.speed = 0.1;
      }

      if (state.car.speed < state.car.model.maxSpeed) {
        state.car.speed += state.car.model.acceleration;
      }
    } else if (state.keypress.down && state.car.speed > state.car.model.maxReverseSpeed) {
      state.car.speed -= (state.car.model.acceleration / 2);
    }

    if (state.keypress.left) {
      if (state.car.speed && state.car.turn < state.car.model.turnMax) {
        state.car.turn += 0.4;
      }
    } else if (state.keypress.right) {
      if (state.car.speed && state.car.turn > -state.car.model.turnMax) {
        state.car.turn -= 0.4;
      }
    }

    state.car.speed *= state.car.model.friction;

    if (state.car.speed < 0.1 && state.car.speed > -0.1) {
      state.car.speed = 0;
    }

    if (state.car.speed != 0 && state.car.turn != 0) {
      state.car.dir += state.car.turn * (state.car.speed / state.car.model.maxSpeed);
      state.car.turn *= 0.7

      if (state.car.dir < 0) {
        state.car.dir = (360 - state.car.dir);
      } else if (state.car.dir > 360) {
        state.car.dir = 360 - state.car.dir;
      }
    }

    if (state.car.turn < 0.1 && state.car.turn > -0.1) {
      state.car.turn = 0;
    }

    calcPosition();
  }

  function calcPosition() {
    var dirRadian = state.car.dir * (Math.PI / 180);
    state.car.x += state.car.speed * Math.sin(dirRadian);
    state.car.y += state.car.speed * Math.cos(dirRadian);
  }

  function animLoop() {
    setTimeout(function() {
      calcMovement();
      state.car.render(state.transformProperty);
      requestAnimationFrame(animLoop);
    }, 100 / state.fps);
  }

  function keyUp(e) {
    move(e, false);
  }

  function keyDown(e) {
    move(e, true);
  }

  function move(e, isKeyDown) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      e.preventDefault();
    }

    if (e.keyCode === 37) {
      state.keypress.left = isKeyDown;
    }

    if (e.keyCode === 38) {
      state.keypress.up = isKeyDown;
    }

    if (e.keyCode === 39) {
      state.keypress.right = isKeyDown;
    }

    if (e.keyCode === 40) {
      state.keypress.down = isKeyDown;
    }
  }

  function camera(el) {
    document.documentElement.setAttribute('class', el.getAttribute('class'));
  }

  window.drive = {
    init: init,
    camera: camera
  }
})();

drive.init("car");
