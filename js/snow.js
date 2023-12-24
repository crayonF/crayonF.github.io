function result (obj, prop) {
  if (typeof obj[prop] === 'function') {
    return obj[prop]();
  } else {
    return obj[prop];
  }
}

class Vector {
  constructor() {
    let x = 0;
    let y = 0;
    if (arguments[0] instanceof Vector) {
      x = arguments[0].x;
      y = arguments[0].y;
    } else {
      x = arguments[0];
      y = arguments[1];
    }
    this.x = x || 0;
    this.y = y || 0;
  }
  
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  
  distanceTo(vector, abs) {
    var distance = Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    return (abs || false) ? Math.abs(distance) : distance;
  }
}

class Particle {
  constructor(options) {
    this.options = Object.assign({
      seed: 0
    }, options);
    
    this.position = new Vector(this.options.x, this.options.y);
    this.vector = new Vector(
      (Math.random() * this.options.speed * 2) - this.options.speed / 2,
      1 + Math.random() * this.options.speed 
    );
    this.rotation = this.options.rotation || 0;

    // Size
    this.options.size = this.options.size || 7;
    this.size = 1 + Math.random() * this.options.size;
    this.targetSize = this.options.targetSize || this.options.size;

    this.orbit = this.options.radius * 0.5 + (this.options.radius * 0.5 * Math.random());
  }
  
  update(mousePosition) {
    let timeIndex = Date.now() / 1000 + this.options.seed;

    let vector = new Vector(this.vector);
    
    // Add wiggle
    vector.x += (Math.sin(timeIndex) / 2); 
    
    this.position.add(vector); 
  }
}

class Animator {
  constructor(options) {
    this.options = Object.assign({
        emit: 2,
        maxParticles: 500,
        speed: 5,
        width: 500,
        height: 1000,
        size: 8,
        ghostTrails: false
    }, options);
    this.el = this.options.el;
    this.ctx = this.el.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.updateDimensions = this.updateDimensions.bind(this);
    this.updateMouse = this.updateMouse.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.loop = this.loop.bind(this);
    
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('mousemove', this.updateMouse);
    window.addEventListener('mouseleave', this.mouseLeave);
    
    this.updateDimensions();
    this.start();
  }
  
  updateMouse(event) {
    this.mouse = new Vector(event.clientX * this.dpr, event.clientY * this.dpr);
  }
  
  mouseLeave() {
    this.mouse = void 0;
  }
  
  start() {
    this.particles = [];
    this.running = true;
    this.loop();
  }
  
  loop() {
    if (!this.running) {
      return;
    }
    
    if (!this._lastEmit || Date.now() - this._lastEmit > 30){
      if (this.particles.length < this.options.maxParticles) {
        for (let i = 0; i < this.options.emit; i++) {
          this.addParticle();
        }
      }
      this._lastEmit = Date.now();
    }

    this.update();
    this.clear();
    this.render();
    window.requestAnimationFrame(this.loop);
  }
  
  addParticle() {
    let x = Math.random() * this.width * 1.1;
    let y = this.options.size * -2;

    var particle = new Particle({
      ...this.options,
      x: x,
      y: y,
      rotation: Math.random() * 360,
      seed: Math.random() * 10
    });

    this.particles.push(particle);
  }
  
  clear() {
    if(!this.options.ghostTrails) {
      this.ctx.clearRect(0, 0 , this.width, this.height);
    } else {
      this.ctx.globalCompositeOperation = 'multiply';
      this.ctx.rect(0, 0 , this.width, this.height);
      this.ctx.fillStyle = "rgba(33, 33, 33)";
      this.ctx.fill();
    }
  }
  
  unmount() {
    window.removeEventListener('resize', this.updateDimensions);
    this.el.removeEventListener('mousemove', this.updateMouse);
    this.el.removeEventListener('mouseleave', this.mouseLeave);
    this.running = false;
  }
  
  updateDimensions() {
    this.width = this.el.width = result(this.options, 'width') * this.dpr;
    this.height = this.el.height = result(this.options, 'height') * this.dpr;
    this.el.style.width = result(this.options, 'width') + 'px';
    this.el.style.height = result(this.options, 'height') + 'px';
  }
  
  update() {
    var index = -1;
    var length = this.particles.length;
    while (++index < length) {
      var point = this.particles[index];
      if (!point) {
        continue;
      }
      point.update(this.mouse);

      if (point.position.y > (this.height + this.options.size)) {
        this.particles.splice(index, 1);
      }
    } 
  }
  
  render() {
    let index = -1;
    let length = this.particles.length;
    this.ctx.globalCompositeOperation = 'lighten';
    while (++index < length) {
      let point = this.particles[index];
      let opacity = point.size / this.options.size;
      this.ctx.fillStyle = `rgba(200, 200, 200, ${opacity * 0.3})`;
      this.ctx.beginPath();
      this.ctx.arc(point.position.x, point.position.y, point.size, Math.PI * 2, 0, false);
      this.ctx.closePath();
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.arc(point.position.x, point.position.y, point.size * 0.6, Math.PI * 2, 0, false);
      this.ctx.closePath();
      this.ctx.fill();
    }  
  }
}

new Animator({
  el: document.getElementById('canvas'),
  width: function() {
    return window.innerWidth;
  },
  height: function() {
    return window.innerHeight;
  }
});