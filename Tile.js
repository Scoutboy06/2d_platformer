class Tile {
  
  constructor({ x, y, collide, texture }) {
    this.pos = createVector(x, y);
    this.collide = collide;
    this.texture = texture;
  }
  
  
  
  
  draw() {
    
    image(
      tileset,
      this.pos.x,
      this.pos.y,
      tileSize,
      tileSize,
      this.texture.col * 32,
      this.texture.row * 32,
      32,
      32
    );
    
    // console.log(this.texture)
    
  }
}