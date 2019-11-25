'use strict';

let playButton = document.getElementsByClassName('play-button')[0];
let audio = document.getElementsByTagName('audio')[0];

// play/pause function
playButton.addEventListener('click', function(e) {
  if(audio.paused) {
    audio.play();
    playButton.src = './public/assets/img/pause.svg';
  }
  else {
    audio.pause();
    playButton.src = './public/assets/img/play.svg';
  }
}, false);

// in some browsers, when a track ends, it doesn't set the audio to paused mode, thats why:
audio.addEventListener('ended', function(e) {
  audio.pause();
  playButton.src = './public/assets/img/play.svg';
}, false);