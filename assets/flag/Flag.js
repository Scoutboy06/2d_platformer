class Flag extends Asset {
  
  constructor(args) {
    super(args);
  }
  
  
  
  
  setup() {
    this.textureType = 'flag';
    this.lastUpdatedTexture = millis();
    this.width = 1.25 * tileSize;
    this.height = 2 * tileSize;
    this.pos.y -= (this.height - tileSize);
  }
  
  
  
  
  playerCollision() {
    Overlay.show('win');
    noLoop();
  }
}