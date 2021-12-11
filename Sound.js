class Sound {

  constructor(url) {
    this.url = url;
    this.Audio = new Audio(url);
    this.isPlaying = false;
    this.isLoaded = false;
    
    
    this.Audio.addEventListener('canplaythrough', () => {
      this.isLoaded = true;
    });
  }
  
  
  play() {
    this.isPlaying = true;
    this.Audio.play();
  }

  pause() {
    this.isPlaying = false;
    this.Audio.pause();
  }
  
  loop(bool=true) {
    this.Audio.loop = bool;
    if(!this.isPlaying) this.play();
  }
  
  onEnded(callback) {
    this.Audio.addEventListener('ended', callback);
  }
}



function loadSound(url) {
  return new Sound(url);
}


