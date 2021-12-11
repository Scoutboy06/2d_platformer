class Asset {
  
  constructor({ x, y }) {
    this.pos = createVector(x, y);
    this.width = null;
    this.height = null;
    
    this.textures = null;
    this.texturesMeta = null;
    this.textureIndex = 0;
    this.lastUpdatedTexture = null;
    this.textureDelay = null;
    this.textureType = null;
    
    this.collected = null;
    this.index = null;
  }
  
  
  
  
  static init() {
    this.textures = {
      flag: loadImage('assets/flag/Flag.png'),
      star: loadImage('assets/star/star_light.png'),
    };
    
    this.texturesMeta = loadJSON('assets/assetsMeta.json');
  }
  
  
  
  
  draw() {
    if(this.isCollected) return;
    
    const textureMeta = Asset.texturesMeta[this.textureType];
    const texture = Asset.textures[this.textureType];
    
    if(textureMeta.animated) {
      const imageLeft = textureMeta.left[this.textureIndex];
      const imageRight = textureMeta.right[this.textureIndex];
      const imageTop = textureMeta.top;
      const imageBottom = textureMeta.bottom;


      image(
        texture,
        this.pos.x,
        this.pos.y,
        this.width,
        this.height,
        imageLeft,
        imageTop,
        (imageRight - imageLeft),
        (imageBottom - imageTop)
      );



      if(millis() - this.lastUpdatedTexture > textureMeta.delay) {
        this.textureIndex++;

        if(this.textureIndex >= textureMeta.left.length) {
          this.textureIndex = 0;
        }

        this.lastUpdatedTexture = millis();
      }
    }

    
    else {
      image(
        texture,
        this.pos.x,
        this.pos.y,
        this.width,
        this.height
      );
    }
    
    
    
    if(this.playerCollision) {
      if(this.collidePlayer()) this.playerCollision();
    }
  }
  
  
  
  
  collidePlayer() {
    const p = 10;

    return (
      player.pos.x + player.width > this.pos.x + p &&
      this.pos.x + this.width > player.pos.x + p &&
      player.pos.y + player.height > this.pos.y + p &&
      this.pos.y + this.width > player.pos.y
    );
  }
}