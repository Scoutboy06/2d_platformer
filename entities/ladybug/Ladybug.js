class Ladybug extends Entity {
  
  constructor(args) {
    super(args);
  }
  
  
  
  
  setup() {
    this.entityType = 'ladybug';
    this.isEnemy = true;
    this.turnOnEdge = true;
    this.texture = Entity.textures.ladybug;
    // 192 x 113
    const h = tileSize - 2;
    const scaleFactor = h / this.texture.height;
    // this.texture.resize(
    //   this.texture.width * scaleFactor,
    //   this.texture.height * scaleFactor
    // );
    
    this.height = h;
    this.width = this.texture.width * scaleFactor;
    this.G = 0.4;
    this.health = 1;
    
    
  }
  
  
  
  
  reset() {
    this.dir = 1;
    this.health = 1;
    this.pos.set(this.startPos);
    this.isDead = false;
  }
  
  
  
  
  collidePlayer() {
    player.damage(this);
  }
  
  
  
  
  damage() {
    this.health--;
    
    if(this.health <= 0) {
      // this.reset();
      this.isDead = true;
    }
  }
}