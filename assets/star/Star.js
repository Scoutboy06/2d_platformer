class Star extends Asset {
  
  constructor(args) {
    super(args);
  }
  
  
  
  
  setup(index) {
    this.textureType = 'star';
    this.lastUpdatedTexture = millis();
    
    this.width = 0.8 * tileSize;
    this.height = 0.8 * tileSize;
    
    this.pos.add(
      // (tileSize - this.width) / 2,
      (tileSize - this.height) / 2
    );
    
    this.index = index;
    this.isCollected = false;
  }
  
  
  
  
  reset() {
    this.isCollected = false;
  }
  
  
  
  
  playerCollision() {
    Overlay.collectStar(this.index);
    this.isCollected = true;
  }
}