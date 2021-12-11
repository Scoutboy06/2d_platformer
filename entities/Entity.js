class Entity {
  
  constructor({ x, y }) {
    this.pos = createVector(x, y);
    this.startPos = createVector(x, y);
    this.vel = createVector();
    this.width = null;
    this.height = null;
    
    this.textures = null;
    this.texture = null;
    
    this.dir = 1;
    this.G = null;
    this.speedX = null;
    
    this.entityType = null;
    this.isEnemy = null;
    this.turnOnEdge = null;
    
    this.health = null;
    
    this.isDead = false;
  }
  
  
  
  
  static init() {
    this.textures = {
      ladybug: loadImage('entities/ladybug/ladybug2-a.png'),
    };
  }
  
  
  
  
  collideBlocks() {
    let m = map.getCurrentMap();

    for(let row = 0; row < m.length; row++) {
      for(let col = 0; col < m[row].length; col++) {
        const block = m[row][col];
        if(!block || block === 'start' || block === 'goal') continue;

        const blockX = col * tileSize;
        const blockY = row * tileSize;

        // Side relative to player's bodypart
        const left = this.pos.x < blockX + tileSize - 1;
        const right = this.pos.x + this.width > blockX + 1;
        const top = this.pos.y < blockY + tileSize - 1;
        const bottom = this.pos.y + this.height > blockY + 1;


        if(left && right && top && bottom) {
          return true;
        }
      }
    }
    return false;
  }
  
  
  
  
  collidesPlayer() {
    return (
      this.pos.x + this.width > player.pos.x &&
      this.pos.x < player.pos.x + player.width &&
      this.pos.y + this.height > player.pos.y &&
      this.pos.y < player.pos.y + player.height
    );
  }
  
  
  
  
  draw() {
    if(this.isDead) return;
    
    push();
    
    translate(this.pos.x + (this.dir === -1 ? this.width : 0), this.pos.y);
    scale(this.dir, 1);
    
    image(
      Entity.textures[this.entityType],
      0,
      0,
      this.width,
      this.height
    );
    
    pop();
  }
  
  
  
  
  update() {
    
    if(this.isDead) return;
    
    this.vel.y += this.G;
    this.vel.x = this.dir;
    
    // Check collisions
    const totalSteps = round(abs(this.vel.x) + abs(this.vel.y));
    const dx = this.vel.x / totalSteps;
    const dy = this.vel.y / totalSteps;
    const lastPos = this.pos.copy();

    for (let i = 0; i < totalSteps; i++) {
      lastPos.x = this.pos.x;
      this.pos.x += dx;

      if (this.collideBlocks()) {
        this.pos.x = lastPos.x;
        this.vel.x = 0;
        this.dir *= -1;
      }
      
      lastPos.y = this.pos.y;
      this.pos.y += dy;
      
      if(this.collideBlocks()) {
        this.pos.y = lastPos.y;
        this.vel.y = 0;
      }
    }
    
    if(this.collidesPlayer()) {
      this.collidePlayer();
    }

    // if (this.pos.x < 0)
    //   this.pos.x = 0;
    // else if (this.pos.x + this.width > map.getLevelWidth())
    //   this.pos.x = map.getLevelWidth() - this.width;
    
    if(this.turnOnEdge) {
      if(this.detectGoingOverEdge()) {
        this.dir *= -1;
      }
    }
  }
  
  
  
  
  detectGoingOverEdge() {
    // console.log(true)
    const blocks = map.getCurrentMap();
        
    // Walking rightwards, detect on entity's right side
    if(this.dir === 1) {
      // console.log('Right edge detection')
      const blockIndexX = floor((this.pos.x + this.width) / tileSize);
      const blockIndexY = floor((this.pos.y + this.height + this.vel.x) / tileSize);

      if(!blocks[blockIndexY][blockIndexX]) return true;
    }

    // Walking leftwards, detect on entity's left side
    else if(this.dir === -1) {
      const blockIndexX = floor((this.pos.x - this.vel.x) / tileSize);
      const blockIndexY = floor((this.pos.y + this.height + 1) / tileSize);

      if(!blocks[blockIndexY][blockIndexX]) return true;
    }
  }
}



