class Overlay {
  
  constructor(type='start') {
    this.type = type;
    this.stars = null;
  }
  
  
  static setup() {
    this.stars = [ false, false, false ];
  }
  
  
  static show(type) {
    console.log(soundtracks.village_1)
    if(soundtracks.village_1.isLoaded) {
      if(soundtracks.village_1.isPlaying) soundtracks.village_1.pause();
    }
    
    const show = el => { el.classList.remove('hidden') };
    
    this.type = type;
    $$('.overlay:not(.hidden)').forEach(el => el.classList.add('hidden'));
    
    if(this.type === 'start') {
      show( $('#startContainer') );
    }
    
    else if(this.type === 'game') {
      soundtracks.village_1.loop();
    }
    
    else if(this.type === 'death') {
      show( $('#deathContainer') );
    }
    
    else if(this.type === 'win') {
      show( $('#winContainer') );
    }
  }
  
  
  
  
  static collectStar(index) {
    this.stars[index] = true;
    $$('.star')[index].classList.add('light');
  }
  
  
  
  
  static resetStars() {
    this.stars = [ false, false, false ];
    $$('.star').forEach(el => el.classList.remove('light'));
  }
}