const pressedKeys = new Set();

let tileSize;

let player;
let map;
let levelBlocks;
// let font;

let tileset;
let tilesetMeta;

let entities = [];
let entityTextures;

let sounds;
let soundtracks;

let hpBar;



let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);



function preload() {
  player = new Player();
  map = new Map();
  
  player.init();
  map.init();
  Entity.init();
  Asset.init();
  
  // font = loadFont('Pixellari.ttf');
  tileset = loadImage('swamp/tileset.png');
  tilesetMeta = loadJSON('swamp/tileset.json');
  levelBlocks = loadTable('maps/level_01.csv', 'csv');
  
  entityTextures = {
    ladybug: loadImage('entities/ladybug/ladybug2-a.png'),
  };
  
  soundtracks = {
    village_1: loadSound('soundtracks/village_1.mp3'),
  };
}



function setup() {
  const c = createCanvas(800, 450);
  c.parent('root');
  
  tileSize = 32;
  
  player.setup();
  map.setup();
  map.setCurrentMapCSV(levelBlocks);
  entities.forEach(entity => entity.setup());
  Overlay.setup();
  
  hpBar = new HpBar();
}



function draw() {
  if(Overlay.type === 'game') {
    stats.begin();
  
    clear();
    map.drawBackground();

    player.update();
    entities.forEach(entity => entity.update());

    map.translateMap({
      x: player.pos.x,
      y: player.pos.y,
      w: player.width,
      h: player.height,
    });

    map.drawBlocks();
    entities.forEach(entity => entity.draw());
    player.draw();
    hpBar.draw();
    
    stats.end();
  }
}



function mousePressed() {
  if(!sounds) {
    sounds = {
      damage: loadSound('sounds/damage.mp3'),
      death: loadSound('sounds/death.mp3'),
    };
  }
}






window.addEventListener('keydown', e => pressedKeys.add(e.key));
window.addEventListener('keyup', e => pressedKeys.delete(e.key));
window.addEventListener('keypress', e => {
  if(e.key == 'r') $('.retryBtn').click();
});




const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

window.addEventListener('load', loaded);

function loaded() {
  
  $$('.overlay').forEach(el => el.classList.add('hidden'));
  Overlay.show('start');
  
  $('#startBtn').addEventListener('click', () => {
    Overlay.show('game');
  });
  
  $$('.retryBtn').forEach(btn => btn.addEventListener('click', () => {
    
    player.reset();
    entities.forEach(entity => entity.reset());
    map.stars.forEach(star => star.reset());
    Overlay.resetStars();
    Overlay.show('game');
    
    loop();
  }));
}

