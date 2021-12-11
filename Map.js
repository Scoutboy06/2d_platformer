class Map {
  
  constructor() {
    this.blocks = [];
    this.originalMap = null;
    
    this.levelWidth = null;
    this.levelHeight = null;
    
    this.translate = createVector();
    
    this.background = null;
    
    this.assets = null;
    this.assetsMeta = null;
    
    this.flag = null;
    this.stars = null;
  }
  
  
  
  
  init() {
    // 576 × 324
    this.background = loadImage('swamp/background.png');
  }
  
  setup() {
    const scaleFactor = height / this.background.height;

    this.background.resize(
      this.background.width * scaleFactor,
      this.background.height * scaleFactor + 1
    );
    
    this.stars = [];
  }
  
  
  
  
  getLevelWidth() {
    return this.levelWidth;
  }
  
  getLevelHeight() {
    return this.levelHeight;
  }
  
  getCurrentMap() {
    return this.blocks;
  }
  
  
  
  
  drawBackground() {
    const mult = 1000;
    const pan = (map.translate.x / map.getLevelWidth() * mult) % width;
    
    image(
      this.background,
      0,
      0,
      this.background.width,
      this.background.height,
      -pan,
      0,
      this.background.width,
      this.background.height
    );
    
    
    image(
      this.background,
      0,
      0,
      this.background.width,
      this.background.height,
      -width - pan,
      0,
      this.background.width,
      this.background.height
    );
    
    
  }
  
  
  
  
  drawBlocks() {
    for(let i = 0; i < this.blocks.length; i++) {
      const row = this.blocks[i];
      for(let j = 0; j < row.length; j++) {
        const block = row[j];
        
        if(block?.draw) block.draw();
      }
    }
    
    this.flag.draw();
    this.stars.forEach(star => star.draw());
  }
  
  
  
  
  setCurrentMapCSV(importedMap) {
    this.originalMap = importedMap;
    
    
    const blockIsPlacedAt = (row, col, blockType='ground') => {
      if(importedMap.rows[row]) {
        const item = importedMap.rows[row].arr[col];

        if(item === '') return false;
        // else if(!item || item === blockType) return true;
        else if(!item || item === 'ground' || item === blockType) return true;
        return false;
      }
      
      return true;
    }
    
    
    
    this.blocks = [];

    for(let i = 0; i < importedMap.getRowCount(); i++) {
      this.blocks[i] = [];

      for(let j = 0; j < importedMap.getColumnCount(); j++) {
        const block = importedMap.rows[i].arr[j];
        
        
        if(block === 'ground') {
          let x = j * tileSize;
          let y = i * tileSize;
          
          const collide = {
            top: true,
            right: true,
            bottom: true,
            left: true,
          };
          
          const texture = (function() {
            const textureCheck = Array(8);

            textureCheck[0] = blockIsPlacedAt(i-1, j-1);
            textureCheck[1] = blockIsPlacedAt(i-1, j);
            textureCheck[2] = blockIsPlacedAt(i-1, j+1);

            textureCheck[3] = blockIsPlacedAt(i, j-1);
            // current block
            textureCheck[4] = blockIsPlacedAt(i, j+1);

            textureCheck[5] = blockIsPlacedAt(i+1, j-1);
            textureCheck[6] = blockIsPlacedAt(i+1, j);
            textureCheck[7] = blockIsPlacedAt(i+1, j+1);

            const foundTile = Object.values(tilesetMeta).find((textureObject, index) => {
              if(
                !textureObject ||
                typeof textureObject != 'object' ||
                !textureObject.texture ||
                textureObject.semisolid
              ) return false;

              let isRight = true;

              for(let k = 0; k < textureObject.texture.length; k++) {
                const hasBlock = textureObject.texture[k];

                if(hasBlock === '') continue;

                else if(hasBlock !== textureCheck[k]) {
                  isRight = false;
                }
              }

              return isRight;
            });



            if(!foundTile) {
              console.error('---------------------');
              console.error('Texture not found');
              console.error(block);
              console.error(textureCheck);
              console.error(j, i);
              return false;
            }

            const foundTileIndex = Object.values(tilesetMeta).indexOf(foundTile);


            // tileset is 10 x 6 tiles
            const lookupTextureMeta = {
              col: foundTileIndex % 10,
              row: Math.floor(foundTileIndex / 10),
            }

            return lookupTextureMeta;
          })();

          this.blocks[i][j] = new Tile({ x, y, collide, texture });
        }
        
        
        else if(block === 'semisolid') {
          let x = j * tileSize;
          let y = i * tileSize;
          
          const collide = {
            top: true,
            right: false,
            bottom: false,
            left: false,
          };
          
          const texture = (function() {
            const textureCheck = Array(8);

            textureCheck[0] = blockIsPlacedAt(i-1, j-1, 'semisolid');
            textureCheck[1] = blockIsPlacedAt(i-1, j, 'semisolid');
            textureCheck[2] = blockIsPlacedAt(i-1, j+1, 'semisolid');

            textureCheck[3] = blockIsPlacedAt(i, j-1, 'semisolid');
            // current block
            textureCheck[4] = blockIsPlacedAt(i, j+1, 'semisolid');

            textureCheck[5] = blockIsPlacedAt(i+1, j-1, 'semisolid');
            textureCheck[6] = blockIsPlacedAt(i+1, j, 'semisolid');
            textureCheck[7] = blockIsPlacedAt(i+1, j+1, 'semisolid');

            const foundTile = Object.values(tilesetMeta).find((textureObject, index) => {
              if(
                !textureObject ||
                typeof textureObject != 'object' ||
                !textureObject.texture ||
                !textureObject.semisolid
              ) return false;

              let isRight = true;

              for(let k = 0; k < textureObject.texture.length; k++) {
                const hasBlock = textureObject.texture[k];

                if(hasBlock === '') continue;

                else if(hasBlock !== textureCheck[k]) {
                  isRight = false;
                }
              }

              return isRight;
            });



            if(!foundTile) {
              console.error('---------------------');
              console.error('Texture not found');
              console.error(block);
              console.error(textureCheck);
              console.error(j, i);
              return false;
            }

            const foundTileIndex = Object.values(tilesetMeta).indexOf(foundTile);


            // tileset is 10 x 6 tiles
            const lookupTextureMeta = {
              col: foundTileIndex % 10,
              row: Math.floor(foundTileIndex / 10),
            }

            return lookupTextureMeta;
          })();

          this.blocks[i][j] = new Tile({ x, y, collide, texture });
        }
        
        
        else if(block === 'ladybug') {
          const entity = new Ladybug({
            x: j * tileSize,
            y: i * tileSize,
          });
          
          entities.push(entity);
        }
        
        
        else if(block === 'start') {
          this.blocks[i][j] = block;
          const x = j * tileSize;
          const y = i * tileSize;
          player.setRespawnPoint(x, y);
          player.setPosition(x, y);
        }
        
        
        else if(block === 'goal') {
          this.blocks[i][j] = block;
          this.flag = new Flag({
            x: j * tileSize,
            y: i * tileSize,
          });
          this.flag.setup();
        }
        
        
        else if(block.startsWith('star:')) {
          this.blocks[i][j] = block;
          const starIndex = parseInt(block.split(':')[1]);
          
          const star =  new Star({
            x: j * tileSize,
            y: i * tileSize,
          });
          
          this.stars[starIndex] = star;
          star.setup(starIndex);
        }
        
        
        else this.blocks[i][j] = null;
      }
    }
    
    this.levelWidth = importedMap.getColumnCount() * tileSize;
    this.levelHeight = importedMap.getRowCount() * tileSize;
  }
  
  
  
  
  translateMap({ x, y, w, h }) {
    let translateX = 0;
    let translateY = 0;
    
    // Horizontal
    
    // Left
    if((x + w / 2) < width / 2) translateX = 0;
    // Right
    else if((x + w / 2) > this.levelWidth - width / 2) translateX = -this.levelWidth + width;
    // Mid
    else translateX = width / 2 - x - w / 2;
    
    // Vertical
    
    // Top
    if(y < height / 2) translateY = 0;
    // Bottom
    else if(y > this.levelHeight - height / 2) translateY = -this.levelHeight + height;
    // Mid
    else translateY = height / 2 - y;
    
    
    
    this.translate.set(translateX, translateY);
    translate(translateX, translateY);
  }
  
}