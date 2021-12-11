class HpBar {
  
  constructor() {}

  
  draw() {
    // console.log(true);
    push();

    const m = 10;
    const p = 5;
    const rectWidth = 50;
    const rectHeight = 30;
    
    const w = player.maxHealth * rectWidth + 2 * p + 2 * (player.maxHealth - 1);
    const h = rectHeight + 2 * p;
    
    translate(-map.translate.x, -map.translate.y);

    fill(0, 100, 0);
    noStroke();
    
    rect(
      width - m - w,
      m,
      w,
      h
    );
    
    fill(0, 200, 0);
    
    for(let i = 0; i < player.health; i++) {
      rect(
        width - m - w + p + i * rectWidth + i * 2,
        m + p,
        rectWidth,
        rectHeight
      );
    }
    
    pop();
  }
}