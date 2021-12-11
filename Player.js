class Player {
  
  constructor() {
    this.pos = createVector();
    this.prevPos = createVector();
    this.respawnPoint = createVector();

    // 26 x 32
    this.width = null;
    this.height = null;

    this.vel = createVector();
    this.acc = createVector();

    this.G = 0.4;
    this.jumpForce = null;
    this.speedX = 0.85;
    // this.speedX = 1.2;
    this.groundFriction = 0.8;
    
    // Variable used to check if able to jump
    this.falling = 0;
    
    this.textures = null;
    this.texturesMeta = null;
    this.state = 'idle';
    this.textureIndex = 0;
    this.lastUpdatedTexture = null;
    this.dir = 1;
    
    this.lastDamagedAt = -Infinity;
    this.isDamageCooldown = false;
    this.damageCooldownMs = 2000;
    this.health = 3;
    this.maxHealth = 3;
    
    this.isAttacking = false;
    this.lastAttackedAt = -Infinity;
    this.spaceKeyPressed = false;
    this.attackCooldownMs = 500;
    this.reach = 5;
  }
  
  
  
  
  init() {
    this.textures = loadImage('player_textures/main_character.png');
    this.texturesMeta = loadJSON('player_textures/main_character.json');
    this.lastUpdatedTexture = millis();
  }
  
  
  
  setup() {
    // 26 x 32
    const scaleFactor = 1 * tileSize / 32;

    this.width = 26 * scaleFactor;
    this.height = 32 * scaleFactor;
    
    this.jumpForce = -tileSize * 0.27;
  }
  
  
  
  reset() {
    this.pos.set(this.respawnPoint);
    this.vel.set(0, 0);
    this.acc.set(0, 0);
    this.state = 'idle';
    this.textureIndex = 0;
    this.lastUpdatedTexture = millis();
    this.falling = 0;
    this.dir = 1;
    this.health = this.maxHealth;
    this.lastDamagedAt = -Infinity;
    this.isDamageCooldown = false;
    this.isAttacking = false;
    this.lastAttackedAt = -Infinity;
    this.isAttackCooldown = false;
  }

  
  
  
  draw() {
    const texture = this.texturesMeta[this.state];
    
    
    if(true) {    
      push();
      
      noFill();
      stroke("#fff");
      strokeWeight(1);

      // rect(this.pos.x, this.pos.y, this.width, this.height);
      
      const imageLeft = texture.left[this.textureIndex];
      const imageRight = texture.right[this.textureIndex];
      const imageTop = texture.top;
      const imageBottom = texture.bottom;

      translate(
        this.pos.x + (this.dir === -1 ? this.width : 0),
        this.pos.y
      );
      // (this.dir === -1 ? this.width : 0)
      // ((this.dir - 1) * -0.5 * this.width)
      scale(this.dir, 1);
      
      image(
        this.textures,
        0,
        0,
        this.width,
        this.height,
        imageLeft,
        imageTop,
        (imageRight - imageLeft),
        (imageBottom - imageTop)
      );
      
      pop();
    }
    
    else {
      const x = 273;
      const y = 498;

      image(this.textures, -x, -map.translate.y - y);
      noLoop();
    }
  }
  
  
  
  
  update() {
    this.prevPos.set(this.pos);
    
    const texture = this.texturesMeta[this.state];
    
    
    if(this.pos.y > map.getLevelHeight()) {
      this.isDamageCooldown = false;
      this.health = 1;
      this.damage();
    }
    
    this.acc.set(0, 0);

    const checkLeftKeys = () => pressedKeys.has("a") || pressedKeys.has("ArrowLeft");
    const checkRightKeys = () => pressedKeys.has("d") || pressedKeys.has("ArrowRight");
    const checkJumpKeys = () => pressedKeys.has('ArrowUp') || pressedKeys.has('w');

    // Check if the player is trying to move horizontally
    const left = checkLeftKeys();
    const right = checkRightKeys();
    const up = checkJumpKeys();

    // Setting horizontal acceleration
    if(!this.isAttacking) {
      if (left) {
        this.acc.x = -this.speedX;
        this.dir = -1;
      }
      else if (right) {
        this.acc.x = this.speedX;
        this.dir = 1;
      }
    }
    
    if(up && this.falling < 3) this.vel.y = this.jumpForce;
    else this.acc.y = this.G;

    // Adding the acceleration to the velocity
    this.vel.add(this.acc);
    // Adding friction
    if(this.falling < 10) this.vel.x *= this.groundFriction;
    else this.vel.x = constrain(this.vel.x, -3, 3);


    // Check collisions
    const totalSteps = round(abs(this.vel.x) + abs(this.vel.y));
    const dx = this.vel.x / totalSteps;
    const dy = this.vel.y / totalSteps;
    const lastPos = this.pos.copy();
    
    this.falling++;

    for (let i = 0; i < totalSteps; i++) {
      lastPos.x = this.pos.x;
      this.pos.x += dx;

      if (this.collideBlocks()) {
        this.pos.x = lastPos.x;
        this.vel.x = 0;
      }
      
      lastPos.y = this.pos.y;
      this.pos.y += dy;
      
      if(this.collideBlocks()) {
        this.pos.y = lastPos.y;
        if(this.vel.y > 0) {
          this.falling = 0;
        }
        this.vel.y = 0;
      }
    }

    if (this.pos.x < 0)
      this.pos.x = 0;
    else if (this.pos.x + this.width > map.getLevelWidth())
      this.pos.x = map.getLevelWidth() - this.width;
    
    
    
    if(this.spaceKeyPressed && !pressedKeys.has(' ')) this.spaceKeyPressed = false;
    
    if(!this.isAttacking &&
       !this.spaceKeyPressed &&
       pressedKeys.has(' ') &&
       // this.falling < 3 &&
       millis() - this.lastAttackedAt - this.attackCooldownMs > this.texturesMeta.attack1.delay * this.texturesMeta.attack1.left.length
      ) {
      console.log('ATTACK!!!');
      this.setState('attack1');
      this.lastAttackedAt = millis();
      this.spaceKeyPressed = true;
      this.isAttacking = true;
    }
    
    
    
    if(this.isAttacking) {

      entities.forEach(entity => {
        if(!entity.isEnemy) return;
        
        // Check if in range in y-axis
        if(this.pos.y + this.height > entity.pos.y &&
           entity.pos.y + entity.height > this.pos.y
          ) {
          
          // If player is facing rightwards
          if(this.dir === 1) {
            // Check if in range in x-axis
            if(entity.pos.x < this.pos.x + this.width + this.reach &&
               this.pos.x + this.width < entity.pos.x + entity.width) {
              entity.damage();
            }
          }
          
          // If player is facing leftwards
          else {
            if(this.pos.x - this.reach < entity.pos.x + entity.width &&
               entity.pos.x < this.pos.x) {
              entity.damage();
            }
          }
          
        }
        
      });
    }
    
    
    
    this.costumeUpdate();
  }
  
  
  
  
  costumeUpdate() {
    const texture = this.texturesMeta[this.state];
    
    
    switch(this.state) {
      case 'idle':
        this.isAttacking = false;
        if(this.falling > 3) {
          if(this.vel.y < 0) this.setState('jump');
          else this.setState('fall');
        }
        else if(abs(this.vel.x) > 1) {
          this.setState('run');
        }
        break;

      case 'damage':
        this.isAttacking = false;
        if(millis() - this.lastDamagedAt > texture.delay * texture.left.length) {
          if(this.falling > 3) {
            if(this.vel.y < 0) this.setState('jump');
            else this.setState('fall');
          }
          else if(abs(this.vel.x) < 1) {
            this.setState('idle');
          }
          else this.setState('run');
        }
        break;
      
      case 'attack1':
        if(millis() - this.lastAttackedAt > texture.delay * texture.left.length) {
          this.isAttacking = false;
          if(this.falling > 3) {
            if(this.vel.y < 0) this.setState('jump');
            else this.setState('fall');
          }
          else if(abs(this.vel.x) < 1) {
            this.setState('idle');
          }
          else this.setState('run');
        }
        break;
        
      case 'run':
        this.isAttacking = false;
        if(this.falling > 3) {
          if(this.vel.y < 0) this.setState('jump');
          else this.setState('fall');
        }
        else if(abs(this.vel.x) < 1) {
          this.setState('idle');
        }
        break;
      
      case 'jump':
        this.isAttacking = false;
        if(this.falling < 3) this.setState('idle');
        if(this.vel.y > 5) this.setState('fall');
        break;
      
      case 'fall':
        this.isAttacking = false;
        if(this.falling < 3) {
          if(this.vel.x < 1) this.setState('idle');
          else this.setState('run');
        }
        break;
    }
    
    
    if(millis() - this.lastUpdatedTexture > texture.delay) {
      if(this.textureIndex+1 == texture.left.length && !texture.infinite) return;

      this.textureIndex++;

      if(texture.infinite) {
        this.textureIndex = this.textureIndex % texture.left.length;
      }

      this.lastUpdatedTexture = millis();
    }
  }
  
  
  
  
  setState(state) {
    // console.log('Changed state : ' + state);
    this.state = state;
    this.textureIndex = 0;
    this.lastUpdatedTexture = millis();
  }
  
  
  
  
  damage(enemy) {
    if(!this.isDamageCooldown) {
      this.health--;
      
      this.setState('damage');
      this.lastDamagedAt = millis();
      this.isDamageCooldown = true;
      
      
      if(this.health <= 0) {
        this.isDamageCooldown = true;
        sounds.death.play();
        Overlay.show('death');
        noLoop();
        return;
      }
      
      
      sounds.damage.play();
      
      setTimeout(() => {
        this.isDamageCooldown = false;
      }, this.damageCooldownMs);
    }
  }
  
  
  
  
  collideBlocks() {
    let m = map.getCurrentMap();

    for(let row = 0; row < m.length; row++) {
      for(let col = 0; col < m[row].length; col++) {
        const block = m[row][col];
        if(!block || !block.collide) continue;

        const blockX = col * tileSize;
        const blockY = row * tileSize;

        // Side relative to player's bodypart
        const left = this.pos.x < blockX + tileSize - 1;
        const right = this.pos.x + this.width > blockX + 1;
        const top = this.pos.y < blockY + tileSize - 1;
        const bottom = this.pos.y + this.height > blockY + 1;


        if(left && right && top && bottom) {
          
          const wasOverBefore = blockY > this.prevPos.y + this.height - 1;
          // console.log(wasOverBefore)
          if(block.collide.top && wasOverBefore) return true;
          
          const wasRightBefore = blockX + tileSize < this.prevPos.x + 1;
          // console.log(wasRightBefore)
          if(block.collide.right && wasRightBefore) return true;
          
          const wasUnderBefore = blockY + tileSize < this.prevPos.y + 1;
          // console.log(wasUnderBefore)
          if(block.collide.bottom && wasUnderBefore) return true;
          
          const wasLeftBefore = blockX > this.prevPos.x + this.width - 1;
          // console.log(wasLeftBefore)
          if(block.collide.left && wasLeftBefore) return true;
          
          // return true;
        }
      }
    }
    return false;
  }
  
  
  
  
  setPosition() {
    if(typeof arguments[0] === p5.Vector)
      this.pos.set(arguments[0]);
    else
      this.pos.set(arguments[0], arguments[1]);
  }
  
  
  
  
  setRespawnPoint() {
    if(typeof arguments[0] === p5.Vector)
      this.respawnPoint.set(arguments[0]);
    else
      this.respawnPoint.set(arguments[0], arguments[1]);
  }
}


